/**
 * Brand Request Validators
 */

export const validateCreateBrand = (req) => {
  const { name } = req.body || {};
  const errors = {};

  if (!name || typeof name !== 'string' || name.trim().length < 2) {
    errors.name = 'Brand name must be at least 2 characters long.';
  }

  return {
    isValid: Object.keys(errors).length === 0,
    errors,
  };
};

export const validateUpdateBrand = (req) => {
  const { name, status } = req.body || {};
  const errors = {};

  if (name !== undefined && (typeof name !== 'string' || name.trim().length < 2)) {
    errors.name = 'Brand name must be at least 2 characters long.';
  }

  if (status !== undefined && !['active', 'inactive'].includes(status)) {
    errors.status = 'Status must be active or inactive.';
  }

  return {
    isValid: Object.keys(errors).length === 0,
    errors,
  };
};

export default {
  validateCreateBrand,
  validateUpdateBrand,
};
