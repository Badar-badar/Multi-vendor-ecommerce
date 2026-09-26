import { updateUserProfile, changeUserPassword } from '../services/userService.js';
import { sendSuccess } from '../utils/apiResponse.js';
import { setAuthCookie } from '../utils/token.js';

/**
 * User Profile Controller
 */

/**
 * @route   GET /api/v1/users/me
 * @desc    Get currently authenticated user profile
 * @access  Private
 */
export const getProfile = async (req, res) => {
  return sendSuccess(res, {
    statusCode: 200,
    message: 'User profile retrieved successfully.',
    data: {
      user: req.user,
    },
  });
};

/**
 * @route   PATCH /api/v1/users/me
 * @desc    Update authenticated user profile (name, phone, avatar)
 * @access  Private
 */
export const updateProfile = async (req, res, next) => {
  try {
    const updatedUser = await updateUserProfile(req.user._id, req.body);

    return sendSuccess(res, {
      statusCode: 200,
      message: 'Profile updated successfully.',
      data: {
        user: updatedUser,
      },
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @route   POST /api/v1/users/me/change-password
 * @desc    Change password for authenticated user and refresh auth cookie
 * @access  Private
 */
export const changePassword = async (req, res, next) => {
  try {
    const { user, token } = await changeUserPassword(req.user._id, req.body);

    // Refresh auth cookie with new token
    setAuthCookie(res, token);

    return sendSuccess(res, {
      statusCode: 200,
      message: 'Password changed successfully. Your active session has been updated.',
      data: {
        user,
      },
    });
  } catch (error) {
    next(error);
  }
};

export default {
  getProfile,
  updateProfile,
  changePassword,
};
