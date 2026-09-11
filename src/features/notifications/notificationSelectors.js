import { createSelector } from '@reduxjs/toolkit';

export const selectNotificationsState = (state) => state.notifications;

export const selectNotifications = (state) => state.notifications?.items || [];

export const selectNotificationLoading = (state) => state.notifications?.loading || false;

export const selectNotificationError = (state) => state.notifications?.error || null;

export const selectNotificationFilterType = (state) => state.notifications?.filterType || 'all';

export const selectUnreadNotificationsCount = createSelector(
  [selectNotifications],
  (items) => items.filter((item) => !item.isRead).length
);

export const selectFilteredNotifications = createSelector(
  [selectNotifications, selectNotificationFilterType],
  (items, filterType) => {
    if (!filterType || filterType === 'all') return items;
    if (filterType === 'unread') return items.filter((item) => !item.isRead);
    return items.filter((item) => item.type === filterType);
  }
);
