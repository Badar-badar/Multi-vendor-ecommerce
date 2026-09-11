import api from './api';

export const adminApi = {
  // Dashboard & Reports
  getDashboard: () => api.get('/admin/dashboard'),
  getDashboardKPIs: () => api.get('/admin/dashboard'),
  getReports: (params = {}) => api.get('/admin/reports', { params }),

  // Users / Customers
  getUsers: (params = {}) => api.get('/admin/users', { params }),
  getUser: (userId) => api.get(`/admin/users/${userId}`),
  updateUserStatus: (userId, status) => api.put(`/admin/users/${userId}/status`, { status }),

  // Sellers
  getSellers: (params = {}) => api.get('/admin/sellers', { params }),
  getSeller: (sellerId) => api.get(`/admin/sellers/${sellerId}`),
  updateSellerStatus: (sellerId, status) => api.put(`/admin/sellers/${sellerId}/status`, { status }),
  approveSeller: (sellerId) => api.post(`/admin/sellers/${sellerId}/approve`),
  rejectSeller: (sellerId, reason) => api.post(`/admin/sellers/${sellerId}/reject`, { reason }),

  // Products
  getProducts: (params = {}) => api.get('/admin/products', { params }),
  getProduct: (productId) => api.get(`/admin/products/${productId}`),
  updateProductStatus: (productId, status) => api.put(`/admin/products/${productId}/status`, { status }),
  approveProduct: (productId) => api.post(`/admin/products/${productId}/approve`),
  rejectProduct: (productId, reason) => api.post(`/admin/products/${productId}/reject`, { reason }),
  deleteProduct: (productId) => api.delete(`/admin/products/${productId}`),

  // Categories & Subcategories
  getCategories: () => api.get('/admin/categories'),
  createCategory: (data) => api.post('/admin/categories', data),
  updateCategory: (id, data) => api.put(`/admin/categories/${id}`, data),
  deleteCategory: (id) => api.delete(`/admin/categories/${id}`),

  getSubcategories: (params = {}) => api.get('/admin/subcategories', { params }),
  createSubcategory: (data) => api.post('/admin/subcategories', data),
  updateSubcategory: (id, data) => api.put(`/admin/subcategories/${id}`, data),
  deleteSubcategory: (id) => api.delete(`/admin/subcategories/${id}`),

  // Brands
  getBrands: () => api.get('/admin/brands'),
  createBrand: (data) => api.post('/admin/brands', data),
  updateBrand: (id, data) => api.put(`/admin/brands/${id}`, data),
  deleteBrand: (id) => api.delete(`/admin/brands/${id}`),

  // Orders & Details
  getOrders: (params = {}) => api.get('/admin/orders', { params }),
  getOrder: (orderId) => api.get(`/admin/orders/${orderId}`),
  updateOrderStatus: (orderId, statusData) => api.put(`/admin/orders/${orderId}/status`, statusData),

  // Finance: Payments & Refunds
  getPayments: (params = {}) => api.get('/admin/payments', { params }),
  getRefunds: (params = {}) => api.get('/admin/refunds', { params }),
  updateRefundStatus: (refundId, statusData) => api.put(`/admin/refunds/${refundId}/status`, statusData),
  issueRefund: (paymentId, amount) => api.post(`/admin/payments/${paymentId}/refund`, { amount }),

  // Finance: Commissions
  getCommissions: (params = {}) => api.get('/admin/commissions', { params }),
  releaseCommissionPayout: (sellerId) => api.post(`/admin/commissions/${sellerId}/payout`),
  updateCommissionRate: (sellerId, rate) => api.put(`/admin/commissions/${sellerId}/rate`, { rate }),

  // Marketing: Coupons & Promotions
  getCoupons: () => api.get('/admin/coupons'),
  createCoupon: (data) => api.post('/admin/coupons', data),
  updateCoupon: (id, data) => api.put(`/admin/coupons/${id}`, data),
  deleteCoupon: (id) => api.delete(`/admin/coupons/${id}`),

  getPromotions: () => api.get('/admin/promotions'),
  createPromotion: (data) => api.post('/admin/promotions', data),
  updatePromotion: (id, data) => api.put(`/admin/promotions/${id}`, data),
  deletePromotion: (id) => api.delete(`/admin/promotions/${id}`),

  // Moderation: Reviews
  getReviews: (params = {}) => api.get('/admin/reviews', { params }),
  moderateReview: (reviewId, action) => api.put(`/admin/reviews/${reviewId}/moderate`, { action }),

  // System: Notifications, Audit Logs & Settings
  getNotifications: () => api.get('/admin/notifications'),
  markNotificationRead: (id) => api.put(`/admin/notifications/${id}/read`),
  getAuditLogs: (params = {}) => api.get('/admin/audit-logs', { params }),
  getSettings: () => api.get('/admin/settings'),
  updateSettings: (data) => api.put('/admin/settings', data),
};

export default adminApi;
