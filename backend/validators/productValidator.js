/**
 * Product Request Validators
 */

export const validateCreateProduct = (req) => {
  const { name, description, category, basePrice, hasVariants, variants, stock, sku } = req.body || {};
  const errors = {};

  if (!name || typeof name !== 'string' || name.trim().length < 3) {
    errors.name = 'Product name must be at least 3 characters long.';
  }

  if (!description || typeof description !== 'string' || description.trim().length < 10) {
    errors.description = 'Product description must be at least 10 characters long.';
  }

  if (!category || !category.match(/^[0-9a-fA-F]{24}$/)) {
    errors.category = 'A valid category ID is required.';
  }

  const priceNum = parseFloat(basePrice);
  if (basePrice === undefined || isNaN(priceNum) || priceNum < 0) {
    errors.basePrice = 'A valid non-negative base price is required.';
  }

  if (hasVariants) {
    if (!Array.isArray(variants) || variants.length === 0) {
      errors.variants = 'Variant-based products must include at least one variant.';
    } else {
      const skus = new Set();
      variants.forEach((v, idx) => {
        if (!v.sku || typeof v.sku !== 'string' || v.sku.trim().length === 0) {
          errors[`variants[${idx}].sku`] = 'Variant SKU is required.';
        } else {
          const upperSku = v.sku.trim().toUpperCase();
          if (skus.has(upperSku)) {
            errors[`variants[${idx}].sku`] = `Duplicate SKU '${upperSku}' within variant list.`;
          }
          skus.add(upperSku);
        }

        if (v.price !== undefined && (isNaN(parseFloat(v.price)) || parseFloat(v.price) < 0)) {
          errors[`variants[${idx}].price`] = 'Variant price cannot be negative.';
        }

        if (v.stock !== undefined && (isNaN(parseInt(v.stock, 10)) || parseInt(v.stock, 10) < 0)) {
          errors[`variants[${idx}].stock`] = 'Variant stock cannot be negative.';
        }
      });
    }
  } else {
    if (stock !== undefined && (isNaN(parseInt(stock, 10)) || parseInt(stock, 10) < 0)) {
      errors.stock = 'Stock cannot be negative.';
    }
  }

  return {
    isValid: Object.keys(errors).length === 0,
    errors,
  };
};

export const validateUpdateProduct = (req) => {
  const { name, description, category, basePrice, stock } = req.body || {};
  const errors = {};

  if (name !== undefined && (typeof name !== 'string' || name.trim().length < 3)) {
    errors.name = 'Product name must be at least 3 characters long.';
  }

  if (description !== undefined && (typeof description !== 'string' || description.trim().length < 10)) {
    errors.description = 'Product description must be at least 10 characters long.';
  }

  if (category !== undefined && !category.match(/^[0-9a-fA-F]{24}$/)) {
    errors.category = 'A valid category ID is required.';
  }

  if (basePrice !== undefined) {
    const priceNum = parseFloat(basePrice);
    if (isNaN(priceNum) || priceNum < 0) {
      errors.basePrice = 'Base price must be a non-negative number.';
    }
  }

  if (stock !== undefined) {
    const stockNum = parseInt(stock, 10);
    if (isNaN(stockNum) || stockNum < 0) {
      errors.stock = 'Stock must be a non-negative integer.';
    }
  }

  return {
    isValid: Object.keys(errors).length === 0,
    errors,
  };
};

export const validateStockAdjustment = (req) => {
  const { stock, adjustment } = req.body || {};
  const errors = {};

  if (stock === undefined && adjustment === undefined) {
    errors.stock = 'Either exact stock or relative adjustment quantity must be provided.';
  }

  if (stock !== undefined && (isNaN(parseInt(stock, 10)) || parseInt(stock, 10) < 0)) {
    errors.stock = 'Stock must be a non-negative number.';
  }

  if (adjustment !== undefined && isNaN(parseInt(adjustment, 10))) {
    errors.adjustment = 'Adjustment must be a valid integer.';
  }

  return {
    isValid: Object.keys(errors).length === 0,
    errors,
  };
};

export default {
  validateCreateProduct,
  validateUpdateProduct,
  validateStockAdjustment,
};
