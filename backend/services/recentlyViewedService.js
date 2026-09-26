import { RecentlyViewed } from '../models/RecentlyViewed.js';
import { Product, PRODUCT_APPROVAL_STATUS, PRODUCT_STATUS } from '../models/Product.js';

/**
 * Recently Viewed Products Service
 */

const MAX_RECENT_ITEMS = 20;

export const getRecentlyViewed = async (userId) => {
  const record = await RecentlyViewed.findOne({ user: userId })
    .populate({
      path: 'products.product',
      match: { approvalStatus: PRODUCT_APPROVAL_STATUS.APPROVED, status: PRODUCT_STATUS.PUBLISHED },
      select: 'name slug images basePrice compareAtPrice discount ratingAverage',
    })
    .lean();

  if (!record || !record.products) {
    return [];
  }

  // Filter out any populated products that became null (inactive/deleted)
  return record.products
    .filter((p) => p.product !== null)
    .map((p) => ({
      ...p.product,
      viewedAt: p.viewedAt,
    }));
};

export const recordProductView = async (userId, productId) => {
  const product = await Product.findById(productId);
  if (!product) return null;

  let record = await RecentlyViewed.findOne({ user: userId });
  if (!record) {
    record = new RecentlyViewed({ user: userId, products: [] });
  }

  // Remove existing entry for this product to place it at the front
  record.products = record.products.filter(
    (p) => p.product.toString() !== productId.toString()
  );

  // Unshift new view
  record.products.unshift({
    product: productId,
    viewedAt: new Date(),
  });

  // Cap list size
  if (record.products.length > MAX_RECENT_ITEMS) {
    record.products = record.products.slice(0, MAX_RECENT_ITEMS);
  }

  await record.save();
  return record;
};

export default {
  getRecentlyViewed,
  recordProductView,
};
