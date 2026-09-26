import { createSlice } from '@reduxjs/toolkit';
import {
  fetchAddresses,
  addAddress,
  updateAddress,
  deleteAddress,
  setDefaultAddressThunk,
} from './addressThunk';

const initialState = {
  addresses: [],
  loading: false,
  error: null,
};

export const addressSlice = createSlice({
  name: 'addresses',
  initialState,
  reducers: {
    clearAddressError: (state) => {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchAddresses.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchAddresses.fulfilled, (state, action) => {
        state.loading = false;
        state.addresses = Array.isArray(action.payload) ? action.payload : [];
      })
      .addCase(fetchAddresses.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(addAddress.fulfilled, (state, action) => {
        if (action.payload) {
          if (action.payload.isDefault) {
            state.addresses.forEach((a) => (a.isDefault = false));
          }
          state.addresses.push(action.payload);
        }
      })
      .addCase(updateAddress.fulfilled, (state, action) => {
        if (action.payload) {
          const idx = state.addresses.findIndex((a) => (a._id || a.id) === (action.payload._id || action.payload.id));
          if (idx !== -1) {
            if (action.payload.isDefault) {
              state.addresses.forEach((a) => (a.isDefault = false));
            }
            state.addresses[idx] = action.payload;
          }
        }
      })
      .addCase(deleteAddress.fulfilled, (state, action) => {
        state.addresses = state.addresses.filter((a) => (a._id || a.id) !== action.payload);
      })
      .addCase(setDefaultAddressThunk.fulfilled, (state, action) => {
        const id = typeof action.payload === 'object' ? (action.payload._id || action.payload.id) : action.payload;
        state.addresses.forEach((a) => {
          a.isDefault = (a._id || a.id) === id;
        });
      });
  },
});

export const { clearAddressError } = addressSlice.actions;

export default addressSlice.reducer;
