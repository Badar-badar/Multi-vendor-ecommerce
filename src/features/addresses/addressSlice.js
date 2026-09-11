import { createSlice } from '@reduxjs/toolkit';
import {
  fetchAddresses,
  addAddress,
  updateAddress,
  deleteAddress,
} from './addressThunk';

const INITIAL_ADDRESSES = [
  {
    id: 'addr-1',
    label: 'Primary Penthouse Residence',
    fullName: 'Sarah Jenkins',
    phone: '+1 (555) 019-2834',
    addressLine1: '740 Park Avenue, Penthouse 14B',
    addressLine2: 'Upper East Side',
    city: 'New York',
    state: 'NY',
    postalCode: '10021',
    country: 'United States',
    isDefaultShipping: true,
    isDefaultBilling: true,
  },
  {
    id: 'addr-2',
    label: 'Beverly Hills Villa Estate',
    fullName: 'Sarah Jenkins',
    phone: '+1 (555) 839-1120',
    addressLine1: '102 Rodeo Drive, Villa 4',
    addressLine2: '',
    city: 'Beverly Hills',
    state: 'CA',
    postalCode: '90210',
    country: 'United States',
    isDefaultShipping: false,
    isDefaultBilling: false,
  },
];

const initialState = {
  addresses: INITIAL_ADDRESSES,
  loading: false,
  error: null,
};

export const addressSlice = createSlice({
  name: 'addresses',
  initialState,
  reducers: {
    addAddressLocal: (state, action) => {
      const newAddress = {
        id: `addr-${Date.now()}`,
        ...action.payload,
      };
      if (newAddress.isDefaultShipping) {
        state.addresses.forEach((a) => (a.isDefaultShipping = false));
      }
      if (newAddress.isDefaultBilling) {
        state.addresses.forEach((a) => (a.isDefaultBilling = false));
      }
      state.addresses.push(newAddress);
    },
    updateAddressLocal: (state, action) => {
      const { id, data } = action.payload;
      const index = state.addresses.findIndex((a) => a.id === id);
      if (index > -1) {
        if (data.isDefaultShipping) {
          state.addresses.forEach((a) => (a.isDefaultShipping = false));
        }
        if (data.isDefaultBilling) {
          state.addresses.forEach((a) => (a.isDefaultBilling = false));
        }
        state.addresses[index] = { ...state.addresses[index], ...data };
      }
    },
    deleteAddressLocal: (state, action) => {
      state.addresses = state.addresses.filter((a) => a.id !== action.payload);
    },
    setDefaultShippingLocal: (state, action) => {
      const id = action.payload;
      state.addresses.forEach((a) => {
        a.isDefaultShipping = a.id === id;
      });
    },
    setDefaultBillingLocal: (state, action) => {
      const id = action.payload;
      state.addresses.forEach((a) => {
        a.isDefaultBilling = a.id === id;
      });
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchAddresses.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchAddresses.fulfilled, (state, action) => {
        state.loading = false;
        if (Array.isArray(action.payload) && action.payload.length > 0) {
          state.addresses = action.payload;
        }
      })
      .addCase(fetchAddresses.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(addAddress.fulfilled, (state, action) => {
        if (action.payload) {
          state.addresses.push(action.payload);
        }
      })
      .addCase(deleteAddress.fulfilled, (state, action) => {
        state.addresses = state.addresses.filter((a) => a.id !== action.payload);
      });
  },
});

export const {
  addAddressLocal,
  updateAddressLocal,
  deleteAddressLocal,
  setDefaultShippingLocal,
  setDefaultBillingLocal,
} = addressSlice.actions;

export default addressSlice.reducer;
