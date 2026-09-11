import { createSelector } from '@reduxjs/toolkit';

export const selectAllReviews = (state) => state.reviews?.items || [];
export const selectUserReviews = (state) => state.reviews?.userReviews || [];
export const selectEligibleReviews = (state) => state.reviews?.eligibleReviews || [];
export const selectReviewFilter = (state) => state.reviews?.filterRating || 'all';
export const selectReviewSortBy = (state) => state.reviews?.sortBy || 'relevant';
export const selectReviewLoading = (state) => state.reviews?.loading || false;
export const selectReviewSubmitting = (state) => state.reviews?.submitting || false;
export const selectReviewSubmitSuccess = (state) => state.reviews?.submitSuccess || false;
export const selectReviewError = (state) => state.reviews?.error || null;
export const selectVotedReviews = (state) => state.reviews?.votedReviews || {};
export const selectReportedReviews = (state) => state.reviews?.reportedReviews || {};

// Memoized selector for product-specific reviews
export const selectProductReviews = (productId) =>
  createSelector([selectAllReviews], (reviews) => {
    if (!productId) return reviews;
    const matched = reviews.filter((r) => r.productId === productId);
    return matched.length > 0 ? matched : reviews.slice(0, 4);
  });

// Memoized statistics for a product
export const selectProductReviewStats = (productId) =>
  createSelector([selectProductReviews(productId)], (reviews) => {
    const total = reviews.length;
    const sum = reviews.reduce((acc, r) => acc + r.rating, 0);
    const avg = total > 0 ? (sum / total).toFixed(1) : '5.0';

    const distribution = { 5: 0, 4: 0, 3: 0, 2: 0, 1: 0 };
    reviews.forEach((r) => {
      distribution[r.rating] = (distribution[r.rating] || 0) + 1;
    });

    return { total, avg, distribution };
  });

// Filtered and sorted product reviews
export const selectFilteredAndSortedReviews = (productId) =>
  createSelector(
    [selectProductReviews(productId), selectReviewFilter, selectReviewSortBy],
    (reviews, filter, sort) => {
      let result = [...reviews];

      // Filtering
      if (filter === 'photos') {
        result = result.filter((r) => r.images && r.images.length > 0);
      } else if (filter !== 'all') {
        result = result.filter((r) => r.rating === Number(filter));
      }

      // Sorting
      if (sort === 'newest') {
        result.sort((a, b) => (b.id > a.id ? 1 : -1));
      } else if (sort === 'highest') {
        result.sort((a, b) => b.rating - a.rating);
      } else if (sort === 'lowest') {
        result.sort((a, b) => a.rating - b.rating);
      } else {
        // relevant (most helpful first)
        result.sort((a, b) => (b.helpfulCount || 0) - (a.helpfulCount || 0));
      }

      return result;
    }
  );
