import { createAsyncThunk } from '@reduxjs/toolkit';
import cartApi from '../../api/cartApi';

export const fetchCart = createAsyncThunk(
  'cart/fetchCart',
  async (_, { rejectWithValue }) => {
    try {
      const response = await cartApi.getCart();
      return response.data?.cart || response.cart || response.data || response;
    } catch (error) {
      return rejectWithValue(error.message || 'Failed to fetch shopping bag');
    }
  }
);

export const addToCartThunk = createAsyncThunk(
  'cart/addToCart',
  async (itemData, { rejectWithValue }) => {
    try {
      const response = await cartApi.addToCart(itemData);
      return response.data?.cart || response.cart || response.data || response;
    } catch (error) {
      return rejectWithValue(error.message || 'Failed to add item to bag');
    }
  }
);

export const updateCartQuantityThunk = createAsyncThunk(
  'cart/updateQuantity',
  async ({ itemId, quantity }, { rejectWithValue }) => {
    try {
      const response = await cartApi.updateCartItem(itemId, quantity);
      return response.data?.cart || response.cart || response.data || response;
    } catch (error) {
      return rejectWithValue(error.message || 'Failed to update quantity');
    }
  }
);

export const removeFromCartThunk = createAsyncThunk(
  'cart/removeFromCart',
  async (itemId, { rejectWithValue }) => {
    try {
      const response = await cartApi.removeFromCart(itemId);
      return response.data?.cart || response.cart || response.data || response;
    } catch (error) {
      return rejectWithValue(error.message || 'Failed to remove item');
    }
  }
);

export const clearCartThunk = createAsyncThunk(
  'cart/clearCart',
  async (_, { rejectWithValue }) => {
    try {
      const response = await cartApi.clearCart();
      return response.data?.cart || response.cart || response.data || response;
    } catch (error) {
      return rejectWithValue(error.message || 'Failed to clear bag');
    }
  }
);

export const syncCartWithBackend = fetchCart;
