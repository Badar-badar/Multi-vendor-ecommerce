import mongoose from 'mongoose';

const wishlistSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: [true, 'User reference is required.'],
      index: true,
    },
    product: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Product',
      required: [true, 'Product reference is required.'],
      index: true,
    },
  },
  {
    timestamps: true,
  }
);

// Compound index to guarantee no duplicate wishlist entries per user
wishlistSchema.index({ user: 1, product: 1 }, { unique: true });

export const Wishlist = mongoose.model('Wishlist', wishlistSchema);
export default Wishlist;
