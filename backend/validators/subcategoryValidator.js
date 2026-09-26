/**
 * Subcategory Request Validators
 */

export const validateCreateSubcategory = (req) => {
  const { name, category } = req.body || {};
  const errors = {};

  if (!name || typeof name !== 'string' || name.trim().length < 2) {
    errors.name = 'Subcategory name must be at least 2 characters long.';
  }

  if (!category || !category.match(/^[0-9a-fA-F]{24}$/)) {
    errors.category = 'A valid parent category ID is required.';
  }

  return {
    isValid: Object.keys(errors).length === 0,
    errors,
  };
};

export const validateUpdateSubcategory = (req) => {
  const { name, category, status, sortOrder } = req.body || {};
  const errors = {};

  if (name !== undefined && (typeof name !== 'string' || name.trim().length < 2)) {
    errors.name = 'Subcategory name must be at least 2 characters long.';
  }

  if (category !== undefined && !category.match(/^[0-9a-fA-F]{24}$/)) {
    errors.category = 'Parent category must be a valid ID.';
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
  validateCreateSubcategory,
  validateUpdateSubcategory,
};
