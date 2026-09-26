import { createAsyncThunk } from '@reduxjs/toolkit';
import adminApi from '../../api/adminApi';

export const fetchAdminDashboard = createAsyncThunk(
  'admin/fetchDashboard',
  async (_, { rejectWithValue }) => {
    try {
      const response = await adminApi.getAnalyticsOverview();
      const data = response.data || response;
      return data.overview || data.analytics || data;
    } catch (err) {
      return rejectWithValue(err.message || 'Failed to load dashboard data');
    }
  }
);

export const fetchAdminSellers = createAsyncThunk(
  'admin/fetchSellers',
  async (params = {}, { rejectWithValue }) => {
    try {
      const response = await adminApi.getSellerApplications(params);
      const data = response.data || response;
      return data.applications || data.sellers || (Array.isArray(data) ? data : []);
    } catch (err) {
      return rejectWithValue(err.message || 'Failed to load seller applications');
    }
  }
);

export const fetchAdminProducts = createAsyncThunk(
  'admin/fetchProducts',
  async (params = {}, { rejectWithValue }) => {
    try {
      const response = await adminApi.getProducts(params);
      const data = response.data || response;
      return data.products || (Array.isArray(data) ? data : []);
    } catch (err) {
      return rejectWithValue(err.message || 'Failed to load products');
    }
  }
);

export const fetchAdminCategories = createAsyncThunk(
  'admin/fetchCategories',
  async (_, { rejectWithValue }) => {
    try {
      const response = await adminApi.getCategories();
      const data = response.data || response;
      return data.categories || (Array.isArray(data) ? data : []);
    } catch (err) {
      return rejectWithValue(err.message || 'Failed to load categories');
    }
  }
);

export const fetchAdminSubcategories = createAsyncThunk(
  'admin/fetchSubcategories',
  async (params = {}, { rejectWithValue }) => {
    try {
      const response = await adminApi.getSubcategories(params);
      const data = response.data || response;
      return data.subcategories || (Array.isArray(data) ? data : []);
    } catch (err) {
      return rejectWithValue(err.message || 'Failed to load subcategories');
    }
  }
);

export const fetchAdminBrands = createAsyncThunk(
  'admin/fetchBrands',
  async (_, { rejectWithValue }) => {
    try {
      const response = await adminApi.getBrands();
      const data = response.data || response;
      return data.brands || (Array.isArray(data) ? data : []);
    } catch (err) {
      return rejectWithValue(err.message || 'Failed to load brands');
    }
  }
);

export const fetchAdminOrders = createAsyncThunk(
  'admin/fetchOrders',
  async (params = {}, { rejectWithValue }) => {
    try {
      const response = await adminApi.getOrders(params);
      const data = response.data || response;
      return data.orders || (Array.isArray(data) ? data : []);
    } catch (err) {
      return rejectWithValue(err.message || 'Failed to load orders');
    }
  }
);

export const fetchAdminPayments = createAsyncThunk(
  'admin/fetchPayments',
  async (params = {}, { rejectWithValue }) => {
    try {
      const response = await adminApi.getPayments(params);
      const data = response.data || response;
      return data.payments || (Array.isArray(data) ? data : []);
    } catch (err) {
      return rejectWithValue(err.message || 'Failed to load payments');
    }
  }
);

export const fetchAdminRefunds = createAsyncThunk(
  'admin/fetchRefunds',
  async (params = {}, { rejectWithValue }) => {
    try {
      const response = await adminApi.getRefunds(params);
      const data = response.data || response;
      return data.refunds || (Array.isArray(data) ? data : []);
    } catch (err) {
      return rejectWithValue(err.message || 'Failed to load refunds');
    }
  }
);

export const fetchAdminCommissions = createAsyncThunk(
  'admin/fetchCommissions',
  async (params = {}, { rejectWithValue }) => {
    try {
      const response = await adminApi.getCommissions(params);
      const data = response.data || response;
      return data.commissions || (Array.isArray(data) ? data : []);
    } catch (err) {
      return rejectWithValue(err.message || 'Failed to load commissions');
    }
  }
);

export const fetchAdminReviews = createAsyncThunk(
  'admin/fetchReviews',
  async (params = {}, { rejectWithValue }) => {
    try {
      const response = await adminApi.getReviews(params);
      const data = response.data || response;
      return data.reviews || (Array.isArray(data) ? data : []);
    } catch (err) {
      return rejectWithValue(err.message || 'Failed to load reviews');
    }
  }
);

export const fetchAdminCoupons = createAsyncThunk(
  'admin/fetchCoupons',
  async (params = {}, { rejectWithValue }) => {
    try {
      const response = await adminApi.getCoupons(params);
      const data = response.data || response;
      return data.coupons || (Array.isArray(data) ? data : []);
    } catch (err) {
      return rejectWithValue(err.message || 'Failed to load coupons');
    }
  }
);

export const fetchAdminSettings = createAsyncThunk(
  'admin/fetchSettings',
  async (_, { rejectWithValue }) => {
    try {
      const response = await adminApi.getSettings();
      const data = response.data || response;
      return data.settings || data;
    } catch (err) {
      return rejectWithValue(err.message || 'Failed to load settings');
    }
  }
);
