import api from './api';

export const reviewApi = {
  // Product Reviews
  getProductReviews: (productId, params = {}) =>
    api.get(`/reviews/product/${productId}`, { params }),
  getReviewSummary: (productId) =>
    api.get(`/reviews/product/${productId}/summary`),

  // Review Operations
  createReview: (productId, reviewData) =>
    api.post(`/reviews/product/${productId}`, reviewData),
  updateReview: (reviewId, reviewData) =>
    api.put(`/reviews/${reviewId}`, reviewData),
  deleteReview: (reviewId) =>
    api.delete(`/reviews/${reviewId}`),

  // Community & Moderation
  voteHelpful: (reviewId) =>
    api.post(`/reviews/${reviewId}/helpful`),
  reportReview: (reviewId, reason) =>
    api.post(`/reviews/${reviewId}/report`, { reason }),

  // Customer Account Reviews
  getMyReviews: (params = {}) =>
    api.get('/reviews/my-reviews', { params }),
  getEligibleReviews: () =>
    api.get('/reviews/eligible'),

  // Seller Review Responses
  replyToReview: (reviewId, replyData) =>
    api.post(`/reviews/${reviewId}/reply`, replyData),
  updateReviewReply: (reviewId, replyData) =>
    api.put(`/reviews/${reviewId}/reply`, replyData),
  deleteReviewReply: (reviewId) =>
    api.delete(`/reviews/${reviewId}/reply`),
};

export default reviewApi;
