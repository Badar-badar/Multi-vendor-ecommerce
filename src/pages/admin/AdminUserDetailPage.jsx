import { useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import {
  Users,
  ArrowLeft,
  Mail,
  Phone,
  MapPin,
  Calendar,
  DollarSign,
  ShoppingCart,
  Heart,
  Star,
  Shield,
  Ban,
  RotateCcw,
  CheckCircle2,
} from 'lucide-react';
import { useSelector, useDispatch } from 'react-redux';
import toast from 'react-hot-toast';
import Button from '../../components/common/Button';
import Badge from '../../components/common/Badge';
import { formatCurrency } from '../../utils/formatCurrency';
import { selectAdminUsers } from '../../features/admin/adminSelectors';
import { updateUserStatusLocal } from '../../features/admin/adminSlice';

export const AdminUserDetailPage = () => {
  const { id } = useParams();
  const dispatch = useDispatch();
  const users = useSelector(selectAdminUsers);

  const user = users.find((u) => u.id === id) || users[0];

  if (!user) {
    return (
      <>
        <div className="p-8 text-center space-y-4">
          <p className="text-slate-500">Patron user not found.</p>
          <Link to="/admin/users">
            <Button variant="primary" size="sm">
              Return to Users
            </Button>
          </Link>
        </div>
      </>
    );
  }

  const handleToggleStatus = () => {
    const nextStatus = user.status === 'Active' ? 'Suspended' : 'Active';
    dispatch(updateUserStatusLocal({ userId: user.id, status: nextStatus }));
    toast.success(`User status changed to ${nextStatus}.`);
  };

  return (
    <>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-200">
          <div className="flex items-center gap-3">
            <Link to="/admin/users">
              <Button variant="ghost" size="sm" leftIcon={ArrowLeft}>
                Users
              </Button>
            </Link>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-xl sm:text-2xl font-serif font-bold text-slate-900">
                  {user.name}
                </h1>
                <Badge
                  variant={user.status === 'Active' ? 'success' : 'danger'}
                  size="xs"
                >
                  {user.status}
                </Badge>
              </div>
              <p className="text-xs text-slate-500">
                User ID: <span className="font-mono">{user.id}</span> · Joined: {user.joinedDate}
              </p>
            </div>
          </div>

          {user.role !== 'admin' && (
            <Button
              variant={user.status === 'Active' ? 'outline' : 'primary'}
              size="sm"
              leftIcon={user.status === 'Active' ? Ban : RotateCcw}
              onClick={handleToggleStatus}
              className={user.status === 'Active' ? 'text-rose-600 hover:bg-rose-50' : ''}
            >
              {user.status === 'Active' ? 'Suspend Account' : 'Reactivate Account'}
            </Button>
          )}
        </div>

        {/* Profile Card & Overview */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Main User Card */}
          <div className="bg-white p-6 rounded-2xl border border-slate-200/80 shadow-xs space-y-4">
            <div className="flex items-center gap-4">
              <img
                src={user.avatar}
                alt={user.name}
                className="w-16 h-16 rounded-2xl object-cover border border-slate-200"
              />
              <div>
                <h3 className="font-serif font-bold text-slate-900 text-base">{user.name}</h3>
                <span className="text-xs text-amber-800 font-semibold block">
                  {user.tier || 'Patron'}
                </span>
                <span className="text-[11px] text-slate-400 capitalize">{user.role}</span>
              </div>
            </div>

            <div className="space-y-2.5 pt-3 border-t border-slate-100 text-xs">
              <div className="flex items-center gap-2.5 text-slate-600">
                <Mail className="w-4 h-4 text-slate-400 shrink-0" />
                <span className="truncate">{user.email}</span>
              </div>
              <div className="flex items-center gap-2.5 text-slate-600">
                <Phone className="w-4 h-4 text-slate-400 shrink-0" />
                <span>{user.phone || '+44 20 7946 0912'}</span>
              </div>
              <div className="flex items-center gap-2.5 text-slate-600">
                <MapPin className="w-4 h-4 text-slate-400 shrink-0" />
                <span>{user.city ? `${user.city}, ${user.country}` : user.country}</span>
              </div>
            </div>
          </div>

          {/* Spend & Loyalty Metrics */}
          <div className="md:col-span-2 bg-white p-6 rounded-2xl border border-slate-200/80 shadow-xs flex flex-col justify-between space-y-4">
            <div>
              <h3 className="text-sm font-serif font-bold text-slate-900 pb-2 border-b border-slate-100">
                Patron Lifetime Metrics
              </h3>

              <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mt-4 text-center">
                <div className="p-3 bg-slate-50 rounded-xl border border-slate-100">
                  <span className="text-[11px] text-slate-400 block font-medium">Total Spend</span>
                  <p className="text-base sm:text-lg font-serif font-bold text-slate-900 mt-0.5">
                    {formatCurrency(user.spent || 0)}
                  </p>
                </div>

                <div className="p-3 bg-slate-50 rounded-xl border border-slate-100">
                  <span className="text-[11px] text-slate-400 block font-medium">Completed Orders</span>
                  <p className="text-base sm:text-lg font-serif font-bold text-slate-900 mt-0.5">
                    {user.ordersCount || 0}
                  </p>
                </div>

                <div className="p-3 bg-slate-50 rounded-xl border border-slate-100">
                  <span className="text-[11px] text-slate-400 block font-medium">Loyalty Points</span>
                  <p className="text-base sm:text-lg font-serif font-bold text-amber-800 mt-0.5">
                    {(user.loyaltyPoints || 4800).toLocaleString()}
                  </p>
                </div>

                <div className="p-3 bg-slate-50 rounded-xl border border-slate-100">
                  <span className="text-[11px] text-slate-400 block font-medium">Wishlist Items</span>
                  <p className="text-base sm:text-lg font-serif font-bold text-slate-900 mt-0.5">
                    {user.wishlistCount || 6}
                  </p>
                </div>
              </div>
            </div>

            <div className="p-3 bg-slate-50 rounded-xl border border-slate-200 text-xs text-slate-600 flex items-center justify-between">
              <span>Account Standing:</span>
              <strong className="text-emerald-700 font-bold">Good Standing · Sovereign Tier</strong>
            </div>
          </div>
        </div>

        {/* Saved Addresses & Recent Orders */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Saved Addresses */}
          <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-xs space-y-3">
            <h3 className="font-serif font-bold text-slate-900 text-sm pb-2 border-b border-slate-100">
              Verified Shipping Addresses
            </h3>
            <div className="space-y-2">
              {(user.addresses || [
                {
                  id: 'ADDR-1',
                  title: 'Primary Residence',
                  address: '14 Mayfair Gardens',
                  city: 'London',
                  postal: 'W1K 6ZA',
                  country: 'United Kingdom',
                  isDefault: true,
                },
              ]).map((addr) => (
                <div key={addr.id} className="p-3 rounded-xl bg-slate-50 border border-slate-100 text-xs space-y-1">
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-slate-900">{addr.title}</span>
                    {addr.isDefault && <Badge variant="accent" size="xs">Default</Badge>}
                  </div>
                  <p className="text-slate-600">{addr.address}, {addr.city} {addr.postal}, {addr.country}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Recent Orders */}
          <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-xs space-y-3">
            <h3 className="font-serif font-bold text-slate-900 text-sm pb-2 border-b border-slate-100">
              Recent Order History
            </h3>
            <div className="divide-y divide-slate-100 text-xs">
              {(user.recentOrders || [
                { id: 'ORD-9821', orderNumber: 'ZRN-2026-9821', date: '2026-09-06', amount: 8050, status: 'Processing' },
              ]).map((o) => (
                <div key={o.id} className="py-2.5 flex items-center justify-between">
                  <div>
                    <p className="font-mono font-bold text-slate-900">{o.orderNumber || o.id}</p>
                    <span className="text-[10px] text-slate-400">{o.date}</span>
                  </div>
                  <div className="text-right">
                    <p className="font-serif font-bold text-slate-900">{formatCurrency(o.amount)}</p>
                    <span className="text-[10px] text-slate-500">{o.status}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default AdminUserDetailPage;
