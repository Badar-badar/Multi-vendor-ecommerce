import { createAsyncThunk } from '@reduxjs/toolkit';
import { addressApi } from '../../api/addressApi';

export const fetchAddresses = createAsyncThunk(
  'addresses/fetchAddresses',
  async (_, { rejectWithValue }) => {
    try {
      const response = await addressApi.getAddresses();
      return response.data?.addresses || response.data || [];
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || 'Failed to fetch saved addresses.'
      );
    }
  }
);

export const addAddress = createAsyncThunk(
  'addresses/addAddress',
  async (addressData, { rejectWithValue }) => {
    try {
      const response = await addressApi.createAddress(addressData);
      return response.data?.address || response.data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || 'Failed to add address.'
      );
    }
  }
);

export const updateAddress = createAsyncThunk(
  'addresses/updateAddress',
  async ({ id, data }, { rejectWithValue }) => {
    try {
      const response = await addressApi.updateAddress(id, data);
      return response.data?.address || response.data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || 'Failed to update address.'
      );
    }
  }
);

export const deleteAddress = createAsyncThunk(
  'addresses/deleteAddress',
  async (id, { rejectWithValue }) => {
    try {
      await addressApi.deleteAddress(id);
      return id;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || 'Failed to delete address.'
      );
    }
  }
);
