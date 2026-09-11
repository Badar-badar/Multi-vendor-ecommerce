import api from './api';

export const sellerApi = {
  // Authentication & Onboarding
  registerSeller: (sellerData) => api.post('/seller/register', sellerData),
  getApplicationStatus: () => api.get('/seller/application/status'),
  updateApplication: (applicationData) => api.put('/seller/application', applicationData),
  resubmitApplication: (applicationData) => api.post('/seller/application/resubmit', applicationData),
  getProfile: () => api.get('/seller/profile'),
  updateProfile: (profileData) => api.put('/seller/profile', profileData),

  // Studio Dashboard & Telemetry
  getDashboardMetrics: (params = {}) => api.get('/seller/dashboard', { params }),
  getSalesTrend: (timeframe = '30d') => api.get('/seller/dashboard/sales-trend', { params: { timeframe } }),

  // Catalog Products
  getProducts: (params = {}) => api.get('/seller/products', { params }),
  getProductById: (productId) => api.get(`/seller/products/${productId}`),
  createProduct: (productData) => api.post('/seller/products', productData),
  updateProduct: (productId, productData) =>
    api.put(`/seller/products/${productId}`, productData),
  deleteProduct: (productId) => api.delete(`/seller/products/${productId}`),

  // Inventory Management
  getInventory: (params = {}) => api.get('/seller/inventory', { params }),
  updateInventory: (productId, inventoryData) =>
    api.put(`/seller/inventory/${productId}`, inventoryData),

  // Orders & Fulfillment
  getOrders: (params = {}) => api.get('/seller/orders', { params }),
  getOrderDetails: (orderId) => api.get(`/seller/orders/${orderId}`),
  updateOrderStatus: (orderId, statusData) =>
    api.put(`/seller/orders/${orderId}/status`, statusData),

  // Returns Management
  getReturns: (params = {}) => api.get('/seller/returns', { params }),
  updateReturnStatus: (returnId, statusData) =>
    api.put(`/seller/returns/${returnId}/status`, statusData),

  // Analytics & Reports
  getAnalytics: (timeframe = '30d') =>
    api.get('/seller/analytics', { params: { timeframe } }),
  getReports: (reportType = 'sales', params = {}) =>
    api.get('/seller/reports', { params: { type: reportType, ...params } }),
  getEarnings: (params = {}) => api.get('/seller/earnings', { params }),

  // Notifications
  getNotifications: () => api.get('/seller/notifications'),
  markNotificationRead: (notificationId) =>
    api.put(`/seller/notifications/${notificationId}/read`),
  markAllNotificationsRead: () => api.put('/seller/notifications/read-all'),

  // Store Settings & Policies
  getSettings: () => api.get('/seller/settings'),
  updateSettings: (settingsData) => api.put('/seller/settings', settingsData),

  // Coupons & Reviews
  getCoupons: () => api.get('/seller/coupons'),
  createCoupon: (couponData) => api.post('/seller/coupons', couponData),
  updateCoupon: (couponId, couponData) =>
    api.put(`/seller/coupons/${couponId}`, couponData),
  deleteCoupon: (couponId) => api.delete(`/seller/coupons/${couponId}`),
  getReviews: (params = {}) => api.get('/seller/reviews', { params }),
  replyToReview: (reviewId, replyText) =>
    api.post(`/seller/reviews/${reviewId}/reply`, { replyText }),
};

export default sellerApi;
