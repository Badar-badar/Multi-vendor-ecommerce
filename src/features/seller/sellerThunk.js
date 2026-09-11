import { createAsyncThunk } from '@reduxjs/toolkit';
import sellerApi from '../../api/sellerApi';

export const fetchSellerProfile = createAsyncThunk(
  'seller/fetchProfile',
  async (_, { rejectWithValue }) => {
    try {
      const response = await sellerApi.getSellerProfile();
      return response.seller;
    } catch (error) {
      return rejectWithValue(error.message || 'Failed to fetch seller profile');
    }
  }
);

export const fetchSellerProducts = createAsyncThunk(
  'seller/fetchProducts',
  async (params, { rejectWithValue }) => {
    try {
      const response = await sellerApi.getSellerProducts(params);
      return response.products;
    } catch (error) {
      return rejectWithValue(error.message || 'Failed to fetch seller products');
    }
  }
);

export const fetchSellerAnalytics = createAsyncThunk(
  'seller/fetchAnalytics',
  async (_, { rejectWithValue }) => {
    try {
      const response = await sellerApi.getSellerAnalytics();
      return response.analytics;
    } catch (error) {
      return rejectWithValue(error.message || 'Failed to fetch seller analytics');
    }
  }
);
