import { useState, useRef, useEffect } from 'react';
import { Link } from 'react-router-dom';
import {
  ShoppingBag,
  Heart,
  User,
  Menu,
  X,
  Store,
  Shield,
  LogOut,
  ChevronDown,
  Sparkles,
  Package,
  Layers,
  ArrowRight,
  Bell,
} from 'lucide-react';
import { useSelector, useDispatch } from 'react-redux';
import useAuth from '../../hooks/useAuth';
import { selectCartTotalQuantity } from '../../features/cart/cartSelectors';
import { selectWishlistCount } from '../../features/wishlist/wishlistSelectors';
import {
  selectNotifications,
  selectUnreadNotificationsCount,
} from '../../features/notifications/notificationSelectors';
import {
  markAsRead,
  markAllAsRead,
} from '../../features/notifications/notificationSlice';
import { headerNavigation } from '../../data/navigation';
import { categories as staticCategories } from '../../data/categories';
import { categoryApi } from '../../api/categoryApi';
import Badge from '../common/Badge';
import Logo from '../common/Logo';
import SearchAutocomplete from '../marketplace/SearchAutocomplete';

export const Navbar = () => {
  const dispatch = useDispatch();
  const { user, isAuthenticated, isSeller, isAdmin, logout } = useAuth();
  const cartCount = useSelector(selectCartTotalQuantity) || 0;
  const wishlistCount = useSelector(selectWishlistCount) || 0;
  const notifications = useSelector(selectNotifications) || [];
  const unreadNotifCount = useSelector(selectUnreadNotificationsCount) || 0;

  const [categoryList, setCategoryList] = useState(staticCategories);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [categoriesDropdownOpen, setCategoriesDropdownOpen] = useState(false);
  const [userDropdownOpen, setUserDropdownOpen] = useState(false);
  const [notificationsDropdownOpen, setNotificationsDropdownOpen] = useState(false);

  const categoriesRef = useRef(null);
  const userMenuRef = useRef(null);
  const notificationsRef = useRef(null);

  useEffect(() => {
    const fetchLiveCategories = async () => {
      try {
        const res = await categoryApi.getCategories();
        const list = res?.categories || res?.data?.categories || (Array.isArray(res) ? res : []);
        if (list && list.length > 0) {
          setCategoryList(list);
        }
      } catch {
        // Safe fallback
      }
    };
    fetchLiveCategories();
  }, []);

  const closeAllMenus = () => {
    setMobileMenuOpen(false);
    setCategoriesDropdownOpen(false);
    setUserDropdownOpen(false);
    setNotificationsDropdownOpen(false);
  };

  // Click outside to close dropdowns
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (categoriesRef.current && !categoriesRef.current.contains(e.target)) {
        setCategoriesDropdownOpen(false);
      }
      if (userMenuRef.current && !userMenuRef.current.contains(e.target)) {
        setUserDropdownOpen(false);
      }
      if (notificationsRef.current && !notificationsRef.current.contains(e.target)) {
        setNotificationsDropdownOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  return (
    <header className="sticky top-0 z-40 bg-surface border-b border-border shadow-subtle transition-all">
      {/* Top Announcement Bar */}
      <div className="bg-primary-light text-text-main text-[11px] sm:text-xs py-2 tracking-wide font-medium border-b border-border shadow-xs">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex items-center justify-between gap-2 min-w-0">
          <div className="hidden md:flex items-center gap-2 text-text-muted shrink-0">
            <Sparkles className="w-3.5 h-3.5 text-primary" />
            <span>Curated Sovereign Marketplace</span>
          </div>
          <div className="mx-auto md:mx-0 text-center text-text-main font-medium truncate">
            Complimentary insured worldwide shipping on orders over $200
          </div>
          <div className="hidden sm:flex items-center gap-4 text-text-muted shrink-0">
            {isAdmin ? (
              <Link
                to="/admin/dashboard"
                onClick={closeAllMenus}
                className="hover:text-primary font-semibold transition-colors flex items-center gap-1 text-text-main"
              >
                <Shield className="w-3.5 h-3.5 text-primary" /> Admin Portal
              </Link>
            ) : isSeller ? (
              <Link
                to="/seller/dashboard"
                onClick={closeAllMenus}
                className="hover:text-primary font-semibold transition-colors flex items-center gap-1 text-text-main"
              >
                <Store className="w-3.5 h-3.5 text-primary" /> Seller Portal
              </Link>
            ) : (
              <Link
                to="/seller/register"
                onClick={closeAllMenus}
                className="hover:text-primary font-semibold transition-colors flex items-center gap-1 text-text-main"
              >
                <Store className="w-3.5 h-3.5 text-primary" /> Sell on Zareen
              </Link>
            )}
            <span className="text-border-strong">|</span>
            <Link
              to="/orders/track"
              onClick={closeAllMenus}
              className="hover:text-primary transition-colors text-text-muted"
            >
              Track Order
            </Link>
          </div>
        </div>
      </div>

      {/* Main Bar */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20 gap-4">
          {/* Left: Mobile menu toggle + Brand Logo */}
          <div className="flex items-center gap-3 sm:gap-4 shrink-0">
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="lg:hidden p-2 rounded-lg text-text-muted hover:text-text-main hover:bg-surface-muted transition-colors cursor-pointer"
              aria-label={mobileMenuOpen ? 'Close menu' : 'Open menu'}
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>

            {/* Brand Logo */}
            <Logo size="md" />
          </div>

          {/* Center: Live Search Bar with Autocomplete Suggestions */}
          <div className="hidden md:flex flex-1 max-w-xl mx-4 min-w-0">
            <SearchAutocomplete placeholder="Search jewelry, apparel, ceramics, leather..." />
          </div>

          {/* Right: Actions */}
          <div className="flex items-center gap-1 sm:gap-3 shrink-0">
            {/* Seller Portal Link (Desktop CTA) */}
            {!isSeller && !isAdmin && (
              <Link
                to="/seller/register"
                onClick={closeAllMenus}
                className="hidden xl:inline-flex items-center gap-1.5 text-xs font-medium text-text-muted hover:text-text-main px-3 py-2 rounded-lg hover:bg-surface-muted transition-colors border border-transparent hover:border-border"
              >
                <Store className="w-4 h-4 text-accent" />
                <span>Become a Seller</span>
              </Link>
            )}

            {/* Notification Bell Dropdown */}
            <div className="relative" ref={notificationsRef}>
              <button
                onClick={() => {
                  setNotificationsDropdownOpen(!notificationsDropdownOpen);
                  setUserDropdownOpen(false);
                  setCategoriesDropdownOpen(false);
                }}
                className="relative p-2.5 text-text-muted hover:text-text-main hover:bg-surface-muted rounded-lg transition-colors cursor-pointer"
                title="Notifications"
                aria-label="Notifications"
              >
                <Bell className="w-5 h-5 stroke-[1.75]" />
                {unreadNotifCount > 0 && (
                  <span className="absolute top-1.5 right-1.5 min-w-[18px] h-[18px] px-1 bg-accent text-white text-[10px] font-bold rounded-full flex items-center justify-center shadow-xs animate-pulse">
                    {unreadNotifCount > 9 ? '9+' : unreadNotifCount}
                  </span>
                )}
              </button>

              {notificationsDropdownOpen && (
                <div className="absolute right-0 mt-2 w-80 sm:w-96 max-w-[calc(100vw-2rem)] bg-surface rounded-2xl border border-border shadow-modal py-3 z-50 animate-in fade-in zoom-in-95 duration-150">
                  <div className="px-4 pb-2.5 border-b border-border flex items-center justify-between">
                    <span className="font-serif text-xs font-bold text-text-main uppercase tracking-wider">
                      Patron Intelligence
                    </span>
                    {unreadNotifCount > 0 && (
                      <button
                        onClick={() => dispatch(markAllAsRead())}
                        className="text-[11px] font-semibold text-accent hover:underline cursor-pointer"
                      >
                        Mark all read
                      </button>
                    )}
                  </div>

                  <div className="divide-y divide-border max-h-72 overflow-y-auto px-2 py-1">
                    {notifications.slice(0, 4).map((notif) => (
                      <div
                        key={notif.id}
                        onClick={() => {
                          if (!notif.isRead) dispatch(markAsRead(notif.id));
                        }}
                        className={`p-3 rounded-xl transition-colors cursor-pointer ${
                          notif.isRead ? 'hover:bg-surface-muted' : 'bg-surface-muted/60'
                        }`}
                      >
                        <div className="flex items-start justify-between gap-2">
                          <p className="text-xs font-semibold text-text-main">{notif.title}</p>
                          {!notif.isRead && (
                            <span className="w-2 h-2 rounded-full bg-accent shrink-0 mt-1" />
                          )}
                        </div>
                        <p className="text-[11px] text-text-muted mt-0.5 line-clamp-2">
                          {notif.message}
                        </p>
                      </div>
                    ))}
                  </div>

                  <div className="px-4 pt-2.5 border-t border-border mt-1">
                    <Link
                      to="/account/notifications"
                      onClick={closeAllMenus}
                      className="block text-center text-xs font-semibold text-accent hover:underline"
                    >
                      View All Notifications ({notifications.length}) →
                    </Link>
                  </div>
                </div>
              )}
            </div>

            {/* Wishlist Button */}
            <Link
              to="/wishlist"
              onClick={closeAllMenus}
              className="relative p-2.5 text-text-muted hover:text-text-main hover:bg-surface-muted rounded-lg transition-colors"
              title="Wishlist"
              aria-label="Wishlist"
            >
              <Heart className="w-5 h-5 stroke-[1.75]" />
              {wishlistCount > 0 && (
                <span className="absolute top-1.5 right-1.5 min-w-[18px] h-[18px] px-1 bg-primary text-white text-[10px] font-bold rounded-full flex items-center justify-center shadow-xs">
                  {wishlistCount > 99 ? '99+' : wishlistCount}
                </span>
              )}
            </Link>

            {/* Cart Button */}
            <Link
              to="/cart"
              onClick={closeAllMenus}
              className="relative p-2.5 text-text-muted hover:text-text-main hover:bg-surface-muted rounded-lg transition-colors"
              title="Shopping Cart"
              aria-label="Shopping Cart"
            >
              <ShoppingBag className="w-5 h-5 stroke-[1.75]" />
              {cartCount > 0 && (
                <span className="absolute top-1.5 right-1.5 min-w-[18px] h-[18px] px-1 bg-accent text-white text-[10px] font-bold rounded-full flex items-center justify-center shadow-xs">
                  {cartCount > 99 ? '99+' : cartCount}
                </span>
              )}
            </Link>

            <div className="h-6 w-[1px] bg-border mx-1 hidden sm:block" />

            {/* User Account Menu */}
            <div className="relative" ref={userMenuRef}>
              {isAuthenticated ? (
                <div>
                  <button
                    onClick={() => setUserDropdownOpen(!userDropdownOpen)}
                    className="flex items-center gap-2 p-1.5 sm:px-2.5 sm:py-1.5 rounded-lg hover:bg-surface-muted border border-border transition-colors focus-ring cursor-pointer"
                    aria-expanded={userDropdownOpen}
                    aria-haspopup="true"
                  >
                    <img
                      src={
                        user?.avatar ||
                        'https://images.unsplash.com/photo-1534528741775-53994a69daeb?q=80&w=100&auto=format&fit=crop'
                      }
                      alt={user?.name || 'User'}
                      className="w-7 h-7 rounded-full object-cover border border-border"
                    />
                    <div className="hidden lg:flex flex-col text-left">
                      <span className="text-xs font-semibold text-text-main leading-tight line-clamp-1">
                        {user?.name || 'Account'}
                      </span>
                      <span className="text-[10px] text-text-muted capitalize">
                        {user?.role || 'Customer'}
                      </span>
                    </div>
                    <ChevronDown className="hidden sm:block w-3.5 h-3.5 text-text-muted" />
                  </button>

                  {/* Dropdown Card */}
                  {userDropdownOpen && (
                    <div className="absolute right-0 mt-2 w-64 max-w-[calc(100vw-2rem)] bg-surface rounded-xl border border-border shadow-modal py-2 z-50 animate-in fade-in zoom-in-95 duration-150">
                      <div className="px-4 py-3 border-b border-border bg-surface-muted/40">
                        <p className="text-xs font-bold text-text-main line-clamp-1">
                          {user?.name}
                        </p>
                        <p className="text-[11px] text-text-muted truncate mt-0.5">
                          {user?.email}
                        </p>
                        <div className="mt-2 flex items-center gap-1.5">
                          <Badge
                            variant={
                              user?.role === 'admin'
                                ? 'primary'
                                : user?.role === 'seller'
                                ? 'accent'
                                : 'default'
                            }
                            size="xs"
                          >
                            {user?.role?.toUpperCase()}
                          </Badge>
                        </div>
                      </div>

                      <div className="py-1">
                        <Link
                          to="/profile"
                          onClick={closeAllMenus}
                          className="flex items-center gap-2.5 px-4 py-2 text-xs font-medium text-text-main hover:bg-surface-muted transition-colors"
                        >
                          <User className="w-4 h-4 text-text-muted" />
                          <span>My Profile & Settings</span>
                        </Link>

                        <Link
                          to="/orders"
                          onClick={closeAllMenus}
                          className="flex items-center gap-2.5 px-4 py-2 text-xs font-medium text-text-main hover:bg-surface-muted transition-colors"
                        >
                          <Package className="w-4 h-4 text-text-muted" />
                          <span>My Orders & History</span>
                        </Link>

                        <Link
                          to="/wishlist"
                          onClick={closeAllMenus}
                          className="flex items-center gap-2.5 px-4 py-2 text-xs font-medium text-text-main hover:bg-surface-muted transition-colors"
                        >
                          <Heart className="w-4 h-4 text-text-muted" />
                          <span>Saved Wishlist</span>
                        </Link>

                        {isSeller && (
                          <div className="border-t border-border/80 my-1 pt-1">
                            <Link
                              to="/seller/dashboard"
                              onClick={closeAllMenus}
                              className="flex items-center gap-2.5 px-4 py-2 text-xs font-medium text-accent hover:bg-accent-light transition-colors"
                            >
                              <Store className="w-4 h-4 text-accent" />
                              <span>Seller Dashboard</span>
                            </Link>
                          </div>
                        )}

                        {isAdmin && (
                          <div className="border-t border-border/80 my-1 pt-1">
                            <Link
                              to="/admin/dashboard"
                              onClick={closeAllMenus}
                              className="flex items-center gap-2.5 px-4 py-2 text-xs font-medium text-primary hover:bg-surface-muted transition-colors"
                            >
                              <Shield className="w-4 h-4 text-primary" />
                              <span>Admin Console</span>
                            </Link>
                          </div>
                        )}
                      </div>

                      <div className="border-t border-border pt-1">
                        <button
                          onClick={() => {
                            closeAllMenus();
                            logout();
                          }}
                          className="w-full flex items-center gap-2.5 px-4 py-2 text-xs font-medium text-error hover:bg-error-light transition-colors text-left cursor-pointer"
                        >
                          <LogOut className="w-4 h-4" />
                          <span>Sign Out</span>
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              ) : (
                <div className="flex items-center gap-2">
                  <Link
                    to="/login"
                    onClick={closeAllMenus}
                    className="text-xs font-semibold px-3 py-2 rounded-lg text-text-main hover:bg-surface-muted transition-colors"
                  >
                    Sign In
                  </Link>
                  <Link
                    to="/register"
                    onClick={closeAllMenus}
                    className="text-xs font-semibold px-4 py-2 rounded-lg bg-primary text-white hover:bg-primary-hover shadow-subtle transition-all"
                  >
                    Join
                  </Link>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Desktop Navigation & Categories Bar */}
        <div className="hidden lg:flex items-center justify-between py-2 border-t border-border/70 text-xs font-medium">
          {/* Categories Popover Trigger */}
          <div className="relative" ref={categoriesRef}>
            <button
              onClick={() => setCategoriesDropdownOpen(!categoriesDropdownOpen)}
              className="flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-primary-light text-primary hover:bg-primary hover:text-white font-semibold text-xs border border-primary/25 transition-all duration-200 shadow-2xs focus-ring cursor-pointer group"
              aria-expanded={categoriesDropdownOpen}
            >
              <Layers className="w-3.5 h-3.5 text-primary group-hover:text-white transition-colors" />
              <span>Browse Categories</span>
              <ChevronDown
                className={`w-3.5 h-3.5 text-primary/70 group-hover:text-white transition-transform duration-200 ${
                  categoriesDropdownOpen ? 'rotate-180' : ''
                }`}
              />
            </button>

            {/* Categories Dropdown Grid */}
            {categoriesDropdownOpen && (
              <div className="absolute left-0 mt-2 w-[540px] max-w-[calc(100vw-2rem)] bg-surface rounded-2xl border border-border shadow-modal p-5 z-50 animate-in fade-in zoom-in-95">
                <div className="flex items-center justify-between pb-3 border-b border-border mb-3">
                  <span className="font-serif text-sm font-bold text-text-main">
                    Curated Market Departments
                  </span>
                  <Link
                    to="/categories"
                    onClick={() => setCategoriesDropdownOpen(false)}
                    className="text-xs text-primary hover:underline flex items-center gap-1 font-medium"
                  >
                    View All <ArrowRight className="w-3 h-3" />
                  </Link>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  {categoryList.map((cat) => (
                    <Link
                      key={cat._id || cat.id || cat.slug}
                      to={`/products?category=${cat.slug || cat.name?.toLowerCase()}`}
                      onClick={() => setCategoriesDropdownOpen(false)}
                      className="flex items-start gap-3 p-2.5 rounded-xl hover:bg-surface-muted transition-colors border border-transparent hover:border-border group"
                    >
                      <img
                        src={cat.image || cat.bannerImage || 'https://images.unsplash.com/photo-1515562141207-7a88fb7ce338?auto=format&fit=crop&w=400&q=80'}
                        alt={cat.name}
                        className="w-11 h-11 rounded-lg object-cover shrink-0 border border-border"
                      />
                      <div className="min-w-0">
                        <p className="text-xs font-bold text-text-main group-hover:text-primary transition-colors truncate">
                          {cat.name}
                        </p>
                        <p className="text-[11px] text-text-muted line-clamp-1 mt-0.5">
                          {cat.itemCount || cat.productCount || 'Exclusive'} items available
                        </p>
                      </div>
                    </Link>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Direct Category & Navigation Links */}
          <nav className="flex items-center gap-1 xl:gap-2">
            <Link
              to="/"
              className="px-3 py-1 rounded-full text-xs font-medium text-text-muted hover:text-text-main hover:bg-surface-muted transition-colors"
            >
              Home
            </Link>
            <Link
              to="/products"
              className="px-3 py-1 rounded-full text-xs font-medium text-text-muted hover:text-text-main hover:bg-surface-muted transition-colors"
            >
              Collections
            </Link>
            <Link
              to="/sellers"
              className="px-3 py-1 rounded-full text-xs font-medium text-text-muted hover:text-text-main hover:bg-surface-muted transition-colors"
            >
              Artisan Ateliers
            </Link>
            <Link
              to="/about"
              className="px-3 py-1 rounded-full text-xs font-medium text-text-muted hover:text-text-main hover:bg-surface-muted transition-colors"
            >
              About Zareen
            </Link>

            <div className="h-3.5 w-px bg-border/80 mx-1" />

            {categoryList.slice(0, 4).map((cat) => (
              <Link
                key={cat._id || cat.id || cat.slug}
                to={`/products?category=${cat.slug || cat.name?.toLowerCase()}`}
                className="px-2.5 py-1 rounded-full text-xs font-normal text-text-muted hover:text-primary hover:bg-primary-light/50 transition-colors"
              >
                {cat.name}
              </Link>
            ))}
          </nav>

          {/* Quick Discover / Spotlight Link */}
          <Link
            to="/products?sort=newest"
            className="inline-flex items-center gap-1.5 px-3.5 py-1 rounded-full bg-primary-light text-primary hover:bg-primary hover:text-white border border-primary/25 text-xs font-semibold transition-all duration-200 shadow-2xs group"
          >
            <Sparkles className="w-3.5 h-3.5 text-primary group-hover:text-white transition-colors" />
            <span>New In Store</span>
          </Link>
        </div>

        {/* Mobile & Tablet Category Quick Bar (Intentionally Horizontally Scrollable without page overflow) */}
        <div className="lg:hidden flex items-center gap-2 py-2.5 border-t border-border/70 overflow-x-auto scrollbar-none whitespace-nowrap w-full max-w-full">
          <Link
            to="/categories"
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-surface-muted text-xs font-semibold text-text-main shrink-0 border border-border"
          >
            <Layers className="w-3.5 h-3.5 text-accent" />
            <span>All Departments</span>
          </Link>
          {categoryList.map((cat) => (
            <Link
              key={cat._id || cat.id || cat.slug}
              to={`/products?category=${cat.slug || cat.name?.toLowerCase()}`}
              className="px-3 py-1.5 rounded-lg bg-surface text-text-muted hover:text-text-main text-xs font-medium shrink-0 border border-border/60 hover:bg-surface-muted transition-colors"
            >
              {cat.name}
            </Link>
          ))}
        </div>
      </div>

      {/* Mobile Drawer Navigation */}
      {mobileMenuOpen && (
        <div className="lg:hidden border-t border-border bg-surface px-4 py-6 space-y-6 animate-in slide-in-from-top-2 duration-200 shadow-xl max-h-[85vh] overflow-y-auto">
          {/* Mobile Search Form with live suggestions */}
          <SearchAutocomplete placeholder="Search Zareen goods..." />

          {/* Primary Navigation Links */}
          <div className="space-y-1">
            <p className="text-[10px] font-bold text-text-subtle uppercase tracking-wider px-3 mb-2">
              Explore
            </p>
            {headerNavigation.map((nav) => (
              <Link
                key={nav.path}
                to={nav.path}
                onClick={closeAllMenus}
                className="block px-3 py-2.5 text-sm font-medium text-text-main hover:bg-surface-muted rounded-lg transition-colors"
              >
                {nav.name}
              </Link>
            ))}
          </div>

          {/* Categories Grid */}
          <div className="border-t border-border pt-4">
            <p className="text-[10px] font-bold text-text-subtle uppercase tracking-wider px-3 mb-2">
              Departments
            </p>
            <div className="grid grid-cols-1 gap-1">
              {categoryList.map((cat) => (
                <Link
                  key={cat._id || cat.id || cat.slug}
                  to={`/products?category=${cat.slug || cat.name?.toLowerCase()}`}
                  onClick={closeAllMenus}
                  className="flex items-center justify-between px-3 py-2 text-xs font-medium text-text-muted hover:text-text-main hover:bg-surface-muted rounded-lg transition-colors"
                >
                  <span>{cat.name}</span>
                  <span className="text-[10px] text-text-subtle">{cat.itemCount || cat.productCount || 'Catalog'}</span>
                </Link>
              ))}
            </div>
          </div>

          {/* Seller / Support CTA */}
          <div className="border-t border-border pt-4 space-y-2">
            {!isSeller && (
              <Link
                to="/seller/register"
                onClick={closeAllMenus}
                className="flex items-center justify-between p-3 rounded-xl bg-accent-light border border-accent/20 text-accent-hover text-xs font-semibold"
              >
                <span className="flex items-center gap-2">
                  <Store className="w-4 h-4" /> Become a Zareen Seller
                </span>
                <ArrowRight className="w-3.5 h-3.5" />
              </Link>
            )}

            <Link
              to="/orders/track"
              onClick={closeAllMenus}
              className="flex items-center gap-2 px-3 py-2 text-xs text-text-muted hover:text-text-main"
            >
              <Package className="w-4 h-4 text-text-muted" /> Track My Order
            </Link>
          </div>
        </div>
      )}
    </header>
  );
};

export default Navbar;
