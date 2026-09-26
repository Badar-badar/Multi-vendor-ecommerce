import mongoose from 'mongoose';
import { createSlug } from '../utils/slugify.js';

export const PRODUCT_STATUS = Object.freeze({
  DRAFT: 'draft',
  PUBLISHED: 'published',
  ARCHIVED: 'archived',
});

export const PRODUCT_APPROVAL_STATUS = Object.freeze({
  DRAFT: 'draft',
  PENDING_REVIEW: 'pending_review',
  APPROVED: 'approved',
  REJECTED: 'rejected',
  ARCHIVED: 'archived',
});

const productSchema = new mongoose.Schema(
  {
    seller: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Seller',
      required: [true, 'Seller reference is required.'],
      index: true,
    },
    store: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Store',
      required: [true, 'Store reference is required.'],
      index: true,
    },
    category: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Category',
      required: [true, 'Category reference is required.'],
      index: true,
    },
    subcategory: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Subcategory',
      default: null,
      index: true,
    },
    brand: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Brand',
      default: null,
      index: true,
    },
    name: {
      type: String,
      required: [true, 'Product name is required.'],
      trim: true,
      minlength: [3, 'Product name must be at least 3 characters.'],
      maxlength: [250, 'Product name cannot exceed 250 characters.'],
    },
    slug: {
      type: String,
      unique: true,
      trim: true,
      lowercase: true,
      index: true,
    },
    description: {
      type: String,
      required: [true, 'Product description is required.'],
      trim: true,
    },
    shortDescription: {
      type: String,
      trim: true,
      maxlength: [500, 'Short description cannot exceed 500 characters.'],
      default: '',
    },
    specifications: [
      {
        name: { type: String, required: true, trim: true },
        value: { type: String, required: true, trim: true },
      },
    ],
    images: [
      {
        url: { type: String, required: true },
        alt: { type: String, default: '' },
        sortOrder: { type: Number, default: 0 },
        isPrimary: { type: Boolean, default: false },
      },
    ],
    hasVariants: {
      type: Boolean,
      default: false,
    },
    sku: {
      type: String,
      trim: true,
      uppercase: true,
      default: null,
    },
    basePrice: {
      type: Number,
      required: [true, 'Base price is required.'],
      min: [0, 'Base price cannot be negative.'],
      index: true,
    },
    compareAtPrice: {
      type: Number,
      default: null,
      min: [0, 'Compare-at price cannot be negative.'],
    },
    discount: {
      type: Number,
      default: 0,
      min: [0, 'Discount cannot be negative.'],
      max: [100, 'Discount percentage cannot exceed 100%.'],
    },
    stock: {
      type: Number,
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
    status: {
      type: String,
      enum: {
        values: Object.values(PRODUCT_STATUS),
        message: 'Invalid product status.',
      },
      default: PRODUCT_STATUS.PUBLISHED,
      index: true,
    },
    approvalStatus: {
      type: String,
      enum: {
        values: Object.values(PRODUCT_APPROVAL_STATUS),
        message: 'Invalid product approval status.',
      },
      default: PRODUCT_APPROVAL_STATUS.PENDING_REVIEW,
      index: true,
    },
    rejectionReason: {
      type: String,
      default: null,
    },
    featured: {
      type: Boolean,
      default: false,
      index: true,
    },
    tags: {
      type: [String],
      default: [],
      index: true,
    },
    ratingAverage: {
      type: Number,
      default: 0,
      min: [0, 'Rating cannot be less than 0.'],
      max: [5, 'Rating cannot exceed 5.'],
      index: true,
    },
    ratingCount: {
      type: Number,
      default: 0,
      min: 0,
    },
    salesCount: {
      type: Number,
      default: 0,
      min: 0,
    },
  },
  {
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  }
);

// Virtual for available stock: stock - reservedStock
productSchema.virtual('availableStock').get(function () {
  return Math.max(0, (this.stock || 0) - (this.reservedStock || 0));
});

// Virtual for populated variants
productSchema.virtual('variants', {
  ref: 'ProductVariant',
  localField: '_id',
  foreignField: 'product',
});

// Text index for search
productSchema.index({
  name: 'text',
  shortDescription: 'text',
  description: 'text',
  tags: 'text',
});

// Compound indexes for marketplace catalog queries
productSchema.index({ approvalStatus: 1, status: 1, category: 1, basePrice: 1 });
productSchema.index({ approvalStatus: 1, status: 1, ratingAverage: -1 });
productSchema.index({ approvalStatus: 1, status: 1, createdAt: -1 });

// Pre-save hook: generate unique slug
productSchema.pre('save', function () {
  if (this.isModified('name') || !this.slug) {
    this.slug = createSlug(this.name);
  }
});

export const Product = mongoose.model('Product', productSchema);
export default Product;
