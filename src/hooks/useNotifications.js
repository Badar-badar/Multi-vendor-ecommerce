import { useCallback, useMemo } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import {
  selectNotifications,
  selectUnreadCount,
  selectNotificationFilter,
  selectNotificationsLoading,
} from '../features/notifications/notificationSelectors';
import {
  markAsRead,
  markAllAsRead,
  addNotification,
  removeNotification,
  clearAllNotifications,
  setFilterType,
} from '../features/notifications/notificationSlice';
import toast from 'react-hot-toast';

export const useNotifications = () => {
  const dispatch = useDispatch();

  const allNotifications = useSelector(selectNotifications);
  const unreadCount = useSelector(selectUnreadCount);
  const filterType = useSelector(selectNotificationFilter);
  const loading = useSelector(selectNotificationsLoading);

  const filteredNotifications = useMemo(() => {
    if (filterType === 'all') return allNotifications;
    if (filterType === 'unread') return allNotifications.filter((n) => !n.isRead);
    return allNotifications.filter((n) => n.type === filterType);
  }, [allNotifications, filterType]);

  const markRead = useCallback(
    (id) => {
      dispatch(markAsRead(id));
    },
    [dispatch]
  );

  const markAllRead = useCallback(() => {
    dispatch(markAllAsRead());
    toast.success('All notifications marked as read.');
  }, [dispatch]);

  const removeNotif = useCallback(
    (id) => {
      dispatch(removeNotification(id));
      toast.success('Notification removed.');
    },
    [dispatch]
  );

  const clearAll = useCallback(() => {
    dispatch(clearAllNotifications());
    toast.success('Notification inbox cleared.');
  }, [dispatch]);

  const setFilter = useCallback(
    (type) => {
      dispatch(setFilterType(type));
    },
    [dispatch]
  );

  /**
   * Realtime Event Ingestion Architecture
   * When Socket.IO is initialized on the backend, incoming events can call dispatchNewNotification
   */
  const dispatchNewNotification = useCallback(
    (notificationPayload) => {
      dispatch(addNotification(notificationPayload));
      toast((t) => (
        <div className="flex items-center gap-2 text-xs">
          <span className="font-serif font-bold text-accent">Zareen Alert:</span>
          <span>{notificationPayload.title}</span>
        </div>
      ));
    },
    [dispatch]
  );

  return {
    notifications: filteredNotifications,
    allNotifications,
    unreadCount,
    filterType,
    loading,
    markRead,
    markAllRead,
    removeNotif,
    clearAll,
    setFilter,
    dispatchNewNotification,
  };
};

export default useNotifications;
