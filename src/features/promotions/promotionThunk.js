import { createAsyncThunk } from '@reduxjs/toolkit';
import promotionApi from '../../api/promotionApi';

export const fetchActivePromotions = createAsyncThunk(
  'promotions/fetchActivePromotions',
  async (params = {}, { rejectWithValue }) => {
    try {
      const response = await promotionApi.getActivePromotions(params);
      return response;
    } catch (error) {
      return rejectWithValue(error.message || 'Failed to fetch active promotions.');
    }
  }
);

export const fetchAdminPromotions = createAsyncThunk(
  'promotions/fetchAdminPromotions',
  async (params = {}, { rejectWithValue }) => {
    try {
      const response = await promotionApi.getAdminPromotions(params);
      return response;
    } catch (error) {
      return rejectWithValue(error.message || 'Failed to fetch admin promotions.');
    }
  }
);
