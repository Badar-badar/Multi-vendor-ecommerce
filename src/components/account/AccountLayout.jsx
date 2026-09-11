import { NavLink, useNavigate, useLocation } from 'react-router-dom';
import {
  LayoutDashboard,
  User,
  MapPin,
  Package,
  Heart,
  Bell,
  Settings,
  LogOut,
  ShieldCheck,
  Crown,
  ChevronRight,
  RotateCcw,
  CreditCard,
} from 'lucide-react';
import { useSelector } from 'react-redux';
import useAuth from '../../hooks/useAuth';
import useWishlist from '../../hooks/useWishlist';
import { selectNotifications } from '../../features/notifications/notificationSelectors';
import { selectOrders } from '../../features/orders/orderSelectors';

export const AccountLayout = ({ children }) => {
  const navigate = useNavigate();
  const location = useLocation();
  const { user, logout } = useAuth();
  const { count: wishlistCount } = useWishlist();
  const notifications = useSelector(selectNotifications) || [];
  const unreadNotifCount = notifications.filter((n) => !n.isRead).length;
  const orders = useSelector(selectOrders) || [];

  const handleLogout = async () => {
    await logout();
    navigate('/login');
  };

  const navItems = [
    {
      to: '/account',
      label: 'Overview',
      icon: LayoutDashboard,
      exact: true,
    },
    {
      to: '/account/orders',
      label: 'My Orders',
      icon: Package,
      badge: orders.length > 0 ? orders.length : null,
    },
    {
      to: '/account/payments',
      label: 'Payment History',
      icon: CreditCard,
    },
    {
      to: '/account/returns',
      label: 'Returns & Exchanges',
      icon: RotateCcw,
    },
    {
      to: '/account/reviews',
      label: 'My Reviews',
      icon: ShieldCheck,
    },
    {
      to: '/account/profile',
      label: 'Profile & Security',
      icon: User,
    },
    {
      to: '/account/addresses',
      label: 'Delivery Addresses',
      icon: MapPin,
    },
    {
      to: '/wishlist',
      label: 'Saved Curations',
      icon: Heart,
      badge: wishlistCount > 0 ? wishlistCount : null,
    },
    {
      to: '/account/notifications',
      label: 'Notifications',
      icon: Bell,
      badge: unreadNotifCount > 0 ? unreadNotifCount : null,
      badgeColor: 'bg-accent text-white',
    },
    {
      to: '/account/settings',
      label: 'Settings',
      icon: Settings,
    },
  ];

  const patronName = user?.name || 'Sarah Jenkins';
  const patronEmail = user?.email || 'sarah.jenkins@example.com';
  const patronAvatar =
    user?.avatar ||
    'https://images.unsplash.com/photo-1534528741775-53994a69daeb?q=80&w=300&auto=format&fit=crop';

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-10 w-full">
      {/* Patron Hero Banner */}
      <div className="bg-surface rounded-3xl border border-border p-6 sm:p-8 mb-8 shadow-subtle flex flex-col md:flex-row md:items-center justify-between gap-6 min-w-0">
        <div className="flex items-center gap-4 sm:gap-5 min-w-0">
          <div className="relative shrink-0">
            <img
              src={patronAvatar}
              alt={patronName}
              className="w-16 h-16 sm:w-20 sm:h-20 rounded-2xl object-cover border-2 border-accent shadow-xs"
            />
            <span
              className="absolute -bottom-1 -right-1 w-6 h-6 rounded-full bg-primary text-white flex items-center justify-center border-2 border-surface shadow-xs"
              title="Sovereign Collector Tier"
            >
              <Crown className="w-3.5 h-3.5 text-accent" />
            </span>
          </div>

          <div className="space-y-1 min-w-0">
            <div className="flex items-center gap-2 flex-wrap">
              <h1 className="font-serif text-xl sm:text-2xl font-bold text-text-main truncate">
                {patronName}
              </h1>
              <span className="inline-flex items-center gap-1 text-[10px] font-bold uppercase tracking-wider bg-accent-light text-accent px-2 py-0.5 rounded-full border border-accent/20 shrink-0">
                <Crown className="w-3 h-3" /> VIP Sovereign Patron
              </span>
            </div>
            <p className="text-xs text-text-muted truncate">{patronEmail}</p>
            <div className="flex items-center gap-3 text-[11px] text-text-subtle pt-1 flex-wrap">
              <span className="flex items-center gap-1 text-emerald-600 font-medium">
                <ShieldCheck className="w-3.5 h-3.5" /> Identity Verified
              </span>
              <span>•</span>
              <span>Member Since 2026</span>
            </div>
          </div>
        </div>

        {/* Top Quick Stats */}
        <div className="flex items-center gap-4 sm:gap-6 border-t md:border-t-0 md:border-l border-border pt-4 md:pt-0 md:pl-6 shrink-0">
          <div className="text-center md:text-left">
            <span className="text-[11px] text-text-muted block">Active Orders</span>
            <span className="font-serif font-bold text-lg text-text-main">
              {orders.filter((o) => o.status !== 'Delivered' && o.status !== 'Cancelled').length}
            </span>
          </div>

          <div className="text-center md:text-left">
            <span className="text-[11px] text-text-muted block">Wishlist</span>
            <span className="font-serif font-bold text-lg text-accent">
              {wishlistCount}
            </span>
          </div>

          <div className="text-center md:text-left">
            <span className="text-[11px] text-text-muted block">Total Orders</span>
            <span className="font-serif font-bold text-lg text-text-main">
              {orders.length}
            </span>
          </div>
        </div>
      </div>

      {/* Main Grid: Sidebar + Sub-page Content */}
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6 xl:gap-8 w-full items-start">
        {/* Left Navigation Sidebar */}
        <aside className="lg:col-span-1 space-y-4 w-full min-w-0">
          {/* Mobile Horizontal Navigation Tabs */}
          <div className="lg:hidden flex items-center gap-2 overflow-x-auto pb-2 scrollbar-none w-full max-w-full">
            {navItems.map((item) => {
              const isActive =
                item.exact
                  ? location.pathname === item.to
                  : location.pathname.startsWith(item.to);

              const Icon = item.icon;

              return (
                <NavLink
                  key={item.to}
                  to={item.to}
                  className={`flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-semibold whitespace-nowrap shrink-0 border transition-all ${
                    isActive
                      ? 'bg-primary text-white border-primary shadow-xs'
                      : 'bg-surface text-text-muted border-border hover:text-text-main hover:bg-surface-muted'
                  }`}
                >
                  <Icon className="w-3.5 h-3.5" />
                  <span>{item.label}</span>
                  {item.badge !== null && item.badge !== undefined && (
                    <span
                      className={`text-[10px] font-bold px-1.5 py-0.2 rounded-full ${
                        item.badgeColor || (isActive ? 'bg-white/20 text-white' : 'bg-surface-muted text-text-main')
                      }`}
                    >
                      {item.badge}
                    </span>
                  )}
                </NavLink>
              );
            })}
          </div>

          {/* Desktop Vertical Menu */}
          <nav className="hidden lg:block bg-surface rounded-2xl border border-border p-3 space-y-1 shadow-subtle sticky top-24">
            {navItems.map((item) => {
              const isActive =
                item.exact
                  ? location.pathname === item.to
                  : location.pathname.startsWith(item.to);

              const Icon = item.icon;

              return (
                <NavLink
                  key={item.to}
                  to={item.to}
                  className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl text-xs font-semibold transition-all ${
                    isActive
                      ? 'bg-primary text-white shadow-xs'
                      : 'text-text-muted hover:text-text-main hover:bg-surface-muted'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <Icon className={`w-4 h-4 ${isActive ? 'text-white' : 'text-text-subtle'}`} />
                    <span>{item.label}</span>
                  </div>

                  <div className="flex items-center gap-1.5">
                    {item.badge !== null && item.badge !== undefined && (
                      <span
                        className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                          item.badgeColor || (isActive ? 'bg-white/20 text-white' : 'bg-surface-muted text-text-main border border-border')
                        }`}
                      >
                        {item.badge}
                      </span>
                    )}
                    <ChevronRight className={`w-3.5 h-3.5 ${isActive ? 'text-white/60' : 'text-text-subtle'}`} />
                  </div>
                </NavLink>
              );
            })}

            {/* Logout button */}
            <div className="pt-2 mt-2 border-t border-border">
              <button
                type="button"
                onClick={handleLogout}
                className="w-full flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-xs font-semibold text-text-muted hover:text-rose-600 hover:bg-rose-50 transition-colors cursor-pointer"
              >
                <LogOut className="w-4 h-4" />
                <span>Sign Out of Registry</span>
              </button>
            </div>
          </nav>
        </aside>

        {/* Right Content Area */}
        <main className="lg:col-span-3 min-w-0 w-full">
          {children}
        </main>
      </div>
    </div>
  );
};

export default AccountLayout;
