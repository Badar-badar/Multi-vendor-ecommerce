import mongoose from 'mongoose';
import { createSlug } from '../utils/slugify.js';

const categorySchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'Category name is required.'],
      trim: true,
      minlength: [2, 'Category name must be at least 2 characters.'],
      maxlength: [100, 'Category name cannot exceed 100 characters.'],
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
      trim: true,
      maxlength: [1000, 'Description cannot exceed 1000 characters.'],
      default: '',
    },
    image: {
      type: String,
      default: '',
    },
    status: {
      type: String,
      enum: {
        values: ['active', 'inactive'],
        message: 'Status must be active or inactive.',
      },
      default: 'active',
      index: true,
    },
    sortOrder: {
      type: Number,
      default: 0,
    },
  },
  {
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  }
);

// Virtual for subcategories populated on request
categorySchema.virtual('subcategories', {
  ref: 'Subcategory',
  localField: '_id',
  foreignField: 'category',
});

// Pre-save hook to generate unique slug
categorySchema.pre('save', function () {
  if (this.isModified('name') || !this.slug) {
    this.slug = createSlug(this.name);
  }
});

export const Category = mongoose.model('Category', categorySchema);
export default Category;
