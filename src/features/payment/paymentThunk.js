import { createAsyncThunk } from '@reduxjs/toolkit';
import { paymentApi } from '../../api';

export const createPaymentIntentThunk = createAsyncThunk(
  'payment/createPaymentIntent',
  async (payload, { rejectWithValue }) => {
    try {
      const response = await paymentApi.createPaymentIntent(payload);
      return response.data?.data || response.data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || 'Failed to initialize payment session.'
      );
    }
  }
);

export const confirmPaymentThunk = createAsyncThunk(
  'payment/confirmPayment',
  async (payload, { rejectWithValue }) => {
    try {
      const response = await paymentApi.confirmPayment(payload);
      return response.data?.data || response.data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || 'Payment confirmation failed.'
      );
    }
  }
);

export const fetchPaymentStatusThunk = createAsyncThunk(
  'payment/fetchPaymentStatus',
  async (paymentIntentId, { rejectWithValue }) => {
    try {
      const response = await paymentApi.getPaymentStatus(paymentIntentId);
      return response.data?.data || response.data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || 'Failed to retrieve payment status.'
      );
    }
  }
);

export const fetchCustomerPaymentsThunk = createAsyncThunk(
  'payment/fetchCustomerPayments',
  async (params, { rejectWithValue }) => {
    try {
      const response = await paymentApi.getCustomerPayments(params);
      return response.data?.data || response.data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || 'Failed to load customer payment history.'
      );
    }
  }
);

export const fetchAdminPaymentsThunk = createAsyncThunk(
  'payment/fetchAdminPayments',
  async (params, { rejectWithValue }) => {
    try {
      const response = await paymentApi.getAdminPayments(params);
      return response.data?.data || response.data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || 'Failed to load payment transactions.'
      );
    }
  }
);
