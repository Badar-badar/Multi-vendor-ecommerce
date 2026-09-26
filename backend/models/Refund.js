import mongoose from 'mongoose';

export const REFUND_STATUS = Object.freeze({
  PENDING: 'pending',
  PROCESSING: 'processing',
  SUCCEEDED: 'succeeded',
  FAILED: 'failed',
  CANCELLED: 'cancelled',
});

const refundSchema = new mongoose.Schema(
  {
    order: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Order',
      required: [true, 'Order reference is required.'],
      index: true,
    },
    payment: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Payment',
      required: [true, 'Payment reference is required.'],
      index: true,
    },
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: [true, 'User reference is required.'],
      index: true,
    },
    stripeRefundId: {
      type: String,
      unique: true,
      sparse: true,
      trim: true,
      index: true,
    },
    amount: {
      type: Number,
      required: [true, 'Refund amount is required.'],
      min: [0.01, 'Refund amount must be greater than zero.'],
    },
    currency: {
      type: String,
      default: 'pkr',
      trim: true,
      lowercase: true,
    },
    reason: {
      type: String,
      default: 'customer_request',
      trim: true,
    },
    status: {
      type: String,
      enum: {
        values: Object.values(REFUND_STATUS),
        message: 'Invalid refund status.',
      },
      default: REFUND_STATUS.PENDING,
      index: true,
    },
    requestedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: [true, 'Requester user reference is required.'],
    },
    processedAt: {
      type: Date,
      default: null,
    },
    metadata: {
      type: mongoose.Schema.Types.Mixed,
      default: {},
    },
  },
  {
    timestamps: true,
  }
);

refundSchema.index({ order: 1, createdAt: -1 });
refundSchema.index({ user: 1, createdAt: -1 });

export const Refund = mongoose.model('Refund', refundSchema);
export default Refund;
