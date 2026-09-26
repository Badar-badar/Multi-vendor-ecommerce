import { createAsyncThunk } from '@reduxjs/toolkit';
import reviewApi from '../../api/reviewApi';

export const fetchProductReviews = createAsyncThunk(
  'reviews/fetchProductReviews',
  async ({ productId, params = {} }, { rejectWithValue }) => {
    try {
      const response = await reviewApi.getProductReviews(productId, params);
      const data = response.data || response;
      return {
        reviews: data.reviews || (Array.isArray(data) ? data : []),
        pagination: data.pagination,
        stats: data.stats || data.ratingDistribution,
      };
    } catch (error) {
      return rejectWithValue(error.message || 'Failed to load reviews.');
    }
  }
);

export const submitProductReview = createAsyncThunk(
  'reviews/submitProductReview',
  async ({ productId, reviewData }, { rejectWithValue }) => {
    try {
      const response = await reviewApi.createReview(productId, reviewData);
      const data = response.data || response;
      return data.review || data;
    } catch (error) {
      return rejectWithValue(error.message || 'Failed to submit review.');
    }
  }
);

export const editProductReview = createAsyncThunk(
  'reviews/editProductReview',
  async ({ reviewId, reviewData }, { rejectWithValue }) => {
    try {
      const response = await reviewApi.updateReview(reviewId, reviewData);
      const data = response.data || response;
      return data.review || data;
    } catch (error) {
      return rejectWithValue(error.message || 'Failed to update review.');
    }
  }
);

export const removeProductReview = createAsyncThunk(
  'reviews/removeProductReview',
  async (reviewId, { rejectWithValue }) => {
    try {
      await reviewApi.deleteReview(reviewId);
      return reviewId;
    } catch (error) {
      return rejectWithValue(error.message || 'Failed to delete review.');
    }
  }
);
