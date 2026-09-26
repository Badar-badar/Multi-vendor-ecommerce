/**
 * Cart Request Validators
 */

export const validateAddToCart = (req) => {
  const { productId, variantId, quantity } = req.body || {};
  const errors = {};

  if (!productId || !productId.match(/^[0-9a-fA-F]{24}$/)) {
    errors.productId = 'A valid product ID is required.';
  }

  if (variantId && !variantId.match(/^[0-9a-fA-F]{24}$/)) {
    errors.variantId = 'Variant ID must be a valid ID.';
  }

  if (quantity !== undefined) {
    const parsedQty = parseInt(quantity, 10);
    if (isNaN(parsedQty) || parsedQty < 1) {
      errors.quantity = 'Quantity must be at least 1.';
    }
  }

  return {
    isValid: Object.keys(errors).length === 0,
    errors,
  };
};

export const validateUpdateCartQuantity = (req) => {
  const { quantity } = req.body || {};
  const errors = {};

  const parsedQty = parseInt(quantity, 10);
  if (quantity === undefined || isNaN(parsedQty) || parsedQty < 1) {
    errors.quantity = 'Quantity must be at least 1.';
  }

  return {
    isValid: Object.keys(errors).length === 0,
    errors,
  };
};

export default {
  validateAddToCart,
  validateUpdateCartQuantity,
};
