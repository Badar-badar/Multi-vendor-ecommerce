import api from './api';

export const cartApi = {
  getCart: () => api.get('/cart'),
  addToCart: (itemData) => api.post('/cart/items', itemData),
  updateCartItem: (itemId, quantity) =>
    api.patch(`/cart/items/${itemId}`, { quantity }),
  removeFromCart: (itemId) => api.delete(`/cart/items/${itemId}`),
  clearCart: () => api.delete('/cart'),
};

export default cartApi;
