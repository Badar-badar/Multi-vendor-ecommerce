import api from './api';

export const categoryApi = {
  getCategories: () => api.get('/categories'),
  getCategoryBySlug: (slug) => api.get(`/categories/${slug}`),
  getSubcategories: (categoryId) => api.get(`/categories/${categoryId}/subcategories`),
};

export default categoryApi;
