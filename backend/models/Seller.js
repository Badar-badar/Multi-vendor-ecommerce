import mongoose from 'mongoose';

export const SELLER_APPROVAL_STATUS = Object.freeze({
  PENDING: 'pending',
  UNDER_REVIEW: 'under_review',
  APPROVED: 'approved',
  REJECTED: 'rejected',
  SUSPENDED: 'suspended',
});

export const SELLER_STATUS = Object.freeze({
  ACTIVE: 'active',
  INACTIVE: 'inactive',
  SUSPENDED: 'suspended',
});

const sellerSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: [true, 'User reference is required.'],
      unique: true, // One seller profile per user account
      index: true,
    },
    store: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Store',
      default: null,
    },
    businessName: {
      type: String,
      required: [true, 'Business/Atelier name is required.'],
      trim: true,
      minlength: [2, 'Business name must be at least 2 characters.'],
      maxlength: [150, 'Business name cannot exceed 150 characters.'],
    },
    businessDescription: {
      type: String,
      trim: true,
      maxlength: [2000, 'Description cannot exceed 2000 characters.'],
      default: '',
    },
    businessEmail: {
      type: String,
      required: [true, 'Business email is required.'],
      trim: true,
      lowercase: true,
    },
    businessPhone: {
      type: String,
      required: [true, 'Business phone is required.'],
      trim: true,
    },
    businessAddress: {
      street: { type: String, default: '' },
      city: { type: String, default: '' },
      state: { type: String, default: '' },
      country: { type: String, default: '' },
      postalCode: { type: String, default: '' },
    },
    approvalStatus: {
      type: String,
      enum: {
        values: Object.values(SELLER_APPROVAL_STATUS),
        message: 'Invalid seller approval status.',
      },
      default: SELLER_APPROVAL_STATUS.PENDING,
      index: true,
    },
    status: {
      type: String,
      enum: {
        values: Object.values(SELLER_STATUS),
        message: 'Invalid seller account status.',
      },
      default: SELLER_STATUS.ACTIVE,
      index: true,
    },
    approvedAt: {
      type: Date,
      default: null,
    },
    approvedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      default: null,
    },
    rejectedAt: {
      type: Date,
      default: null,
    },
    rejectedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      default: null,
    },
    rejectionReason: {
      type: String,
      trim: true,
      default: null,
    },
  },
  {
    timestamps: true,
  }
);

export const Seller = mongoose.model('Seller', sellerSchema);
export default Seller;
