import api from './api';

export const paymentApi = {
  // Stripe Payment Intent Creation (Backend-Authoritative)
  createPaymentIntent: (orderId, idempotencyKey = null) =>
    api.post(
      '/payments/create-intent',
      { orderId },
      {
        headers: idempotencyKey ? { 'Idempotency-Key': idempotencyKey } : {},
      }
    ),

  // Confirm / Verify Payment Intent with Stripe Webhook Sync
  confirmPayment: (paymentIntentId) =>
    api.post('/payments/confirm', { paymentIntentId }),

  // Status Check & Transaction Verification
  getPaymentStatus: (transactionId) =>
    api.get(`/payments/${transactionId}/status`),

  // Customer Payment History Ledger
  getCustomerPayments: (params = {}) =>
    api.get('/payments/my-history', { params }),

  // Admin Platform Payment Settlements
  getAdminPayments: (params = {}) =>
    api.get('/admin/payments', { params }),
};

export default paymentApi;
