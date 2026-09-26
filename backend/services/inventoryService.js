import { Product } from '../models/Product.js';
import { ProductVariant } from '../models/ProductVariant.js';
import { Seller } from '../models/Seller.js';
import { AppError } from '../utils/appError.js';

/**
 * Inventory Management Service
 */

/**
 * Seller: Get inventory dashboard and low stock alerts for own products.
 */
export const getSellerInventory = async (userId, query = {}) => {
  const seller = await Seller.findOne({ user: userId });
  if (!seller) {
    throw AppError.forbidden('Seller profile not found.');
  }

  const page = Math.max(1, parseInt(query.page, 10) || 1);
  const limit = Math.min(100, Math.max(1, parseInt(query.limit, 10) || 25));
  const skip = (page - 1) * limit;

  const filter = { seller: seller._id };
  if (query.lowStock === 'true') {
    filter.$expr = { $lte: ['$stock', '$lowStockThreshold'] };
  }

  const [items, total] = await Promise.all([
    Product.find(filter)
      .select('name slug sku stock reservedStock lowStockThreshold hasVariants basePrice status approvalStatus')
      .populate({
        path: 'variants',
        select: 'sku attributes stock reservedStock lowStockThreshold price status',
      })
      .skip(skip)
      .limit(limit)
      .lean(),
    Product.countDocuments(filter),
  ]);

  // Compute available stock for each item
  const formattedItems = items.map((p) => ({
    ...p,
    availableStock: Math.max(0, (p.stock || 0) - (p.reservedStock || 0)),
    isLowStock: (p.stock || 0) <= (p.lowStockThreshold || 5),
    variants: (p.variants || []).map((v) => ({
      ...v,
      availableStock: Math.max(0, (v.stock || 0) - (v.reservedStock || 0)),
      isLowStock: (v.stock || 0) <= (v.lowStockThreshold || 5),
    })),
  }));

  return {
    items: formattedItems,
    pagination: {
      page,
      limit,
      total,
      totalPages: Math.ceil(total / limit),
    },
  };
};

/**
 * Seller: Adjust stock level for simple product or variant.
 */
export const adjustStock = async (userId, productId, { variantId, stock, adjustment }) => {
  const seller = await Seller.findOne({ user: userId });
  if (!seller) {
    throw AppError.forbidden('Seller profile not found.');
  }

  const product = await Product.findById(productId);
  if (!product) {
    throw AppError.notFound('Product not found.');
  }

  // IDOR check
  if (product.seller.toString() !== seller._id.toString()) {
    throw AppError.forbidden('Unauthorized access: You do not own this product.');
  }

  // If adjusting variant stock
  if (variantId) {
    const variant = await ProductVariant.findOne({ _id: variantId, product: productId });
    if (!variant) {
      throw AppError.notFound('Product variant not found.');
    }

    let newStock = variant.stock;
    if (stock !== undefined) {
      newStock = parseInt(stock, 10);
    } else if (adjustment !== undefined) {
      newStock += parseInt(adjustment, 10);
    }

    if (isNaN(newStock) || newStock < 0) {
      throw AppError.badRequest('Stock quantity cannot be negative.');
    }

    variant.stock = newStock;
    await variant.save();

    // Recalculate parent product total stock
    const allVariants = await ProductVariant.find({ product: productId });
    product.stock = allVariants.reduce((acc, v) => acc + (v.stock || 0), 0);
    await product.save();

    return {
      product: product._id,
      variant: variant._id,
      sku: variant.sku,
      stock: variant.stock,
      reservedStock: variant.reservedStock,
      availableStock: variant.availableStock,
    };
  }

  // Simple product stock adjustment
  let newStock = product.stock;
  if (stock !== undefined) {
    newStock = parseInt(stock, 10);
  } else if (adjustment !== undefined) {
    newStock += parseInt(adjustment, 10);
  }

  if (isNaN(newStock) || newStock < 0) {
    throw AppError.badRequest('Stock quantity cannot be negative.');
  }

  product.stock = newStock;
  await product.save();

  return {
    product: product._id,
    stock: product.stock,
    reservedStock: product.reservedStock,
    availableStock: product.availableStock,
  };
};

export default {
  getSellerInventory,
  adjustStock,
};
