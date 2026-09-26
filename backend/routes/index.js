import { Router } from 'express';
import healthRoutes from './healthRoutes.js';
import authRoutes from './authRoutes.js';
import userRoutes from './userRoutes.js';
import categoryRoutes from './categoryRoutes.js';
import subcategoryRoutes from './subcategoryRoutes.js';
import brandRoutes from './brandRoutes.js';
import storeRoutes from './storeRoutes.js';
import productRoutes from './productRoutes.js';
import sellerRoutes from './sellerRoutes.js';
import adminRoutes from './adminRoutes.js';
import cartRoutes from './cartRoutes.js';
import wishlistRoutes from './wishlistRoutes.js';
import checkoutRoutes from './checkoutRoutes.js';
import orderRoutes from './orderRoutes.js';
import reviewRoutes from './reviewRoutes.js';
import paymentRoutes from './paymentRoutes.js';
import notificationRoutes from './notificationRoutes.js';

const router = Router();

/**
 * Root API v1 Route Index
 * All domain routes are registered here under the versioned /api/v1 prefix.
 */
router.use('/health', healthRoutes);
router.use('/auth', authRoutes);
router.use('/users', userRoutes);

// Public Marketplace Discovery & Taxonomy
router.use('/categories', categoryRoutes);
router.use('/subcategories', subcategoryRoutes);
router.use('/brands', brandRoutes);
router.use('/stores', storeRoutes);
router.use('/products', productRoutes);

// Shopping Bag, Wishlist & Checkout Flow
router.use('/cart', cartRoutes);
router.use('/wishlist', wishlistRoutes);
router.use('/checkout', checkoutRoutes);
router.use('/orders', orderRoutes);
router.use('/reviews', reviewRoutes);

// Payments & Notifications
router.use('/payments', paymentRoutes);
router.use('/notifications', notificationRoutes);

// Seller Atelier & Applications
router.use('/sellers', sellerRoutes);
router.use('/seller', sellerRoutes);

// Master Admin Moderation & Management
router.use('/admin', adminRoutes);

export default router;
