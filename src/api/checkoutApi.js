import api from './api';

export const checkoutApi = {
  // Validate cart, addresses, shipping & coupon with backend to calculate authoritative totals
  validateCheckoutSession: (payload) =>
    api.post('/checkout/validate', payload),

  // Place authoritative confirmed order
  createCheckoutOrder: (orderPayload, idempotencyKey) =>
    api.post('/orders', { ...orderPayload, idempotencyKey }, {
      headers: idempotencyKey ? { 'Idempotency-Key': idempotencyKey } : {},
    }),
};

export default checkoutApi;
