import { Product, PRODUCT_STATUS, PRODUCT_APPROVAL_STATUS } from '../models/Product.js';
import { ProductVariant } from '../models/ProductVariant.js';
import { Category } from '../models/Category.js';
import { Subcategory } from '../models/Subcategory.js';
import { Brand } from '../models/Brand.js';
import { Seller, SELLER_APPROVAL_STATUS } from '../models/Seller.js';
import { AppError } from '../utils/appError.js';
import { createSlug } from '../utils/slugify.js';
import { cacheService } from './cacheService.js';

/**
 * Product & Marketplace Catalog Service
 */

/**
 * Public: List marketplace catalog products with rich search, filtering, sorting, pagination.
 */
export const getPublicProducts = async (query = {}) => {
  const cacheKey = `products:list:${JSON.stringify(query)}`;
  const cached = await cacheService.get(cacheKey);
  if (cached) {
    return cached;
  }

  const page = Math.max(1, parseInt(query.page, 10) || 1);
  const limit = Math.min(50, Math.max(1, parseInt(query.limit, 10) || 16));
  const skip = (page - 1) * limit;

  // Strict public visibility condition: only approved and published
  const filter = {
    approvalStatus: PRODUCT_APPROVAL_STATUS.APPROVED,
    status: PRODUCT_STATUS.PUBLISHED,
  };

  // Category filter
  if (query.category) {
    if (query.category.match(/^[0-9a-fA-F]{24}$/)) {
      filter.category = query.category;
    } else {
      const cat = await Category.findOne({ slug: query.category, status: 'active' });
      if (cat) filter.category = cat._id;
      else return { items: [], pagination: { page, limit, total: 0, totalPages: 0 } };
    }
  }

  // Subcategory filter
  if (query.subcategory) {
    if (query.subcategory.match(/^[0-9a-fA-F]{24}$/)) {
      filter.subcategory = query.subcategory;
    } else {
      const subcat = await Subcategory.findOne({ slug: query.subcategory, status: 'active' });
      if (subcat) filter.subcategory = subcat._id;
      else return { items: [], pagination: { page, limit, total: 0, totalPages: 0 } };
    }
  }

  // Brand filter
  if (query.brand) {
    if (query.brand.match(/^[0-9a-fA-F]{24}$/)) {
      filter.brand = query.brand;
    } else {
      const br = await Brand.findOne({ slug: query.brand, status: 'active' });
      if (br) filter.brand = br._id;
      else return { items: [], pagination: { page, limit, total: 0, totalPages: 0 } };
    }
  }

  // Store filter
  if (query.store) {
    filter.store = query.store;
  }

  // Price range filters
  if (query.minPrice !== undefined || query.maxPrice !== undefined) {
    filter.basePrice = {};
    if (query.minPrice !== undefined) {
      const min = Math.max(0, parseFloat(query.minPrice));
      if (!isNaN(min)) filter.basePrice.$gte = min;
    }
    if (query.maxPrice !== undefined) {
      const max = Math.max(0, parseFloat(query.maxPrice));
      if (!isNaN(max)) filter.basePrice.$lte = max;
    }
  }

  // Minimum rating filter
  if (query.rating) {
    const ratingVal = parseFloat(query.rating);
    if (!isNaN(ratingVal)) {
      filter.ratingAverage = { $gte: Math.min(5, Math.max(0, ratingVal)) };
    }
  }

  // In-stock availability filter
  if (query.availability === 'in_stock' || query.inStock === 'true') {
    filter.stock = { $gt: 0 };
  }

  // Discount filter
  if (query.discount === 'true' || query.hasDiscount === 'true') {
    filter.discount = { $gt: 0 };
  }

  // Keyword search
  if (query.search && query.search.trim()) {
    const searchRegex = new RegExp(query.search.trim(), 'i');
    filter.$or = [
      { name: searchRegex },
      { shortDescription: searchRegex },
      { description: searchRegex },
      { tags: searchRegex },
    ];
  }

  // Sorting whitelist
  let sortOption = { createdAt: -1 };
  switch (query.sort) {
    case 'oldest':
      sortOption = { createdAt: 1 };
      break;
    case 'price_asc':
      sortOption = { basePrice: 1 };
      break;
    case 'price_desc':
      sortOption = { basePrice: -1 };
      break;
    case 'rating':
      sortOption = { ratingAverage: -1 };
      break;
    case 'popular':
      sortOption = { salesCount: -1 };
      break;
    case 'discount':
      sortOption = { discount: -1 };
      break;
    case 'newest':
    default:
      sortOption = { createdAt: -1 };
      break;
  }

  const [items, total] = await Promise.all([
    Product.find(filter)
      .sort(sortOption)
      .skip(skip)
      .limit(limit)
      .populate('category', 'name slug')
      .populate('subcategory', 'name slug')
      .populate('brand', 'name slug logo')
      .populate('store', 'name slug logo')
      .populate('variants')
      .lean(),
    Product.countDocuments(filter),
  ]);

  const result = {
    items,
    pagination: {
      page,
      limit,
      total,
      totalPages: Math.ceil(total / limit),
    },
  };

  await cacheService.set(cacheKey, result, 120);
  return result;
};

