import mongoose from 'mongoose';

const addressSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: [true, 'User reference is required.'],
      index: true,
    },
    fullName: {
      type: String,
      required: [true, 'Full name for delivery contact is required.'],
      trim: true,
      minlength: [2, 'Full name must be at least 2 characters.'],
      maxlength: [100, 'Full name cannot exceed 100 characters.'],
    },
    phone: {
      type: String,
      required: [true, 'Phone number for shipping coordination is required.'],
      trim: true,
    },
    addressLine1: {
      type: String,
      required: [true, 'Street address line 1 is required.'],
      trim: true,
      maxlength: [200, 'Address line cannot exceed 200 characters.'],
    },
    addressLine2: {
      type: String,
      trim: true,
      maxlength: [200, 'Address line cannot exceed 200 characters.'],
      default: '',
    },
    city: {
      type: String,
      required: [true, 'City is required.'],
      trim: true,
    },
    state: {
      type: String,
      required: [true, 'State/Province is required.'],
      trim: true,
    },
    postalCode: {
      type: String,
      required: [true, 'Postal/ZIP code is required.'],
      trim: true,
    },
    country: {
      type: String,
      required: [true, 'Country is required.'],
      trim: true,
      default: 'Pakistan',
    },
    isDefault: {
      type: Boolean,
      default: false,
    },
  },
  {
    timestamps: true,
  }
);

// Index user + isDefault for fast default address lookups
addressSchema.index({ user: 1, isDefault: 1 });

export const Address = mongoose.model('Address', addressSchema);
export default Address;
