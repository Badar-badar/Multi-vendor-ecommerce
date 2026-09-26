import api from './api';

export const reportApi = {
  // Sales & Revenue Intelligence
  getSalesReport: (params = {}) => api.get('/admin/reports/sales', { params }),

  // Orders Velocity & Fulfillment
  getOrderReport: (params = {}) => api.get('/admin/reports/orders', { params }),

  // Catalog Performance & Valuation
  getProductReport: (params = {}) => api.get('/admin/reports/products', { params }),

  // Seller Performance & GMV
  getSellerReport: (params = {}) => api.get('/admin/reports/sellers', { params }),

  // Patron & Customer Growth
  getCustomerReport: (params = {}) => api.get('/admin/reports/customers', { params }),

  // Payment Settlement & Gateway Distribution
  getPaymentReport: (params = {}) => api.get('/admin/reports/payments', { params }),

  queueReport: (reportType, params = {}) =>
    api.post('/admin/reports/queue', { reportType, ...params }),

  // Refund Claims & Dispute Ratio
  getRefundReport: (params = {}) => api.get('/admin/reports/refunds', { params }),

  // Platform Commission Take Rate
  getCommissionReport: (params = {}) => api.get('/admin/reports/commissions', { params }),

  // Export Report (CSV / PDF stream)
  exportReport: (type, params = {}) =>
    api.get(`/admin/reports/${type}/export`, {
      params,
      responseType: 'blob',
    }),
};

export default reportApi;
