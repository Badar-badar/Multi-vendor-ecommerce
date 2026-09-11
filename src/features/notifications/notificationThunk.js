import { createAsyncThunk } from '@reduxjs/toolkit';
import notificationApi from '../../api/notificationApi';

export const fetchNotifications = createAsyncThunk(
  'notifications/fetchNotifications',
  async (_, { rejectWithValue }) => {
    try {
      const response = await notificationApi.getNotifications();
      return response.notifications;
    } catch (error) {
      return rejectWithValue(error.message || 'Failed to fetch notifications');
    }
  }
);
