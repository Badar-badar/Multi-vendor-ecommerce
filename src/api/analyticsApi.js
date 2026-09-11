import api from './api';

export const analyticsApi = {
  // Aggregate marketplace telemetry
  getMarketplaceAnalytics: (params = {}) =>
    api.get('/admin/analytics', { params }),

  // Category and discipline metrics
  getCategoryMetrics: (params = {}) =>
    api.get('/admin/analytics/categories', { params }),
};

export default analyticsApi;

