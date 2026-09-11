import { useState, useRef, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import {
  Menu,
  X,
  Search,
  ExternalLink,
  Bell,
  CheckCircle2,
  ShieldCheck,
  User,
  LogOut,
  ChevronRight,
} from 'lucide-react';
import { useSelector, useDispatch } from 'react-redux';
import {
  selectSellerProfile,
  selectSellerNotifications,
} from '../../features/seller/sellerSelectors';
import { selectCurrentUser } from '../../features/auth/authSelectors';
import { logoutUser } from '../../features/auth/authThunk';
import { markAllSellerNotificationsRead } from '../../features/seller/sellerSlice';
import Logo from '../common/Logo';

export const SellerHeader = ({
  mobileOpen = false,
  onToggleMobile = () => {},
}) => {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const [searchQuery, setSearchQuery] = useState('');
  const [profileDropdownOpen, setProfileDropdownOpen] = useState(false);
  const [notificationsOpen, setNotificationsOpen] = useState(false);

  const profileRef = useRef(null);
  const notifRef = useRef(null);

  const currentUser = useSelector(selectCurrentUser);
  const profile = useSelector(selectSellerProfile) || {
    storeName: 'Seller Store',
    ownerName: 'Seller',
    verified: true,
  };
  const notifications = useSelector(selectSellerNotifications) || [];
  const unreadCount = notifications.filter((n) => !n.isRead).length;

  // Close dropdowns on outside click
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (profileRef.current && !profileRef.current.contains(e.target)) {
        setProfileDropdownOpen(false);
      }
      if (notifRef.current && !notifRef.current.contains(e.target)) {
        setNotificationsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    if (!searchQuery.trim()) return;
    navigate(
      `/seller/products?search=${encodeURIComponent(searchQuery.trim())}`
    );
  };

  const handleLogout = async () => {
    await dispatch(logoutUser());
    navigate('/login');
  };

  return (
    <header className="sticky top-0 z-40 bg-surface border-b border-border shadow-xs">
      <div className="px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between gap-4">
        {/* Left: Mobile Toggle & Store Identity */}
        <div className="flex items-center gap-3 sm:gap-4 min-w-0">
          <button
            onClick={onToggleMobile}
            className="lg:hidden p-2 rounded-xl text-text-muted hover:text-text-main hover:bg-surface-muted transition-colors cursor-pointer"
            aria-label="Toggle Seller Sidebar"
          >
            {mobileOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>

          <div className="flex items-center gap-3">
            <Logo variant="seller" size="sm" to="/seller/dashboard" />
            <div className="hidden sm:block h-5 w-px bg-border" />
            <div className="hidden sm:flex items-center gap-2">
              <span className="font-serif font-bold text-xs text-text-main truncate max-w-[140px] md:max-w-[180px]">
                {profile.storeName}
              </span>
              {profile.verified && (
                <span className="inline-flex items-center gap-0.5 text-[10px] font-bold text-accent bg-accent-light px-1.5 py-0.5 rounded border border-accent/20">
                  <ShieldCheck className="w-3 h-3 text-accent" />
                  Verified
                </span>
              )}
            </div>
          </div>
        </div>

        {/* Center: Quick Workspace Search */}
        <div className="hidden md:flex flex-1 max-w-md mx-4">
          <form onSubmit={handleSearchSubmit} className="w-full relative">
            <input
              type="text"
              placeholder="Search products, orders, SKU..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-9 pr-3 py-1.5 text-xs bg-surface-muted border border-border rounded-xl focus:outline-none focus:border-primary text-text-main placeholder:text-text-muted"
            />
            <Search className="w-3.5 h-3.5 text-text-muted absolute left-3 top-1/2 -translate-y-1/2" />
          </form>
        </div>

        {/* Right: Actions, Notifications & Profile */}
        <div className="flex items-center gap-2 sm:gap-3 shrink-0">
          {/* View Customer Marketplace */}
          <Link
            to="/"
            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-border text-xs font-semibold text-text-main hover:bg-surface-muted transition-colors shadow-xs"
            title="Return to Customer Marketplace"
          >
            <ExternalLink className="w-3.5 h-3.5 text-accent" />
            <span className="hidden sm:inline">View Marketplace</span>
          </Link>

          {/* Notifications Dropdown */}
          <div className="relative" ref={notifRef}>
            <button
              onClick={() => {
                setNotificationsOpen(!notificationsOpen);
                setProfileDropdownOpen(false);
              }}
              className="relative p-2 rounded-xl text-text-muted hover:text-text-main hover:bg-surface-muted transition-colors cursor-pointer"
              aria-label="Seller Notifications"
            >
              <Bell className="w-4 h-4" />
              {unreadCount > 0 && (
                <span className="absolute top-1 right-1 w-2 h-2 rounded-full bg-accent animate-pulse" />
              )}
            </button>

            {notificationsOpen && (
              <div className="absolute right-0 mt-2 w-80 sm:w-96 bg-surface border border-border rounded-2xl shadow-xl py-3 z-50 animate-in fade-in zoom-in-95 duration-100">
                <div className="px-4 pb-3 border-b border-border flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <h3 className="text-xs font-bold text-text-main">
                      Store Notifications
                    </h3>
                    {unreadCount > 0 && (
                      <span className="text-[10px] font-bold px-1.5 py-0.5 rounded-full bg-primary text-white">
                        {unreadCount} new
                      </span>
                    )}
                  </div>
                  {unreadCount > 0 && (
                    <button
                      onClick={() => dispatch(markAllSellerNotificationsRead())}
                      className="text-[11px] font-semibold text-accent hover:underline cursor-pointer"
                    >
                      Mark all read
                    </button>
                  )}
                </div>

                <div className="max-h-72 overflow-y-auto divide-y divide-border/50">
                  {notifications.length === 0 ? (
                    <div className="py-8 text-center text-xs text-text-muted">
                      No notifications yet
                    </div>
                  ) : (
                    notifications.map((notif) => (
                      <div
                        key={notif.id}
                        className={`p-3 text-xs transition-colors hover:bg-surface-muted ${
                          !notif.isRead ? 'bg-primary/5' : ''
                        }`}
                      >
                        <p className="font-medium text-text-main">
                          {notif.title}
                        </p>
                        <p className="text-[11px] text-text-muted mt-0.5 line-clamp-2">
                          {notif.message}
                        </p>
                        <span className="text-[10px] text-text-muted/60 mt-1 block">
                          {notif.time || 'Just now'}
                        </span>
                      </div>
                    ))
                  )}
                </div>

                <div className="pt-2 px-4 border-t border-border text-center">
                  <Link
                    to="/seller/notifications"
                    onClick={() => setNotificationsOpen(false)}
                    className="text-xs font-semibold text-text-main hover:text-accent inline-flex items-center gap-1"
                  >
                    View all notifications <ChevronRight className="w-3 h-3" />
                  </Link>
                </div>
              </div>
            )}
          </div>

          {/* Profile Dropdown */}
          <div className="relative" ref={profileRef}>
            <button
              onClick={() => {
                setProfileDropdownOpen(!profileDropdownOpen);
                setNotificationsOpen(false);
              }}
              className="flex items-center gap-2 p-1.5 rounded-xl hover:bg-surface-muted transition-colors cursor-pointer"
            >
              <div className="w-8 h-8 rounded-full bg-primary/10 border border-primary/20 flex items-center justify-center text-xs font-bold text-primary">
                {currentUser?.name
                  ? currentUser.name.charAt(0).toUpperCase()
                  : 'S'}
              </div>
            </button>

            {profileDropdownOpen && (
              <div className="absolute right-0 mt-2 w-56 bg-surface border border-border rounded-2xl shadow-xl py-2 z-50 animate-in fade-in zoom-in-95 duration-100">
                <div className="px-4 py-2.5 border-b border-border">
                  <p className="text-xs font-bold text-text-main truncate">
                    {currentUser?.name || profile.ownerName}
                  </p>
                  <p className="text-[11px] text-text-muted truncate">
                    {currentUser?.email || profile.email}
                  </p>
                  <span className="inline-block mt-1 text-[10px] font-bold text-emerald-700 bg-emerald-50 px-1.5 py-0.5 rounded border border-emerald-200">
                    Seller Account
                  </span>
                </div>

                <div className="py-1">
                  <Link
                    to="/seller/store"
                    onClick={() => setProfileDropdownOpen(false)}
                    className="flex items-center gap-2 px-4 py-2 text-xs text-text-main hover:bg-surface-muted"
                  >
                    <User className="w-3.5 h-3.5 text-text-muted" /> Store Profile
                  </Link>
                  <Link
                    to="/seller/settings"
                    onClick={() => setProfileDropdownOpen(false)}
                    className="flex items-center gap-2 px-4 py-2 text-xs text-text-main hover:bg-surface-muted"
                  >
                    <CheckCircle2 className="w-3.5 h-3.5 text-text-muted" /> Store Settings
                  </Link>
                </div>

                <div className="pt-1 border-t border-border">
                  <button
                    onClick={handleLogout}
                    className="w-full flex items-center gap-2 px-4 py-2 text-xs font-semibold text-rose-600 hover:bg-rose-50 cursor-pointer"
                  >
                    <LogOut className="w-3.5 h-3.5" /> Sign Out
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </header>
  );
};

export default SellerHeader;
