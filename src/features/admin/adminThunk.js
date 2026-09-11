import { createAsyncThunk } from '@reduxjs/toolkit';
import adminApi from '../../api/adminApi';

export const fetchAdminDashboard = createAsyncThunk(
  'admin/fetchDashboard',
  async (_, { rejectWithValue }) => {
    try {
      const response = await adminApi.getDashboard();
      return response.data?.data || response.data;
    } catch (err) {
      return rejectWithValue(err.response?.data?.message || 'Failed to load dashboard data');
    }
  }
);

export const fetchAdminUsers = createAsyncThunk(
  'admin/fetchUsers',
  async (params, { rejectWithValue }) => {
    try {
      const response = await adminApi.getUsers(params);
      return response.data?.data || response.data;
    } catch (err) {
      return rejectWithValue(err.response?.data?.message || 'Failed to load users');
    }
  }
);

export const fetchAdminSellers = createAsyncThunk(
  'admin/fetchSellers',
  async (params, { rejectWithValue }) => {
    try {
      const response = await adminApi.getSellers(params);
      return response.data?.data || response.data;
    } catch (err) {
      return rejectWithValue(err.response?.data?.message || 'Failed to load sellers');
    }
  }
);

export const fetchAdminProducts = createAsyncThunk(
  'admin/fetchProducts',
  async (params, { rejectWithValue }) => {
    try {
      const response = await adminApi.getProducts(params);
      return response.data?.data || response.data;
    } catch (err) {
      return rejectWithValue(err.response?.data?.message || 'Failed to load products');
    }
  }
);

export const fetchAdminCategories = createAsyncThunk(
  'admin/fetchCategories',
  async (_, { rejectWithValue }) => {
    try {
      const response = await adminApi.getCategories();
      return response.data?.data || response.data;
    } catch (err) {
      return rejectWithValue(err.response?.data?.message || 'Failed to load categories');
    }
  }
);

export const fetchAdminOrders = createAsyncThunk(
  'admin/fetchOrders',
  async (params, { rejectWithValue }) => {
    try {
      const response = await adminApi.getOrders(params);
      return response.data?.data || response.data;
    } catch (err) {
      return rejectWithValue(err.response?.data?.message || 'Failed to load orders');
    }
  }
);

export const fetchAdminPayments = createAsyncThunk(
  'admin/fetchPayments',
  async (params, { rejectWithValue }) => {
    try {
      const response = await adminApi.getPayments(params);
      return response.data?.data || response.data;
    } catch (err) {
      return rejectWithValue(err.response?.data?.message || 'Failed to load payments');
    }
  }
);

export const fetchAdminCommissions = createAsyncThunk(
  'admin/fetchCommissions',
  async (params, { rejectWithValue }) => {
    try {
      const response = await adminApi.getCommissions(params);
      return response.data?.data || response.data;
    } catch (err) {
      return rejectWithValue(err.response?.data?.message || 'Failed to load commissions');
    }
  }
);

export const fetchAdminReviews = createAsyncThunk(
  'admin/fetchReviews',
  async (params, { rejectWithValue }) => {
    try {
      const response = await adminApi.getReviews(params);
      return response.data?.data || response.data;
    } catch (err) {
      return rejectWithValue(err.response?.data?.message || 'Failed to load reviews');
    }
  }
);

export const fetchAdminCoupons = createAsyncThunk(
  'admin/fetchCoupons',
  async (_, { rejectWithValue }) => {
    try {
      const response = await adminApi.getCoupons();
      return response.data?.data || response.data;
    } catch (err) {
      return rejectWithValue(err.response?.data?.message || 'Failed to load coupons');
    }
  }
);

export const fetchAdminAuditLogs = createAsyncThunk(
  'admin/fetchAuditLogs',
  async (params, { rejectWithValue }) => {
    try {
      const response = await adminApi.getAuditLogs(params);
      return response.data?.data || response.data;
    } catch (err) {
      return rejectWithValue(err.response?.data?.message || 'Failed to load audit logs');
    }
  }
);

export const fetchAdminSettings = createAsyncThunk(
  'admin/fetchSettings',
  async (_, { rejectWithValue }) => {
    try {
      const response = await adminApi.getSettings();
      return response.data?.data || response.data;
    } catch (err) {
      return rejectWithValue(err.response?.data?.message || 'Failed to load settings');
    }
  }
);
