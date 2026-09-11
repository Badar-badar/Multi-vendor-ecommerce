import api from './api';

export const couponApi = {
  // Customer Checkout
  validateCoupon: (code, cartTotal) =>
    api.post('/coupons/validate', { code, cartTotal }),
  getAvailableCoupons: () =>
    api.get('/coupons/available'),

  // Seller Coupons
  getSellerCoupons: (params = {}) =>
    api.get('/seller/coupons', { params }),
  createSellerCoupon: (couponData) =>
    api.post('/seller/coupons', couponData),
  updateSellerCoupon: (id, couponData) =>
    api.put(`/seller/coupons/${id}`, couponData),
  deleteSellerCoupon: (id) =>
    api.delete(`/seller/coupons/${id}`),

  // Admin Platform Coupons
  getAdminCoupons: (params = {}) =>
    api.get('/admin/coupons', { params }),
  createAdminCoupon: (couponData) =>
    api.post('/admin/coupons', couponData),
  updateAdminCoupon: (id, couponData) =>
    api.put(`/admin/coupons/${id}`, couponData),
  deleteAdminCoupon: (id) =>
    api.delete(`/admin/coupons/${id}`),
};

export default couponApi;
