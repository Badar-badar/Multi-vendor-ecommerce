import { createAsyncThunk } from '@reduxjs/toolkit';
import cartApi from '../../api/cartApi';

export const syncCartWithBackend = createAsyncThunk(
  'cart/syncCart',
  async (_, { rejectWithValue }) => {
    try {
      const response = await cartApi.getCart();
      return response.cart;
    } catch (error) {
      return rejectWithValue(error.message || 'Failed to sync cart');
    }
  }
);
