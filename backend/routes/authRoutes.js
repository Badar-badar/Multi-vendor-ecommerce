import { Router } from 'express';
import {
  register,
  login,
  logout,
  getCurrentUser,
  verifyEmail,
  resendVerification,
  forgotPassword,
  resetPassword,
} from '../controllers/authController.js';
import { authenticate } from '../middleware/authMiddleware.js';
import { authRateLimiter } from '../middleware/rateLimiter.js';
import { validate } from '../validators/validateRequest.js';
import {
  validateRegister,
  validateLogin,
  validateForgotPassword,
  validateResetPassword,
  validateVerifyEmail,
} from '../validators/authValidator.js';

const router = Router();

// Registration & Login
router.post('/register', authRateLimiter, validate(validateRegister), register);
router.post('/login', authRateLimiter, validate(validateLogin), login);
router.post('/logout', logout);

// Authenticated Session State
router.get('/me', authenticate, getCurrentUser);

// Email Verification
router.post('/verify-email', validate(validateVerifyEmail), verifyEmail);
router.post(
  '/resend-verification',
  authRateLimiter,
  validate(validateForgotPassword), // Validates email presence & format
  resendVerification
);

// Password Reset Flow
router.post(
  '/forgot-password',
  authRateLimiter,
  validate(validateForgotPassword),
  forgotPassword
);
router.post(
  '/reset-password',
  authRateLimiter,
  validate(validateResetPassword),
  resetPassword
);

export default router;
