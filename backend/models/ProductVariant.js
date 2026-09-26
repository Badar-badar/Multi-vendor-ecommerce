import mongoose from 'mongoose';

const productVariantSchema = new mongoose.Schema(
  {
    product: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Product',
      required: [true, 'Product reference is required.'],
      index: true,
    },
    sku: {
      type: String,
      required: [true, 'SKU is required for product variant.'],
      unique: true,
      trim: true,
      uppercase: true,
      index: true,
    },
    attributes: {
      type: Map,
      of: String,
      default: {},
    },
    price: {
      type: Number,
      required: [true, 'Variant price is required.'],
      min: [0, 'Price cannot be negative.'],
    },
    compareAtPrice: {
      type: Number,
      default: null,
      min: [0, 'Compare-at price cannot be negative.'],
    },
    stock: {
      type: Number,
      required: true,
      default: 0,
      min: [0, 'Stock cannot be negative.'],
    },
    reservedStock: {
      type: Number,
      default: 0,
      min: [0, 'Reserved stock cannot be negative.'],
    },
    lowStockThreshold: {
      type: Number,
      default: 5,
      min: 0,
    },
    weight: {
      type: Number,
      default: null,
    },
    status: {
      type: String,
      enum: {
        values: ['active', 'inactive'],
        message: 'Variant status must be active or inactive.',
      },
      default: 'active',
      index: true,
    },
    images: [
      {
        url: { type: String, required: true },
        alt: { type: String, default: '' },
      },
    ],
  },
  {
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  }
);

// Virtual for available stock: stock - reservedStock
productVariantSchema.virtual('availableStock').get(function () {
  return Math.max(0, (this.stock || 0) - (this.reservedStock || 0));
});

export const ProductVariant = mongoose.model('ProductVariant', productVariantSchema);
export default ProductVariant;
