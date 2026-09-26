import mongoose from 'mongoose';
import { createSlug } from '../utils/slugify.js';

const storeSchema = new mongoose.Schema(
  {
    seller: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Seller',
      required: [true, 'Seller reference is required.'],
      unique: true, // One primary store per seller
      index: true,
    },
    name: {
      type: String,
      required: [true, 'Store name is required.'],
      trim: true,
      minlength: [2, 'Store name must be at least 2 characters.'],
      maxlength: [100, 'Store name cannot exceed 100 characters.'],
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
      maxlength: [2000, 'Description cannot exceed 2000 characters.'],
      default: '',
    },
    logo: {
      type: String,
      default: '',
    },
    coverImage: {
      type: String,
      default: '',
    },
    contactEmail: {
      type: String,
      trim: true,
      lowercase: true,
      default: '',
    },
    contactPhone: {
      type: String,
      trim: true,
      default: '',
    },
    address: {
      street: { type: String, default: '' },
      city: { type: String, default: '' },
      state: { type: String, default: '' },
      country: { type: String, default: '' },
      postalCode: { type: String, default: '' },
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
  },
  {
    timestamps: true,
  }
);

// Pre-save hook to generate unique slug if not provided
storeSchema.pre('save', function () {
  if (!this.slug) {
    this.slug = createSlug(this.name);
  }
});

export const Store = mongoose.model('Store', storeSchema);
export default Store;
