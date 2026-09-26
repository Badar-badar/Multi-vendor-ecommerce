import api from './api';

export const storeApi = {
  getStores: (params = {}) => api.get('/stores', { params }),
  getStoreBySlug: (slug) => api.get(`/stores/${slug}`),
  getStoreProducts: (id, params = {}) => api.get(`/stores/${id}/products`, { params }),
  getSellerStore: () => api.get('/seller/store'),
  updateStoreProfile: (storeData) => api.patch('/seller/store', storeData),
};

export default storeApi;
