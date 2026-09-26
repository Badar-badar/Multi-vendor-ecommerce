import mongoose from 'mongoose';

const settingSchema = new mongoose.Schema(
  {
    key: {
      type: String,
      required: true,
      unique: true,
      trim: true,
      default: 'platform_settings',
    },
    platformCommissionRate: {
      type: Number,
      default: 0.10, // 10%
      min: [0, 'Commission rate cannot be negative.'],
      max: [1, 'Commission rate cannot exceed 100% (1.0).'],
    },
    defaultTaxRate: {
      type: Number,
      default: 0.05, // 5%
      min: [0, 'Tax rate cannot be negative.'],
      max: [1, 'Tax rate cannot exceed 100% (1.0).'],
    },
    defaultShippingCost: {
      type: Number,
      default: 250,
      min: [0, 'Shipping cost cannot be negative.'],
    },
    freeShippingThreshold: {
      type: Number,
      default: 5000,
      min: [0, 'Free shipping threshold cannot be negative.'],
    },
    lowStockThreshold: {
      type: Number,
      default: 5,
      min: [0, 'Low stock threshold cannot be negative.'],
    },
    marketplaceStatus: {
      type: String,
      enum: ['active', 'maintenance'],
      default: 'active',
    },
    updatedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      default: null,
    },
  },
  {
    timestamps: true,
  }
);

export const Setting = mongoose.model('Setting', settingSchema);
export default Setting;
