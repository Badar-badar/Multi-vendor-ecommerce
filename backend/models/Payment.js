import mongoose from 'mongoose';

export const PAYMENT_STATUS = Object.freeze({
  PENDING: 'pending',
  PROCESSING: 'processing',
  SUCCEEDED: 'succeeded',
  FAILED: 'failed',
  CANCELLED: 'cancelled',
  REFUNDED: 'refunded',
  PARTIALLY_REFUNDED: 'partially_refunded',
});

const paymentSchema = new mongoose.Schema(
  {
    order: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Order',
      required: [true, 'Order reference is required.'],
      index: true,
    },
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: [true, 'User reference is required.'],
      index: true,
    },
    stripePaymentIntentId: {
      type: String,
      required: [true, 'Stripe PaymentIntent ID is required.'],
      unique: true,
      trim: true,
      index: true,
    },
    stripeCustomerId: {
      type: String,
      default: null,
      trim: true,
    },
    amount: {
      type: Number,
      required: [true, 'Payment amount is required.'],
      min: [0, 'Payment amount must be non-negative.'],
    },
    amountRefunded: {
      type: Number,
      default: 0,
      min: [0, 'Refunded amount cannot be negative.'],
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
        values: Object.values(PAYMENT_STATUS),
        message: 'Invalid payment status.',
      },
      default: PAYMENT_STATUS.PENDING,
      index: true,
    },
    paymentMethod: {
      type: String,
      default: 'card',
      trim: true,
    },
    paidAt: {
      type: Date,
      default: null,
    },
    failureReason: {
      type: String,
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

// Compound indexes for performant historical queries
paymentSchema.index({ user: 1, createdAt: -1 });
paymentSchema.index({ order: 1, status: 1 });
paymentSchema.index({ status: 1, createdAt: -1 });

export const Payment = mongoose.model('Payment', paymentSchema);
export default Payment;
