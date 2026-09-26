/**
 * Checkout & Order Request Validators
 */

export const validateCheckoutPayload = (req) => {
  const { addressId, shippingAddress } = req.body || {};
  const errors = {};

  if (addressId && !addressId.match(/^[0-9a-fA-F]{24}$/)) {
    errors.addressId = 'Invalid address ID format.';
  }

  if (shippingAddress) {
    if (!shippingAddress.fullName || shippingAddress.fullName.trim().length < 2) {
      errors['shippingAddress.fullName'] = 'Recipient full name is required.';
    }
    if (!shippingAddress.phone || shippingAddress.phone.trim().length < 5) {
      errors['shippingAddress.phone'] = 'Contact phone number is required.';
    }
    if (!shippingAddress.addressLine1 || shippingAddress.addressLine1.trim().length < 3) {
      errors['shippingAddress.addressLine1'] = 'Street address is required.';
    }
    if (!shippingAddress.city || shippingAddress.city.trim().length < 2) {
      errors['shippingAddress.city'] = 'City is required.';
    }
  }

  return {
    isValid: Object.keys(errors).length === 0,
    errors,
  };
};

export const validateCancelOrder = (req) => {
  const { reason } = req.body || {};
  const errors = {};

  if (!reason || typeof reason !== 'string' || reason.trim().length < 3) {
    errors.reason = 'Please provide a cancellation reason (minimum 3 characters).';
  }

  return {
    isValid: Object.keys(errors).length === 0,
    errors,
  };
};

export const validateReturnOrder = (req) => {
  const { reason } = req.body || {};
  const errors = {};

  if (!reason || typeof reason !== 'string' || reason.trim().length < 3) {
    errors.reason = 'Please provide a reason for the return request.';
  }

  return {
    isValid: Object.keys(errors).length === 0,
    errors,
  };
};

export default {
  validateCheckoutPayload,
  validateCancelOrder,
  validateReturnOrder,
};
