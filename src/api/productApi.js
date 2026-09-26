import api from './api';

export const productApi = {
  // Customer Discovery & Catalog
  getProducts: (params = {}) => api.get('/products', { params }),
  getProductByIdOrSlug: (idOrSlug) => api.get(`/products/${idOrSlug}`),
  getFeaturedProducts: (params = {}) => api.get('/products', { params: { featured: true, ...params } }),
  getNewArrivals: (params = {}) => api.get('/products', { params: { sortBy: 'newest', ...params } }),
  getBestSellers: (params = {}) => api.get('/products', { params: { sortBy: 'popular', ...params } }),
  getTrendingProducts: (params = {}) => api.get('/products', { params: { featured: true, ...params } }),
  getDeals: (params = {}) => api.get('/products', { params: { deal: true, ...params } }),
  getRelatedProducts: (category, params = {}) => api.get('/products', { params: { category, limit: 4, ...params } }),
  searchProducts: (query, params = {}) =>
    api.get('/products', { params: { search: query, ...params } }),
  getProductsByCategory: (categorySlug, params = {}) =>
    api.get('/products', { params: { category: categorySlug, ...params } }),
  getProductsBySeller: (sellerId, params = {}) =>
    api.get('/products', { params: { seller: sellerId, ...params } }),

  // Seller Product Studio & Inventory Management
  getSellerProducts: (params = {}) => api.get('/seller/products', { params }),
  getSellerProductById: (id) => api.get(`/seller/products/${id}`),
  createSellerProduct: (data) => api.post('/seller/products', data),
  updateSellerProduct: (id, data) => api.patch(`/seller/products/${id}`, data),
  deleteSellerProduct: (id) => api.delete(`/seller/products/${id}`),
  getSellerInventory: (params = {}) => api.get('/seller/inventory', { params }),
  updateInventoryStock: (productId, stockData) =>
    api.patch(`/seller/inventory/${productId}/stock`, stockData),

  // Admin Catalog & Moderation
  getAdminProducts: (params = {}) => api.get('/admin/products', { params }),
  approveProduct: (id) =>
    api.patch(`/admin/products/${id}/approve`),
  rejectProduct: (id, reason = 'Product details do not meet marketplace standards') =>
    api.patch(`/admin/products/${id}/reject`, { reason }),
  archiveAdminProduct: (id) => api.patch(`/admin/products/${id}/archive`),
};

export default productApi;
