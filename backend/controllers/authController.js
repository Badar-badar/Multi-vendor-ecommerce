import { asyncHandler } from '../utils/asyncHandler.js';
import { sendSuccess } from '../utils/apiResponse.js';
import { setAuthCookie, clearAuthCookie } from '../utils/token.js';
import {
  registerUser,
  loginUser,
  verifyEmailToken,
  resendVerificationEmail,
  requestPasswordReset,
  resetUserPassword,
} from '../services/authService.js';

/**
 * @desc    Register a new customer account
 * @route   POST /api/v1/auth/register
 * @access  Public
 */
export const register = asyncHandler(async (req, res) => {
  const { name, email, password, phone } = req.body;

  const { user, token } = await registerUser({ name, email, password, phone });

  // Set secure HTTP-only session cookie
  setAuthCookie(res, token);

  return sendSuccess(res, {
    statusCode: 201,
    message: 'Welcome to Zareen. Your sovereign account has been registered successfully.',
    data: {
      user,
    },
  });
});

/**
 * @desc    Sign in to existing account
 * @route   POST /api/v1/auth/login
 * @access  Public
 */
export const login = asyncHandler(async (req, res) => {
  const { email, password } = req.body;

  const { user, token } = await loginUser({ email, password });

  // Set secure HTTP-only session cookie
  setAuthCookie(res, token);

  return sendSuccess(res, {
    statusCode: 200,
    message: 'Welcome back. Signed in successfully.',
    data: {
      user,
    },
  });
});

/**
 * @desc    Sign out and clear session cookie
 * @route   POST /api/v1/auth/logout
 * @access  Public (Safe even if unauthenticated)
 */
export const logout = asyncHandler(async (req, res) => {
  // Clear the HTTP-only cookie
  clearAuthCookie(res);

  return sendSuccess(res, {
    statusCode: 200,
    message: 'You have been signed out successfully.',
    data: null,
  });
});

/**
 * @desc    Get currently authenticated user state
 * @route   GET /api/v1/auth/me
 * @access  Private (Authenticated)
 */
export const getCurrentUser = asyncHandler(async (req, res) => {
  return sendSuccess(res, {
    statusCode: 200,
    message: 'Patron session verified successfully.',
    data: {
      user: req.user,
    },
  });
});

/**
 * @desc    Verify email address via token
 * @route   POST /api/v1/auth/verify-email
 * @access  Public
 */
export const verifyEmail = asyncHandler(async (req, res) => {
  const token = req.body.token || req.query.token;

  const user = await verifyEmailToken(token);

  return sendSuccess(res, {
    statusCode: 200,
    message: 'Your email address has been verified successfully.',
    data: {
      user,
    },
  });
});

/**
 * @desc    Resend verification email
 * @route   POST /api/v1/auth/resend-verification
 * @access  Public
 */
export const resendVerification = asyncHandler(async (req, res) => {
  const { email } = req.body;

  await resendVerificationEmail(email);

  return sendSuccess(res, {
    statusCode: 200,
    message:
      'If an unverified account exists with this email, a verification link has been sent.',
    data: null,
  });
});

/**
 * @desc    Request password reset link
 * @route   POST /api/v1/auth/forgot-password
 * @access  Public
 */
export const forgotPassword = asyncHandler(async (req, res) => {
  const { email } = req.body;

  await requestPasswordReset(email);

  return sendSuccess(res, {
    statusCode: 200,
    message:
      'If an account exists with this email, password reset instructions have been sent.',
    data: null,
  });
});

/**
 * @desc    Reset password via token
 * @route   POST /api/v1/auth/reset-password
 * @access  Public
 */
export const resetPassword = asyncHandler(async (req, res) => {
  const { token, password } = req.body;
  const rawToken = token || req.query.token;

  const { user, token: sessionToken } = await resetUserPassword({
    rawToken,
    newPassword: password,
  });

  // Set new session cookie
  setAuthCookie(res, sessionToken);

  return sendSuccess(res, {
    statusCode: 200,
    message: 'Your password has been reset successfully. You are now signed in.',
    data: {
      user,
    },
  });
});

export default {
  register,
  login,
  logout,
  getCurrentUser,
  verifyEmail,
  resendVerification,
  forgotPassword,
  resetPassword,
};
