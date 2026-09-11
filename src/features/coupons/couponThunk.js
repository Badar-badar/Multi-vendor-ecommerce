import { createAsyncThunk } from '@reduxjs/toolkit';
import couponApi from '../../api/couponApi';

export const fetchAvailableCoupons = createAsyncThunk(
  'coupons/fetchAvailableCoupons',
  async (_, { rejectWithValue }) => {
    try {
      const response = await couponApi.getAvailableCoupons();
      return response;
    } catch (error) {
      return rejectWithValue(error.message || 'Failed to fetch available coupons.');
    }
  }
);

export const validateCouponCode = createAsyncThunk(
  'coupons/validateCouponCode',
  async ({ code, cartTotal }, { rejectWithValue }) => {
    try {
      const response = await couponApi.validateCoupon(code, cartTotal);
      return response;
    } catch (error) {
      return rejectWithValue(error.message || 'Invalid promotional code.');
    }
  }
);

export const fetchSellerCoupons = createAsyncThunk(
  'coupons/fetchSellerCoupons',
  async (params = {}, { rejectWithValue }) => {
    try {
      const response = await couponApi.getSellerCoupons(params);
      return response;
    } catch (error) {
      return rejectWithValue(error.message || 'Failed to load atelier coupons.');
    }
  }
);

export const fetchAdminCoupons = createAsyncThunk(
  'coupons/fetchAdminCoupons',
  async (params = {}, { rejectWithValue }) => {
    try {
      const response = await couponApi.getAdminCoupons(params);
      return response;
    } catch (error) {
      return rejectWithValue(error.message || 'Failed to load platform coupons.');
    }
  }
);
