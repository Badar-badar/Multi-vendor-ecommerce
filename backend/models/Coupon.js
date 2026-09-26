import mongoose from 'mongoose';

export const COUPON_TYPE = Object.freeze({
  PERCENTAGE: 'percentage',
  FIXED: 'fixed',
});

export const COUPON_SCOPE = Object.freeze({
  PLATFORM: 'platform',
  SELLER: 'seller',
});

const couponSchema = new mongoose.Schema(
  {
    code: {
      type: String,
      required: [true, 'Coupon code is required.'],
      unique: true,
      trim: true,
      uppercase: true,
      index: true,
    },
    description: {
      type: String,
      trim: true,
      default: '',
    },
    type: {
      type: String,
      enum: {
        values: Object.values(COUPON_TYPE),
        message: 'Coupon type must be percentage or fixed.',
      },
      required: true,
    },
    value: {
      type: Number,
      required: [true, 'Coupon value is required.'],
      min: [0, 'Coupon value cannot be negative.'],
    },
    scope: {
      type: String,
      enum: {
        values: Object.values(COUPON_SCOPE),
        message: 'Coupon scope must be platform or seller.',
      },
      default: COUPON_SCOPE.PLATFORM,
      index: true,
    },
    seller: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Seller',
      default: null,
      index: true,
    },
    minimumOrderAmount: {
      type: Number,
      default: 0,
      min: 0,
    },
    maximumDiscount: {
      type: Number,
      default: null,
      min: 0,
    },
    startDate: {
      type: Date,
      default: Date.now,
    },
    expiryDate: {
      type: Date,
      required: [true, 'Coupon expiration date is required.'],
    },
    usageLimit: {
      type: Number,
      default: null, // null means unlimited
      min: 1,
    },
    perUserLimit: {
      type: Number,
      default: 1,
      min: 1,
    },
    usageCount: {
      type: Number,
      default: 0,
      min: 0,
    },
    usedBy: [
      {
        user: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
        count: { type: Number, default: 0 },
      },
    ],
    applicableProducts: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Product',
      },
    ],
    applicableCategories: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Category',
      },
    ],
    status: {
      type: String,
      enum: ['active', 'inactive'],
      default: 'active',
      index: true,
    },
  },
  {
    timestamps: true,
  }
);

export const Coupon = mongoose.model('Coupon', couponSchema);
export default Coupon;
