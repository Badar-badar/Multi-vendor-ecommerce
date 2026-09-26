import api from './api';

export const wishlistApi = {
  getWishlist: () => api.get('/wishlist'),
  addToWishlist: (productId) => api.post(`/wishlist/${productId}`),
  removeFromWishlist: (productId) => api.delete(`/wishlist/${productId}`),
  moveToCart: (productId) => api.post(`/wishlist/${productId}/move-to-cart`),
};

export default wishlistApi;
