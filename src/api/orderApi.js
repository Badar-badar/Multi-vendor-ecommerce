import api from './api';

export const orderApi = {
  createOrder: (orderData) =>
    api.post('/orders', orderData),
  getMyOrders: (params = {}) =>
    api.get('/orders', { params }),
  getOrderById: (orderId) =>
    api.get(`/orders/${orderId}`),
  cancelOrder: (orderId, reason) =>
    api.post(`/orders/${orderId}/cancel`, { reason }),
  requestReturn: (orderId, returnData) =>
    api.post(`/orders/${orderId}/return`, returnData),
  trackOrder: (orderNumber, email) =>
    api.get('/orders/track', { params: { orderNumber, email } }),
  reorder: (orderId) =>
    api.post(`/orders/${orderId}/reorder`),

  // Seller Order Management
  getSellerOrders: (params = {}) =>
    api.get('/seller/orders', { params }),
  getSellerOrderById: (orderId) =>
    api.get(`/seller/orders/${orderId}`),
  updateSellerOrderStatus: (orderId, statusData) =>
    api.put(`/seller/orders/${orderId}/status`, statusData),

  // Admin Order Management
  getAdminOrders: (params = {}) =>
    api.get('/admin/orders', { params }),
  getAdminOrderById: (orderId) =>
    api.get(`/admin/orders/${orderId}`),
  updateAdminOrderStatus: (orderId, statusData) =>
    api.put(`/admin/orders/${orderId}/status`, statusData),
};

export default orderApi;
