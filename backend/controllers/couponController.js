import {
  getSellerCoupons,
  createSellerCoupon,
  updateSellerCoupon,
  deleteSellerCoupon,
  getAdminCoupons,
  createAdminCoupon,
  updateAdminCoupon,
  deleteAdminCoupon,
} from '../services/couponService.js';
import { sendSuccess } from '../utils/apiResponse.js';

/**
 * Coupon Controller
 */

// --- Seller Endpoints ---

export const getMyCoupons = async (req, res, next) => {
  try {
    const coupons = await getSellerCoupons(req.user._id);
    return sendSuccess(res, {
      statusCode: 200,
      message: 'Seller atelier coupons retrieved.',
      data: { coupons },
    });
  } catch (error) {
    next(error);
  }
};

export const createMyCoupon = async (req, res, next) => {
  try {
    const coupon = await createSellerCoupon(req.user._id, req.body);
    return sendSuccess(res, {
      statusCode: 201,
      message: 'Atelier coupon created successfully.',
      data: { coupon },
    });
  } catch (error) {
    next(error);
  }
};

export const updateMyCoupon = async (req, res, next) => {
  try {
    const coupon = await updateSellerCoupon(req.user._id, req.params.id, req.body);
    return sendSuccess(res, {
      statusCode: 200,
      message: 'Atelier coupon updated.',
      data: { coupon },
    });
  } catch (error) {
    next(error);
  }
};

export const deleteMyCoupon = async (req, res, next) => {
  try {
    const result = await deleteSellerCoupon(req.user._id, req.params.id);
    return sendSuccess(res, {
      statusCode: 200,
      message: 'Atelier coupon removed.',
      data: result,
    });
  } catch (error) {
    next(error);
  }
};

// --- Admin Endpoints ---

export const getAllCouponsAdmin = async (req, res, next) => {
  try {
    const coupons = await getAdminCoupons();
    return sendSuccess(res, {
      statusCode: 200,
      message: 'Admin coupons list retrieved.',
      data: { coupons },
    });
  } catch (error) {
    next(error);
  }
};

export const createAdminNewCoupon = async (req, res, next) => {
  try {
    const coupon = await createAdminCoupon(req.body);
    return sendSuccess(res, {
      statusCode: 201,
      message: 'Platform coupon created successfully.',
      data: { coupon },
    });
  } catch (error) {
    next(error);
  }
};

export const updateAdminCouponById = async (req, res, next) => {
  try {
    const coupon = await updateAdminCoupon(req.params.id, req.body);
    return sendSuccess(res, {
      statusCode: 200,
      message: 'Coupon updated successfully.',
      data: { coupon },
    });
  } catch (error) {
    next(error);
  }
};

export const deleteAdminCouponById = async (req, res, next) => {
  try {
    const result = await deleteAdminCoupon(req.params.id);
    return sendSuccess(res, {
      statusCode: 200,
      message: 'Coupon deleted successfully.',
      data: result,
    });
  } catch (error) {
    next(error);
  }
};

export default {
  getMyCoupons,
  createMyCoupon,
  updateMyCoupon,
  deleteMyCoupon,
  getAllCouponsAdmin,
  createAdminNewCoupon,
  updateAdminCouponById,
  deleteAdminCouponById,
};
