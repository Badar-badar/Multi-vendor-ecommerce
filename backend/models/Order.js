import mongoose from 'mongoose';

export const ORDER_STATUS = Object.freeze({
  PENDING_PAYMENT: 'pending_payment',
  PAID: 'paid',
  PROCESSING: 'processing',
  SHIPPED: 'shipped',
  DELIVERED: 'delivered',
  CANCELLED: 'cancelled',
  RETURN_REQUESTED: 'return_requested',
  RETURNED: 'returned',
  REFUNDED: 'refunded',
});

export const ITEM_STATUS = Object.freeze({
  PENDING: 'pending',
  PROCESSING: 'processing',
  SHIPPED: 'shipped',
  DELIVERED: 'delivered',
  CANCELLED: 'cancelled',
  RETURNED: 'returned',
});

const orderItemSchema = new mongoose.Schema(
  {
    product: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Product',
      required: true,
    },
    variant: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'ProductVariant',
      default: null,
    },
    seller: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Seller',
      required: true,
      index: true,
    },
    store: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Store',
      required: true,
    },
    productName: {
      type: String,
      required: true,
    },
    sku: {
      type: String,
      default: '',
    },
    image: {
      type: String,
      default: '',
    },
    quantity: {
      type: Number,
      required: true,
      min: 1,
    },
    unitPrice: {
      type: Number,
      required: true,
      min: 0,
    },
    discount: {
      type: Number,
      default: 0,
      min: 0,
    },
    finalItemTotal: {
      type: Number,
      required: true,
      min: 0,
    },
    status: {
      type: String,
      enum: Object.values(ITEM_STATUS),
      default: ITEM_STATUS.PENDING,
    },
  },
  { _id: true }
);

const orderSchema = new mongoose.Schema(
  {
    orderNumber: {
      type: String,
      required: true,
      unique: true,
      trim: true,
      index: true,
    },
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: [true, 'User reference is required.'],
      index: true,
    },
    items: [orderItemSchema],
    shippingAddress: {
      fullName: { type: String, required: true },
      phone: { type: String, required: true },
      addressLine1: { type: String, required: true },
      addressLine2: { type: String, default: '' },
      city: { type: String, required: true },
      state: { type: String, required: true },
      postalCode: { type: String, required: true },
      country: { type: String, default: 'Pakistan' },
    },
    billingAddress: {
      fullName: { type: String },
      phone: { type: String },
      addressLine1: { type: String },
      addressLine2: { type: String },
      city: { type: String },
      state: { type: String },
      postalCode: { type: String },
      country: { type: String },
    },
    shippingMethod: {
      type: String,
      default: 'standard',
    },
    subtotal: {
      type: Number,
      required: true,
      min: 0,
    },
    discount: {
      type: Number,
      default: 0,
      min: 0,
    },
    tax: {
      type: Number,
      default: 0,
      min: 0,
    },
    shippingCost: {
      type: Number,
      default: 0,
      min: 0,
    },
    total: {
      type: Number,
      required: true,
      min: 0,
    },
    coupon: {
      code: { type: String, default: null },
      discountAmount: { type: Number, default: 0 },
      couponId: { type: mongoose.Schema.Types.ObjectId, ref: 'Coupon', default: null },
    },
    payment: {
      method: { type: String, default: 'cod' }, // 'cod', 'stripe', 'card', etc.
      status: {
        type: String,
        enum: ['pending', 'paid', 'failed', 'refunded', 'partially_refunded'],
        default: 'pending',
      },
      transactionId: { type: String, default: null },
      paidAt: { type: Date, default: null },
    },
    orderStatus: {
      type: String,
      enum: {
        values: Object.values(ORDER_STATUS),
        message: 'Invalid order status.',
      },
      default: ORDER_STATUS.PENDING_PAYMENT,
      index: true,
    },
    cancellation: {
      isCancelled: { type: Boolean, default: false },
      reason: { type: String, default: null },
      cancelledAt: { type: Date, default: null },
      cancelledBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User', default: null },
    },
    returnRequest: {
      reason: { type: String, default: null },
      description: { type: String, default: null },
      items: [{ type: mongoose.Schema.Types.ObjectId }],
      status: {
        type: String,
        enum: ['requested', 'approved', 'rejected', 'received', 'refunded', null],
        default: null,
      },
      requestedAt: { type: Date, default: null },
      reviewedAt: { type: Date, default: null },
      resolution: { type: String, default: null },
    },
  },
  {
    timestamps: true,
  }
);

// Indexes for order lookups
orderSchema.index({ user: 1, createdAt: -1 });
orderSchema.index({ 'items.seller': 1, createdAt: -1 });
orderSchema.index({ orderStatus: 1, createdAt: -1 });

export const Order = mongoose.model('Order', orderSchema);
export default Order;
