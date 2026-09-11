import { useState, useMemo } from 'react';
import { Link } from 'react-router-dom';
import {
  Users,
  Search,
  Filter,
  Eye,
  ShieldAlert,
  CheckCircle2,
  XCircle,
  Ban,
  RotateCcw,
  Sparkles,
} from 'lucide-react';
import { useSelector, useDispatch } from 'react-redux';
import toast from 'react-hot-toast';
import Button from '../../components/common/Button';
import Badge from '../../components/common/Badge';
import Input from '../../components/common/Input';
import { formatCurrency } from '../../utils/formatCurrency';
import { selectAdminUsers } from '../../features/admin/adminSelectors';
import { updateUserStatusLocal } from '../../features/admin/adminSlice';

export const AdminUsersPage = () => {
  const dispatch = useDispatch();
  const users = useSelector(selectAdminUsers);

  const [searchTerm, setSearchTerm] = useState('');
  const [selectedRole, setSelectedRole] = useState('all');
  const [selectedStatus, setSelectedStatus] = useState('all');

  const filteredUsers = useMemo(() => {
    return users.filter((u) => {
      const matchesSearch =
        u.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        u.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
        u.country?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        u.id.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesRole = selectedRole === 'all' || u.role === selectedRole;
      const matchesStatus =
        selectedStatus === 'all' || u.status === selectedStatus;
      return matchesSearch && matchesRole && matchesStatus;
    });
  }, [users, searchTerm, selectedRole, selectedStatus]);

  const handleToggleStatus = (user) => {
    const nextStatus = user.status === 'Active' ? 'Suspended' : 'Active';
    dispatch(updateUserStatusLocal({ userId: user.id, status: nextStatus }));
    toast.success(`User ${nextStatus === 'Active' ? 'activated' : 'suspended'}.`);
  };

  return (
    <>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-200">
          <div>
            <span className="text-[10px] font-bold uppercase tracking-wider text-amber-800 block mb-1">
              Patron Registry
            </span>
            <h1 className="text-2xl sm:text-3xl font-serif font-bold text-slate-900">
              Customer & User Management
            </h1>
            <p className="text-xs text-slate-500 mt-0.5">
              Oversee client VIP tiers, spend history, and account security.
            </p>
          </div>

          <div className="flex items-center gap-2">
            <span className="text-xs font-semibold text-slate-500">
              {filteredUsers.length} of {users.length} Users
            </span>
          </div>
        </div>

        {/* Toolbar */}
        <div className="bg-white p-4 rounded-2xl border border-slate-200/80 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div className="flex-1 max-w-sm">
            <Input
              placeholder="Search by name, email, ID, country..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              leftIcon={Search}
              size="sm"
            />
          </div>

          <div className="flex flex-wrap items-center gap-2">
            <select
              value={selectedRole}
              onChange={(e) => setSelectedRole(e.target.value)}
              className="px-3 py-1.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold text-slate-800 cursor-pointer"
            >
              <option value="all">All Roles</option>
              <option value="customer">Customers</option>
              <option value="seller">Sellers</option>
              <option value="admin">SuperAdmins</option>
            </select>

            <select
              value={selectedStatus}
              onChange={(e) => setSelectedStatus(e.target.value)}
              className="px-3 py-1.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold text-slate-800 cursor-pointer"
            >
              <option value="all">All Statuses</option>
              <option value="Active">Active</option>
              <option value="Suspended">Suspended</option>
              <option value="Pending Verification">Pending</option>
            </select>
          </div>
        </div>

        {/* Users Table */}
        <div className="bg-white rounded-2xl border border-slate-200/80 shadow-xs overflow-hidden">
          {/* Desktop Table */}
          <div className="hidden lg:block overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-50 text-slate-500 uppercase tracking-wider text-[10px] font-bold border-b border-slate-200">
                <tr>
                  <th className="py-3.5 px-4">User</th>
                  <th className="py-3.5 px-4">Role & Tier</th>
                  <th className="py-3.5 px-4">Location</th>
                  <th className="py-3.5 px-4">Registered</th>
                  <th className="py-3.5 px-4">Orders</th>
                  <th className="py-3.5 px-4">Lifetime Spend</th>
                  <th className="py-3.5 px-4">Status</th>
                  <th className="py-3.5 px-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {filteredUsers.length === 0 ? (
                  <tr>
                    <td colSpan={8} className="py-8 text-center text-slate-500">
                      No users match your criteria.
                    </td>
                  </tr>
                ) : (
                  filteredUsers.map((user) => (
                    <tr key={user.id} className="hover:bg-slate-50/70 transition-colors">
                      <td className="py-3.5 px-4">
                        <div className="flex items-center gap-3">
                          <img
                            src={user.avatar}
                            alt={user.name}
                            className="w-10 h-10 rounded-xl object-cover border border-slate-200 shrink-0"
                          />
                          <div>
                            <p className="font-bold text-slate-900">{user.name}</p>
                            <p className="text-[11px] text-slate-400">{user.email}</p>
                          </div>
                        </div>
                      </td>
                      <td className="py-3.5 px-4">
                        <div className="space-y-0.5">
                          <span className="capitalize font-semibold text-slate-800 block">
                            {user.role}
                          </span>
                          <span className="text-[10px] text-amber-800 font-medium">
                            {user.tier || 'Standard Patron'}
                          </span>
                        </div>
                      </td>
                      <td className="py-3.5 px-4 text-slate-700">{user.country}</td>
                      <td className="py-3.5 px-4 text-slate-400 text-[11px] whitespace-nowrap">
                        {user.joinedDate}
                      </td>
                      <td className="py-3.5 px-4 font-bold text-slate-900">
                        {user.ordersCount || 0}
                      </td>
                      <td className="py-3.5 px-4 font-serif font-bold text-slate-900">
                        {formatCurrency(user.spent || 0)}
                      </td>
                      <td className="py-3.5 px-4">
                        <Badge
                          variant={
                            user.status === 'Active'
                              ? 'success'
                              : user.status === 'Suspended'
                              ? 'danger'
                              : 'warning'
                          }
                          size="xs"
                        >
                          {user.status}
                        </Badge>
                      </td>
                      <td className="py-3.5 px-4 text-right">
                        <div className="flex items-center justify-end gap-1.5">
                          <Link to={`/admin/users/${user.id}`}>
                            <Button variant="outline" size="xs" leftIcon={Eye}>
                              Profile
                            </Button>
                          </Link>
                          {user.role !== 'admin' && (
                            <button
                              onClick={() => handleToggleStatus(user)}
                              className={`p-1.5 rounded-lg cursor-pointer ${
                                user.status === 'Suspended'
                                  ? 'text-emerald-600 hover:bg-emerald-50'
                                  : 'text-slate-400 hover:text-rose-600 hover:bg-rose-50'
                              }`}
                              title={user.status === 'Suspended' ? 'Activate User' : 'Suspend User'}
                            >
                              {user.status === 'Suspended' ? (
                                <RotateCcw className="w-4 h-4" />
                              ) : (
                                <Ban className="w-4 h-4" />
                              )}
                            </button>
                          )}
                        </div>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>

          {/* Mobile View */}
          <div className="lg:hidden divide-y divide-slate-100 p-4 space-y-4">
            {filteredUsers.map((user) => (
              <div key={user.id} className="pt-3 space-y-3">
                <div className="flex items-start gap-3">
                  <img
                    src={user.avatar}
                    alt={user.name}
                    className="w-12 h-12 rounded-xl object-cover border border-slate-200 shrink-0"
                  />
                  <div className="min-w-0 flex-1">
                    <div className="flex items-center justify-between">
                      <p className="font-bold text-xs text-slate-900">{user.name}</p>
                      <Badge
                        variant={user.status === 'Active' ? 'success' : 'danger'}
                        size="xs"
                      >
                        {user.status}
                      </Badge>
                    </div>
                    <p className="text-[11px] text-slate-500">{user.email}</p>
                    <div className="flex items-center justify-between mt-2 text-xs">
                      <span className="font-serif font-bold text-slate-900">
                        {formatCurrency(user.spent || 0)}
                      </span>
                      <span className="text-slate-500">
                        Orders: <strong>{user.ordersCount || 0}</strong>
                      </span>
                    </div>
                  </div>
                </div>

                <div className="flex items-center justify-between pt-2 border-t border-slate-100">
                  <Link to={`/admin/users/${user.id}`}>
                    <Button variant="outline" size="xs">
                      View Profile
                    </Button>
                  </Link>

                  {user.role !== 'admin' && (
                    <button
                      onClick={() => handleToggleStatus(user)}
                      className={`px-2.5 py-1 rounded-lg text-xs font-semibold cursor-pointer ${
                        user.status === 'Suspended'
                          ? 'bg-emerald-50 text-emerald-700'
                          : 'bg-rose-50 text-rose-700'
                      }`}
                    >
                      {user.status === 'Suspended' ? 'Activate' : 'Suspend'}
                    </button>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </>
  );
};

export default AdminUsersPage;
