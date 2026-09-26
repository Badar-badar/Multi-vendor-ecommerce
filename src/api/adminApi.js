import api from './api';

export const adminApi = {
  // Categories & Subcategories
  getCategories: () => api.get('/admin/categories'),
  createCategory: (data) => api.post('/admin/categories', data),
  updateCategory: (id, data) => api.patch(`/admin/categories/${id}`, data),
  deleteCategory: (id) => api.delete(`/admin/categories/${id}`),

  getSubcategories: (params = {}) => api.get('/admin/subcategories', { params }),
  createSubcategory: (data) => api.post('/admin/subcategories', data),
  updateSubcategory: (id, data) => api.patch(`/admin/subcategories/${id}`, data),
  deleteSubcategory: (id) => api.delete(`/admin/subcategories/${id}`),

  // Brands
  getBrands: () => api.get('/admin/brands'),
  createBrand: (data) => api.post('/admin/brands', data),
  updateBrand: (id, data) => api.patch(`/admin/brands/${id}`, data),
  deleteBrand: (id) => api.delete(`/admin/brands/${id}`),

  // Sellers & Applications
  getSellerApplications: (params = {}) => api.get('/admin/sellers/applications', { params }),
  getSellerById: (id) => api.get(`/admin/sellers/${id}`),
  approveSeller: (id) => api.patch(`/admin/sellers/${id}/approve`),
  rejectSeller: (id, reason = 'Application does not meet platform criteria') =>
    api.patch(`/admin/sellers/${id}/reject`, { reason }),
  suspendSeller: (id, reason = 'Account suspended by administrator') =>
    api.patch(`/admin/sellers/${id}/suspend`, { reason }),

  // Products
  getProducts: (params = {}) => api.get('/admin/products', { params }),
  approveProduct: (id) => api.patch(`/admin/products/${id}/approve`),
  rejectProduct: (id, reason) => api.patch(`/admin/products/${id}/reject`, { reason }),
  archiveProduct: (id) => api.patch(`/admin/products/${id}/archive`),

  // Orders
  getOrders: (params = {}) => api.get('/admin/orders', { params }),
  getOrderById: (id) => api.get(`/admin/orders/${id}`),
  updateOrderStatus: (id, statusData) => api.patch(`/admin/orders/${id}/status`, statusData),

  // Reviews Moderation
  getReviews: (params = {}) => api.get('/admin/reviews', { params }),
  moderateReview: (id, status) => api.patch(`/admin/reviews/${id}/status`, { status }),

  // Coupons
  getCoupons: (params = {}) => api.get('/admin/coupons', { params }),
  createCoupon: (data) => api.post('/admin/coupons', data),
  updateCoupon: (id, data) => api.patch(`/admin/coupons/${id}`, data),
  deleteCoupon: (id) => api.delete(`/admin/coupons/${id}`),

  // Financial Oversight
  getPayments: (params = {}) => api.get('/admin/payments', { params }),
  getTransactions: (params = {}) => api.get('/admin/transactions', { params }),
  getRefunds: (params = {}) => api.get('/admin/refunds', { params }),
  processRefund: (orderId, data) => api.post(`/admin/orders/${orderId}/refund`, data),
  getCommissions: (params = {}) => api.get('/admin/commissions', { params }),

  // Analytics
  getAnalyticsOverview: () => api.get('/admin/analytics/overview'),
  getAnalyticsSales: (params = {}) => api.get('/admin/analytics/sales', { params }),
  getAnalyticsSellers: (params = {}) => api.get('/admin/analytics/sellers', { params }),
  getAnalyticsProducts: (params = {}) => api.get('/admin/analytics/products', { params }),
  getAnalyticsCustomers: (params = {}) => api.get('/admin/analytics/customers', { params }),
  getAnalyticsPayments: (params = {}) => api.get('/admin/analytics/payments', { params }),

  // Reports
  getSalesReport: (params = {}) => api.get('/admin/reports/sales', { params }),
  getOrdersReport: (params = {}) => api.get('/admin/reports/orders', { params }),
  getSellersReport: (params = {}) => api.get('/admin/reports/sellers', { params }),
  getPaymentsReport: (params = {}) => api.get('/admin/reports/payments', { params }),

  // Platform Settings
  getSettings: () => api.get('/admin/settings'),
  updateSettings: (data) => api.patch('/admin/settings', data),
};

export default adminApi;
