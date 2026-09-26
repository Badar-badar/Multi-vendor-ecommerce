import mongoose from 'mongoose';

export const REVIEW_STATUS = Object.freeze({
  PENDING: 'pending',
  APPROVED: 'approved',
  REJECTED: 'rejected',
  HIDDEN: 'hidden',
});

const reviewSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: [true, 'User reference is required.'],
      index: true,
    },
    product: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Product',
      required: [true, 'Product reference is required.'],
      index: true,
    },
    order: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Order',
      required: [true, 'Order reference is required to verify purchase.'],
      index: true,
    },
    orderItem: {
      type: mongoose.Schema.Types.ObjectId,
      default: null,
    },
    rating: {
      type: Number,
      required: [true, 'Rating (1 to 5) is required.'],
      min: [1, 'Rating cannot be less than 1.'],
      max: [5, 'Rating cannot exceed 5.'],
      index: true,
    },
    title: {
      type: String,
      trim: true,
      maxlength: [150, 'Review title cannot exceed 150 characters.'],
      default: '',
    },
    comment: {
      type: String,
      required: [true, 'Review comment is required.'],
      trim: true,
      minlength: [5, 'Comment must be at least 5 characters.'],
      maxlength: [2000, 'Comment cannot exceed 2000 characters.'],
    },
    images: [
      {
        url: { type: String, required: true },
        alt: { type: String, default: '' },
      },
    ],
    isVerifiedPurchase: {
      type: Boolean,
      default: false,
    },
    status: {
      type: String,
      enum: {
        values: Object.values(REVIEW_STATUS),
        message: 'Invalid review status.',
      },
      default: REVIEW_STATUS.APPROVED, // Default approved for direct publication or moderation
      index: true,
    },
    sellerResponse: {
      comment: { type: String, trim: true, default: null },
      respondedAt: { type: Date, default: null },
      seller: { type: mongoose.Schema.Types.ObjectId, ref: 'Seller', default: null },
    },
  },
  {
    timestamps: true,
  }
);

// Prevent duplicate reviews from the same user for the same order & product
reviewSchema.index({ user: 1, product: 1, order: 1 }, { unique: true });

export const Review = mongoose.model('Review', reviewSchema);
export default Review;
