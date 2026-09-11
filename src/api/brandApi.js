import api from './api';

export const brandApi = {
  getBrands: (params = {}) => api.get('/brands', { params }),
  getBrandBySlug: (slug) => api.get(`/brands/${slug}`),
};

export default brandApi;
