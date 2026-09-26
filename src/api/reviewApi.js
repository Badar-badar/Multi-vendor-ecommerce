import api from './api';

export const reviewApi = {
  // Product Reviews
  getProductReviews: (productId, params = {}) =>
    api.get(`/reviews/product/${productId}`, { params }),

  // Customer Review Actions
  createReview: (productId, reviewData) =>
    api.post(`/reviews/product/${productId}`, reviewData),
  updateReview: (reviewId, reviewData) =>
    api.patch(`/reviews/${reviewId}`, reviewData),
  deleteReview: (reviewId) =>
    api.delete(`/reviews/${reviewId}`),
};

export default reviewApi;
