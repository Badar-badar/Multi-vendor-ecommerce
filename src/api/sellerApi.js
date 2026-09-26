import api from './api';

export const sellerApi = {
  // Application & Onboarding
  getApplication: () => api.get('/seller/application'),
  applySeller: (data) => api.post('/seller/apply', data),
  updateApplication: (data) => api.patch('/seller/application', data),

  // Store Profile
  getStore: () => api.get('/seller/store'),
  updateStore: (data) => api.patch('/seller/store', data),

  // Products
  getProducts: (params = {}) => api.get('/seller/products', { params }),
  getProductById: (id) => api.get(`/seller/products/${id}`),
  createProduct: (data) => api.post('/seller/products', data),
  updateProduct: (id, data) => api.patch(`/seller/products/${id}`, data),
  deleteProduct: (id) => api.delete(`/seller/products/${id}`),

  // Inventory
  getInventory: (params = {}) => api.get('/seller/inventory', { params }),
  updateStock: (productId, stockData) =>
    api.patch(`/seller/inventory/${productId}/stock`, stockData),

  // Coupons
  getCoupons: () => api.get('/seller/coupons'),
  createCoupon: (data) => api.post('/seller/coupons', data),
  updateCoupon: (id, data) => api.patch(`/seller/coupons/${id}`, data),
  deleteCoupon: (id) => api.delete(`/seller/coupons/${id}`),

  // Orders & Returns
  getOrders: (params = {}) => api.get('/seller/orders', { params }),
  getOrderById: (id) => api.get(`/seller/orders/${id}`),
  updateOrderStatus: (id, statusData) =>
    api.patch(`/seller/orders/${id}/status`, statusData),
  getReturns: (params = {}) => api.get('/seller/returns', { params }),
  reviewReturn: (id, data) =>
    api.patch(`/seller/returns/${id}/review`, data),

  // Financial & Earnings
  getEarnings: (params = {}) => api.get('/seller/earnings', { params }),
  getTransactions: (params = {}) => api.get('/seller/transactions', { params }),

  // Analytics
  getAnalyticsOverview: () => api.get('/seller/analytics/overview'),
  getAnalyticsSales: (params = {}) => api.get('/seller/analytics/sales', { params }),
  getAnalyticsProducts: (params = {}) => api.get('/seller/analytics/products', { params }),
  getAnalyticsCustomers: (params = {}) => api.get('/seller/analytics/customers', { params }),
};

export default sellerApi;
