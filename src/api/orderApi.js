import api from './api';

export const orderApi = {
  createOrder: (orderData, idempotencyKey) =>
    api.post('/orders', orderData, {
      headers: idempotencyKey ? { 'Idempotency-Key': idempotencyKey } : {},
    }),
  getMyOrders: (params = {}) =>
    api.get('/orders', { params }),
  getOrderById: (orderId) =>
    api.get(`/orders/${orderId}`),
  cancelOrder: (orderId, reason) =>
    api.post(`/orders/${orderId}/cancel`, { reason }),
  requestReturn: (orderId, returnData) =>
    api.post(`/orders/${orderId}/return`, returnData),
  reorder: (orderId) =>
    api.post(`/orders/${orderId}/reorder`),

  // Seller Order Management
  getSellerOrders: (params = {}) =>
    api.get('/seller/orders', { params }),
  getSellerOrderById: (orderId) =>
    api.get(`/seller/orders/${orderId}`),
  updateSellerOrderStatus: (orderId, statusData) =>
    api.patch(`/seller/orders/${orderId}/status`, statusData),
  getSellerReturns: (params = {}) =>
    api.get('/seller/returns', { params }),
  reviewSellerReturn: (returnId, reviewData) =>
    api.patch(`/seller/returns/${returnId}/review`, reviewData),

  // Admin Order Management
  getAdminOrders: (params = {}) =>
    api.get('/admin/orders', { params }),
  getAdminOrderById: (orderId) =>
    api.get(`/admin/orders/${orderId}`),
  updateAdminOrderStatus: (orderId, statusData) =>
    api.patch(`/admin/orders/${orderId}/status`, statusData),
};

export default orderApi;
