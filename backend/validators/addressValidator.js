/**
 * Address Request Validators
 */

export const validateCreateAddress = (req) => {
  const { fullName, phone, addressLine1, city, state, postalCode } = req.body || {};
  const errors = {};

  if (!fullName || typeof fullName !== 'string' || fullName.trim().length < 2) {
    errors.fullName = 'Full name is required for delivery (min 2 characters).';
  }

  if (!phone || typeof phone !== 'string' || phone.trim().length < 5) {
    errors.phone = 'Contact phone number is required.';
  }

  if (!addressLine1 || typeof addressLine1 !== 'string' || addressLine1.trim().length < 3) {
    errors.addressLine1 = 'Street address line 1 is required.';
  }

  if (!city || typeof city !== 'string' || city.trim().length < 2) {
    errors.city = 'City is required.';
  }

  if (!state || typeof state !== 'string' || state.trim().length < 2) {
    errors.state = 'State or province is required.';
  }

  if (!postalCode || typeof postalCode !== 'string' || postalCode.trim().length < 2) {
    errors.postalCode = 'Postal/ZIP code is required.';
  }

  return {
    isValid: Object.keys(errors).length === 0,
    errors,
  };
};

export const validateUpdateAddress = (req) => {
  const { fullName, phone, addressLine1, city, state, postalCode } = req.body || {};
  const errors = {};

  if (fullName !== undefined && (typeof fullName !== 'string' || fullName.trim().length < 2)) {
    errors.fullName = 'Full name must be at least 2 characters.';
  }

  if (phone !== undefined && (typeof phone !== 'string' || phone.trim().length < 5)) {
    errors.phone = 'Please provide a valid phone number.';
  }

  if (addressLine1 !== undefined && (typeof addressLine1 !== 'string' || addressLine1.trim().length < 3)) {
    errors.addressLine1 = 'Street address line 1 must be at least 3 characters.';
  }

  return {
    isValid: Object.keys(errors).length === 0,
    errors,
  };
};

export default {
  validateCreateAddress,
  validateUpdateAddress,
};
