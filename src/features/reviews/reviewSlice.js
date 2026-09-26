import { createSlice } from '@reduxjs/toolkit';
import {
  fetchProductReviews,
  submitProductReview,
  editProductReview,
  removeProductReview,
} from './reviewThunk';

const initialState = {
  items: [],
  userReviews: [],
  eligibleReviews: [],
  stats: null,
  filterRating: 'all',
  sortBy: 'relevant',
  votedReviews: {},
  reportedReviews: {},
  loading: false,
  submitting: false,
  error: null,
  submitSuccess: false,
};

export const reviewSlice = createSlice({
  name: 'reviews',
  initialState,
  reducers: {
    setFilterRating: (state, action) => {
      state.filterRating = action.payload;
    },
    setSortBy: (state, action) => {
      state.sortBy = action.payload;
    },
    addLocalReview: (state, action) => {
      state.items.unshift(action.payload);
      state.userReviews.unshift(action.payload);
    },
    updateLocalReview: (state, action) => {
      const idx = state.items.findIndex((r) => (r._id || r.id) === (action.payload._id || action.payload.id));
      if (idx !== -1) state.items[idx] = { ...state.items[idx], ...action.payload };
      const uIdx = state.userReviews.findIndex((r) => (r._id || r.id) === (action.payload._id || action.payload.id));
      if (uIdx !== -1) state.userReviews[uIdx] = { ...state.userReviews[uIdx], ...action.payload };
    },
    deleteLocalReview: (state, action) => {
      state.items = state.items.filter((r) => (r._id || r.id) !== action.payload);
      state.userReviews = state.userReviews.filter((r) => (r._id || r.id) !== action.payload);
    },
    markReviewHelpfulLocal: (state, action) => {
      const id = action.payload;
      if (!state.votedReviews) state.votedReviews = {};
      state.votedReviews[id] = true;
      const rev = state.items.find((r) => (r._id || r.id) === id);
      if (rev) rev.helpfulCount = (rev.helpfulCount || 0) + 1;
    },
    reportReviewLocal: (state, action) => {
      const id = action.payload;
      if (!state.reportedReviews) state.reportedReviews = {};
      state.reportedReviews[id] = true;
    },
    clearReviewError: (state) => {
      state.error = null;
    },
    resetSubmitState: (state) => {
      state.submitting = false;
      state.submitSuccess = false;
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      // Fetch Product Reviews
      .addCase(fetchProductReviews.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchProductReviews.fulfilled, (state, action) => {
        state.loading = false;
        if (action.payload) {
          state.items = action.payload.reviews || (Array.isArray(action.payload) ? action.payload : []);
          if (action.payload.stats) state.stats = action.payload.stats;
        }
      })
      .addCase(fetchProductReviews.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // Submit Review
      .addCase(submitProductReview.pending, (state) => {
        state.submitting = true;
        state.error = null;
        state.submitSuccess = false;
      })
      .addCase(submitProductReview.fulfilled, (state, action) => {
        state.submitting = false;
        state.submitSuccess = true;
        if (action.payload) {
          state.items.unshift(action.payload);
        }
      })
      .addCase(submitProductReview.rejected, (state, action) => {
        state.submitting = false;
        state.error = action.payload;
      })

      // Edit Review
      .addCase(editProductReview.fulfilled, (state, action) => {
        if (action.payload) {
          const idx = state.items.findIndex((r) => (r._id || r.id) === (action.payload._id || action.payload.id));
          if (idx !== -1) {
            state.items[idx] = { ...state.items[idx], ...action.payload };
          }
        }
      })

      // Delete Review
      .addCase(removeProductReview.fulfilled, (state, action) => {
        state.items = state.items.filter((r) => (r._id || r.id) !== action.payload);
      });
  },
});

export const {
  setFilterRating,
  setSortBy,
  addLocalReview,
  updateLocalReview,
  deleteLocalReview,
  markReviewHelpfulLocal,
  reportReviewLocal,
  clearReviewError,
  resetSubmitState,
} = reviewSlice.actions;

export default reviewSlice.reducer;
