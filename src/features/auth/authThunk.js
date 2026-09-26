import { createAsyncThunk } from '@reduxjs/toolkit';
import authApi from '../../api/authApi';

export const loginUser = createAsyncThunk(
  'auth/login',
  async (credentials, { rejectWithValue }) => {
    try {
      const response = await authApi.login(credentials);
      return response.data?.user || response.user || response;
    } catch (error) {
      return rejectWithValue(error.message || 'Authentication failed');
    }
  }
);

export const registerUser = createAsyncThunk(
  'auth/register',
  async (userData, { rejectWithValue }) => {
    try {
      const response = await authApi.register(userData);
      return response.data?.user || response.user || response;
    } catch (error) {
      return rejectWithValue(error.message || 'Registration failed');
    }
  }
);

export const fetchCurrentUser = createAsyncThunk(
  'auth/fetchCurrentUser',
  async (_, { rejectWithValue }) => {
    try {
      const response = await authApi.getCurrentUser();
      return response.data?.user || response.user;
    } catch (error) {
      return rejectWithValue(error.message || 'Session expired or unauthenticated');
    }
  }
);

export const verifyEmailUser = createAsyncThunk(
  'auth/verifyEmail',
  async (data, { rejectWithValue }) => {
    try {
      const response = await authApi.verifyEmail(data);
      return response;
    } catch (error) {
      return rejectWithValue(error.message || 'Email verification failed');
    }
  }
);

export const forgotPasswordUser = createAsyncThunk(
  'auth/forgotPassword',
  async (data, { rejectWithValue }) => {
    try {
      const response = await authApi.forgotPassword(data);
      return response;
    } catch (error) {
      return rejectWithValue(error.message || 'Failed to dispatch password recovery');
    }
  }
);

export const resetPasswordUser = createAsyncThunk(
  'auth/resetPassword',
  async (data, { rejectWithValue }) => {
    try {
      const response = await authApi.resetPassword(data);
      return response;
    } catch (error) {
      return rejectWithValue(error.message || 'Failed to reset password');
    }
  }
);

export const updateProfileUser = createAsyncThunk(
  'auth/updateProfile',
  async (profileData, { rejectWithValue }) => {
    try {
      const response = await authApi.updateProfile(profileData);
      return response.data?.user || response.user;
    } catch (error) {
      return rejectWithValue(error.message || 'Failed to update profile');
    }
  }
);

export const googleAuthUser = createAsyncThunk(
  'auth/googleAuth',
  async (credentialData, { rejectWithValue }) => {
    try {
      const response = await authApi.googleAuth?.(credentialData);
      return response?.data?.user || response?.user || response;
    } catch (error) {
      return rejectWithValue(error.message || 'Google authentication failed');
    }
  }
);

export const logoutUser = createAsyncThunk(
  'auth/logout',
  async (_, { rejectWithValue }) => {
    try {
      await authApi.logout();
      return true;
    } catch (error) {
      return rejectWithValue(error.message || 'Logout failed');
    }
  }
);
