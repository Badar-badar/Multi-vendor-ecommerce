/**
 * User Profile & Password Request Validators
 */

export const validateChangePassword = (req) => {
  const { currentPassword, newPassword, confirmPassword, passwordConfirm } = req.body || {};
  const errors = {};

  const effectiveConfirm = confirmPassword || passwordConfirm;

  if (!currentPassword || typeof currentPassword !== 'string') {
    errors.currentPassword = 'Your current password is required.';
  }

  if (!newPassword || typeof newPassword !== 'string' || newPassword.length < 8) {
    errors.newPassword = 'New password must be at least 8 characters long.';
  }

  if (effectiveConfirm && newPassword !== effectiveConfirm) {
    errors.confirmPassword = 'New passwords do not match.';
  }

  if (currentPassword && newPassword && currentPassword === newPassword) {
    errors.newPassword = 'New password cannot be the same as your current password.';
  }

  return {
    isValid: Object.keys(errors).length === 0,
    errors,
  };
};

export const validateUpdateProfile = (req) => {
  const { name, phone } = req.body || {};
  const errors = {};

  if (name !== undefined) {
    if (typeof name !== 'string' || name.trim().length < 2) {
      errors.name = 'Full name must be at least 2 characters long.';
    }
  }

  if (phone !== undefined && phone !== null && phone !== '') {
    if (typeof phone !== 'string' || phone.trim().length < 5) {
      errors.phone = 'Please provide a valid phone number format.';
    }
  }

  return {
    isValid: Object.keys(errors).length === 0,
    errors,
  };
};

export default {
  validateChangePassword,
  validateUpdateProfile,
};
