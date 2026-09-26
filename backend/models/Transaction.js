import mongoose from 'mongoose';

export const TRANSACTION_TYPE = Object.freeze({
  PAYMENT: 'payment',
  REFUND: 'refund',
  COMMISSION: 'commission',
  PAYOUT: 'payout',
});

export const TRANSACTION_STATUS = Object.freeze({
  PENDING: 'pending',
  SUCCEEDED: 'succeeded',
  FAILED: 'failed',
  REVERSED: 'reversed',
});

const transactionSchema = new mongoose.Schema(
  {
    payment: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Payment',
      default: null,
      index: true,
    },
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
    seller: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Seller',
      default: null,
      index: true,
    },
    type: {
      type: String,
      enum: {
        values: Object.values(TRANSACTION_TYPE),
        message: 'Invalid transaction type.',
      },
      required: [true, 'Transaction type is required.'],
      index: true,
    },
    amount: {
      type: Number,
      required: [true, 'Transaction amount is required.'],
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
        values: Object.values(TRANSACTION_STATUS),
        message: 'Invalid transaction status.',
      },
      default: TRANSACTION_STATUS.SUCCEEDED,
      index: true,
    },
    reference: {
      type: String,
      default: null,
      trim: true,
      index: true,
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

transactionSchema.index({ user: 1, createdAt: -1 });
transactionSchema.index({ seller: 1, createdAt: -1 });
transactionSchema.index({ type: 1, createdAt: -1 });

export const Transaction = mongoose.model('Transaction', transactionSchema);
export default Transaction;
