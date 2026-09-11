import api from './api';

export const checkoutApi = {
  // Validate cart & prices with backend before proceeding to payment
  validateCheckoutSession: (cartItems, couponCode = null) =>
    api.post('/checkout/validate', { items: cartItems, couponCode }),

  // Calculate authoritative shipping, taxes, and discounts based on address & shipping selection
  calculateCheckoutTotals: (payload) =>
    api.post('/checkout/calculate', payload),

  // Pre-validate inventory across multi-seller ateliers
  checkStockAvailability: (items) =>
    api.post('/checkout/stock-check', { items }),

  // Create authoritative confirmed order with idempotency token
  createCheckoutOrder: (orderPayload, idempotencyKey) =>
    api.post('/checkout/orders', orderPayload, {
      headers: idempotencyKey ? { 'Idempotency-Key': idempotencyKey } : {},
    }),
};

export default checkoutApi;
