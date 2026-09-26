import { Store } from '../models/Store.js';
import { Seller, SELLER_APPROVAL_STATUS } from '../models/Seller.js';
import { Product } from '../models/Product.js';
import { AppError } from '../utils/appError.js';
import { createSlug } from '../utils/slugify.js';

/**
 * Store Service
 */

/**
 * Public: List active stores with pagination and search.
 */
export const getPublicStores = async (query = {}) => {
  const page = Math.max(1, parseInt(query.page, 10) || 1);
  const limit = Math.min(50, Math.max(1, parseInt(query.limit, 10) || 12));
  const skip = (page - 1) * limit;

  const filter = { status: 'active' };

  if (query.search) {
    const searchRegex = new RegExp(query.search.trim(), 'i');
    filter.$or = [{ name: searchRegex }, { description: searchRegex }];
  }

  const [items, total] = await Promise.all([
    Store.find(filter)
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit)
      .select('name slug description logo coverImage address.city address.country status createdAt')
      .lean(),
    Store.countDocuments(filter),
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
 * Public: Get single active store details by slug.
 */
export const getStoreBySlug = async (slug) => {
  const store = await Store.findOne({ slug, status: 'active' })
    .select('name slug description logo coverImage contactEmail contactPhone address status createdAt')
    .lean();

  if (!store) {
    throw AppError.notFound(`Store '${slug}' not found.`);
  }

  // Count active products for this store
  const productCount = await Product.countDocuments({
    store: store._id,
    approvalStatus: 'approved',
    status: 'published',
  });

  return {
    ...store,
    productCount,
  };
};

/**
 * Seller: Get authenticated seller's store.
 */
export const getMyStore = async (userId) => {
  const seller = await Seller.findOne({ user: userId, approvalStatus: SELLER_APPROVAL_STATUS.APPROVED });
  if (!seller) {
    throw AppError.forbidden('You do not have an approved seller store.');
  }

  const store = await Store.findOne({ seller: seller._id });
  if (!store) {
    throw AppError.notFound('Store profile not found.');
  }

  return store;
};

/**
 * Seller: Update authenticated seller's store profile.
 */
export const updateMyStore = async (userId, data) => {
  const seller = await Seller.findOne({ user: userId, approvalStatus: SELLER_APPROVAL_STATUS.APPROVED });
  if (!seller) {
    throw AppError.forbidden('You do not have an approved seller store.');
  }

  const store = await Store.findOne({ seller: seller._id });
  if (!store) {
    throw AppError.notFound('Store profile not found.');
  }

  if (data.name && data.name.trim() !== store.name) {
    const baseSlug = createSlug(data.name);
    let uniqueSlug = baseSlug;
    let count = 1;
    while (await Store.findOne({ slug: uniqueSlug, _id: { $ne: store._id } })) {
      uniqueSlug = `${baseSlug}-${count++}`;
    }
    store.name = data.name.trim();
    store.slug = uniqueSlug;
  }

  if (data.description !== undefined) store.description = data.description.trim();
  if (data.logo !== undefined) store.logo = data.logo;
  if (data.coverImage !== undefined) store.coverImage = data.coverImage;
  if (data.contactEmail !== undefined) store.contactEmail = data.contactEmail.trim().toLowerCase();
  if (data.contactPhone !== undefined) store.contactPhone = data.contactPhone.trim();
  if (data.address) {
    store.address = {
      ...store.address.toObject(),
      ...data.address,
    };
  }

  await store.save();
  return store;
};

export default {
  getPublicStores,
  getStoreBySlug,
  getMyStore,
  updateMyStore,
};
