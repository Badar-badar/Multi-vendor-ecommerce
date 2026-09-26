import mongoose from 'mongoose';

export const COMMISSION_STATUS = Object.freeze({
  PENDING: 'pending',
  EARNED: 'earned',
  REVERSED: 'reversed',
  REFUNDED: 'refunded',
});

const commissionSchema = new mongoose.Schema(
  {
    order: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Order',
      required: [true, 'Order reference is required.'],
      index: true,
    },
    orderItem: {
      type: mongoose.Schema.Types.ObjectId,
      required: [true, 'Order item reference is required.'],
    },
    seller: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Seller',
      required: [true, 'Seller reference is required.'],
      index: true,
    },
    amount: {
      type: Number,
      required: [true, 'Commission amount is required.'],
      min: [0, 'Commission amount must be non-negative.'],
    },
    rate: {
      type: Number,
      required: [true, 'Commission rate is required.'],
      min: [0, 'Commission rate cannot be negative.'],
      max: [1, 'Commission rate cannot exceed 1.0 (100%).'],
    },
    itemPrice: {
      type: Number,
      required: true,
      min: 0,
    },
    sellerNetEarnings: {
      type: Number,
      required: true,
    },
    currency: {
      type: String,
      default: 'pkr',
      trim: true,
      lowercase: true,
    },
    status: {
      type: String,
      enum: {
        values: Object.values(COMMISSION_STATUS),
        message: 'Invalid commission status.',
      },
      default: COMMISSION_STATUS.PENDING,
      index: true,
    },
    refundReference: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Refund',
      default: null,
    },
  },
  {
    timestamps: true,
  }
);

commissionSchema.index({ seller: 1, status: 1, createdAt: -1 });
commissionSchema.index({ order: 1, orderItem: 1 });

export const Commission = mongoose.model('Commission', commissionSchema);
export default Commission;
