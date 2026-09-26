import { User } from '../models/User.js';
import { AppError } from '../utils/appError.js';
import { generateToken } from '../utils/token.js';

/**
 * User Profile Service
 */

/**
 * Updates safe profile fields for an authenticated user.
 * Strictly prevents mass assignment of administrative or privilege fields.
 */
export const updateUserProfile = async (userId, updates = {}) => {
  const allowedUpdates = {};

  if (updates.name !== undefined && typeof updates.name === 'string') {
    allowedUpdates.name = updates.name.trim();
  }
  if (updates.phone !== undefined && typeof updates.phone === 'string') {
    allowedUpdates.phone = updates.phone.trim();
  }
  if (updates.avatar !== undefined && typeof updates.avatar === 'string') {
    allowedUpdates.avatar = updates.avatar.trim();
  }

  const user = await User.findByIdAndUpdate(
    userId,
    { $set: allowedUpdates },
    { returnDocument: 'after', runValidators: true }
  );

  if (!user) {
    throw AppError.notFound('User profile not found.');
  }

  return user;
};

/**
 * Changes password for an authenticated user by verifying current password.
 */
export const changeUserPassword = async (userId, { currentPassword, newPassword }) => {
  const user = await User.findById(userId).select('+password');
  if (!user) {
    throw AppError.notFound('User profile not found.');
  }

  // 1. Verify current password
  const isCurrentValid = await user.comparePassword(currentPassword);
  if (!isCurrentValid) {
    throw AppError.unauthorized('Your current password is incorrect.');
  }

  // 2. Set new password (pre-save hook hashes and sets passwordChangedAt)
  user.password = newPassword;
  await user.save();

  // 3. Generate new session token
  const token = generateToken(user);

  return { user, token };
};

export default {
  updateUserProfile,
  changeUserPassword,
};
