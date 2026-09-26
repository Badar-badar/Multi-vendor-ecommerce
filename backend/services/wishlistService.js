import { Wishlist } from '../models/Wishlist.js';
import { Product, PRODUCT_APPROVAL_STATUS, PRODUCT_STATUS } from '../models/Product.js';
import { addToCart } from './cartService.js';
import { AppError } from '../utils/appError.js';

/**
 * Wishlist Service
 */

export const getMyWishlist = async (userId) => {
  return Wishlist.find({ user: userId })
    .populate({
      path: 'product',
      match: { approvalStatus: PRODUCT_APPROVAL_STATUS.APPROVED, status: PRODUCT_STATUS.PUBLISHED },
      populate: [
        { path: 'category', select: 'name slug' },
        { path: 'brand', select: 'name slug' },
        { path: 'store', select: 'name slug logo' },
      ],
    })
    .sort({ createdAt: -1 })
    .lean();
};

export const addToWishlist = async (userId, productId) => {
  const product = await Product.findById(productId);
  if (!product || product.approvalStatus !== PRODUCT_APPROVAL_STATUS.APPROVED || product.status !== PRODUCT_STATUS.PUBLISHED) {
    throw AppError.notFound('Product not found or not available.');
  }

  const existing = await Wishlist.findOne({ user: userId, product: productId });
  if (existing) {
    return existing; // Idempotent add
  }

  const item = new Wishlist({ user: userId, product: productId });
  return item.save();
};

export const removeFromWishlist = async (userId, productId) => {
  await Wishlist.findOneAndDelete({ user: userId, product: productId });
  return { removed: true, productId };
};

export const moveWishlistToCart = async (userId, productId, variantId) => {
  // 1. Add to cart (validates product, variant, and stock)
  const cart = await addToCart(userId, { productId, variantId, quantity: 1 });

  // 2. Remove from wishlist only after successful cart addition
  await Wishlist.findOneAndDelete({ user: userId, product: productId });

  return {
    cart,
    movedProductId: productId,
  };
};

export default {
  getMyWishlist,
  addToWishlist,
  removeFromWishlist,
  moveWishlistToCart,
};