/**
 * Public: Get single product details by slug.
 */
export const getPublicProductBySlug = async (slug) => {
  const cacheKey = `products:slug:${slug}`;
  const cached = await cacheService.get(cacheKey);
  if (cached) {
    return cached;
  }

  const product = await Product.findOne({
    slug,
    approvalStatus: PRODUCT_APPROVAL_STATUS.APPROVED,
    status: PRODUCT_STATUS.PUBLISHED,
  })
    .populate('category', 'name slug')
    .populate('subcategory', 'name slug')
    .populate('brand', 'name slug logo')
    .populate('store', 'name slug logo description contactEmail contactPhone address.city address.country')
    .populate({
      path: 'variants',
      match: { status: 'active' },
    })
    .lean();

  if (!product) {
    throw AppError.notFound(`Product '${slug}' not found or not available.`);
  }

  await cacheService.set(cacheKey, product, 300);
  return product;
};

/**
 * Helper: Validates taxonomy consistency (category, subcategory, brand)
 */
const validateTaxonomy = async (categoryId, subcategoryId, brandId) => {
  const category = await Category.findById(categoryId);
  if (!category) {
    throw AppError.badRequest('Selected category does not exist.');
  }

  if (subcategoryId) {
    const subcategory = await Subcategory.findById(subcategoryId);
    if (!subcategory) {
      throw AppError.badRequest('Selected subcategory does not exist.');
    }
    if (subcategory.category.toString() !== categoryId.toString()) {
      throw AppError.badRequest(
        `Inconsistent taxonomy: Subcategory '${subcategory.name}' does not belong to Category '${category.name}'.`
      );
    }
  }

  if (brandId) {
    const brand = await Brand.findById(brandId);
    if (!brand) {
      throw AppError.badRequest('Selected brand does not exist.');
    }
  }
};

/**
 * Seller: Create a new marketplace product.
 */
export const createSellerProduct = async (userId, data) => {
  const seller = await Seller.findOne({ user: userId, approvalStatus: SELLER_APPROVAL_STATUS.APPROVED });
  if (!seller || !seller.store) {
    throw AppError.forbidden('Only approved sellers with an active store can publish products.');
  }

  // 1. Validate taxonomy
  await validateTaxonomy(data.category, data.subcategory, data.brand);

  // 2. Validate pricing
  const basePrice = parseFloat(data.basePrice);
  if (isNaN(basePrice) || basePrice < 0) {
    throw AppError.badRequest('Valid base price is required.');
  }

  let compareAtPrice = null;
  if (data.compareAtPrice !== undefined && data.compareAtPrice !== null && data.compareAtPrice !== '') {
    compareAtPrice = parseFloat(data.compareAtPrice);
    if (compareAtPrice < basePrice) {
      throw AppError.badRequest('Compare-at price cannot be lower than the base price.');
    }
  }

  // 3. Generate unique slug
  const baseSlug = createSlug(data.name);
  let uniqueSlug = baseSlug;
  let count = 1;
  while (await Product.findOne({ slug: uniqueSlug })) {
    uniqueSlug = `${baseSlug}-${count++}`;
  }

  // 4. Calculate total stock if simple or variant-based
  let stock = Math.max(0, parseInt(data.stock, 10) || 0);
  const hasVariants = Boolean(data.hasVariants && Array.isArray(data.variants) && data.variants.length > 0);

  if (hasVariants) {
    stock = data.variants.reduce((acc, v) => acc + (Math.max(0, parseInt(v.stock, 10) || 0)), 0);
  }

  // 5. Create product record (defaults to pending_review for moderation)
  const product = new Product({
    seller: seller._id,
    store: seller.store,
    category: data.category,
    subcategory: data.subcategory || null,
    brand: data.brand || null,
    name: data.name.trim(),
    slug: uniqueSlug,
    description: data.description.trim(),
    shortDescription: data.shortDescription?.trim() || '',
    specifications: Array.isArray(data.specifications) ? data.specifications : [],
    images: Array.isArray(data.images) ? data.images : [],
    hasVariants,
    sku: data.sku ? data.sku.trim().toUpperCase() : null,
    basePrice,
    compareAtPrice,
    discount: data.discount ? Math.min(100, Math.max(0, parseFloat(data.discount))) : 0,
    stock,
    status: data.status || PRODUCT_STATUS.PUBLISHED,
    approvalStatus: PRODUCT_APPROVAL_STATUS.PENDING_REVIEW,
    featured: false,
    tags: Array.isArray(data.tags) ? data.tags.map((t) => t.trim().toLowerCase()) : [],
  });

  await product.save();

  // 6. If product has variants, create variant documents
  if (hasVariants) {
    const variantDocs = data.variants.map((v) => ({
      product: product._id,
      sku: v.sku.trim().toUpperCase(),
      attributes: v.attributes || {},
      price: parseFloat(v.price) || basePrice,
      compareAtPrice: v.compareAtPrice ? parseFloat(v.compareAtPrice) : compareAtPrice,
      stock: Math.max(0, parseInt(v.stock, 10) || 0),
      lowStockThreshold: v.lowStockThreshold ? parseInt(v.lowStockThreshold, 10) : 5,
      weight: v.weight ? parseFloat(v.weight) : null,
      status: v.status || 'active',
      images: Array.isArray(v.images) ? v.images : [],
    }));

    await ProductVariant.insertMany(variantDocs);
  }

  await cacheService.deleteByPattern('products:*');

  return Product.findById(product._id).populate('variants');
};

