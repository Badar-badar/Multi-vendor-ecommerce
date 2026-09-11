import { useState, useMemo } from 'react';
import { Link } from 'react-router-dom';
import {
  Bell,
  Shield,
  Store,
  ShoppingCart,
  CreditCard,
  RotateCcw,
  MessageSquare,
  Package,
  ShieldAlert,
  CheckCircle2,
  Check,
  Filter,
} from 'lucide-react';
import { useSelector, useDispatch } from 'react-redux';
import toast from 'react-hot-toast';
import Button from '../../components/common/Button';
import Badge from '../../components/common/Badge';
import { selectAdminNotifications } from '../../features/admin/adminSelectors';
import {
  markNotificationReadLocal,
  markAllNotificationsReadLocal,
} from '../../features/admin/adminSlice';

export const AdminNotificationsPage = () => {
  const dispatch = useDispatch();
  const notifications = useSelector(selectAdminNotifications);

  const [selectedType, setSelectedType] = useState('all');

  const filteredNotifications = useMemo(() => {
    return notifications.filter((n) => {
      if (selectedType === 'all') return true;
      if (selectedType === 'unread') return n.unread;
      return n.type === selectedType;
    });
  }, [notifications, selectedType]);

  const unreadCount = notifications.filter((n) => n.unread).length;

  const handleMarkAllRead = () => {
    dispatch(markAllNotificationsReadLocal());
    toast.success('All notifications marked as read.');
  };

  const handleMarkRead = (id) => {
    dispatch(markNotificationReadLocal(id));
  };

  const getTypeIcon = (type) => {
    switch (type) {
      case 'seller':
        return <Store className="w-4 h-4 text-amber-800" />;
      case 'order':
        return <ShoppingCart className="w-4 h-4 text-blue-700" />;
      case 'payment':
        return <CreditCard className="w-4 h-4 text-emerald-700" />;
      case 'refund':
        return <RotateCcw className="w-4 h-4 text-rose-600" />;
      case 'review':
        return <MessageSquare className="w-4 h-4 text-purple-700" />;
      case 'inventory':
        return <Package className="w-4 h-4 text-amber-600" />;
      case 'security':
        return <ShieldAlert className="w-4 h-4 text-rose-600" />;
      default:
        return <Bell className="w-4 h-4 text-slate-700" />;
    }
  };

  return (
    <>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-200">
          <div>
            <span className="text-[10px] font-bold uppercase tracking-wider text-amber-800 block mb-1">
              Sentinel Intelligence
            </span>
            <h1 className="text-2xl sm:text-3xl font-serif font-bold text-slate-900">
              System Alerts & Notifications
            </h1>
            <p className="text-xs text-slate-500 mt-0.5">
              Live operational alerts across KYC vetting, order processing, and risk exceptions.
            </p>
          </div>

          <div className="flex items-center gap-2">
            {unreadCount > 0 && (
              <Button variant="outline" size="sm" leftIcon={Check} onClick={handleMarkAllRead}>
                Mark All Read ({unreadCount})
              </Button>
            )}
          </div>
        </div>

        {/* Filter Pills */}
        <div className="flex flex-wrap gap-2 text-xs">
          {[
            { id: 'all', label: 'All Alerts' },
            { id: 'unread', label: `Unread (${unreadCount})` },
            { id: 'seller', label: 'Seller Apps' },
            { id: 'order', label: 'Orders' },
            { id: 'refund', label: 'Refunds' },
            { id: 'security', label: 'Security & Sentinel' },
            { id: 'inventory', label: 'Inventory' },
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setSelectedType(tab.id)}
              className={`px-3 py-1.5 rounded-xl font-semibold transition-all cursor-pointer ${
                selectedType === tab.id
                  ? 'bg-slate-900 text-white shadow-xs'
                  : 'bg-white text-slate-600 border border-slate-200 hover:bg-slate-50'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* Notifications List */}
        <div className="bg-white rounded-2xl border border-slate-200/80 shadow-xs divide-y divide-slate-100 overflow-hidden">
          {filteredNotifications.length === 0 ? (
            <div className="p-8 text-center text-xs text-slate-500">
              No notifications found matching filter.
            </div>
          ) : (
            filteredNotifications.map((notif) => (
              <div
                key={notif.id}
                className={`p-4 sm:p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4 transition-colors ${
                  notif.unread ? 'bg-amber-50/40' : 'hover:bg-slate-50/70'
                }`}
              >
                <div className="flex items-start gap-3.5 min-w-0">
                  <div className="w-9 h-9 rounded-xl bg-white border border-slate-200 flex items-center justify-center shrink-0 shadow-xs mt-0.5">
                    {getTypeIcon(notif.type)}
                  </div>
                  <div className="space-y-0.5 min-w-0">
                    <div className="flex items-center gap-2">
                      <h4 className="font-bold text-xs text-slate-900">{notif.title}</h4>
                      {notif.unread && (
                        <span className="w-2 h-2 rounded-full bg-rose-500 shrink-0" />
                      )}
                    </div>
                    <p className="text-xs text-slate-600 leading-relaxed">{notif.message}</p>
                    <span className="text-[10px] text-slate-400 block pt-0.5">
                      {notif.timestamp || 'Just now'}
                    </span>
                  </div>
                </div>

                <div className="flex items-center gap-2 self-end sm:self-center shrink-0">
                  {notif.link && (
                    <Link to={notif.link}>
                      <Button variant="outline" size="xs">
                        Review Event
                      </Button>
                    </Link>
                  )}
                  {notif.unread && (
                    <button
                      onClick={() => handleMarkRead(notif.id)}
                      className="p-1.5 text-slate-400 hover:text-slate-900 cursor-pointer"
                      title="Mark as read"
                    >
                      <Check className="w-4 h-4" />
                    </button>
                  )}
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </>
  );
};

export default AdminNotificationsPage;
