import { createSlice } from '@reduxjs/toolkit';
import {
  fetchNotifications,
  fetchUnreadNotificationCount,
  markNotificationReadThunk,
  markAllNotificationsReadThunk,
} from './notificationThunk';

const initialState = {
  items: [],
  unreadCount: 0,
  pagination: null,
  filterType: 'all',
  loading: false,
  error: null,
};

export const notificationSlice = createSlice({
  name: 'notifications',
  initialState,
  reducers: {
    addNotification: (state, action) => {
      const newNotif = {
        _id: action.payload._id || action.payload.id || `notif-${Date.now()}`,
        id: action.payload._id || action.payload.id || `notif-${Date.now()}`,
        isRead: false,
        createdAt: new Date().toISOString(),
        ...action.payload,
      };
      state.items.unshift(newNotif);
      state.unreadCount += 1;
    },
    markAsRead: (state, action) => {
      const id = action.payload;
      const notif = state.items.find((item) => (item._id || item.id) === id);
      if (notif && !notif.isRead) {
        notif.isRead = true;
        if (state.unreadCount > 0) state.unreadCount -= 1;
      }
    },
    markAllAsRead: (state) => {
      state.items.forEach((item) => {
        item.isRead = true;
      });
      state.unreadCount = 0;
    },
    removeNotification: (state, action) => {
      state.items = state.items.filter(
        (item) => (item._id || item.id) !== action.payload
      );
    },
    clearAllNotifications: (state) => {
      state.items = [];
      state.unreadCount = 0;
    },
    setFilterType: (state, action) => {
      state.filterType = action.payload;
    },
  },
  extraReducers: (builder) => {
    builder
      // Fetch Notifications
      .addCase(fetchNotifications.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchNotifications.fulfilled, (state, action) => {
        state.loading = false;
        if (Array.isArray(action.payload)) {
          state.items = action.payload;
        } else if (action.payload?.notifications) {
          state.items = action.payload.notifications;
          state.pagination = action.payload.pagination;
        }
        state.unreadCount = state.items.filter((item) => !item.isRead).length;
      })
      .addCase(fetchNotifications.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      // Unread Count
      .addCase(fetchUnreadNotificationCount.fulfilled, (state, action) => {
        state.unreadCount = typeof action.payload === 'number' ? action.payload : state.unreadCount;
      })
      // Mark Read
      .addCase(markNotificationReadThunk.fulfilled, (state, action) => {
        const id = action.payload._id || action.payload.id;
        const notif = state.items.find((item) => (item._id || item.id) === id);
        if (notif && !notif.isRead) {
          notif.isRead = true;
          if (state.unreadCount > 0) state.unreadCount -= 1;
        }
      })
      // Mark All Read
      .addCase(markAllNotificationsReadThunk.fulfilled, (state) => {
        state.items.forEach((item) => {
          item.isRead = true;
        });
        state.unreadCount = 0;
      });
  },
});

export const {
  addNotification,
  markAsRead,
  markAllAsRead,
  removeNotification,
  clearAllNotifications,
  setFilterType,
} = notificationSlice.actions;

export default notificationSlice.reducer;
