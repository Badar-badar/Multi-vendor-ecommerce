import { NavLink } from 'react-router-dom';
import {
  LayoutDashboard,
  Package,
  Plus,
  Boxes,
  ShoppingCart,
  RotateCcw,
  Store,
  Settings,
  TrendingUp,
  Bell,
  X,
  FileText,
  DollarSign,
  Tag,
  Star,
} from 'lucide-react';
import { useSelector } from 'react-redux';
import {
  selectSellerProducts,
  selectSellerOrders,
  selectSellerReturns,
  selectSellerNotifications,
} from '../../features/seller/sellerSelectors';
import Logo from '../common/Logo';

export const SellerSidebar = ({ mobileOpen = false, onClose = () => {} }) => {
  const products = useSelector(selectSellerProducts) || [];
  const orders = useSelector(selectSellerOrders) || [];
  const returns = useSelector(selectSellerReturns) || [];
  const notifications = useSelector(selectSellerNotifications) || [];

  const lowStockCount = products.filter(
    (p) => p.stock <= (p.lowStockThreshold || 3)
  ).length;

  const pendingOrdersCount = orders.filter(
    (o) => o.status === 'Pending' || o.status === 'Processing'
  ).length;

  const pendingReturnsCount = returns.filter(
    (r) => r.status === 'Requested'
  ).length;

  const unreadNotifCount = notifications.filter((n) => !n.isRead).length;

  const navGroups = [
    {
      group: 'OVERVIEW',
      items: [
        {
          to: '/seller/dashboard',
          label: 'Dashboard',
          icon: LayoutDashboard,
          end: true,
        },
      ],
    },
    {
      group: 'CATALOG',
      items: [
        {
          to: '/seller/products',
          label: 'Products',
          icon: Package,
          badge: products.length > 0 ? products.length : null,
        },
        {
          to: '/seller/products/create',
          label: 'Add Product',
          icon: Plus,
        },
        {
          to: '/seller/inventory',
          label: 'Inventory',
          icon: Boxes,
          warningBadge: lowStockCount > 0 ? `${lowStockCount} Low` : null,
        },
      ],
    },
    {
      group: 'ORDERS',
      items: [
        {
          to: '/seller/orders',
          label: 'Orders',
          icon: ShoppingCart,
          badge:
            pendingOrdersCount > 0
              ? `${pendingOrdersCount} Pending`
              : orders.length > 0
              ? orders.length
              : null,
          badgeColor:
            pendingOrdersCount > 0
              ? 'bg-amber-100 text-amber-800 border border-amber-200'
              : null,
        },
        {
          to: '/seller/returns',
          label: 'Returns',
          icon: RotateCcw,
          badge: pendingReturnsCount > 0 ? `${pendingReturnsCount} New` : null,
          badgeColor:
            pendingReturnsCount > 0
              ? 'bg-rose-100 text-rose-800 border border-rose-200'
              : null,
        },
      ],
    },
    {
      group: 'FINANCE & STORE',
      items: [
        {
          to: '/seller/earnings',
          label: 'Earnings & Payouts',
          icon: DollarSign,
        },
        {
          to: '/seller/store',
          label: 'Store Profile',
          icon: Store,
        },
        {
          to: '/seller/settings',
          label: 'Store Settings',
          icon: Settings,
        },
      ],
    },
    {
      group: 'ANALYTICS & REPORTS',
      items: [
        {
          to: '/seller/analytics',
          label: 'Sales Analytics',
          icon: TrendingUp,
        },
        {
          to: '/seller/reports',
          label: 'Reports & Audits',
          icon: FileText,
        },
      ],
    },
    {
      group: 'MARKETING & REVIEWS',
      items: [
        {
          to: '/seller/coupons',
          label: 'Coupons & Promos',
          icon: Tag,
        },
        {
          to: '/seller/reviews',
          label: 'Customer Reviews',
          icon: Star,
        },
      ],
    },
    {
      group: 'ACCOUNT',
      items: [
        {
          to: '/seller/notifications',
          label: 'Notifications',
          icon: Bell,
          badge: unreadNotifCount > 0 ? unreadNotifCount : null,
          badgeColor: 'bg-primary text-white',
        },
      ],
    },
  ];

  const sidebarContent = (
    <div className="flex flex-col h-full bg-surface border-r border-border">
      {/* Sidebar Header (Mobile Drawer only) */}
      <div className="flex lg:hidden items-center justify-between p-4 border-b border-border">
        <Logo variant="seller" size="sm" to="/seller/dashboard" />
        <button
          onClick={onClose}
          className="p-1.5 rounded-lg text-text-muted hover:text-text-main hover:bg-surface-muted transition-colors cursor-pointer"
          aria-label="Close sidebar"
        >
          <X className="w-5 h-5" />
        </button>
      </div>

      {/* Navigation List */}
      <div className="flex-1 overflow-y-auto py-4 px-3 space-y-6">
        {navGroups.map((group) => (
          <div key={group.group} className="space-y-1">
            <h4 className="px-3 text-[10px] font-bold uppercase tracking-widest text-text-muted/70">
              {group.group}
            </h4>
            <div className="space-y-0.5">
              {group.items.map((item) => {
                const Icon = item.icon;
                return (
                  <NavLink
                    key={item.to}
                    to={item.to}
                    end={item.end}
                    onClick={onClose}
                    className={({ isActive }) =>
                      `group flex items-center justify-between px-3 py-2 rounded-xl text-xs font-medium transition-all ${
                        isActive
                          ? 'bg-primary text-white shadow-xs font-semibold'
                          : 'text-text-muted hover:text-text-main hover:bg-surface-muted'
                      }`
                    }
                  >
                    {({ isActive }) => (
                      <>
                        <div className="flex items-center gap-2.5 min-w-0">
                          <Icon
                            className={`w-4 h-4 shrink-0 transition-transform group-hover:scale-110 ${
                              isActive
                                ? 'text-accent'
                                : 'text-text-muted group-hover:text-text-main'
                            }`}
                          />
                          <span className="truncate">{item.label}</span>
                        </div>

                        {/* Badges */}
                        <div className="flex items-center gap-1 shrink-0 ml-2">
                          {item.badge && (
                            <span
                              className={`px-1.5 py-0.5 text-[10px] font-bold rounded-md ${
                                item.badgeColor ||
                                (isActive
                                  ? 'bg-accent/20 text-accent'
                                  : 'bg-surface-muted text-text-muted border border-border')
                              }`}
                            >
                              {item.badge}
                            </span>
                          )}
                          {item.warningBadge && (
                            <span className="px-1.5 py-0.5 text-[10px] font-bold rounded-md bg-amber-100 text-amber-800 border border-amber-200">
                              {item.warningBadge}
                            </span>
                          )}
                        </div>
                      </>
                    )}
                  </NavLink>
                );
              })}
            </div>
          </div>
        ))}
      </div>

      {/* Sidebar Footer Stats / Status */}
      <div className="p-3 border-t border-border bg-surface-muted/30">
        <div className="p-2.5 rounded-xl bg-surface border border-border/70 flex items-center justify-between text-xs">
          <div className="flex items-center gap-2">
            <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
            <span className="font-medium text-[11px] text-text-main">
              Store Live & Accepting Orders
            </span>
          </div>
        </div>
      </div>
    </div>
  );

  return (
    <>
      {/* Desktop Persistent Sidebar */}
      <aside className="hidden lg:block w-64 shrink-0 h-[calc(100vh-4rem)] sticky top-16 z-30">
        {sidebarContent}
      </aside>

      {/* Mobile Drawer Backdrop & Sidebar */}
      {mobileOpen && (
        <div className="fixed inset-0 z-50 lg:hidden">
          <div
            className="fixed inset-0 bg-black/60 backdrop-blur-xs transition-opacity"
            onClick={onClose}
          />
          <div className="fixed inset-y-0 left-0 w-72 max-w-[85vw] shadow-2xl z-50">
            {sidebarContent}
          </div>
        </div>
      )}
    </>
  );
};

export default SellerSidebar;
