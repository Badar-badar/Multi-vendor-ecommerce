import { useState, useMemo } from 'react';
import { Link } from 'react-router-dom';
import {
  Store,
  Search,
  Filter,
  CheckCircle2,
  XCircle,
  AlertTriangle,
  Eye,
  Shield,
  Star,
  ExternalLink,
  Ban,
  Check,
  RotateCcw,
} from 'lucide-react';
import { useSelector, useDispatch } from 'react-redux';
import toast from 'react-hot-toast';
import Button from '../../components/common/Button';
import Badge from '../../components/common/Badge';
import Input from '../../components/common/Input';
import ConfirmModal from '../../components/common/ConfirmModal';
import { formatCurrency } from '../../utils/formatCurrency';
import { selectAdminSellers } from '../../features/admin/adminSelectors';
import { updateSellerStatusLocal } from '../../features/admin/adminSlice';

export const AdminSellersPage = () => {
  const dispatch = useDispatch();
  const sellers = useSelector(selectAdminSellers);

  const [searchTerm, setSearchTerm] = useState('');
  const [selectedStatus, setSelectedStatus] = useState('all');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [suspendTarget, setSuspendTarget] = useState(null);

  const filteredSellers = useMemo(() => {
    return sellers.filter((s) => {
      const matchesSearch =
        s.storeName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        s.ownerName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        s.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
        s.country?.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesStatus =
        selectedStatus === 'all' || s.status === selectedStatus;
      const matchesCat =
        selectedCategory === 'all' || s.category === selectedCategory;
      return matchesSearch && matchesStatus && matchesCat;
    });
  }, [sellers, searchTerm, selectedStatus, selectedCategory]);

  const handleApprove = (id) => {
    dispatch(updateSellerStatusLocal({ sellerId: id, status: 'Approved' }));
    toast.success('Seller application approved and accredited.');
  };

  const handleConfirmSuspend = () => {
    if (!suspendTarget) return;
    dispatch(updateSellerStatusLocal({ sellerId: suspendTarget.id, status: 'Suspended' }));
    toast.error(`Seller account "${suspendTarget.storeName}" suspended.`);
    setSuspendTarget(null);
  };

  const handleReactivate = (id) => {
    dispatch(updateSellerStatusLocal({ sellerId: id, status: 'Approved' }));
    toast.success('Seller account reactivated.');
  };

  const getStatusBadge = (status) => {
    switch (status) {
      case 'Approved':
        return <Badge variant="success" size="xs">Approved</Badge>;
      case 'Pending':
        return <Badge variant="warning" size="xs">Pending Review</Badge>;
      case 'Suspended':
        return <Badge variant="danger" size="xs">Suspended</Badge>;
      case 'Rejected':
        return <Badge variant="danger" size="xs">Rejected</Badge>;
      default:
        return <Badge variant="default" size="xs">{status}</Badge>;
    }
  };

  return (
    <>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-200">
          <div>
            <span className="text-[10px] font-bold uppercase tracking-wider text-amber-800 block mb-1">
              Marketplace Vendors
            </span>
            <h1 className="text-2xl sm:text-3xl font-serif font-bold text-slate-900">
              Seller Directory & Accreditation
            </h1>
            <p className="text-xs text-slate-500 mt-0.5">
              Review seller applications, monitor atelier performance, and manage marketplace authorizations.
            </p>
          </div>

          <div className="flex items-center gap-2">
            <span className="text-xs font-semibold text-slate-500">
              {filteredSellers.length} of {sellers.length} Sellers
            </span>
          </div>
        </div>

        {/* Toolbar */}
        <div className="bg-white p-4 rounded-2xl border border-slate-200/80 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div className="flex-1 max-w-sm">
            <Input
              placeholder="Search by store, owner, email, country..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              leftIcon={Search}
              size="sm"
            />
          </div>

          <div className="flex flex-wrap items-center gap-2">
            <select
              value={selectedStatus}
              onChange={(e) => setSelectedStatus(e.target.value)}
              className="px-3 py-1.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold text-slate-800 cursor-pointer"
            >
              <option value="all">All Statuses</option>
              <option value="Approved">Approved</option>
              <option value="Pending">Pending Review</option>
              <option value="Suspended">Suspended</option>
              <option value="Rejected">Rejected</option>
            </select>

            <select
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              className="px-3 py-1.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold text-slate-800 cursor-pointer"
            >
              <option value="all">All Categories</option>
              <option value="Haute Couture & Tailoring">Haute Couture</option>
              <option value="Jewelry & Watches">Jewelry & Watches</option>
              <option value="Haute Horlogerie">Haute Horlogerie</option>
              <option value="Leather Goods">Leather Goods</option>
              <option value="Living & Objet d’Art">Living & Objet d’Art</option>
            </select>
          </div>
        </div>

        {/* Sellers Table */}
        <div className="bg-white rounded-2xl border border-slate-200/80 shadow-xs overflow-hidden">
          {/* Desktop Table */}
          <div className="hidden lg:block overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-50 text-slate-500 uppercase tracking-wider text-[10px] font-bold border-b border-slate-200">
                <tr>
                  <th className="py-3.5 px-4">Store & Maison</th>
                  <th className="py-3.5 px-4">Owner & Contact</th>
                  <th className="py-3.5 px-4">Category</th>
                  <th className="py-3.5 px-4">Rating</th>
                  <th className="py-3.5 px-4">Products</th>
                  <th className="py-3.5 px-4">Gross Revenue</th>
                  <th className="py-3.5 px-4">Status</th>
                  <th className="py-3.5 px-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {filteredSellers.length === 0 ? (
                  <tr>
                    <td colSpan={8} className="py-8 text-center text-slate-500">
                      No sellers found matching filters.
                    </td>
                  </tr>
                ) : (
                  filteredSellers.map((seller) => (
                    <tr key={seller.id} className="hover:bg-slate-50/70 transition-colors">
                      <td className="py-3.5 px-4">
                        <div className="flex items-center gap-3">
                          <img
                            src={seller.logo}
                            alt={seller.storeName}
                            className="w-10 h-10 rounded-xl object-cover border border-slate-200 shrink-0"
                          />
                          <div>
                            <p className="font-bold text-slate-900">{seller.storeName}</p>
                            <span className="text-[10px] text-slate-400 font-mono">
                              {seller.id} · {seller.country}
                            </span>
                          </div>
                        </div>
                      </td>
                      <td className="py-3.5 px-4">
                        <p className="font-semibold text-slate-900">{seller.ownerName}</p>
                        <p className="text-[10px] text-slate-400">{seller.email}</p>
                      </td>
                      <td className="py-3.5 px-4 text-slate-700 font-medium">
                        {seller.category}
                      </td>
                      <td className="py-3.5 px-4">
                        {seller.rating > 0 ? (
                          <div className="flex items-center gap-1 font-bold text-slate-900">
                            <Star className="w-3.5 h-3.5 text-amber-500 fill-amber-500" />
                            <span>{seller.rating}</span>
                          </div>
                        ) : (
                          <span className="text-slate-400 text-[11px]">N/A</span>
                        )}
                      </td>
                      <td className="py-3.5 px-4 font-bold text-slate-900">
                        {seller.activeProducts || 0}
                      </td>
                      <td className="py-3.5 px-4 font-serif font-bold text-slate-900">
                        {formatCurrency(seller.gmv || 0)}
                      </td>
                      <td className="py-3.5 px-4">{getStatusBadge(seller.status)}</td>
                      <td className="py-3.5 px-4 text-right">
                        <div className="flex items-center justify-end gap-1.5">
                          <Link to={`/admin/sellers/${seller.id}`}>
                            <Button variant="outline" size="xs" leftIcon={Eye}>
                              Dossier
                            </Button>
                          </Link>

                          {seller.status === 'Pending' && (
                            <button
                              onClick={() => handleApprove(seller.id)}
                              className="p-1.5 rounded-lg text-emerald-600 hover:bg-emerald-50 cursor-pointer"
                              title="Approve Seller"
                            >
                              <Check className="w-4 h-4" />
                            </button>
                          )}

                          {seller.status === 'Approved' && (
                            <button
                              onClick={() => setSuspendTarget(seller)}
                              className="p-1.5 rounded-lg text-rose-500 hover:bg-rose-50 cursor-pointer"
                              title="Suspend Seller"
                            >
                              <Ban className="w-4 h-4" />
                            </button>
                          )}

                          {seller.status === 'Suspended' && (
                            <button
                              onClick={() => handleReactivate(seller.id)}
                              className="p-1.5 rounded-lg text-emerald-600 hover:bg-emerald-50 cursor-pointer"
                              title="Reactivate Seller"
                            >
                              <RotateCcw className="w-4 h-4" />
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

          {/* Mobile Cards */}
          <div className="lg:hidden divide-y divide-slate-100 p-4 space-y-4">
            {filteredSellers.map((seller) => (
              <div key={seller.id} className="pt-3 space-y-3">
                <div className="flex items-start gap-3">
                  <img
                    src={seller.logo}
                    alt={seller.storeName}
                    className="w-12 h-12 rounded-xl object-cover border border-slate-200 shrink-0"
                  />
                  <div className="min-w-0 flex-1">
                    <div className="flex items-center justify-between">
                      <p className="font-bold text-xs text-slate-900">{seller.storeName}</p>
                      {getStatusBadge(seller.status)}
                    </div>
                    <p className="text-[11px] text-slate-500 mt-0.5">
                      {seller.ownerName} ({seller.country})
                    </p>
                    <div className="flex items-center justify-between mt-2 text-xs">
                      <span className="font-serif font-bold text-slate-900">
                        {formatCurrency(seller.gmv || 0)}
                      </span>
                      <span className="text-slate-500">
                        Products: <strong>{seller.activeProducts || 0}</strong>
                      </span>
                    </div>
                  </div>
                </div>

                <div className="flex items-center justify-between pt-2 border-t border-slate-100">
                  <Link to={`/admin/sellers/${seller.id}`}>
                    <Button variant="outline" size="xs">
                      View Dossier
                    </Button>
                  </Link>

                  <div className="flex items-center gap-1.5">
                    {seller.status === 'Pending' && (
                      <button
                        onClick={() => handleApprove(seller.id)}
                        className="px-2.5 py-1 rounded-lg bg-emerald-50 text-emerald-700 text-xs font-semibold cursor-pointer"
                      >
                        Approve
                      </button>
                    )}
                    {seller.status === 'Approved' && (
                      <button
                        onClick={() => setSuspendTarget(seller)}
                        className="px-2.5 py-1 rounded-lg bg-rose-50 text-rose-700 text-xs font-semibold cursor-pointer"
                      >
                        Suspend
                      </button>
                    )}
                    {seller.status === 'Suspended' && (
                      <button
                        onClick={() => handleReactivate(seller.id)}
                        className="px-2.5 py-1 rounded-lg bg-emerald-50 text-emerald-700 text-xs font-semibold cursor-pointer"
                      >
                        Reactivate
                      </button>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Suspend Confirmation Modal */}
        <ConfirmModal
          isOpen={Boolean(suspendTarget)}
          onClose={() => setSuspendTarget(null)}
          onConfirm={handleConfirmSuspend}
          title="Suspend Seller Atelier?"
          message={`Are you sure you wish to suspend "${suspendTarget?.storeName}"? Their listings will immediately be suppressed from public discovery and active commissions held.`}
          confirmText="Suspend Seller"
          variant="danger"
        />
      </div>
    </>
  );
};

export default AdminSellersPage;
