/**
 * Coupon Request Validators
 */

export const validateCreateCoupon = (req) => {
  const { code, type, value, expiryDate } = req.body || {};
  const errors = {};

  if (!code || typeof code !== 'string' || code.trim().length < 2) {
    errors.code = 'Coupon code must be at least 2 characters.';
  }

  if (!type || !['percentage', 'fixed'].includes(type)) {
    errors.type = 'Coupon type must be percentage or fixed.';
  }

  const valNum = parseFloat(value);
  if (value === undefined || isNaN(valNum) || valNum <= 0) {
    errors.value = 'Coupon value must be a positive number.';
  }

  if (type === 'percentage' && valNum > 100) {
    errors.value = 'Percentage discount cannot exceed 100%.';
  }

  if (!expiryDate || isNaN(new Date(expiryDate).getTime())) {
    errors.expiryDate = 'A valid expiration date is required.';
  }

  return {
    isValid: Object.keys(errors).length === 0,
    errors,
  };
};

export default {
  validateCreateCoupon,
};