/**
 * Seller: List own products with IDOR isolation.
 */
export const getSellerProducts = async (userId, query = {}) => {
  const seller = await Seller.findOne({ user: userId });
  if (!seller) {
    throw AppError.forbidden('Seller profile not found.');
  }

  const page = Math.max(1, parseInt(query.page, 10) || 1);
  const limit = Math.min(100, Math.max(1, parseInt(query.limit, 10) || 20));
  const skip = (page - 1) * limit;

  const filter = { seller: seller._id };

  if (query.approvalStatus) filter.approvalStatus = query.approvalStatus;
  if (query.status) filter.status = query.status;
  if (query.search) {
    filter.name = new RegExp(query.search.trim(), 'i');
  }

  const [items, total] = await Promise.all([
    Product.find(filter)
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit)
      .populate('category', 'name slug')
      .populate('subcategory', 'name slug')
      .populate('brand', 'name slug')
      .populate('variants')
      .lean(),
    Product.countDocuments(filter),
  ]);

  return {
    items,
    pagination: {
      page,
      limit,
      total,
      totalPages: Math.ceil(total / limit),
    },
  };
};

/**
 * Seller: View single product with strict ownership verification.
 */
export const getSellerProductById = async (userId, productId) => {
  const seller = await Seller.findOne({ user: userId });
  if (!seller) {
    throw AppError.forbidden('Seller profile not found.');
  }

  const product = await Product.findById(productId)
    .populate('category')
    .populate('subcategory')
    .populate('brand')
    .populate('variants');

  if (!product) {
    throw AppError.notFound('Product not found.');
  }

  // IDOR Ownership verification
  if (product.seller.toString() !== seller._id.toString()) {
    throw AppError.forbidden('Unauthorized access: You do not own this product.');
  }

  return product;
};

/**
 * Seller: Update product with strict ownership check.
 */
export const updateSellerProduct = async (userId, productId, data) => {
  const seller = await Seller.findOne({ user: userId });
  if (!seller) {
    throw AppError.forbidden('Seller profile not found.');
  }

  const product = await Product.findById(productId);
  if (!product) {
    throw AppError.notFound('Product not found.');
  }

  // IDOR Ownership check
  if (product.seller.toString() !== seller._id.toString()) {
    throw AppError.forbidden('Unauthorized access: You cannot modify another seller\'s product.');
  }

  // Taxonomy validation if category / subcategory / brand are updated
  const categoryId = data.category || product.category;
  const subcategoryId = data.subcategory !== undefined ? data.subcategory : product.subcategory;
  const brandId = data.brand !== undefined ? data.brand : product.brand;
  await validateTaxonomy(categoryId, subcategoryId, brandId);

  // If price or critical content modified, reset approval status to pending_review
  let requiresRemoderation = false;
  if (data.name && data.name.trim() !== product.name) {
    const baseSlug = createSlug(data.name);
    let uniqueSlug = baseSlug;
    let count = 1;
    while (await Product.findOne({ slug: uniqueSlug, _id: { $ne: product._id } })) {
      uniqueSlug = `${baseSlug}-${count++}`;
    }
    product.name = data.name.trim();
    product.slug = uniqueSlug;
    requiresRemoderation = true;
  }

  if (data.description && data.description !== product.description) {
    product.description = data.description.trim();
    requiresRemoderation = true;
  }

  if (data.basePrice !== undefined) {
    const newPrice = parseFloat(data.basePrice);
    if (newPrice < 0) throw AppError.badRequest('Price cannot be negative.');
    product.basePrice = newPrice;
  }

  if (data.compareAtPrice !== undefined) {
    product.compareAtPrice = data.compareAtPrice ? parseFloat(data.compareAtPrice) : null;
  }

  if (data.discount !== undefined) {
    product.discount = Math.min(100, Math.max(0, parseFloat(data.discount) || 0));
  }

  if (data.stock !== undefined && !product.hasVariants) {
    product.stock = Math.max(0, parseInt(data.stock, 10) || 0);
  }

  if (data.shortDescription !== undefined) product.shortDescription = data.shortDescription.trim();
  if (data.specifications !== undefined) product.specifications = data.specifications;
  if (data.images !== undefined) product.images = data.images;
  if (data.tags !== undefined) product.tags = data.tags;
  if (data.category !== undefined) product.category = data.category;
  if (data.subcategory !== undefined) product.subcategory = data.subcategory || null;
  if (data.brand !== undefined) product.brand = data.brand || null;
  if (data.sku !== undefined) product.sku = data.sku ? data.sku.trim().toUpperCase() : null;
  if (data.status !== undefined) product.status = data.status;

  if (requiresRemoderation && product.approvalStatus === PRODUCT_APPROVAL_STATUS.APPROVED) {
    product.approvalStatus = PRODUCT_APPROVAL_STATUS.PENDING_REVIEW;
  }

  await product.save();
  return Product.findById(product._id).populate('variants');
};

