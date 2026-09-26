import { createAsyncThunk } from '@reduxjs/toolkit';
import wishlistApi from '../../api/wishlistApi';

export const fetchWishlist = createAsyncThunk(
  'wishlist/fetchWishlist',
  async (_, { rejectWithValue }) => {
    try {
      const response = await wishlistApi.getWishlist();
      const data = response.data || response;
      return data.wishlist || data.items || data;
    } catch (error) {
      return rejectWithValue(error.message || 'Failed to fetch wishlist');
    }
  }
);

export const addToWishlistThunk = createAsyncThunk(
  'wishlist/addToWishlist',
  async (productId, { rejectWithValue }) => {
    try {
      const response = await wishlistApi.addToWishlist(productId);
      const data = response.data || response;
      return data.wishlist || data.items || data;
    } catch (error) {
      return rejectWithValue(error.message || 'Failed to add to wishlist');
    }
  }
);

export const removeFromWishlistThunk = createAsyncThunk(
  'wishlist/removeFromWishlist',
  async (productId, { rejectWithValue }) => {
    try {
      const response = await wishlistApi.removeFromWishlist(productId);
      const data = response.data || response;
      return data.wishlist || data.items || data;
    } catch (error) {
      return rejectWithValue(error.message || 'Failed to remove from wishlist');
    }
  }
);

export const moveWishlistToBagThunk = createAsyncThunk(
  'wishlist/moveToBag',
  async (productId, { rejectWithValue }) => {
    try {
      const response = await wishlistApi.moveToCart(productId);
      const data = response.data || response;
      return data.wishlist || data.items || data;
    } catch (error) {
      return rejectWithValue(error.message || 'Failed to move to cart');
    }
  }
);

export const syncWishlist = fetchWishlist;
