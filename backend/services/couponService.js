import { Coupon, COUPON_TYPE, COUPON_SCOPE } from '../models/Coupon.js';
import { Seller, SELLER_APPROVAL_STATUS } from '../models/Seller.js';
import { AppError } from '../utils/appError.js';

/**
 * Coupon & Promotion Service
 */

/**
 * Validates a coupon code against checkout items and user history.
 */
export const validateCouponForCheckout = async (code, userId, items = [], cartSubtotal = 0) => {
  if (!code || typeof code !== 'string') {
    throw AppError.badRequest('Coupon code is required.');
  }

  const cleanCode = code.trim().toUpperCase();
  const coupon = await Coupon.findOne({ code: cleanCode, status: 'active' });

  if (!coupon) {
    throw AppError.notFound(`Coupon code '${cleanCode}' is invalid or inactive.`);
  }

  const now = new Date();

  // 1. Date window check
  if (coupon.startDate && coupon.startDate > now) {
    throw AppError.badRequest(`Coupon '${cleanCode}' is not yet active.`);
  }
  if (coupon.expiryDate && coupon.expiryDate < now) {
    throw AppError.badRequest(`Coupon '${cleanCode}' has expired.`);
  }

  // 2. Global usage limit check
  if (coupon.usageLimit !== null && coupon.usageCount >= coupon.usageLimit) {
    throw AppError.badRequest(`Coupon '${cleanCode}' has reached its maximum global redemption limit.`);
  }

  // 3. Per-user usage limit check
  if (userId) {
    const userUsage = (coupon.usedBy || []).find((u) => u.user?.toString() === userId.toString());
    const userCount = userUsage ? userUsage.count : 0;
    if (userCount >= coupon.perUserLimit) {
      throw AppError.badRequest(`You have already redeemed coupon '${cleanCode}' the maximum allowed times (${coupon.perUserLimit}).`);
    }
  }

  // 4. Calculate eligible subtotal based on scope (Platform vs Seller)
  let eligibleSubtotal = 0;

  if (coupon.scope === COUPON_SCOPE.SELLER && coupon.seller) {
    // Only items originating from this seller qualify
    const sellerItems = items.filter(
      (i) => (i.product?.seller?._id || i.product?.seller || i.seller)?.toString() === coupon.seller.toString()
    );

    if (sellerItems.length === 0) {
      throw AppError.badRequest(`Coupon '${cleanCode}' is valid only on items from the issuing atelier.`);
    }

    eligibleSubtotal = sellerItems.reduce((acc, i) => acc + (i.finalItemTotal || i.itemSubtotal || (i.unitPrice * i.quantity)), 0);
  } else {
    // Platform-wide coupon
    eligibleSubtotal = cartSubtotal;
  }

  // 5. Minimum order amount check
  if (coupon.minimumOrderAmount > 0 && eligibleSubtotal < coupon.minimumOrderAmount) {
    throw AppError.badRequest(
      `Coupon '${cleanCode}' requires a minimum eligible order amount of PKR ${coupon.minimumOrderAmount.toLocaleString()}.`
    );
  }

  // 6. Calculate discount
  let discountAmount = 0;
  if (coupon.type === COUPON_TYPE.PERCENTAGE) {
    discountAmount = (eligibleSubtotal * coupon.value) / 100;
    if (coupon.maximumDiscount !== null && coupon.maximumDiscount > 0) {
      discountAmount = Math.min(discountAmount, coupon.maximumDiscount);
    }
  } else if (coupon.type === COUPON_TYPE.FIXED) {
    discountAmount = Math.min(coupon.value, eligibleSubtotal);
  }

  discountAmount = Math.round(discountAmount * 100) / 100;

  return {
    isValid: true,
    coupon: {
      _id: coupon._id,
      code: coupon.code,
      type: coupon.type,
      value: coupon.value,
      scope: coupon.scope,
      discountAmount,
    },
    discountAmount,
    eligibleSubtotal,
  };
};

/**
 * Records coupon usage upon successful order placement.
 */
export const recordCouponUsage = async (couponId, userId) => {
  const coupon = await Coupon.findById(couponId);
  if (!coupon) return;

  coupon.usageCount += 1;

  if (userId) {
    const userIndex = coupon.usedBy.findIndex((u) => u.user?.toString() === userId.toString());
    if (userIndex > -1) {
      coupon.usedBy[userIndex].count += 1;
    } else {
      coupon.usedBy.push({ user: userId, count: 1 });
    }
  }

  await coupon.save();
};

// --- Seller Coupon Management ---

export const getSellerCoupons = async (userId) => {
  const seller = await Seller.findOne({ user: userId, approvalStatus: SELLER_APPROVAL_STATUS.APPROVED });
  if (!seller) throw AppError.forbidden('Seller profile not found.');

  return Coupon.find({ seller: seller._id }).sort({ createdAt: -1 }).lean();
};

