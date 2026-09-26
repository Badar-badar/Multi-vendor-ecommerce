import { createAsyncThunk } from '@reduxjs/toolkit';
import addressApi from '../../api/addressApi';

export const fetchAddresses = createAsyncThunk(
  'addresses/fetchAddresses',
  async (_, { rejectWithValue }) => {
    try {
      const response = await addressApi.getAddresses();
      const data = response.data || response;
      return data.addresses || (Array.isArray(data) ? data : []);
    } catch (error) {
      return rejectWithValue(error.message || 'Failed to fetch saved addresses.');
    }
  }
);

export const addAddress = createAsyncThunk(
  'addresses/addAddress',
  async (addressData, { rejectWithValue }) => {
    try {
      const response = await addressApi.createAddress(addressData);
      const data = response.data || response;
      return data.address || data;
    } catch (error) {
      return rejectWithValue(error.message || 'Failed to add address.');
    }
  }
);

export const updateAddress = createAsyncThunk(
  'addresses/updateAddress',
  async ({ id, data: addressData }, { rejectWithValue }) => {
    try {
      const response = await addressApi.updateAddress(id, addressData);
      const data = response.data || response;
      return data.address || data;
    } catch (error) {
      return rejectWithValue(error.message || 'Failed to update address.');
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
      return rejectWithValue(error.message || 'Failed to delete address.');
    }
  }
);

export const setDefaultAddressThunk = createAsyncThunk(
  'addresses/setDefault',
  async (id, { rejectWithValue }) => {
    try {
      const response = await addressApi.setDefaultAddress(id);
      const data = response.data || response;
      return data.address || id;
    } catch (error) {
      return rejectWithValue(error.message || 'Failed to set default address.');
    }
  }
);
