import { createAsyncThunk } from '@reduxjs/toolkit';
import reviewApi from '../../api/reviewApi';

export const fetchProductReviews = createAsyncThunk(
  'reviews/fetchProductReviews',
  async ({ productId, params = {} }, { rejectWithValue }) => {
    try {
      const response = await reviewApi.getProductReviews(productId, params);
      return response;
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
      return response;
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
      return response;
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

export const voteHelpfulReview = createAsyncThunk(
  'reviews/voteHelpful',
  async (reviewId, { rejectWithValue }) => {
    try {
      await reviewApi.voteHelpful(reviewId);
      return reviewId;
    } catch (error) {
      return rejectWithValue(error.message || 'Failed to register vote.');
    }
  }
);

export const reportPatronReview = createAsyncThunk(
  'reviews/reportReview',
  async ({ reviewId, reason }, { rejectWithValue }) => {
    try {
      await reviewApi.reportReview(reviewId, reason);
      return { reviewId, reason };
    } catch (error) {
      return rejectWithValue(error.message || 'Failed to report review.');
    }
  }
);

export const fetchMyReviews = createAsyncThunk(
  'reviews/fetchMyReviews',
  async (params = {}, { rejectWithValue }) => {
    try {
      const response = await reviewApi.getMyReviews(params);
      return response;
    } catch (error) {
      return rejectWithValue(error.message || 'Failed to load patron reviews.');
    }
  }
);
