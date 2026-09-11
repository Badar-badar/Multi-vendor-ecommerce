import { useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import {
  Store,
  ArrowLeft,
  Mail,
  Phone,
  MapPin,
  ShieldCheck,
  Star,
  DollarSign,
  Package,
  ShoppingCart,
  FileText,
  CreditCard,
  Ban,
  CheckCircle2,
  XCircle,
  AlertTriangle,
  RotateCcw,
  Percent,
} from 'lucide-react';
import { useSelector, useDispatch } from 'react-redux';
import toast from 'react-hot-toast';
import Button from '../../components/common/Button';
import Badge from '../../components/common/Badge';
import ConfirmModal from '../../components/common/ConfirmModal';
import { formatCurrency } from '../../utils/formatCurrency';
import {
  selectAdminSellers,
  selectAdminProducts,
  selectAdminOrders,
} from '../../features/admin/adminSelectors';
import {
  updateSellerStatusLocal,
  updateCommissionRateLocal,
} from '../../features/admin/adminSlice';

export const AdminSellerDetailPage = () => {
  const { id } = useParams();
  const dispatch = useDispatch();
  const sellers = useSelector(selectAdminSellers);
  const products = useSelector(selectAdminProducts);
  const orders = useSelector(selectAdminOrders);

  const seller = sellers.find((s) => s.id === id) || sellers[0];
  const sellerProducts = products.filter((p) => p.seller === seller?.storeName);

  const [activeTab, setActiveTab] = useState('overview');
  const [commissionRate, setCommissionRate] = useState(seller?.commissionRate || 10);
  const [isEditingRate, setIsEditingRate] = useState(false);
  const [isSuspendModalOpen, setIsSuspendModalOpen] = useState(false);

  if (!seller) {
    return (
      <>
        <div className="p-8 text-center space-y-4">
          <p className="text-slate-500">Seller not found.</p>
          <Link to="/admin/sellers">
            <Button variant="primary" size="sm">
              Return to Sellers
            </Button>
          </Link>
        </div>
      </>
    );
  }

  const handleApprove = () => {
    dispatch(updateSellerStatusLocal({ sellerId: seller.id, status: 'Approved' }));
    toast.success('Seller application approved and accredited.');
  };

  const handleConfirmSuspend = () => {
    dispatch(updateSellerStatusLocal({ sellerId: seller.id, status: 'Suspended' }));
    toast.error(`Seller account "${seller.storeName}" suspended.`);
    setIsSuspendModalOpen(false);
  };

  const handleReactivate = () => {
    dispatch(updateSellerStatusLocal({ sellerId: seller.id, status: 'Approved' }));
    toast.success('Seller account reactivated.');
  };

  const handleSaveCommissionRate = () => {
    dispatch(updateCommissionRateLocal({ sellerId: seller.id, rate: Number(commissionRate) }));
    setIsEditingRate(false);
    toast.success(`Platform commission rate updated to ${commissionRate}%.`);
  };

  return (
    <>
      <div className="space-y-6">
        {/* Top Back & Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-200">
          <div className="flex items-center gap-3">
            <Link to="/admin/sellers">
              <Button variant="ghost" size="sm" leftIcon={ArrowLeft}>
                Sellers
              </Button>
            </Link>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-xl sm:text-2xl font-serif font-bold text-slate-900">
                  {seller.storeName}
                </h1>
                <Badge
                  variant={
                    seller.status === 'Approved'
                      ? 'success'
                      : seller.status === 'Pending'
                      ? 'warning'
                      : 'danger'
                  }
                  size="xs"
                >
                  {seller.status}
                </Badge>
              </div>
              <p className="text-xs text-slate-500">
                Seller ID: <span className="font-mono">{seller.id}</span> · Joined: {seller.appliedDate}
              </p>
            </div>
          </div>

          {/* Lifecycle Action Buttons */}
          <div className="flex items-center gap-2">
            {seller.status === 'Pending' && (
              <Button variant="primary" size="sm" leftIcon={CheckCircle2} onClick={handleApprove}>
                Accredit & Approve
              </Button>
            )}
            {seller.status === 'Approved' && (
              <Button variant="outline" size="sm" leftIcon={Ban} onClick={() => setIsSuspendModalOpen(true)} className="text-rose-600 hover:bg-rose-50">
                Suspend Seller
              </Button>
            )}
            {seller.status === 'Suspended' && (
              <Button variant="primary" size="sm" leftIcon={RotateCcw} onClick={handleReactivate}>
                Reactivate Account
              </Button>
            )}
          </div>
        </div>

        {/* Hero Card with Store Banner & Info */}
        <div className="bg-white rounded-2xl border border-slate-200/80 shadow-xs overflow-hidden">
          <div className="relative h-44 bg-slate-900 overflow-hidden">
            <img
              src={seller.banner || 'https://images.unsplash.com/photo-1441986300917-64674bd600d8?w=800&auto=format&fit=crop&q=80'}
              alt={seller.storeName}
              className="w-full h-full object-cover opacity-70"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-slate-950/80 via-transparent to-transparent" />
            <div className="absolute bottom-4 left-6 flex items-center gap-4">
              <img
                src={seller.logo}
                alt={seller.storeName}
                className="w-16 h-16 rounded-2xl object-cover border-2 border-white shadow-md"
              />
              <div className="text-white">
                <h2 className="font-serif font-bold text-xl drop-shadow-sm">{seller.storeName}</h2>
                <p className="text-xs text-slate-300 font-medium">
                  {seller.category} · {seller.tier}
                </p>
              </div>
            </div>
          </div>

          {/* Quick Stats Grid */}
          <div className="grid grid-cols-2 sm:grid-cols-4 divide-y sm:divide-y-0 sm:divide-x divide-slate-100 p-4 bg-slate-50/50 text-center text-xs">
            <div className="p-3">
              <span className="text-slate-500 text-[11px] block">Gross Merchandise Value</span>
              <p className="text-lg font-serif font-bold text-slate-900 mt-0.5">
                {formatCurrency(seller.gmv || 0)}
              </p>
            </div>
            <div className="p-3">
              <span className="text-slate-500 text-[11px] block">Active Catalog Items</span>
              <p className="text-lg font-serif font-bold text-slate-900 mt-0.5">
                {seller.activeProducts || sellerProducts.length}
              </p>
            </div>
            <div className="p-3">
              <span className="text-slate-500 text-[11px] block">Customer Rating</span>
              <p className="text-lg font-serif font-bold text-slate-900 mt-0.5 flex items-center justify-center gap-1">
                <Star className="w-4 h-4 text-amber-500 fill-amber-500" />
                {seller.rating > 0 ? seller.rating : '5.0'}
              </p>
            </div>
            <div className="p-3">
              <span className="text-slate-500 text-[11px] block">Platform Take Rate</span>
              <p className="text-lg font-serif font-bold text-amber-800 mt-0.5">
                {seller.commissionRate}%
              </p>
            </div>
          </div>
        </div>

        {/* Tab Navigation */}
        <div className="flex border-b border-slate-200 gap-6 text-xs font-semibold">
          {['overview', 'products', 'compliance', 'payouts'].map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`pb-3 capitalize transition-all cursor-pointer ${
                activeTab === tab
                  ? 'border-b-2 border-slate-900 text-slate-900 font-bold'
                  : 'text-slate-500 hover:text-slate-900'
              }`}
            >
              {tab === 'compliance' ? 'KYC & Compliance' : tab}
            </button>
          ))}
        </div>

        {/* Tab 1: Overview */}
        {activeTab === 'overview' && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Business Contact */}
            <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-xs space-y-4">
              <h3 className="text-sm font-serif font-bold text-slate-900 pb-2 border-b border-slate-100">
                Business & Contact Details
              </h3>
              <div className="space-y-2.5 text-xs">
                <div className="flex justify-between">
                  <span className="text-slate-500">Legal Representative:</span>
                  <span className="font-bold text-slate-900">{seller.ownerName}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-500">Contact Email:</span>
                  <span className="font-semibold text-slate-800">{seller.email}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-500">Business Telephone:</span>
                  <span className="font-semibold text-slate-800">{seller.phone || '+33 1 42 68 55 00'}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-500">Registered Atelier Address:</span>
                  <span className="font-semibold text-slate-800 text-right max-w-[220px]">
                    {seller.address || `${seller.city || 'Paris'}, ${seller.country}`}
                  </span>
                </div>
              </div>
            </div>

            {/* Platform Settings */}
            <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-xs space-y-4">
              <h3 className="text-sm font-serif font-bold text-slate-900 pb-2 border-b border-slate-100">
                Contract & Take Rate
              </h3>
              <div className="space-y-3 text-xs">
                <div className="flex items-center justify-between">
                  <span className="text-slate-500">Platform Commission:</span>
                  {isEditingRate ? (
                    <div className="flex items-center gap-2">
                      <input
                        type="number"
                        value={commissionRate}
                        onChange={(e) => setCommissionRate(e.target.value)}
                        className="w-16 px-2 py-1 border border-slate-200 rounded-lg text-xs font-bold text-slate-900"
                        min="0"
                        max="50"
                      />
                      <button
                        onClick={handleSaveCommissionRate}
                        className="px-2 py-1 bg-slate-900 text-white rounded-lg text-[11px] font-bold cursor-pointer"
                      >
                        Save
                      </button>
                    </div>
                  ) : (
                    <div className="flex items-center gap-2">
                      <strong className="font-bold text-amber-800 text-sm">{seller.commissionRate}%</strong>
                      <button
                        onClick={() => setIsEditingRate(true)}
                        className="text-[11px] text-slate-500 hover:underline cursor-pointer"
                      >
                        Edit
                      </button>
                    </div>
                  )}
                </div>

                <div className="flex justify-between">
                  <span className="text-slate-500">Payout Settlement Cycle:</span>
                  <span className="font-bold text-slate-800">Bi-Weekly (1st & 15th)</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-500">Escrow Hold Policy:</span>
                  <span className="font-bold text-emerald-700">14-Day Post-Delivery</span>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Tab 2: Products */}
        {activeTab === 'products' && (
          <div className="bg-white rounded-2xl border border-slate-200/80 shadow-xs overflow-hidden">
            <div className="p-4 border-b border-slate-100 flex items-center justify-between">
              <h3 className="font-serif font-bold text-slate-900 text-sm">
                Products Listed by {seller.storeName}
              </h3>
              <span className="text-xs text-slate-500">{sellerProducts.length} Items</span>
            </div>

            <div className="divide-y divide-slate-100">
              {sellerProducts.map((p) => (
                <div key={p.id} className="p-4 flex items-center justify-between gap-4 text-xs">
                  <div className="flex items-center gap-3 min-w-0">
                    <img
                      src={p.image}
                      alt={p.name}
                      className="w-12 h-12 rounded-xl object-cover border border-slate-200"
                    />
                    <div>
                      <p className="font-bold text-slate-900">{p.name}</p>
                      <p className="text-[11px] text-slate-400">SKU: {p.sku} · Stock: {p.stock}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-4">
                    <span className="font-serif font-bold text-slate-900 text-sm">
                      {formatCurrency(p.price)}
                    </span>
                    <Badge variant={p.status === 'Approved' ? 'success' : 'warning'} size="xs">
                      {p.status}
                    </Badge>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Tab 3: KYC & Compliance */}
        {activeTab === 'compliance' && (
          <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-xs space-y-4">
            <h3 className="text-sm font-serif font-bold text-slate-900 pb-2 border-b border-slate-100">
              Submitted Legal & Certification Documents
            </h3>

            <div className="divide-y divide-slate-100">
              {(seller.documents || []).map((doc, idx) => (
                <div key={idx} className="py-3 flex items-center justify-between gap-3 text-xs">
                  <div className="flex items-center gap-3">
                    <FileText className="w-5 h-5 text-amber-800" />
                    <div>
                      <p className="font-bold text-slate-900">{doc.name}</p>
                      <p className="text-[10px] text-slate-400">Submitted: {doc.date || seller.appliedDate}</p>
                    </div>
                  </div>
                  <Badge variant={doc.verified ? 'success' : 'warning'} size="xs">
                    {doc.verified ? 'Verified & Authenticated' : 'Under Review'}
                  </Badge>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Tab 4: Payouts */}
        {activeTab === 'payouts' && (
          <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-xs space-y-4">
            <h3 className="text-sm font-serif font-bold text-slate-900 pb-2 border-b border-slate-100">
              Banking & Payout Method
            </h3>
            <div className="space-y-3 text-xs">
              <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 space-y-2">
                <div className="flex items-center gap-2 text-slate-800 font-bold">
                  <CreditCard className="w-4 h-4 text-amber-800" />
                  <span>{seller.payoutMethod || 'Direct Bank Wire'}</span>
                </div>
                <p className="text-[11px] text-slate-500">
                  Bank: <strong className="text-slate-800">{seller.bankName || 'BNP Paribas Private Banking'}</strong>
                </p>
                <div className="flex justify-between pt-2 border-t border-slate-200 text-xs">
                  <span>Pending Escrow Balance:</span>
                  <span className="font-serif font-bold text-slate-900">
                    {formatCurrency(seller.payoutBalance || 28500)}
                  </span>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Suspend Confirmation Modal */}
        <ConfirmModal
          isOpen={isSuspendModalOpen}
          onClose={() => setIsSuspendModalOpen(false)}
          onConfirm={handleConfirmSuspend}
          title="Suspend Seller Atelier?"
          message={`Are you sure you wish to suspend "${seller.storeName}" (${seller.ownerName})? This will immediately hide their catalog listings and freeze disbursement escrows.`}
          confirmText="Suspend Seller"
          variant="danger"
        />
      </div>
    </>
  );
};

export default AdminSellerDetailPage;
