import { useState, useMemo } from 'react';
import { Link } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import {
  Bell,
  CheckCircle2,
  Trash2,
  ShoppingCart,
  Boxes,
  RotateCcw,
  DollarSign,
  Store,
  ShieldCheck,
  ArrowRight,
  Sparkles,
} from 'lucide-react';
import toast from 'react-hot-toast';
import { selectSellerNotifications } from '../../features/seller/sellerSelectors';
import {
  markSellerNotificationRead,
  markAllSellerNotificationsRead,
  deleteSellerNotification,
} from '../../features/seller/sellerSlice';
import Button from '../../components/common/Button';
import Badge from '../../components/common/Badge';

const CATEGORY_FILTERS = ['All', 'Orders', 'Payments', 'Inventory', 'Returns', 'Store', 'System'];

const getCategoryIcon = (category) => {
  switch (category) {
    case 'Orders':
      return ShoppingCart;
    case 'Inventory':
      return Boxes;
    case 'Returns':
      return RotateCcw;
    case 'Payments':
      return DollarSign;
    case 'Store':
      return Store;
    default:
      return Bell;
  }
};

export const SellerNotificationsPage = () => {
  const dispatch = useDispatch();
  const notifications = useSelector(selectSellerNotifications) || [];

  const [activeCategory, setActiveCategory] = useState('All');

  const unreadCount = notifications.filter((n) => !n.isRead).length;

  const filteredNotifications = useMemo(() => {
    return notifications.filter((n) => {
      return activeCategory === 'All' || n.category?.toLowerCase() === activeCategory.toLowerCase();
    });
  }, [notifications, activeCategory]);

  const handleMarkAllRead = () => {
    dispatch(markAllSellerNotificationsRead());
    toast.success('All studio notifications marked as read.');
  };

  const handleMarkSingleRead = (id) => {
    dispatch(markSellerNotificationRead(id));
  };

  const handleDelete = (id) => {
    dispatch(deleteSellerNotification(id));
    toast.success('Notification cleared.');
  };

  return (
    <>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-border">
          <div>
            <div className="flex items-center gap-2">
              <h1 className="font-serif font-bold text-xl sm:text-2xl text-text-main">
                Studio Notifications
              </h1>
              {unreadCount > 0 && (
                <span className="px-2 py-0.5 rounded-full text-xs font-bold bg-primary text-white">
                  {unreadCount} unread
                </span>
              )}
            </div>
            <p className="text-xs text-text-muted">
              Live alerts on order acquisitions, low inventory thresholds, return files, and bi-weekly escrow payouts.
            </p>
          </div>

          {unreadCount > 0 && (
            <Button
              variant="outline"
              size="sm"
              leftIcon={CheckCircle2}
              onClick={handleMarkAllRead}
            >
              Mark All as Read
            </Button>
          )}
        </div>

        {/* Category Filters */}
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1">
          {CATEGORY_FILTERS.map((cat) => {
            const isSelected = activeCategory === cat;
            const count =
              cat === 'All'
                ? notifications.length
                : notifications.filter((n) => n.category?.toLowerCase() === cat.toLowerCase()).length;

            return (
              <button
                key={cat}
                type="button"
                onClick={() => setActiveCategory(cat)}
                className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition-all cursor-pointer shrink-0 flex items-center gap-1.5 ${
                  isSelected
                    ? 'bg-primary text-white shadow-xs'
                    : 'bg-surface hover:bg-surface-muted border border-border text-text-muted hover:text-text-main'
                }`}
              >
                <span>{cat}</span>
                <span
                  className={`text-[10px] px-1.5 py-0.2 rounded-full font-bold ${
                    isSelected ? 'bg-white/20 text-white' : 'bg-surface-muted text-text-subtle'
                  }`}
                >
                  {count}
                </span>
              </button>
            );
          })}
        </div>

        {/* Notifications List */}
        <div className="space-y-3">
          {filteredNotifications.length > 0 ? (
            filteredNotifications.map((notif) => {
              const Icon = getCategoryIcon(notif.category);

              return (
                <div
                  key={notif.id}
                  className={`p-4 sm:p-5 rounded-2xl border transition-all flex flex-col sm:flex-row sm:items-center justify-between gap-4 shadow-subtle ${
                    !notif.isRead
                      ? 'bg-surface border-border-strong ring-1 ring-primary/10'
                      : 'bg-surface/80 border-border opacity-85'
                  }`}
                >
                  <div className="flex items-start gap-3.5">
                    <div
                      className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 mt-0.5 ${
                        !notif.isRead
                          ? 'bg-primary text-white shadow-xs'
                          : 'bg-surface-muted text-text-muted border border-border'
                      }`}
                    >
                      <Icon className="w-5 h-5" />
                    </div>

                    <div className="space-y-1">
                      <div className="flex items-center gap-2">
                        <span className="font-bold text-xs sm:text-sm text-text-main">
                          {notif.title}
                        </span>
                        {!notif.isRead && (
                          <span className="w-2 h-2 rounded-full bg-accent animate-pulse" />
                        )}
                        <Badge variant="neutral" size="xs">
                          {notif.category}
                        </Badge>
                      </div>
                      <p className="text-xs text-text-muted leading-relaxed max-w-2xl">
                        {notif.message}
                      </p>
                      <span className="text-[10px] text-text-subtle font-mono block">
                        {notif.timestamp} • {notif.date}
                      </span>
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="flex items-center gap-2 self-end sm:self-center shrink-0">
                    {notif.link && (
                      <Link
                        to={notif.link}
                        onClick={() => handleMarkSingleRead(notif.id)}
                        className="inline-flex items-center gap-1 px-3 py-1.5 rounded-lg bg-surface border border-border hover:bg-surface-muted text-xs font-semibold text-text-main transition-colors"
                      >
                        <span>View</span>
                        <ArrowRight className="w-3.5 h-3.5 text-accent" />
                      </Link>
                    )}

                    {!notif.isRead && (
                      <button
                        type="button"
                        onClick={() => handleMarkSingleRead(notif.id)}
                        className="p-1.5 rounded-lg text-text-muted hover:text-text-main hover:bg-surface-muted transition-colors cursor-pointer"
                        title="Mark as read"
                      >
                        <CheckCircle2 className="w-4 h-4" />
                      </button>
                    )}

                    <button
                      type="button"
                      onClick={() => handleDelete(notif.id)}
                      className="p-1.5 rounded-lg text-text-muted hover:text-rose-600 hover:bg-rose-50 transition-colors cursor-pointer"
                      title="Clear notification"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              );
            })
          ) : (
            <div className="py-16 text-center text-xs text-text-muted bg-surface rounded-2xl border border-border space-y-2">
              <Bell className="w-8 h-8 text-text-muted mx-auto opacity-50" />
              <p className="font-medium">No notifications found in this category.</p>
            </div>
          )}
        </div>
      </div>
    </>
  );
};

export default SellerNotificationsPage;
