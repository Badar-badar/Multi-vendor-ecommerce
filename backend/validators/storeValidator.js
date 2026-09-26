/**
 * Store Request Validators
 */

export const validateUpdateStore = (req) => {
  const { name, contactEmail } = req.body || {};
  const errors = {};

  if (name !== undefined && (typeof name !== 'string' || name.trim().length < 2)) {
    errors.name = 'Store name must be at least 2 characters long.';
  }

  if (contactEmail !== undefined && contactEmail !== '') {
    if (typeof contactEmail !== 'string' || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(contactEmail)) {
      errors.contactEmail = 'Please provide a valid contact email address.';
    }
  }

  return {
    isValid: Object.keys(errors).length === 0,
    errors,
  };
};

export default {
  validateUpdateStore,
};
