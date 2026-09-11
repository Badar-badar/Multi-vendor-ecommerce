import { createAsyncThunk } from '@reduxjs/toolkit';
import { checkoutApi } from '../../api';

export const validateCheckoutSessionThunk = createAsyncThunk(
  'checkout/validateSession',
  async (payload, { rejectWithValue }) => {
    try {
      const response = await checkoutApi.validateCheckoutSession(payload);
      return response.data?.data || response.data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || 'Checkout validation failed.'
      );
    }
  }
);

export const calculateCheckoutTotalsThunk = createAsyncThunk(
  'checkout/calculateTotals',
  async (payload, { rejectWithValue }) => {
    try {
      const response = await checkoutApi.calculateCheckoutTotals(payload);
      return response.data?.data || response.data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || 'Failed to calculate checkout totals.'
      );
    }
  }
);

export const checkStockAvailabilityThunk = createAsyncThunk(
  'checkout/checkStockAvailability',
  async (items, { rejectWithValue }) => {
    try {
      const response = await checkoutApi.checkStockAvailability(items);
      return response.data?.data || response.data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || 'Failed to verify inventory availability.'
      );
    }
  }
);

export const createCheckoutOrderThunk = createAsyncThunk(
  'checkout/createOrder',
  async ({ orderData, idempotencyKey }, { rejectWithValue }) => {
    try {
      const response = await checkoutApi.createCheckoutOrder(orderData, idempotencyKey);
      return response.data?.data || response.data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || 'Failed to finalize order.'
      );
    }
  }
);
