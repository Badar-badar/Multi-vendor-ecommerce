import mongoose from 'mongoose';
import { Review, REVIEW_STATUS } from '../models/Review.js';
import { Product } from '../models/Product.js';
import { Order, ORDER_STATUS } from '../models/Order.js';
import { Seller } from '../models/Seller.js';
import { AppError } from '../utils/appError.js';

/**
 * Review & Rating Service
 */

/**
 * Helper: Recalculates aggregate ratingAverage and ratingCount on Product model.
 */
export const recalculateProductRatings = async (productId) => {
  const targetId = new mongoose.Types.ObjectId(productId.toString());

  const stats = await Review.aggregate([
    {
      $match: {
        product: targetId,
        status: REVIEW_STATUS.APPROVED,
      },
    },
    {
      $group: {
        _id: '$product',
        ratingAverage: { $avg: '$rating' },
        ratingCount: { $sum: 1 },
      },
    },
  ]);

  if (stats.length > 0) {
    await Product.findByIdAndUpdate(productId, {
      ratingAverage: Math.round(stats[0].ratingAverage * 10) / 10,
      ratingCount: stats[0].ratingCount,
    });
  } else {
    await Product.findByIdAndUpdate(productId, {
      ratingAverage: 0,
      ratingCount: 0,
    });
  }
};

/**
 * Customer: Create verified purchase review.
 */
export const createProductReview = async (userId, productId, data) => {
  const product = await Product.findById(productId);
  if (!product) throw AppError.notFound('Product not found.');

  // 1. Verify Purchase: Must have an order containing this product in delivered or paid status
  const qualifyingOrder = await Order.findOne({
    user: userId,
    'items.product': productId,
    orderStatus: { $in: [ORDER_STATUS.DELIVERED, ORDER_STATUS.PAID, ORDER_STATUS.PROCESSING, ORDER_STATUS.SHIPPED] },
  }).sort({ createdAt: -1 });

  if (!qualifyingOrder) {
    throw AppError.forbidden('Verified purchase required: You can only review products you have purchased on Zareen.');
  }

  // 2. Prevent duplicate review for the same product & order
  const existingReview = await Review.findOne({
    user: userId,
    product: productId,
    order: qualifyingOrder._id,
  });

  if (existingReview) {
    throw AppError.conflict('You have already submitted a review for this purchase.');
  }

  const matchingItem = qualifyingOrder.items.find((i) => i.product.toString() === productId.toString());

  const ratingVal = Math.min(5, Math.max(1, parseInt(data.rating, 10)));

  const review = new Review({
    user: userId,
    product: productId,
    order: qualifyingOrder._id,
    orderItem: matchingItem?._id || null,
    rating: ratingVal,
    title: data.title?.trim() || '',
    comment: data.comment.trim(),
    images: Array.isArray(data.images) ? data.images : [],
    isVerifiedPurchase: true,
    status: REVIEW_STATUS.APPROVED,
  });

  await review.save();
  await recalculateProductRatings(productId);

  return review;
};

/**
 * Public: Get approved reviews for a product with pagination.
 */
export const getProductReviews = async (productId, query = {}) => {
  const page = Math.max(1, parseInt(query.page, 10) || 1);
  const limit = Math.min(50, Math.max(1, parseInt(query.limit, 10) || 10));
  const skip = (page - 1) * limit;

  const filter = {
    product: productId,
    status: REVIEW_STATUS.APPROVED,
  };

  const [items, total] = await Promise.all([
    Review.find(filter)
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit)
      .populate('user', 'name avatar')
      .populate('sellerResponse.seller', 'businessName')
      .lean(),
    Review.countDocuments(filter),
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
 * Customer: Update own review.
 */
export const updateCustomerReview = async (userId, reviewId, data) => {
  const review = await Review.findById(reviewId);
  if (!review) throw AppError.notFound('Review not found.');

  if (review.user.toString() !== userId.toString()) {
    throw AppError.forbidden('Unauthorized access: You do not own this review.');
  }

  if (data.rating !== undefined) {
    review.rating = Math.min(5, Math.max(1, parseInt(data.rating, 10)));
  }
  if (data.title !== undefined) review.title = data.title.trim();
  if (data.comment !== undefined) review.comment = data.comment.trim();
  if (data.images !== undefined) review.images = data.images;

  await review.save();
  await recalculateProductRatings(review.product);

  return review;
};

/**
 * Customer: Delete own review.
 */
export const deleteCustomerReview = async (userId, reviewId) => {
  const review = await Review.findById(reviewId);
  if (!review) throw AppError.notFound('Review not found.');

  if (review.user.toString() !== userId.toString()) {
    throw AppError.forbidden('Unauthorized access: You do not own this review.');
  }

  const productId = review.product;
  await Review.findByIdAndDelete(reviewId);
  await recalculateProductRatings(productId);

  return { deleted: true, id: reviewId };
};

/**
 * Admin: Moderation (approve, reject, hide).
 */
export const moderateReview = async (adminId, reviewId, status) => {
  const review = await Review.findById(reviewId);
  if (!review) throw AppError.notFound('Review not found.');

  if (!Object.values(REVIEW_STATUS).includes(status)) {
    throw AppError.badRequest('Invalid review status.');
  }

  review.status = status;
  await review.save();
  await recalculateProductRatings(review.product);

  return review;
};

/**
 * Admin: List reviews with filter and pagination.
 */
export const getAdminReviews = async (query = {}) => {
  const page = Math.max(1, parseInt(query.page, 10) || 1);
  const limit = Math.min(100, Math.max(1, parseInt(query.limit, 10) || 20));
  const skip = (page - 1) * limit;

  const filter = {};
  if (query.status) filter.status = query.status;
  if (query.product) filter.product = query.product;

  const [items, total] = await Promise.all([
    Review.find(filter)
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit)
      .populate('user', 'name email')
      .populate('product', 'name slug')
      .lean(),
    Review.countDocuments(filter),
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

export default {
  createProductReview,
  getProductReviews,
  updateCustomerReview,
  deleteCustomerReview,
  moderateReview,
  getAdminReviews,
  recalculateProductRatings,
};
