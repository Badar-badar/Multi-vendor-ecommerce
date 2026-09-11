import api from './api';

export const productApi = {
  // Customer Discovery & Catalog
  getProducts: (params = {}) => api.get('/products', { params }),
  getProductByIdOrSlug: (idOrSlug) => api.get(`/products/${idOrSlug}`),
  getFeaturedProducts: () => api.get('/products/featured'),
  getNewArrivals: () => api.get('/products/new-arrivals'),
  getBestSellers: () => api.get('/products/best-sellers'),
  getTrendingProducts: () => api.get('/products/trending'),
  getDeals: () => api.get('/products/deals'),
  getRelatedProducts: (productId) => api.get(`/products/${productId}/related`),
  searchProducts: (query, params = {}) =>
    api.get('/products/search', { params: { q: query, ...params } }),
  getSuggestions: (query) =>
    api.get('/products/suggestions', { params: { q: query } }),
  getProductsByCategory: (categorySlug, params = {}) =>
    api.get(`/categories/${categorySlug}/products`, { params }),
  getProductsBySeller: (sellerId, params = {}) =>
    api.get(`/sellers/${sellerId}/products`, { params }),

  // Seller Product Studio & Inventory Management
  getSellerProducts: (params = {}) => api.get('/seller/products', { params }),
  getSellerProductById: (id) => api.get(`/seller/products/${id}`),
  createSellerProduct: (data) => api.post('/seller/products', data),
  updateSellerProduct: (id, data) => api.put(`/seller/products/${id}`, data),
  deleteSellerProduct: (id) => api.delete(`/seller/products/${id}`),
  archiveSellerProduct: (id) => api.patch(`/seller/products/${id}/archive`),
  duplicateSellerProduct: (id) => api.post(`/seller/products/${id}/duplicate`),
  uploadProductImages: (formData) =>
    api.post('/seller/products/upload-images', formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    }),
  getSellerInventory: (params = {}) => api.get('/seller/inventory', { params }),
  updateInventoryStock: (id, stockData) =>
    api.patch(`/seller/inventory/${id}`, stockData),
  bulkUpdateInventory: (items) =>
    api.patch('/seller/inventory/bulk', { items }),

  // Admin Catalog & Moderation
  getAdminProducts: (params = {}) => api.get('/admin/products', { params }),
  getAdminProductById: (id) => api.get(`/admin/products/${id}`),
  updateAdminProduct: (id, data) => api.put(`/admin/products/${id}`, data),
  approveProduct: (id, moderationNotes = '') =>
    api.patch(`/admin/products/${id}/approve`, { moderationNotes }),
  rejectProduct: (id, reason, details = '') =>
    api.patch(`/admin/products/${id}/reject`, { reason, details }),
  archiveAdminProduct: (id) => api.patch(`/admin/products/${id}/archive`),
  deleteAdminProduct: (id) => api.delete(`/admin/products/${id}`),
};

export default productApi;
