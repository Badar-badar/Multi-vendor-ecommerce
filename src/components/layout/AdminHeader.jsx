import { useState, useRef, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import {
  Menu,
  X,
  ExternalLink,
  Bell,
  Shield,
  User,
  LogOut,
  ChevronRight,
  ShieldAlert,
} from 'lucide-react';
import { useSelector, useDispatch } from 'react-redux';
import { selectCurrentUser } from '../../features/auth/authSelectors';
import { logoutUser } from '../../features/auth/authThunk';
import {
  selectAdminNotifications,
  selectPendingSellers,
  selectPendingProducts,
  selectPendingRefunds,
  selectFlaggedReviews,
} from '../../features/admin/adminSelectors';
import {
  markNotificationReadLocal,
  markAllNotificationsReadLocal,
} from '../../features/admin/adminSlice';
import Logo from '../common/Logo';

export const AdminHeader = ({
  mobileOpen = false,
  onToggleMobile = () => {},
}) => {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const [profileDropdownOpen, setProfileDropdownOpen] = useState(false);
  const [notificationsOpen, setNotificationsOpen] = useState(false);

  const profileRef = useRef(null);
  const notifRef = useRef(null);

  const currentUser = useSelector(selectCurrentUser) || {
    name: 'Administrator',
    email: 'admin@zareen.com',
    role: 'admin',
  };

  const notifications = useSelector(selectAdminNotifications) || [];
  const pendingSellers = useSelector(selectPendingSellers) || [];
  const pendingProducts = useSelector(selectPendingProducts) || [];
  const pendingRefunds = useSelector(selectPendingRefunds) || [];
  const flaggedReviews = useSelector(selectFlaggedReviews) || [];

  const unreadCount = notifications.filter((n) => n.unread).length;
  const totalActionRequired =
    pendingSellers.length +
    pendingProducts.length +
    pendingRefunds.length +
    flaggedReviews.length;

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

  const handleLogout = async () => {
    await dispatch(logoutUser());
    navigate('/login');
  };

  return (
    <header className="sticky top-0 z-40 bg-surface text-text-main border-b border-border shadow-subtle">
      <div className="px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between gap-4">
        {/* Left: Mobile Toggle & Brand */}
        <div className="flex items-center gap-3 sm:gap-4 min-w-0">
          <button
            onClick={onToggleMobile}
            className="lg:hidden p-2 rounded-xl text-text-muted hover:text-text-main hover:bg-surface-muted transition-colors cursor-pointer"
            aria-label="Toggle Admin Sidebar"
          >
            {mobileOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>

          <div className="flex items-center gap-3">
            <Logo variant="admin" size="sm" to="/admin/dashboard" />
            <div className="hidden sm:block h-5 w-px bg-border" />
            <div className="hidden sm:flex items-center gap-2">
              <span className="text-[10px] font-bold uppercase tracking-wider text-primary bg-primary-light px-2 py-0.5 rounded border border-primary/20 flex items-center gap-1">
                <Shield className="w-3 h-3 text-primary" /> Governance Console
              </span>
            </div>
          </div>
        </div>

        {/* Center: Live Moderation Quick Counters */}
        <div className="hidden md:flex items-center gap-2">
          {totalActionRequired > 0 && (
            <div className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-primary-light border border-primary/20 text-primary text-xs font-semibold">
              <ShieldAlert className="w-3.5 h-3.5 text-primary" />
              <span>{totalActionRequired} items pending review</span>
            </div>
          )}
        </div>

        {/* Right: Store Link, Notifications, Profile */}
        <div className="flex items-center gap-2 sm:gap-3 shrink-0">
          {/* View Live Store */}
          <Link
            to="/"
            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-border text-xs font-semibold text-text-main hover:bg-surface-muted transition-colors"
            title="View Live Storefront"
          >
            <ExternalLink className="w-3.5 h-3.5 text-accent" />
            <span className="hidden sm:inline">Live Store</span>
          </Link>

          {/* Notifications Dropdown */}
          <div className="relative" ref={notifRef}>
            <button
              onClick={() => {
                setNotificationsOpen(!notificationsOpen);
                setProfileDropdownOpen(false);
              }}
              className="relative p-2 rounded-xl text-text-muted hover:text-text-main hover:bg-surface-muted transition-colors cursor-pointer"
              aria-label="Admin Notifications"
            >
              <Bell className="w-4 h-4" />
              {unreadCount > 0 && (
                <span className="absolute top-1 right-1 w-2 h-2 rounded-full bg-primary animate-pulse" />
              )}
            </button>

            {notificationsOpen && (
              <div className="absolute right-0 mt-2 w-80 sm:w-96 bg-surface border border-border rounded-2xl shadow-elevated py-3 z-50 animate-in fade-in zoom-in-95 duration-100">
                <div className="px-4 pb-3 border-b border-border flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <h3 className="text-xs font-bold text-text-main">
                      System Notifications
                    </h3>
                    {unreadCount > 0 && (
                      <span className="text-[10px] font-bold px-1.5 py-0.5 rounded-full bg-primary text-white">
                        {unreadCount} new
                      </span>
                    )}
                  </div>
                  {unreadCount > 0 && (
                    <button
                      onClick={() => dispatch(markAllNotificationsReadLocal())}
                      className="text-[11px] font-semibold text-primary hover:underline cursor-pointer"
                    >
                      Mark all read
                    </button>
                  )}
                </div>

                <div className="max-h-72 overflow-y-auto divide-y divide-border/60">
                  {notifications.length === 0 ? (
                    <div className="py-8 text-center text-xs text-text-muted">
                      No system notifications
                    </div>
                  ) : (
                    notifications.map((notif) => (
                      <div
                        key={notif.id}
                        onClick={() => dispatch(markNotificationReadLocal(notif.id))}
                        className={`p-3 text-xs transition-colors hover:bg-surface-muted cursor-pointer ${
                          notif.unread ? 'bg-primary-light/40' : ''
                        }`}
                      >
                        <p className="font-semibold text-text-main">
                          {notif.title}
                        </p>
                        <p className="text-[11px] text-text-muted mt-0.5 line-clamp-2">
                          {notif.message}
                        </p>
                        <span className="text-[10px] text-text-subtle mt-1 block">
                          {notif.time || 'Recent'}
                        </span>
                      </div>
                    ))
                  )}
                </div>

                <div className="pt-2 px-4 border-t border-border text-center">
                  <Link
                    to="/admin/notifications"
                    onClick={() => setNotificationsOpen(false)}
                    className="text-xs font-semibold text-primary hover:text-primary-hover inline-flex items-center gap-1"
                  >
                    View all broadcasts <ChevronRight className="w-3 h-3" />
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
              <div className="w-8 h-8 rounded-full bg-primary-light border border-primary/30 flex items-center justify-center text-xs font-bold text-primary">
                {currentUser?.name
                  ? currentUser.name.charAt(0).toUpperCase()
                  : 'A'}
              </div>
            </button>

            {profileDropdownOpen && (
              <div className="absolute right-0 mt-2 w-56 bg-surface border border-border rounded-2xl shadow-elevated py-2 z-50 animate-in fade-in zoom-in-95 duration-100">
                <div className="px-4 py-2.5 border-b border-border">
                  <p className="text-xs font-bold text-text-main truncate">
                    {currentUser?.name || 'Administrator'}
                  </p>
                  <p className="text-[11px] text-text-muted truncate">
                    {currentUser?.email || 'admin@zareen.com'}
                  </p>
                  <span className="inline-block mt-1 text-[10px] font-bold text-primary bg-primary-light px-1.5 py-0.5 rounded border border-primary/20">
                    Governance SuperAdmin
                  </span>
                </div>

                <div className="py-1">
                  <Link
                    to="/admin/settings"
                    onClick={() => setProfileDropdownOpen(false)}
                    className="flex items-center gap-2 px-4 py-2 text-xs text-text-main hover:bg-surface-muted"
                  >
                    <Shield className="w-3.5 h-3.5 text-text-muted" /> Security Settings
                  </Link>
                  <Link
                    to="/admin/audit-logs"
                    onClick={() => setProfileDropdownOpen(false)}
                    className="flex items-center gap-2 px-4 py-2 text-xs text-text-main hover:bg-surface-muted"
                  >
                    <User className="w-3.5 h-3.5 text-text-muted" /> Audit Log
                  </Link>
                </div>

                <div className="pt-1 border-t border-border">
                  <button
                    onClick={handleLogout}
                    className="w-full flex items-center gap-2 px-4 py-2 text-xs font-semibold text-error hover:bg-error-light cursor-pointer"
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

export default AdminHeader;
