import api from './api';

export const notificationApi = {
  getNotifications: (params = {}) =>
    api.get('/notifications', { params }),
  markAsRead: (notificationId) =>
    api.put(`/notifications/${notificationId}/read`),
  markAllAsRead: () =>
    api.put('/notifications/read-all'),
  deleteNotification: (notificationId) =>
    api.delete(`/notifications/${notificationId}`),
  clearAllNotifications: () =>
    api.delete('/notifications'),
  updatePreferences: (preferences) =>
    api.put('/notifications/preferences', preferences),
};

export default notificationApi;
