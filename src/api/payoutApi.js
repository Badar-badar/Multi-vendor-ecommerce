import api from './api';

export const payoutApi = {
  // Retrieve payouts ledger
  getPayouts: (params = {}) => api.get('/admin/payouts', { params }),

  // Payout batch details
  getPayoutDetails: (id) => api.get(`/admin/payouts/${id}`),

  // Payout summary
  getPayoutSummary: () => api.get('/admin/payouts/summary'),
};

export default payoutApi;
