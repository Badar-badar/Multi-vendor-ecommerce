import api from './api';

export const promotionApi = {
  // Public Storefront Active Promotions
  getActivePromotions: (params = {}) =>
    api.get('/promotions/active', { params }),
  getPromotionById: (id) =>
    api.get(`/promotions/${id}`),

  // Admin Platform Promotions
  getAdminPromotions: (params = {}) =>
    api.get('/admin/promotions', { params }),
  createAdminPromotion: (promoData) =>
    api.post('/admin/promotions', promoData),
  updateAdminPromotion: (id, promoData) =>
    api.put(`/admin/promotions/${id}`, promoData),
  deleteAdminPromotion: (id) =>
    api.delete(`/admin/promotions/${id}`),
};

export default promotionApi;
