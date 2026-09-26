/**
 * Category Request Validators
 */

export const validateCreateCategory = (req) => {
  const { name } = req.body || {};
  const errors = {};

  if (!name || typeof name !== 'string' || name.trim().length < 2) {
    errors.name = 'Category name must be at least 2 characters long.';
  }

  return {
    isValid: Object.keys(errors).length === 0,
    errors,
  };
};

export const validateUpdateCategory = (req) => {
  const { name, status, sortOrder } = req.body || {};
  const errors = {};

  if (name !== undefined && (typeof name !== 'string' || name.trim().length < 2)) {
    errors.name = 'Category name must be at least 2 characters long.';
  }

  if (status !== undefined && !['active', 'inactive'].includes(status)) {
    errors.status = 'Status must be active or inactive.';
  }

  if (sortOrder !== undefined && isNaN(Number(sortOrder))) {
    errors.sortOrder = 'Sort order must be a valid number.';
  }

  return {
    isValid: Object.keys(errors).length === 0,
    errors,
  };
};

export default {
  validateCreateCategory,
  validateUpdateCategory,
};
