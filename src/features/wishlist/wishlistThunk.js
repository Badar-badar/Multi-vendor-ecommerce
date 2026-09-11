import { createAsyncThunk } from '@reduxjs/toolkit';
import api from '../../api/api';

export const syncWishlist = createAsyncThunk(
  'wishlist/syncWishlist',
  async (_, { rejectWithValue }) => {
    try {
      const response = await api.get('/wishlist');
      return response.wishlist || response.data?.wishlist || response.data || response;
    } catch (error) {
      return rejectWithValue(error.message || 'Failed to sync wishlist');
    }
  }
);
