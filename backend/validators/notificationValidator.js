import mongoose from 'mongoose';

/**
 * Validates Notification ID parameter
 */
export const validateNotificationId = (req) => {
  const { id } = req.params || {};
  const errors = {};

  if (!id) {
    errors.id = 'Notification ID is required.';
  } else if (!mongoose.Types.ObjectId.isValid(id)) {
    errors.id = 'Invalid Notification ID format.';
  }

  return {
    isValid: Object.keys(errors).length === 0,
    errors,
  };
};

export default {
  validateNotificationId,
};
