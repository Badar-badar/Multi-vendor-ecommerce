import { useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { Link } from 'react-router-dom';
import {
  Bell,
  Package,
  CreditCard,
  Truck,
  RotateCcw,
  Sparkles,
  Heart,
  Tag,
  Store,
  ShieldCheck,
  Trash2,
  Mail,
  Smartphone,
  Check,
  ChevronRight,
} from 'lucide-react';
import toast from 'react-hot-toast';
import {
  selectFilteredNotifications,
  selectUnreadNotificationsCount,
  selectNotificationFilterType,
} from '../../features/notifications/notificationSelectors';
import {
  markAsRead,
  markAllAsRead,
  removeNotification,
  clearAllNotifications,
  setFilterType,
} from '../../features/notifications/notificationSlice';
import AccountLayout from '../../components/account/AccountLayout';
import Button from '../../components/common/Button';

export const AccountNotificationsPage = () => {
  const dispatch = useDispatch();
  const notifications = useSelector(selectFilteredNotifications) || [];
  const unreadCount = useSelector(selectUnreadNotificationsCount) || 0;
  const currentFilter = useSelector(selectNotificationFilterType) || 'all';

  // Channel toggles
  const [channels, setChannels] = useState({
    email: true,
    sms: true,
    push: false,
  });

  const filterCategories = [
    { key: 'all', label: 'All Intel' },
    { key: 'unread', label: `Unread (${unreadCount})` },
    { key: 'order', label: 'Orders' },
    { key: 'payment', label: 'Payments' },
    { key: 'shipping', label: 'Transit' },
    { key: 'refund', label: 'Refunds' },
    { key: 'coupon', label: 'VIP Privileges' },
    { key: 'wishlist', label: 'Wishlist' },
    { key: 'system', label: 'Security' },
  ];

  const handleMarkAsRead = (id) => {
    dispatch(markAsRead(id));
    toast.success('Notification marked as read.');
  };

  const handleMarkAllRead = () => {
    dispatch(markAllAsRead());
    toast.success('All notifications marked as read.');
  };

  const handleRemove = (id) => {
    dispatch(removeNotification(id));
    toast.success('Notification removed.');
  };

  const handleClearAll = () => {
    dispatch(clearAllNotifications());
    toast.success('Notification inbox cleared.');
  };

  const getNotifIcon = (type) => {
    switch (type) {
      case 'order':
        return <Package className="w-4 h-4 text-accent" />;
      case 'payment':
        return <CreditCard className="w-4 h-4 text-emerald-600" />;
      case 'shipping':
        return <Truck className="w-4 h-4 text-blue-600" />;
      case 'refund':
        return <RotateCcw className="w-4 h-4 text-amber-600" />;
      case 'product':
        return <Sparkles className="w-4 h-4 text-purple-600" />;
      case 'wishlist':
        return <Heart className="w-4 h-4 text-rose-500" />;
      case 'coupon':
        return <Tag className="w-4 h-4 text-accent" />;
      case 'seller':
        return <Store className="w-4 h-4 text-indigo-600" />;
      case 'system':
      default:
        return <ShieldCheck className="w-4 h-4 text-emerald-600" />;
    }
  };

  return (
    <AccountLayout>
      <div className="space-y-6">
        {/* Header Title & Actions */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-border">
          <div>
            <h2 className="font-serif font-bold text-xl text-text-main flex items-center gap-2">
              Sovereign Notification Center
              {unreadCount > 0 && (
                <span className="px-2 py-0.5 rounded-full text-xs font-bold bg-accent/20 text-accent">
                  {unreadCount} Unread
                </span>
              )}
            </h2>
            <p className="text-xs text-text-muted">
              Live updates regarding transit milestones, concierge advisories, and private releases.
            </p>
          </div>

          <div className="flex items-center gap-2">
            {unreadCount > 0 && (
              <Button
                type="button"
                variant="secondary"
                size="sm"
                onClick={handleMarkAllRead}
                leftIcon={Check}
              >
                Mark All as Read
              </Button>
            )}
            {notifications.length > 0 && (
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={handleClearAll}
                leftIcon={Trash2}
              >
                Clear All
              </Button>
            )}
          </div>
        </div>

        {/* Filter Categories Tabs */}
        <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-none">
          {filterCategories.map((cat) => {
            const isActive = currentFilter === cat.key;
            return (
              <button
                key={cat.key}
                type="button"
                onClick={() => dispatch(setFilterType(cat.key))}
                className={`px-3 py-1.5 rounded-xl text-xs font-semibold whitespace-nowrap transition-all cursor-pointer border ${
                  isActive
                    ? 'bg-primary text-white border-primary shadow-xs'
                    : 'bg-surface text-text-muted border-border hover:text-text-main hover:bg-surface-muted'
                }`}
              >
                {cat.label}
              </button>
            );
          })}
        </div>

        {/* Notifications List */}
        {notifications.length === 0 ? (
          <div className="bg-surface rounded-2xl border border-border p-12 text-center space-y-3 shadow-subtle">
            <div className="w-12 h-12 rounded-2xl bg-surface-muted border border-border flex items-center justify-center mx-auto text-text-muted">
              <Bell className="w-6 h-6" />
            </div>
            <h3 className="font-serif font-bold text-base text-text-main">
              No notifications in this category
            </h3>
            <p className="text-xs text-text-muted max-w-sm mx-auto">
              You are completely up to date. You will receive notifications when order milestones update or VIP privileges arrive.
            </p>
          </div>
        ) : (
          <div className="space-y-3">
            {notifications.map((notif) => (
              <div
                key={notif.id}
                className={`p-4 sm:p-5 rounded-2xl border transition-all flex items-start justify-between gap-4 ${
                  notif.isRead
                    ? 'bg-surface border-border'
                    : 'bg-surface border-accent/40 ring-1 ring-accent/10 shadow-xs'
                }`}
              >
                <div className="flex items-start gap-3.5 min-w-0">
                  <div className="w-9 h-9 rounded-xl bg-surface-muted border border-border flex items-center justify-center shrink-0 mt-0.5">
                    {getNotifIcon(notif.type)}
                  </div>

                  <div className="space-y-1 min-w-0">
                    <div className="flex items-center gap-2">
                      <h4 className="font-serif font-bold text-xs sm:text-sm text-text-main truncate">
                        {notif.title}
                      </h4>
                      {!notif.isRead && (
                        <span className="w-2 h-2 rounded-full bg-accent shrink-0 animate-pulse" />
                      )}
                    </div>
                    <p className="text-xs text-text-muted leading-relaxed">
                      {notif.message}
                    </p>
                    <div className="flex items-center gap-3 pt-1 text-[10px] text-text-subtle">
                      <span>{new Date(notif.createdAt).toLocaleString()}</span>
                      {notif.link && (
                        <Link
                          to={notif.link}
                          className="font-semibold text-accent hover:underline flex items-center gap-0.5"
                        >
                          View Details <ChevronRight className="w-3 h-3" />
                        </Link>
                      )}
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-2 shrink-0">
                  {!notif.isRead && (
                    <button
                      type="button"
                      onClick={() => handleMarkAsRead(notif.id)}
                      className="text-xs font-semibold text-accent hover:underline cursor-pointer px-2 py-1"
                    >
                      Mark Read
                    </button>
                  )}
                  <button
                    type="button"
                    onClick={() => handleRemove(notif.id)}
                    className="p-1.5 text-text-muted hover:text-rose-600 hover:bg-rose-50 rounded-lg transition-colors cursor-pointer"
                    title="Remove notification"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Channel Preferences Card */}
        <div className="bg-surface rounded-2xl border border-border p-6 space-y-4 shadow-subtle">
          <div className="pb-2 border-b border-border">
            <h3 className="font-serif font-bold text-sm text-text-main">
              Delivery Channels & Alert Preferences
            </h3>
            <p className="text-xs text-text-muted">
              Configure how you wish to receive real-time cryptographic status notifications.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs">
            <div className="p-3 bg-surface-muted rounded-xl border border-border space-y-2">
              <div className="flex items-center justify-between">
                <span className="font-semibold text-text-main flex items-center gap-1.5">
                  <Mail className="w-3.5 h-3.5 text-accent" /> Email Dispatch
                </span>
                <input
                  type="checkbox"
                  checked={channels.email}
                  onChange={(e) => setChannels({ ...channels, email: e.target.checked })}
                  className="rounded border-border text-primary focus:ring-0 cursor-pointer"
                />
              </div>
              <p className="text-[11px] text-text-muted">
                Official invoices & tracking summaries sent to registered email.
              </p>
            </div>

            <div className="p-3 bg-surface-muted rounded-xl border border-border space-y-2">
              <div className="flex items-center justify-between">
                <span className="font-semibold text-text-main flex items-center gap-1.5">
                  <Smartphone className="w-3.5 h-3.5 text-accent" /> SMS Dispatch
                </span>
                <input
                  type="checkbox"
                  checked={channels.sms}
                  onChange={(e) => setChannels({ ...channels, sms: e.target.checked })}
                  className="rounded border-border text-primary focus:ring-0 cursor-pointer"
                />
              </div>
              <p className="text-[11px] text-text-muted">
                Immediate courier delivery alerts to telephone coordinates.
              </p>
            </div>

            <div className="p-3 bg-surface-muted rounded-xl border border-border space-y-2">
              <div className="flex items-center justify-between">
                <span className="font-semibold text-text-main flex items-center gap-1.5">
                  <Bell className="w-3.5 h-3.5 text-accent" /> Browser Push
                </span>
                <input
                  type="checkbox"
                  checked={channels.push}
                  onChange={(e) => setChannels({ ...channels, push: e.target.checked })}
                  className="rounded border-border text-primary focus:ring-0 cursor-pointer"
                />
              </div>
              <p className="text-[11px] text-text-muted">
                Desktop alerts for flash atelier drops and private invitations.
              </p>
            </div>
          </div>
        </div>
      </div>
    </AccountLayout>
  );
};

export default AccountNotificationsPage;
