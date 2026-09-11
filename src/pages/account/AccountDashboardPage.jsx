import { Link } from 'react-router-dom';
import { useSelector } from 'react-redux';
import {
  Package,
  Heart,
  Bell,
  MapPin,
  ShieldCheck,
  ArrowRight,
  Truck,
  CreditCard,
  Crown,
  ExternalLink,
  Sparkles,
} from 'lucide-react';
import useAuth from '../../hooks/useAuth';
import useWishlist from '../../hooks/useWishlist';
import { selectOrders } from '../../features/orders/orderSelectors';
import { selectNotifications } from '../../features/notifications/notificationSelectors';
import { formatCurrency } from '../../utils/formatCurrency';
import AccountLayout from '../../components/account/AccountLayout';
import Button from '../../components/common/Button';

export const AccountDashboardPage = () => {
  const { user } = useAuth();
  const { count: wishlistCount } = useWishlist();
  const orders = useSelector(selectOrders) || [];
  const notifications = useSelector(selectNotifications) || [];

  const recentOrders = orders.slice(0, 3);
  const unreadNotifs = notifications.filter((n) => !n.isRead).slice(0, 3);

  const patronName = user?.name || 'Sarah Jenkins';

  return (
    <AccountLayout>
      <div className="space-y-8">
        {/* Welcome & Privileges Card */}
        <div className="bg-surface rounded-2xl border border-border p-6 sm:p-8 space-y-4 shadow-subtle relative overflow-hidden">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div className="space-y-1">
              <span className="text-xs font-bold uppercase tracking-wider text-accent flex items-center gap-1.5">
                <Sparkles className="w-3.5 h-3.5" /> Concierge Welcome
              </span>
              <h2 className="font-serif text-2xl font-bold text-text-main">
                Welcome back, {patronName}
              </h2>
              <p className="text-xs text-text-muted max-w-xl">
                Your private registry grants you privileged access to master artisan releases, bespoke commissioning, and armored international transport.
              </p>
            </div>

            <Link to="/products">
              <Button variant="primary" size="md" rightIcon={ArrowRight}>
                Explore Curations
              </Button>
            </Link>
          </div>
        </div>

        {/* Recent Orders Section */}
        <div className="bg-surface rounded-2xl border border-border p-6 sm:p-8 space-y-5 shadow-subtle">
          <div className="flex items-center justify-between pb-3 border-b border-border">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-lg bg-accent-light text-accent flex items-center justify-center">
                <Package className="w-4 h-4" />
              </div>
              <h3 className="font-serif font-bold text-base text-text-main">
                Recent Commissioned Orders
              </h3>
            </div>

            <Link
              to="/account/orders"
              className="inline-flex items-center gap-1 text-xs font-semibold text-accent hover:underline"
            >
              <span>View All ({orders.length})</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>

          {recentOrders.length === 0 ? (
            <div className="text-center py-8 space-y-2">
              <Package className="w-8 h-8 text-text-muted mx-auto" />
              <p className="text-xs text-text-muted">No recent acquisitions registered.</p>
            </div>
          ) : (
            <div className="space-y-4">
              {recentOrders.map((order) => {
                const isDelivered = order.status === 'Delivered';
                const isCancelled = order.status === 'Cancelled';

                return (
                  <div
                    key={order.id}
                    className="p-4 rounded-xl border border-border bg-surface hover:bg-surface-muted/40 transition-all flex flex-col sm:flex-row sm:items-center justify-between gap-4"
                  >
                    <div className="flex items-center gap-4">
                      {order.items?.[0]?.image ? (
                        <img
                          src={order.items[0].image}
                          alt={order.items[0].name}
                          className="w-14 h-14 object-cover rounded-xl bg-surface-muted border border-border shrink-0"
                        />
                      ) : (
                        <div className="w-14 h-14 rounded-xl bg-surface-muted border border-border flex items-center justify-center shrink-0">
                          <Package className="w-6 h-6 text-text-muted" />
                        </div>
                      )}

                      <div className="space-y-0.5 min-w-0">
                        <div className="flex items-center gap-2">
                          <span className="font-mono font-bold text-xs text-text-main">
                            #{order.id}
                          </span>
                          <span
                            className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                              isDelivered
                                ? 'bg-success-light text-success-dark border border-success/20'
                                : isCancelled
                                ? 'bg-error-light text-error-dark border border-error/20'
                                : 'bg-warning-light text-warning-dark border border-warning/20'
                            }`}
                          >
                            {order.status}
                          </span>
                        </div>
                        <p className="text-xs text-text-main font-semibold truncate">
                          {order.items?.[0]?.name}
                          {order.items?.length > 1 && ` +${order.items.length - 1} more`}
                        </p>
                        <p className="text-[11px] text-text-muted">
                          Placed on {order.createdAt} • Total: {formatCurrency(order.total)}
                        </p>
                      </div>
                    </div>

                    <div className="flex items-center gap-2 self-end sm:self-auto">
                      <Link to={`/account/orders/${order.id}`}>
                        <Button variant="secondary" size="sm" rightIcon={ArrowRight}>
                          Track Order
                        </Button>
                      </Link>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>

        {/* 2-Column Overview Details: Address & Security */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
          {/* Default Address Summary */}
          <div className="bg-surface rounded-2xl border border-border p-6 space-y-3 shadow-subtle">
            <div className="flex items-center justify-between pb-2 border-b border-border">
              <div className="flex items-center gap-2">
                <MapPin className="w-4 h-4 text-accent" />
                <h4 className="font-serif font-bold text-sm text-text-main">
                  Primary Delivery Destination
                </h4>
              </div>
              <Link
                to="/account/addresses"
                className="text-xs font-semibold text-accent hover:underline"
              >
                Manage
              </Link>
            </div>
            <div className="text-xs text-text-muted space-y-1">
              <p className="font-semibold text-text-main">{patronName}</p>
              <p>740 Park Avenue, Penthouse 14B</p>
              <p>New York, NY 10021, United States</p>
              <p className="text-text-subtle text-[11px] pt-1">+1 (555) 019-2834</p>
            </div>
          </div>

          {/* Security & Verification */}
          <div className="bg-surface rounded-2xl border border-border p-6 space-y-3 shadow-subtle">
            <div className="flex items-center justify-between pb-2 border-b border-border">
              <div className="flex items-center gap-2">
                <ShieldCheck className="w-4 h-4 text-accent" />
                <h4 className="font-serif font-bold text-sm text-text-main">
                  Account Protection
                </h4>
              </div>
              <Link
                to="/account/profile"
                className="text-xs font-semibold text-accent hover:underline"
              >
                Security
              </Link>
            </div>
            <div className="text-xs text-text-muted space-y-1.5">
              <div className="flex items-center justify-between">
                <span>Email Verification</span>
                <span className="text-emerald-600 font-semibold">Verified</span>
              </div>
              <div className="flex items-center justify-between">
                <span>Two-Factor Authentication</span>
                <span className="text-text-main font-semibold">Active</span>
              </div>
              <div className="flex items-center justify-between">
                <span>Data Sovereignty Protocol</span>
                <span className="text-accent font-semibold">Zero-Knowledge</span>
              </div>
            </div>
          </div>
        </div>

        {/* Recent Notifications Preview */}
        {unreadNotifs.length > 0 && (
          <div className="bg-surface rounded-2xl border border-border p-6 space-y-4 shadow-subtle">
            <div className="flex items-center justify-between pb-2 border-b border-border">
              <div className="flex items-center gap-2">
                <Bell className="w-4 h-4 text-accent" />
                <h4 className="font-serif font-bold text-sm text-text-main">
                  Unread Notifications ({unreadNotifs.length})
                </h4>
              </div>
              <Link
                to="/account/notifications"
                className="text-xs font-semibold text-accent hover:underline"
              >
                Open Center
              </Link>
            </div>

            <div className="space-y-2">
              {unreadNotifs.map((notif) => (
                <div
                  key={notif.id}
                  className="p-3 bg-surface-muted/60 rounded-xl border border-border flex items-start justify-between gap-3 text-xs"
                >
                  <div>
                    <p className="font-semibold text-text-main">{notif.title}</p>
                    <p className="text-text-muted text-[11px] mt-0.5">{notif.message}</p>
                  </div>
                  <span className="text-[10px] text-text-subtle shrink-0">Recent</span>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </AccountLayout>
  );
};

export default AccountDashboardPage;
