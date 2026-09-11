import api from './api';

export const commissionApi = {
  // Retrieve aggregate platform commissions ledger
  getCommissions: (params = {}) => api.get('/admin/commissions', { params }),

  // Summary of platform revenue, pending payouts, and effective take rates
  getCommissionSummary: () => api.get('/admin/commissions/summary'),

  // Adjust seller-specific contract commission rate
  updateCommissionRate: (sellerId, rate) =>
    api.put(`/admin/commissions/${sellerId}/rate`, { rate }),

  // Release / queue batch escrow payout for seller
  releasePayout: (sellerId) =>
    api.post(`/admin/commissions/${sellerId}/payout`),
};

export default commissionApi;