/**
 * Seller: Delete product with ownership verification.
 */
export const deleteSellerProduct = async (userId, productId) => {
  const seller = await Seller.findOne({ user: userId });
  if (!seller) {
    throw AppError.forbidden('Seller profile not found.');
  }

  const product = await Product.findById(productId);
  if (!product) {
    throw AppError.notFound('Product not found.');
  }

  if (product.seller.toString() !== seller._id.toString()) {
    throw AppError.forbidden('Unauthorized access: You cannot delete another seller\'s product.');
  }

  // Delete associated variants
  await ProductVariant.deleteMany({ product: product._id });
  await Product.findByIdAndDelete(productId);

  return { deleted: true, id: productId };
};

/**
 * Admin: List all marketplace products across sellers with filters.
 */
export const getAdminProducts = async (query = {}) => {
  const page = Math.max(1, parseInt(query.page, 10) || 1);
  const limit = Math.min(100, Math.max(1, parseInt(query.limit, 10) || 20));
  const skip = (page - 1) * limit;

  const filter = {};
  if (query.approvalStatus) filter.approvalStatus = query.approvalStatus;
  if (query.status) filter.status = query.status;
  if (query.category) filter.category = query.category;
  if (query.seller) filter.seller = query.seller;
  if (query.search) filter.name = new RegExp(query.search.trim(), 'i');

  const [items, total] = await Promise.all([
    Product.find(filter)
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit)
      .populate('category', 'name slug')
      .populate('seller', 'businessName businessEmail')
      .populate('store', 'name slug')
      .populate('variants')
      .lean(),
    Product.countDocuments(filter),
  ]);

  return {
    items,
    pagination: {
      page,
      limit,
      total,
      totalPages: Math.ceil(total / limit),
    },
  };
};

/**
 * Admin: Approve product for marketplace listing.
 */
export const approveProduct = async (adminId, productId) => {
  const product = await Product.findById(productId);
  if (!product) {
    throw AppError.notFound('Product not found.');
  }

  product.approvalStatus = PRODUCT_APPROVAL_STATUS.APPROVED;
  product.rejectionReason = null;
  await product.save();

  await cacheService.deleteByPattern('products:*');

  return product;
};

/**
 * Admin: Reject product with feedback reason.
 */
export const rejectProduct = async (adminId, productId, rejectionReason) => {
  const product = await Product.findById(productId);
  if (!product) {
    throw AppError.notFound('Product not found.');
  }

  product.approvalStatus = PRODUCT_APPROVAL_STATUS.REJECTED;
  product.rejectionReason = rejectionReason || 'Product violates catalog quality guidelines.';
  await product.save();

  await cacheService.deleteByPattern('products:*');

  return product;
};

/**
 * Admin: Archive product.
 */
export const archiveProduct = async (adminId, productId) => {
  const product = await Product.findById(productId);
  if (!product) {
    throw AppError.notFound('Product not found.');
  }

  product.approvalStatus = PRODUCT_APPROVAL_STATUS.ARCHIVED;
  product.status = PRODUCT_STATUS.ARCHIVED;
  await product.save();

  await cacheService.deleteByPattern('products:*');

  return product;
};

export default {
  getPublicProducts,
  getPublicProductBySlug,
  createSellerProduct,
  getSellerProducts,
  getSellerProductById,
  updateSellerProduct,
  deleteSellerProduct,
  getAdminProducts,
  approveProduct,
  rejectProduct,
  archiveProduct,
};