export const createSellerCoupon = async (userId, data) => {
  const seller = await Seller.findOne({ user: userId, approvalStatus: SELLER_APPROVAL_STATUS.APPROVED });
  if (!seller) throw AppError.forbidden('Only approved sellers can create atelier coupons.');

  const cleanCode = data.code.trim().toUpperCase();
  const existing = await Coupon.findOne({ code: cleanCode });
  if (existing) {
    throw AppError.conflict(`Coupon code '${cleanCode}' already exists.`);
  }

  const coupon = new Coupon({
    code: cleanCode,
    description: data.description?.trim() || '',
    type: data.type,
    value: parseFloat(data.value),
    scope: COUPON_SCOPE.SELLER,
    seller: seller._id,
    minimumOrderAmount: data.minimumOrderAmount ? parseFloat(data.minimumOrderAmount) : 0,
    maximumDiscount: data.maximumDiscount ? parseFloat(data.maximumDiscount) : null,
    startDate: data.startDate ? new Date(data.startDate) : new Date(),
    expiryDate: new Date(data.expiryDate),
    usageLimit: data.usageLimit ? parseInt(data.usageLimit, 10) : null,
    perUserLimit: data.perUserLimit ? parseInt(data.perUserLimit, 10) : 1,
    status: data.status || 'active',
  });

  return coupon.save();
};

export const updateSellerCoupon = async (userId, couponId, data) => {
  const seller = await Seller.findOne({ user: userId });
  if (!seller) throw AppError.forbidden('Seller profile not found.');

  const coupon = await Coupon.findById(couponId);
  if (!coupon) throw AppError.notFound('Coupon not found.');

  if (coupon.seller?.toString() !== seller._id.toString()) {
    throw AppError.forbidden('Unauthorized access: You do not own this coupon.');
  }

  if (data.description !== undefined) coupon.description = data.description.trim();
  if (data.value !== undefined) coupon.value = parseFloat(data.value);
  if (data.minimumOrderAmount !== undefined) coupon.minimumOrderAmount = parseFloat(data.minimumOrderAmount);
  if (data.maximumDiscount !== undefined) coupon.maximumDiscount = data.maximumDiscount ? parseFloat(data.maximumDiscount) : null;
  if (data.expiryDate !== undefined) coupon.expiryDate = new Date(data.expiryDate);
  if (data.usageLimit !== undefined) coupon.usageLimit = data.usageLimit ? parseInt(data.usageLimit, 10) : null;
  if (data.perUserLimit !== undefined) coupon.perUserLimit = parseInt(data.perUserLimit, 10);
  if (data.status !== undefined) coupon.status = data.status;

  return coupon.save();
};

export const deleteSellerCoupon = async (userId, couponId) => {
  const seller = await Seller.findOne({ user: userId });
  if (!seller) throw AppError.forbidden('Seller profile not found.');

  const coupon = await Coupon.findById(couponId);
  if (!coupon) throw AppError.notFound('Coupon not found.');

  if (coupon.seller?.toString() !== seller._id.toString()) {
    throw AppError.forbidden('Unauthorized access: You do not own this coupon.');
  }

  await Coupon.findByIdAndDelete(couponId);
  return { deleted: true, id: couponId };
};

// --- Admin Coupon Management ---

export const getAdminCoupons = async () => {
  return Coupon.find().populate('seller', 'businessName businessEmail').sort({ createdAt: -1 }).lean();
};

export const createAdminCoupon = async (data) => {
  const cleanCode = data.code.trim().toUpperCase();
  const existing = await Coupon.findOne({ code: cleanCode });
  if (existing) {
    throw AppError.conflict(`Coupon code '${cleanCode}' already exists.`);
  }

  const coupon = new Coupon({
    code: cleanCode,
    description: data.description?.trim() || '',
    type: data.type,
    value: parseFloat(data.value),
    scope: data.scope || COUPON_SCOPE.PLATFORM,
    seller: data.seller || null,
    minimumOrderAmount: data.minimumOrderAmount ? parseFloat(data.minimumOrderAmount) : 0,
    maximumDiscount: data.maximumDiscount ? parseFloat(data.maximumDiscount) : null,
    startDate: data.startDate ? new Date(data.startDate) : new Date(),
    expiryDate: new Date(data.expiryDate),
    usageLimit: data.usageLimit ? parseInt(data.usageLimit, 10) : null,
    perUserLimit: data.perUserLimit ? parseInt(data.perUserLimit, 10) : 1,
    status: data.status || 'active',
  });

  return coupon.save();
};

export const updateAdminCoupon = async (couponId, data) => {
  const coupon = await Coupon.findById(couponId);
  if (!coupon) throw AppError.notFound('Coupon not found.');

  if (data.description !== undefined) coupon.description = data.description.trim();
  if (data.value !== undefined) coupon.value = parseFloat(data.value);
  if (data.minimumOrderAmount !== undefined) coupon.minimumOrderAmount = parseFloat(data.minimumOrderAmount);
  if (data.maximumDiscount !== undefined) coupon.maximumDiscount = data.maximumDiscount ? parseFloat(data.maximumDiscount) : null;
  if (data.expiryDate !== undefined) coupon.expiryDate = new Date(data.expiryDate);
  if (data.usageLimit !== undefined) coupon.usageLimit = data.usageLimit ? parseInt(data.usageLimit, 10) : null;
  if (data.perUserLimit !== undefined) coupon.perUserLimit = parseInt(data.perUserLimit, 10);
  if (data.status !== undefined) coupon.status = data.status;

  return coupon.save();
};

export const deleteAdminCoupon = async (couponId) => {
  const coupon = await Coupon.findById(couponId);
  if (!coupon) throw AppError.notFound('Coupon not found.');

  await Coupon.findByIdAndDelete(couponId);
  return { deleted: true, id: couponId };
};

export default {
  validateCouponForCheckout,
  recordCouponUsage,
  getSellerCoupons,
  createSellerCoupon,
  updateSellerCoupon,
  deleteSellerCoupon,
  getAdminCoupons,
  createAdminCoupon,
  updateAdminCoupon,
  deleteAdminCoupon,
};
