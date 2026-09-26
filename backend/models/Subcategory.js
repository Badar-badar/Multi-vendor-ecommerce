import mongoose from 'mongoose';
import { createSlug } from '../utils/slugify.js';

const subcategorySchema = new mongoose.Schema(
  {
    category: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Category',
      required: [true, 'Parent category is required.'],
      index: true,
    },
    name: {
      type: String,
      required: [true, 'Subcategory name is required.'],
      trim: true,
      minlength: [2, 'Subcategory name must be at least 2 characters.'],
      maxlength: [100, 'Subcategory name cannot exceed 100 characters.'],
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
  }
);

// Compound index for unique subcategory per category
subcategorySchema.index({ category: 1, slug: 1 });

// Pre-save hook to generate unique slug
subcategorySchema.pre('save', function () {
  if (this.isModified('name') || !this.slug) {
    this.slug = createSlug(this.name);
  }
});

export const Subcategory = mongoose.model('Subcategory', subcategorySchema);
export default Subcategory;
