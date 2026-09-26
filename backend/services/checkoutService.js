import { getCartDetails } from './cartService.js';
import { Address } from '../models/Address.js';
import { validateCouponForCheckout } from './couponService.js';
import { AppError } from '../utils/appError.js';

/**
 * Checkout Calculation Service
 * The backend is the single source of truth for all pricing, shipping, tax, and order totals.
 */

export const SHIPPING_METHODS = Object.freeze({
  STANDARD: {
    code: 'standard',
    name: 'Zareen Signature Standard Delivery (3–5 business days)',
    cost: 500,
    freeThreshold: 25000,
  },
  EXPRESS: {
    code: 'express',
    name: 'Zareen Concierge Express Delivery (1–2 business days)',
    cost: 1500,
    freeThreshold: null,
  },
});

export const calculateShippingCost = (methodCode = 'standard', subtotal = 0) => {
  const method = Object.values(SHIPPING_METHODS).find((m) => m.code === methodCode) || SHIPPING_METHODS.STANDARD;
  if (method.freeThreshold !== null && subtotal >= method.freeThreshold) {
    return {
      method: method.code,
      name: method.name,
      cost: 0,
      isFree: true,
    };
  }
  return {
    method: method.code,
    name: method.name,
    cost: method.cost,
    isFree: false,
  };
};

/**
 * Authoritative checkout validator and financial calculation engine.
 */
export const validateCheckout = async (userId, payload = {}) => {
  const { addressId, shippingAddress: customAddress, shippingMethod = 'standard', couponCode } = payload;

  // 1. Retrieve and re-validate Cart
  const cart = await getCartDetails(userId);
  if (!cart || cart.items.length === 0) {
    throw AppError.badRequest('Your shopping bag is empty.');
  }

  if (cart.hasIssues) {
    throw AppError.badRequest(
      `Some items in your bag have stock or availability issues. Please review your bag before checkout.`
    );
  }

  // 2. Validate Shipping Address
  let deliveryAddress = null;
  if (addressId) {
    deliveryAddress = await Address.findOne({ _id: addressId, user: userId }).lean();
    if (!deliveryAddress) {
      throw AppError.notFound('Selected delivery address not found.');
    }
  } else if (customAddress) {
    if (!customAddress.fullName || !customAddress.phone || !customAddress.addressLine1 || !customAddress.city) {
      throw AppError.badRequest('Incomplete delivery address provided.');
    }
    deliveryAddress = customAddress;
  } else {
    // Attempt default address lookup
    deliveryAddress = await Address.findOne({ user: userId, isDefault: true }).lean();
    if (!deliveryAddress) {
      deliveryAddress = await Address.findOne({ user: userId }).sort({ createdAt: -1 }).lean();
    }
  }

  // 3. Calculate Item Subtotals
  const itemSubtotal = cart.subtotal;
  const productDiscount = cart.discount;
  const effectiveSubtotal = Math.max(0, itemSubtotal - productDiscount);

  // 4. Calculate Shipping
  const shippingInfo = calculateShippingCost(shippingMethod, effectiveSubtotal);

  // 5. Calculate Coupon Discount if applicable
  let couponDiscount = 0;
  let validatedCoupon = null;

  if (couponCode && couponCode.trim()) {
    const couponResult = await validateCouponForCheckout(
      couponCode,
      userId,
      cart.items,
      effectiveSubtotal
    );
    couponDiscount = couponResult.discountAmount;
    validatedCoupon = couponResult.coupon;
  }

  // 6. Tax calculation (standardized configurable rate)
  const taxRate = 0; // Configurable luxury marketplace sales tax rate
  const tax = Math.round(((effectiveSubtotal - couponDiscount) * taxRate) * 100) / 100;

  // 7. Authoritative Grand Total
  const grandTotal = Math.max(
    0,
    Math.round((effectiveSubtotal - couponDiscount + shippingInfo.cost + tax) * 100) / 100
  );

  return {
    cart: {
      items: cart.items,
      itemCount: cart.itemCount,
    },
    shippingAddress: deliveryAddress,
    shippingMethod: shippingInfo,
    financials: {
      subtotal: itemSubtotal,
      productDiscount,
      effectiveSubtotal,
      couponDiscount,
      shippingCost: shippingInfo.cost,
      tax,
      grandTotal,
    },
    coupon: validatedCoupon,
  };
};

export default {
  validateCheckout,
  calculateShippingCost,
  SHIPPING_METHODS,
};
