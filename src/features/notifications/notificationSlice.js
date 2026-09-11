import { createSlice } from '@reduxjs/toolkit';
import { fetchNotifications } from './notificationThunk';

const initialNotifications = [
  {
    id: 'notif-101',
    type: 'order',
    title: 'Order Dispatched with White-Glove Courier',
    message: 'Your order #ZRN-2026-9821 has been handed to DHL Express Insured Signature Service.',
    link: '/account/orders/ORD-9821',
    isRead: false,
    createdAt: new Date(Date.now() - 1000 * 60 * 25).toISOString(), // 25 mins ago
  },
  {
    id: 'notif-102',
    type: 'payment',
    title: 'Payment Confirmed via Stripe',
    message: 'Stripe transaction #ch_3N8eZp for $8,050.00 was authorized successfully.',
    link: '/account/orders/ORD-9821',
    isRead: false,
    createdAt: new Date(Date.now() - 1000 * 60 * 60 * 2).toISOString(), // 2 hours ago
  },
  {
    id: 'notif-103',
    type: 'coupon',
    title: 'Private VIP Salon Privilege Code',
    message: 'Use code "SOVEREIGN15" to enjoy 15% VIP appreciation on your next atelier commission.',
    link: '/products',
    isRead: false,
    createdAt: new Date(Date.now() - 1000 * 60 * 60 * 5).toISOString(), // 5 hours ago
  },
  {
    id: 'notif-104',
    type: 'wishlist',
    title: 'Low Stock Alert for Saved Piece',
    message: 'The "Aethelgard Tourbillon in Obsidian Dial" on your wishlist has only 2 pieces remaining.',
    link: '/wishlist',
    isRead: true,
    createdAt: new Date(Date.now() - 1000 * 60 * 60 * 24).toISOString(), // 1 day ago
  },
  {
    id: 'notif-105',
    type: 'shipping',
    title: 'Customs Clearance Approved',
    message: 'Swiss chronometry shipment #VSP-CH-8812 has completed UK import clearance without duty holds.',
    link: '/account/orders',
    isRead: true,
    createdAt: new Date(Date.now() - 1000 * 60 * 60 * 36).toISOString(),
  },
  {
    id: 'notif-106',
    type: 'refund',
    title: 'Credit Return Completed',
    message: 'Refund of $4,850.00 for order #ZRN-2026-9818 has been deposited to your original card.',
    link: '/account/orders',
    isRead: true,
    createdAt: new Date(Date.now() - 1000 * 60 * 60 * 48).toISOString(),
  },
  {
    id: 'notif-107',
    type: 'seller',
    title: 'New Collection by Atelier Maison',
    message: 'Jean-Luc Moreau has unveiled the Autumn/Winter Cashmere Tailoring collection.',
    link: '/products?brand=atelier-maison',
    isRead: true,
    createdAt: new Date(Date.now() - 1000 * 60 * 60 * 72).toISOString(),
  },
  {
    id: 'notif-108',
    type: 'system',
    title: 'Security Protocol Upgrade',
    message: 'Two-factor biometric authentication is now active for your Zareen account.',
    link: '/account/settings',
    isRead: true,
    createdAt: new Date(Date.now() - 1000 * 60 * 60 * 96).toISOString(),
  },
];

const initialState = {
  items: initialNotifications,
  filterType: 'all',
  loading: false,
  error: null,
};

export const notificationSlice = createSlice({
  name: 'notifications',
  initialState,
  reducers: {
    markAsRead: (state, action) => {
      const id = action.payload;
      const notif = state.items.find((item) => item.id === id);
      if (notif) notif.isRead = true;
    },
    markAllAsRead: (state) => {
      state.items.forEach((item) => {
        item.isRead = true;
      });
    },
    addNotification: (state, action) => {
      // Prepared for WebSocket events: payload = { id, type, title, message, link, createdAt }
      const newNotif = {
        id: action.payload.id || `notif-${Date.now()}`,
        isRead: false,
        createdAt: new Date().toISOString(),
        ...action.payload,
      };
      state.items.unshift(newNotif);
    },
    removeNotification: (state, action) => {
      state.items = state.items.filter((item) => item.id !== action.payload);
    },
    clearAllNotifications: (state) => {
      state.items = [];
    },
    setFilterType: (state, action) => {
      state.filterType = action.payload;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchNotifications.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchNotifications.fulfilled, (state, action) => {
        state.loading = false;
        state.items = action.payload;
      })
      .addCase(fetchNotifications.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export const {
  markAsRead,
  markAllAsRead,
  addNotification,
  removeNotification,
  clearAllNotifications,
  setFilterType,
} = notificationSlice.actions;

export default notificationSlice.reducer;
