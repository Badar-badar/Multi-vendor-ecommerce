import api from './api';

export const adminReviewApi = {
  getAdminReviews: (params = {}) =>
    api.get('/admin/reviews', { params }),
  getReviewDetails: (reviewId) =>
    api.get(`/admin/reviews/${reviewId}`),
  moderateReview: (reviewId, statusData) =>
    api.patch(`/admin/reviews/${reviewId}/status`, statusData),
  deleteReview: (reviewId) =>
    api.delete(`/admin/reviews/${reviewId}`),
  getReportedReviews: (params = {}) =>
    api.get('/admin/reviews/reported', { params }),
};

export default adminReviewApi;
