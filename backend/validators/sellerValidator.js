/**
 * Seller Request Validators
 */

export const validateApplySeller = (req) => {
  const { businessName, businessEmail, businessPhone } = req.body || {};
  const errors = {};

  if (!businessName || typeof businessName !== 'string' || businessName.trim().length < 2) {
    errors.businessName = 'Business or atelier name must be at least 2 characters long.';
  }

  if (!businessEmail || typeof businessEmail !== 'string' || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(businessEmail)) {
    errors.businessEmail = 'A valid business email address is required.';
  }

  if (!businessPhone || typeof businessPhone !== 'string' || businessPhone.trim().length < 5) {
    errors.businessPhone = 'A valid business contact phone number is required.';
  }

  return {
    isValid: Object.keys(errors).length === 0,
    errors,
  };
};

export const validateRejectSeller = (req) => {
  const { rejectionReason } = req.body || {};
  const errors = {};

  if (!rejectionReason || typeof rejectionReason !== 'string' || rejectionReason.trim().length < 5) {
    errors.rejectionReason = 'Please provide a descriptive reason for rejecting the application.';
  }

  return {
    isValid: Object.keys(errors).length === 0,
    errors,
  };
};

export default {
  validateApplySeller,
  validateRejectSeller,
};
