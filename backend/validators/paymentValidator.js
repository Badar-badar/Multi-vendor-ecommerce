import mongoose from 'mongoose';

/**
 * Validates PaymentIntent creation payload
 */
export const validateCreatePaymentIntent = (req) => {
  const { orderId } = req.body || {};
  const errors = {};

  if (!orderId) {
    errors.orderId = 'Order ID is required.';
  } else if (!mongoose.Types.ObjectId.isValid(orderId)) {
    errors.orderId = 'Invalid Order ID format.';
  }

  return {
    isValid: Object.keys(errors).length === 0,
    errors,
  };
};

/**
 * Validates Refund request payload
 */
export const validateProcessRefund = (req) => {
  const { amount, reason } = req.body || {};
  const errors = {};

  if (amount !== undefined) {
    if (typeof amount !== 'number' || isNaN(amount) || amount <= 0) {
      errors.amount = 'Refund amount must be a positive number greater than zero.';
    }
  }

  if (reason !== undefined && (typeof reason !== 'string' || reason.length > 500)) {
    errors.reason = 'Reason must not exceed 500 characters.';
  }

  return {
    isValid: Object.keys(errors).length === 0,
    errors,
  };
};

export default {
  validateCreatePaymentIntent,
  validateProcessRefund,
};
