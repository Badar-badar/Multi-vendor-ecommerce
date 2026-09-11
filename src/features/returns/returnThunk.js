import { createAsyncThunk } from '@reduxjs/toolkit';
import { returnApi } from '../../api/returnApi';

export const fetchMyReturns = createAsyncThunk(
  'returns/fetchMyReturns',
  async (params, { rejectWithValue }) => {
    try {
      const response = await returnApi.getMyReturns(params);
      return response.data?.returns || response.data || [];
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || 'Unable to synchronize returns registry.'
      );
    }
  }
);

export const createReturn = createAsyncThunk(
  'returns/createReturn',
  async (returnData, { rejectWithValue }) => {
    try {
      const response = await returnApi.createReturnRequest(returnData);
      return response.data?.returnRequest || response.data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || 'Failed to submit return request.'
      );
    }
  }
);

export const cancelReturn = createAsyncThunk(
  'returns/cancelReturn',
  async (returnId, { rejectWithValue }) => {
    try {
      const response = await returnApi.cancelReturnRequest(returnId);
      return response.data || { id: returnId };
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || 'Failed to cancel return request.'
      );
    }
  }
);

export const fetchSellerReturns = createAsyncThunk(
  'returns/fetchSellerReturns',
  async (params, { rejectWithValue }) => {
    try {
      const response = await returnApi.getSellerReturns(params);
      return response.data?.returns || response.data || [];
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || 'Unable to fetch atelier returns.'
      );
    }
  }
);
