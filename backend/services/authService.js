import crypto from 'crypto';
import { User } from '../models/User.js';
import { AppError } from '../utils/appError.js';
import { generateToken } from '../utils/token.js';
import { ROLES, USER_STATUS, getDefaultPermissions } from '../config/permissions.js';
import {
  sendVerificationEmail,
  sendPasswordResetEmail,
} from './emailService.js';
import { logger } from '../utils/logger.js';

/**
 * Authentication Business Logic Service
 */

/**
 * Registers a new customer account.
 * Client privilege escalation is strictly prevented: role is always CUSTOMER.
 */
export const registerUser = async ({ name, email, password, phone }) => {
  const normalizedEmail = email.trim().toLowerCase();

  // 1. Check for existing account
  const existingUser = await User.findOne({ email: normalizedEmail });
  if (existingUser) {
    throw AppError.conflict('An account with this email address already exists.');
  }

  // 2. Create User document strictly as CUSTOMER
  const user = new User({
    name: name.trim(),
    email: normalizedEmail,
    password,
    phone: phone ? phone.trim() : '',
    role: ROLES.CUSTOMER,
    permissions: getDefaultPermissions(ROLES.CUSTOMER),
    status: USER_STATUS.ACTIVE,
  });

  // 3. Generate secure email verification token
  const rawVerificationToken = user.createEmailVerificationToken();

  // 4. Save user to database (triggers password hashing)
  await user.save();

  // 5. Send verification email (non-blocking)
  sendVerificationEmail(user, rawVerificationToken).catch((err) => {
    logger.error(`[AuthService] Error sending verification email: ${err.message}`);
  });

  // 6. Generate JWT
  const token = generateToken(user);

  return { user, token };
};

/**
 * Authenticates user credentials and returns session token.
 * Prevents account enumeration by returning generic authentication error.
 */
export const loginUser = async ({ email, password }) => {
  const normalizedEmail = email.trim().toLowerCase();

  // 1. Find user by email and explicitly select hidden password field
  const user = await User.findOne({ email: normalizedEmail }).select('+password');

  // 2. Validate credentials securely
  if (!user || !(await user.comparePassword(password))) {
    throw AppError.unauthorized('Invalid email address or password.');
  }

  // 3. Check account status
  if (user.status === USER_STATUS.SUSPENDED) {
    throw AppError.forbidden(
      'Your account has been suspended. Please contact concierge support.'
    );
  }
  if (user.status === USER_STATUS.INACTIVE) {
    throw AppError.forbidden(
      'Your account is currently inactive. Please verify your email or contact support.'
    );
  }

  // 4. Update last login timestamp
  user.lastLoginAt = new Date();
  await user.save({ validateBeforeSave: false });

  // 5. Generate JWT
  const token = generateToken(user);

  return { user, token };
};

/**
 * Verifies email address using raw token.
 */
export const verifyEmailToken = async (rawToken) => {
  const hashedToken = crypto
    .createHash('sha256')
    .update(rawToken)
    .digest('hex');

  const user = await User.findOne({
    verificationToken: hashedToken,
    verificationTokenExpiresAt: { $gt: Date.now() },
  }).select('+verificationToken +verificationTokenExpiresAt');

  if (!user) {
    throw AppError.badRequest('Invalid or expired verification token.');
  }

  user.emailVerifiedAt = new Date();
  user.verificationToken = undefined;
  user.verificationTokenExpiresAt = undefined;
  await user.save({ validateBeforeSave: false });

  return user;
};

/**
 * Resends email verification link.
 */
export const resendVerificationEmail = async (email) => {
  const normalizedEmail = email.trim().toLowerCase();
  const user = await User.findOne({ email: normalizedEmail });

  // Generic return to prevent email enumeration
  if (!user) {
    return { success: true };
  }

  if (user.emailVerifiedAt) {
    return { success: true, alreadyVerified: true };
  }

  const rawToken = user.createEmailVerificationToken();
  await user.save({ validateBeforeSave: false });

  sendVerificationEmail(user, rawToken).catch((err) => {
    logger.error(`[AuthService] Error resending verification email: ${err.message}`);
  });

  return { success: true };
};

/**
 * Initiates password reset flow.
 */
export const requestPasswordReset = async (email) => {
  const normalizedEmail = email.trim().toLowerCase();
  const user = await User.findOne({ email: normalizedEmail });

  // Return generic response even if email not found to prevent enumeration
  if (!user) {
    return { success: true };
  }

  const rawToken = user.createPasswordResetToken();
  await user.save({ validateBeforeSave: false });

  sendPasswordResetEmail(user, rawToken).catch((err) => {
    logger.error(`[AuthService] Error sending password reset email: ${err.message}`);
  });

  return { success: true };
};

/**
 * Resets user password using a valid reset token.
 */
export const resetUserPassword = async ({ rawToken, newPassword }) => {
  const hashedToken = crypto
    .createHash('sha256')
    .update(rawToken)
    .digest('hex');

  const user = await User.findOne({
    passwordResetToken: hashedToken,
    passwordResetExpiresAt: { $gt: Date.now() },
  }).select('+passwordResetToken +passwordResetExpiresAt');

  if (!user) {
    throw AppError.badRequest('Invalid or expired password reset token.');
  }

  // Set new password (pre-save hook will hash it and update passwordChangedAt)
  user.password = newPassword;
  user.passwordResetToken = undefined;
  user.passwordResetExpiresAt = undefined;
  await user.save();

  // Issue new session token after successful password reset
  const token = generateToken(user);

  return { user, token };
};

export default {
  registerUser,
  loginUser,
  verifyEmailToken,
  resendVerificationEmail,
  requestPasswordReset,
  resetUserPassword,
};
