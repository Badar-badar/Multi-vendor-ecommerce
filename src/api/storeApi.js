import api from './api';

export const storeApi = {
  getStores: (params = {}) => api.get('/stores', { params }),
  getStoreBySlug: (slug) => api.get(`/stores/${slug}`),
  getStoreProducts: (slug, params = {}) => api.get(`/stores/${slug}/products`, { params }),
  getStoreReviews: (slug, params = {}) => api.get(`/stores/${slug}/reviews`, { params }),
  updateStoreProfile: (storeData) => api.put('/seller/store', storeData),
  uploadStoreMedia: (formData) =>
    api.post('/seller/store/upload-media', formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    }),
};

export default storeApi;
