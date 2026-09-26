import { createAsyncThunk } from '@reduxjs/toolkit';
import notificationApi from '../../api/notificationApi';

export const fetchNotifications = createAsyncThunk(
  'notifications/fetchNotifications',
  async (params, { rejectWithValue }) => {
    try {
      const response = await notificationApi.getNotifications(params);
      return response; // { notifications: [...], pagination: {...} }
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || error.message || 'Failed to fetch notifications');
    }
  }
);

export const fetchUnreadNotificationCount = createAsyncThunk(
  'notifications/fetchUnreadCount',
  async (_, { rejectWithValue }) => {
    try {
      const response = await notificationApi.getUnreadCount();
      return response.unreadCount;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || error.message);
    }
  }
);

export const markNotificationReadThunk = createAsyncThunk(
  'notifications/markRead',
  async (id, { rejectWithValue }) => {
    try {
      const response = await notificationApi.markAsRead(id);
      return response.notification || { _id: id, isRead: true };
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || error.message);
    }
  }
);

export const markAllNotificationsReadThunk = createAsyncThunk(
  'notifications/markAllRead',
  async (_, { rejectWithValue }) => {
    try {
      await notificationApi.markAllAsRead();
      return true;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || error.message);
    }
  }
);
