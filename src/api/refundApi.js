import api from './api';

export const refundApi = {
  // Customer & Seller
  getRefundById: (id) =>
    api.get(`/refunds/${id}`),

  // Admin Platform Refunds
  getAdminRefunds: (params = {}) =>
    api.get('/admin/refunds', { params }),
  processAdminRefund: (id, { action, reason, note }) =>
    api.post(`/admin/refunds/${id}/process`, { action, reason, note }),
};

export default refundApi;
