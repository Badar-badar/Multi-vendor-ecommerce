import api from './api';

export const returnApi = {
  // Customer Returns
  getMyReturns: (params = {}) =>
    api.get('/returns', { params }),
  getReturnById: (id) =>
    api.get(`/returns/${id}`),
  createReturnRequest: (returnData) =>
    api.post('/returns', returnData),
  cancelReturnRequest: (id) =>
    api.post(`/returns/${id}/cancel`),

  // Seller Returns
  getSellerReturns: (params = {}) =>
    api.get('/seller/returns', { params }),
  updateSellerReturnStatus: (id, { status, sellerResponse }) =>
    api.put(`/seller/returns/${id}/status`, { status, sellerResponse }),

  // Admin Returns Moderation
  getAdminReturns: (params = {}) =>
    api.get('/admin/returns', { params }),
};

export default returnApi;
