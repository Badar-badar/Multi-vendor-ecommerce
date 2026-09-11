import api from './api';

export const cartApi = {
  getCart: () => api.get('/cart'),
  addToCart: (itemData) => api.post('/cart/items', itemData),
  updateCartItem: (itemId, quantity, selectedVariants) =>
    api.put(`/cart/items/${itemId}`, { quantity, selectedVariants }),
  removeFromCart: (itemId) => api.delete(`/cart/items/${itemId}`),
  clearCart: () => api.delete('/cart'),
  applyCoupon: (code) => api.post('/cart/coupon', { code }),
  removeCoupon: () => api.delete('/cart/coupon'),
};

export default cartApi;
