import { NavLink } from 'react-router-dom';
import {
  LayoutDashboard,
  Users,
  Store,
  Package,
  Layers,
  Award,
  ShoppingCart,
  CreditCard,
  Percent,
  MessageSquare,
  Tag,
  BarChart3,
  Settings,
  Shield,
  Bell,
  X,
  FolderTree,
  RotateCcw,
  Sparkles,
} from 'lucide-react';
import { useSelector } from 'react-redux';
import {
  selectPendingSellers,
  selectPendingProducts,
  selectPendingRefunds,
  selectFlaggedReviews,
} from '../../features/admin/adminSelectors';
import Logo from '../common/Logo';

export const AdminSidebar = ({ mobileOpen = false, onClose = () => {} }) => {
  const pendingSellers = useSelector(selectPendingSellers) || [];
  const pendingProducts = useSelector(selectPendingProducts) || [];
  const pendingRefunds = useSelector(selectPendingRefunds) || [];
  const flaggedReviews = useSelector(selectFlaggedReviews) || [];

  const navGroups = [
    {
      group: 'OVERVIEW',
      items: [
        {
          to: '/admin/dashboard',
          label: 'Dashboard',
          icon: LayoutDashboard,
          end: true,
        },
        {
          to: '/admin/reports',
          label: 'Executive Reports',
          icon: BarChart3,
        },
      ],
    },
    {
      group: 'CATALOG',
      items: [
        {
          to: '/admin/products',
          label: 'Products',
          icon: Package,
          badge:
            pendingProducts.length > 0
              ? `${pendingProducts.length} Pending`
              : null,
          badgeColor: 'bg-amber-100 text-amber-900 border border-amber-300',
        },
        { to: '/admin/categories', label: 'Categories', icon: Layers },
        { to: '/admin/subcategories', label: 'Subcategories', icon: FolderTree },
        { to: '/admin/brands', label: 'Brands', icon: Award },
      ],
    },
    {
      group: 'MARKETPLACE',
      items: [
        {
          to: '/admin/sellers',
          label: 'Sellers',
          icon: Store,
          badge:
            pendingSellers.length > 0
              ? `${pendingSellers.length} New`
              : null,
          badgeColor: 'bg-amber-100 text-amber-900 border border-amber-300',
        },
        { to: '/admin/users', label: 'Customers', icon: Users },
        { to: '/admin/orders', label: 'Orders', icon: ShoppingCart },
      ],
    },
    {
      group: 'FINANCE',
      items: [
        { to: '/admin/payments', label: 'Payments', icon: CreditCard },
        {
          to: '/admin/refunds',
          label: 'Refunds',
          icon: RotateCcw,
          badge:
            pendingRefunds.length > 0
              ? `${pendingRefunds.length} Action`
              : null,
          badgeColor: 'bg-rose-100 text-rose-800 border border-rose-200',
        },
        { to: '/admin/commissions', label: 'Commissions', icon: Percent },
      ],
    },
    {
      group: 'MARKETING',
      items: [
        { to: '/admin/coupons', label: 'Coupons', icon: Tag },
        { to: '/admin/promotions', label: 'Promotions', icon: Sparkles },
      ],
    },
    {
      group: 'MODERATION',
      items: [
        {
          to: '/admin/reviews',
          label: 'Customer Reviews',
          icon: MessageSquare,
          badge:
            flaggedReviews.length > 0
              ? `${flaggedReviews.length} Flagged`
              : null,
          badgeColor: 'bg-rose-100 text-rose-800 border border-rose-200',
        },
      ],
    },
    {
      group: 'SYSTEM',
      items: [
        { to: '/admin/notifications', label: 'Broadcasts', icon: Bell },
        { to: '/admin/audit-logs', label: 'Audit Logs', icon: Shield },
        { to: '/admin/settings', label: 'Global Settings', icon: Settings },
      ],
    },
  ];

  const sidebarContent = (
    <div className="flex flex-col h-full bg-surface text-text-main border-r border-border">
      {/* Mobile Drawer Header */}
      <div className="flex lg:hidden items-center justify-between p-4 border-b border-border">
        <Logo variant="admin" size="sm" to="/admin/dashboard" />
        <button
          onClick={onClose}
          className="p-1.5 rounded-lg text-text-muted hover:text-text-main hover:bg-surface-muted transition-colors cursor-pointer"
          aria-label="Close admin sidebar"
        >
          <X className="w-5 h-5" />
        </button>
      </div>

      {/* Navigation Groups */}
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
                          ? 'bg-primary text-white font-semibold shadow-xs'
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
                                ? 'text-white'
                                : 'text-text-muted group-hover:text-text-main'
                            }`}
                          />
                          <span className="truncate">{item.label}</span>
                        </div>

                        {item.badge && (
                          <span
                            className={`px-1.5 py-0.5 text-[10px] font-bold rounded-md ${
                              item.badgeColor || 'bg-surface-muted text-text-main'
                            }`}
                          >
                            {item.badge}
                          </span>
                        )}
                      </>
                    )}
                  </NavLink>
                );
              })}
            </div>
          </div>
        ))}
      </div>

      {/* Admin Status Pill */}
      <div className="p-3 border-t border-border bg-surface-muted/60">
        <div className="flex items-center gap-3 px-3 py-2.5 rounded-xl bg-surface border border-border">
          <div className="p-1.5 rounded-lg bg-primary/10 text-primary shrink-0">
            <Shield className="w-4 h-4 text-primary" />
          </div>
          <div className="min-w-0 flex-1">
            <p className="text-xs font-bold text-text-main truncate">
              Root Governance
            </p>
            <p className="text-[10px] text-text-muted truncate">Full Access Granted</p>
          </div>
          <span className="w-2 h-2 rounded-full bg-emerald-500 shrink-0" title="Active" />
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
            className="fixed inset-0 bg-black/70 backdrop-blur-xs transition-opacity"
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

export default AdminSidebar;
