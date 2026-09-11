import { createSlice } from '@reduxjs/toolkit';
import { initialReviews } from '../../data/reviews';
import {
  fetchProductReviews,
  submitProductReview,
  editProductReview,
  removeProductReview,
  voteHelpfulReview,
  reportPatronReview,
  fetchMyReviews,
} from './reviewThunk';

const INITIAL_ELIGIBLE_REVIEWS = [
  {
    id: 'elig-1',
    productId: 'prod-2',
    productName: '18k Solstice Choker with Pavé Diamonds',
    productImage: 'https://images.unsplash.com/photo-1599643478518-a784e5dc4c8f?w=200&auto=format&fit=crop&q=80',
    orderId: 'ORD-2026-9821',
    purchasedDate: '2026-08-25',
    sellerName: 'Aurelia Goldsmiths',
  },
  {
    id: 'elig-2',
    productId: 'prod-5',
    productName: 'Sovereign Obsidian Tourbillon Chronograph',
    productImage: 'https://images.unsplash.com/photo-1522335789203-aabd1fc54bc9?w=200&auto=format&fit=crop&q=80',
    orderId: 'ORD-2026-9818',
    purchasedDate: '2026-08-14',
    sellerName: 'Chronométrie Genevoise',
  },
];

const initialState = {
  items: initialReviews,
  userReviews: [
    {
      id: 'rev-user-1',
      productId: 'prod-1',
      productName: 'Mulberry Silk & Wool Double-Breasted Trench',
      productImage: 'https://images.unsplash.com/photo-1544441893-675973e31985?w=200&auto=format&fit=crop&q=80',
      rating: 5,
      title: 'Exquisite tailoring and silk weight',
      comment: 'The drape of this trench coat is unlike anything from mainstream luxury houses. The Mulberry silk blend feels substantial yet breathable.',
      date: '2 weeks ago',
      status: 'Published',
      verified: true,
      helpfulCount: 24,
      images: ['https://images.unsplash.com/photo-1544441893-675973e31985?w=400&auto=format&fit=crop'],
    },
  ],
  eligibleReviews: INITIAL_ELIGIBLE_REVIEWS,
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
    clearReviewError: (state) => {
      state.error = null;
    },
    resetSubmitState: (state) => {
      state.submitting = false;
      state.submitSuccess = false;
      state.error = null;
    },
    addLocalReview: (state, action) => {
      const newRev = {
        id: `rev-${Date.now()}`,
        date: 'Just now',
        verified: true,
        helpfulCount: 0,
        ...action.payload,
      };
      state.items.unshift(newRev);
      state.userReviews.unshift({
        ...newRev,
        status: 'Published',
      });
      // Remove from eligible list if it matches
      if (action.payload.productId) {
        state.eligibleReviews = state.eligibleReviews.filter(
          (e) => e.productId !== action.payload.productId
        );
      }
    },
    updateLocalReview: (state, action) => {
      const { reviewId, updatedData } = action.payload;
      state.items = state.items.map((r) =>
        r.id === reviewId ? { ...r, ...updatedData } : r
      );
      state.userReviews = state.userReviews.map((r) =>
        r.id === reviewId ? { ...r, ...updatedData } : r
      );
    },
    deleteLocalReview: (state, action) => {
      const reviewId = action.payload;
      state.items = state.items.filter((r) => r.id !== reviewId);
      state.userReviews = state.userReviews.filter((r) => r.id !== reviewId);
    },
    markReviewHelpfulLocal: (state, action) => {
      const reviewId = action.payload;
      if (!state.votedReviews[reviewId]) {
        state.votedReviews[reviewId] = true;
        const target = state.items.find((r) => r.id === reviewId);
        if (target) {
          target.helpfulCount = (target.helpfulCount || 0) + 1;
        }
      }
    },
    reportReviewLocal: (state, action) => {
      const { reviewId } = action.payload;
      state.reportedReviews[reviewId] = true;
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
        if (action.payload?.reviews) {
          state.items = action.payload.reviews;
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
        if (action.payload?.review) {
          state.items.unshift(action.payload.review);
        }
      })
      .addCase(submitProductReview.rejected, (state, action) => {
        state.submitting = false;
        state.error = action.payload;
      })

      // Edit Review
      .addCase(editProductReview.pending, (state) => {
        state.submitting = true;
      })
      .addCase(editProductReview.fulfilled, (state, action) => {
        state.submitting = false;
        if (action.payload?.review) {
          const updated = action.payload.review;
          state.items = state.items.map((r) => (r.id === updated.id ? updated : r));
          state.userReviews = state.userReviews.map((r) => (r.id === updated.id ? updated : r));
        }
      })
      .addCase(editProductReview.rejected, (state, action) => {
        state.submitting = false;
        state.error = action.payload;
      })

      // Delete Review
      .addCase(removeProductReview.fulfilled, (state, action) => {
        const id = action.payload;
        state.items = state.items.filter((r) => r.id !== id);
        state.userReviews = state.userReviews.filter((r) => r.id !== id);
      })

      // Vote Helpful
      .addCase(voteHelpfulReview.fulfilled, (state, action) => {
        const id = action.payload;
        state.votedReviews[id] = true;
        const target = state.items.find((r) => r.id === id);
        if (target) {
          target.helpfulCount = (target.helpfulCount || 0) + 1;
        }
      })

      // Report Review
      .addCase(reportPatronReview.fulfilled, (state, action) => {
        state.reportedReviews[action.payload.reviewId] = true;
      })

      // Fetch My Reviews
      .addCase(fetchMyReviews.fulfilled, (state, action) => {
        if (action.payload?.reviews) {
          state.userReviews = action.payload.reviews;
        }
      });
  },
});

export const {
  setFilterRating,
  setSortBy,
  clearReviewError,
  resetSubmitState,
  addLocalReview,
  updateLocalReview,
  deleteLocalReview,
  markReviewHelpfulLocal,
  reportReviewLocal,
} = reviewSlice.actions;

export default reviewSlice.reducer;
