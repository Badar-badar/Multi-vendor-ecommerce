import { Router } from 'express';
import { getProfile, updateProfile, changePassword } from '../controllers/userController.js';
import addressRoutes from './addressRoutes.js';
import recentlyViewedRoutes from './recentlyViewedRoutes.js';
import { authenticate } from '../middleware/authMiddleware.js';
import { authRateLimiter } from '../middleware/rateLimiter.js';
import { validate } from '../validators/validateRequest.js';
import { validateUpdateProfile, validateChangePassword } from '../validators/userValidator.js';

const router = Router();

// All user profile routes require authentication
router.use(authenticate);

// Sub-resources
router.use('/me/addresses', addressRoutes);
router.use('/me/recently-viewed', recentlyViewedRoutes);

// Profile endpoints
router.get('/me', getProfile);
router.patch('/me', validate(validateUpdateProfile), updateProfile);
router.post('/me/change-password', authRateLimiter, validate(validateChangePassword), changePassword);

export default router;
