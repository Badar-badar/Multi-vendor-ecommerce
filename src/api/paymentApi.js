import api from './api';

export const paymentApi = {
  // Stripe Payment Intent Creation (Backend-Authoritative)
  createPaymentIntent: (payload, idempotencyKey = null) =>
    api.post(
      '/payments/create-intent',
      typeof payload === 'string' ? { orderId: payload } : payload,
      {
        headers: idempotencyKey ? { 'Idempotency-Key': idempotencyKey } : {},
      }
    ),

  // Customer Payment History Ledger
  getCustomerPayments: (params = {}) =>
    api.get('/payments', { params }),

  // Single payment details
  getPaymentById: (id) =>
    api.get(`/payments/${id}`),

  // Admin Platform Payment Oversight
  getAdminPayments: (params = {}) =>
    api.get('/admin/payments', { params }),
  getAdminTransactions: (params = {}) =>
    api.get('/admin/transactions', { params }),
  getAdminRefunds: (params = {}) =>
    api.get('/admin/refunds', { params }),
  processRefund: (orderId, refundData) =>
    api.post(`/admin/orders/${orderId}/refund`, refundData),
  getAdminCommissions: (params = {}) =>
    api.get('/admin/commissions', { params }),
};

export default paymentApi;
