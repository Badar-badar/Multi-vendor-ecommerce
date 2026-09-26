/**
 * Validates platform settings update payload
 */
export const validateUpdateSettings = (req) => {
  const {
    platformCommissionRate,
    defaultTaxRate,
    defaultShippingCost,
    freeShippingThreshold,
    lowStockThreshold,
    marketplaceStatus,
  } = req.body || {};

  const errors = {};

  if (platformCommissionRate !== undefined) {
    if (typeof platformCommissionRate !== 'number' || platformCommissionRate < 0 || platformCommissionRate > 1) {
      errors.platformCommissionRate = 'Commission rate must be a number between 0 and 1 (0% to 100%).';
    }
  }

  if (defaultTaxRate !== undefined) {
    if (typeof defaultTaxRate !== 'number' || defaultTaxRate < 0 || defaultTaxRate > 1) {
      errors.defaultTaxRate = 'Tax rate must be a number between 0 and 1.';
    }
  }

  if (defaultShippingCost !== undefined) {
    if (typeof defaultShippingCost !== 'number' || defaultShippingCost < 0) {
      errors.defaultShippingCost = 'Shipping cost must be a non-negative number.';
    }
  }

  if (freeShippingThreshold !== undefined) {
    if (typeof freeShippingThreshold !== 'number' || freeShippingThreshold < 0) {
      errors.freeShippingThreshold = 'Free shipping threshold must be a non-negative number.';
    }
  }

  if (lowStockThreshold !== undefined) {
    if (typeof lowStockThreshold !== 'number' || lowStockThreshold < 0) {
      errors.lowStockThreshold = 'Low stock threshold must be a non-negative number.';
    }
  }

  if (marketplaceStatus !== undefined) {
    if (!['active', 'maintenance'].includes(marketplaceStatus)) {
      errors.marketplaceStatus = "Marketplace status must be either 'active' or 'maintenance'.";
    }
  }

  return {
    isValid: Object.keys(errors).length === 0,
    errors,
  };
};

export default {
  validateUpdateSettings,
};
