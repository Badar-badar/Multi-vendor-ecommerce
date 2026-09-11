import { useState, useMemo } from 'react';
import {
  Tag,
  Plus,
  Edit,
  Trash2,
  Search,
  PowerOff,
  Percent,
  DollarSign,
  Calendar,
  Users,
  Copy,
  Check,
} from 'lucide-react';
import { useSelector, useDispatch } from 'react-redux';
import toast from 'react-hot-toast';
import Button from '../../components/common/Button';
import Badge from '../../components/common/Badge';
import Input from '../../components/common/Input';
import ConfirmModal from '../../components/common/ConfirmModal';
import { formatCurrency } from '../../utils/formatCurrency';
import { selectAdminCoupons } from '../../features/admin/adminSelectors';
import {
  addCouponLocal,
  updateCouponLocal,
  deleteCouponLocal,
} from '../../features/admin/adminSlice';

export const AdminCouponsPage = () => {
  const dispatch = useDispatch();
  const coupons = useSelector(selectAdminCoupons);

  const [searchTerm, setSearchTerm] = useState('');
  const [selectedStatus, setSelectedStatus] = useState('all');
  const [selectedType, setSelectedType] = useState('all');
  const [modalOpen, setModalOpen] = useState(false);
  const [deleteTarget, setDeleteTarget] = useState(null);
  const [editingCoupon, setEditingCoupon] = useState(null);
  const [copiedCode, setCopiedCode] = useState(null);

  const [formData, setFormData] = useState({
    code: '',
    type: 'percentage',
    discount: 10,
    minSpend: 1000,
    maxDiscount: 500,
    usageLimit: 100,
    validFrom: '2026-09-01',
    validUntil: '2026-12-31',
    status: 'Active',
    description: '',
  });

  const filteredCoupons = useMemo(() => {
    return coupons.filter((c) => {
      const matchesSearch =
        c.code.toLowerCase().includes(searchTerm.toLowerCase()) ||
        c.description?.toLowerCase().includes(searchTerm.toLowerCase());

      const matchesStatus =
        selectedStatus === 'all' || c.status === selectedStatus;

      const matchesType =
        selectedType === 'all' || (c.type || 'percentage') === selectedType;

      return matchesSearch && matchesStatus && matchesType;
    });
  }, [coupons, searchTerm, selectedStatus, selectedType]);

  const handleCopyCode = (code) => {
    navigator.clipboard.writeText(code);
    setCopiedCode(code);
    toast.success(`Coupon code "${code}" copied.`);
    setTimeout(() => setCopiedCode(null), 2000);
  };

  const openCreateModal = () => {
    setEditingCoupon(null);
    setFormData({
      code: '',
      type: 'percentage',
      discount: 15,
      minSpend: 2000,
      maxDiscount: 1000,
      usageLimit: 200,
      validFrom: new Date().toISOString().slice(0, 10),
      validUntil: '2026-12-31',
      status: 'Active',
      description: '',
    });
    setModalOpen(true);
  };

  const openEditModal = (coupon) => {
    setEditingCoupon(coupon);
    setFormData({
      code: coupon.code,
      type: coupon.type || 'percentage',
      discount: coupon.discount || coupon.value || 10,
      minSpend: coupon.minSpend || 1000,
      maxDiscount: coupon.maxDiscount || 500,
      usageLimit: coupon.usageLimit || 100,
      validFrom: coupon.validFrom || '',
      validUntil: coupon.validUntil || '',
      status: coupon.status || 'Active',
      description: coupon.description || '',
    });
    setModalOpen(true);
  };

  const handleSave = (e) => {
    e.preventDefault();
    if (!formData.code) {
      toast.error('Coupon code is required');
      return;
    }

    if (editingCoupon) {
      dispatch(
        updateCouponLocal({
          id: editingCoupon.id,
          ...formData,
        })
      );
      toast.success('Coupon updated successfully.');
    } else {
      const newCoupon = {
        id: `CPN-${Date.now().toString().slice(-3)}`,
        ...formData,
        code: formData.code.toUpperCase().replace(/\s+/g, ''),
        usedCount: 0,
      };
      dispatch(addCouponLocal(newCoupon));
      toast.success('VIP privilege coupon created.');
    }
    setModalOpen(false);
  };

  const handleToggleStatus = (c) => {
    const nextStatus = c.status === 'Active' ? 'Disabled' : 'Active';
    dispatch(updateCouponLocal({ id: c.id, status: nextStatus }));
    toast.success(`Coupon ${nextStatus.toLowerCase()}.`);
  };

  const handleConfirmDelete = () => {
    if (!deleteTarget) return;
    dispatch(deleteCouponLocal(deleteTarget.id));
    toast.success(`Coupon "${deleteTarget.code}" deleted.`);
    setDeleteTarget(null);
  };

  return (
    <>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-200">
          <div>
            <span className="text-[10px] font-bold uppercase tracking-wider text-amber-800 block mb-1">
              Marketing & Privileges
            </span>
            <h1 className="text-2xl sm:text-3xl font-serif font-bold text-slate-900">
              VIP Coupons & Promotional Codes
            </h1>
            <p className="text-xs text-slate-500 mt-0.5">
              Create and manage bespoke voucher codes for private salon clients and global promotional campaigns.
            </p>
          </div>

          <div className="flex items-center gap-2">
            <Button variant="primary" size="sm" leftIcon={Plus} onClick={openCreateModal}>
              Create Coupon
            </Button>
          </div>
        </div>

        {/* Toolbar */}
        <div className="bg-white p-4 rounded-2xl border border-slate-200/80 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-3">
          <div className="flex-1 max-w-sm">
            <Input
              placeholder="Search coupon codes or descriptions..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              leftIcon={Search}
              size="sm"
            />
          </div>

          <div className="flex flex-wrap items-center gap-2 text-xs">
            <select
              value={selectedStatus}
              onChange={(e) => setSelectedStatus(e.target.value)}
              className="px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl font-semibold text-slate-800 cursor-pointer text-xs"
            >
              <option value="all">All Statuses</option>
              <option value="Active">Active</option>
              <option value="Disabled">Disabled</option>
              <option value="Expired">Expired</option>
            </select>

            <select
              value={selectedType}
              onChange={(e) => setSelectedType(e.target.value)}
              className="px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl font-semibold text-slate-800 cursor-pointer text-xs"
            >
              <option value="all">All Discount Types</option>
              <option value="percentage">Percentage (%)</option>
              <option value="fixed">Fixed Dollar ($)</option>
            </select>

            <span className="text-xs font-semibold text-slate-500 ml-2">
              {filteredCoupons.length} Vouchers
            </span>
          </div>
        </div>

        {/* Coupons Table */}
        <div className="bg-white rounded-2xl border border-slate-200/80 shadow-xs overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-50 text-slate-500 uppercase tracking-wider text-[10px] font-bold border-b border-slate-200">
                <tr>
                  <th className="py-3.5 px-4">Coupon Code</th>
                  <th className="py-3.5 px-4">Discount Value</th>
                  <th className="py-3.5 px-4">Min Spend</th>
                  <th className="py-3.5 px-4">Max Cap</th>
                  <th className="py-3.5 px-4">Usage Count</th>
                  <th className="py-3.5 px-4">Validity</th>
                  <th className="py-3.5 px-4">Status</th>
                  <th className="py-3.5 px-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {filteredCoupons.length === 0 ? (
                  <tr>
                    <td colSpan={8} className="py-8 text-center text-slate-500">
                      No coupon codes found matching the filter criteria.
                    </td>
                  </tr>
                ) : (
                  filteredCoupons.map((c) => (
                    <tr key={c.id} className="hover:bg-slate-50/70 transition-colors">
                      <td className="py-3.5 px-4">
                        <div className="flex items-center gap-2">
                          <span className="font-mono font-bold text-slate-900 px-2.5 py-1 rounded-md bg-amber-50 text-amber-900 border border-amber-200 text-xs">
                            {c.code}
                          </span>
                          <button
                            onClick={() => handleCopyCode(c.code)}
                            className="p-1 rounded text-slate-400 hover:text-slate-700 cursor-pointer"
                            title="Copy code"
                          >
                            {copiedCode === c.code ? (
                              <Check className="w-3.5 h-3.5 text-emerald-600" />
                            ) : (
                              <Copy className="w-3.5 h-3.5" />
                            )}
                          </button>
                        </div>
                        {c.description && (
                          <p className="text-[11px] text-slate-400 mt-1 max-w-[200px] truncate">
                            {c.description}
                          </p>
                        )}
                      </td>
                      <td className="py-3.5 px-4 font-bold text-slate-900">
                        {c.type === 'percentage' ? `${c.discount || c.value}% Off` : `$${c.discount || c.value} Flat`}
                      </td>
                      <td className="py-3.5 px-4 font-serif font-semibold text-slate-700">
                        {formatCurrency(c.minSpend || 0)}
                      </td>
                      <td className="py-3.5 px-4 font-serif text-slate-700">
                        {c.maxDiscount ? formatCurrency(c.maxDiscount) : 'No Cap'}
                      </td>
                      <td className="py-3.5 px-4">
                        <span className="text-slate-800 font-semibold">
                          {c.usedCount || c.timesUsed || 0}
                        </span>{' '}
                        <span className="text-slate-400">/ {c.usageLimit}</span>
                      </td>
                      <td className="py-3.5 px-4 text-slate-400 text-[11px] whitespace-nowrap">
                        {c.validUntil}
                      </td>
                      <td className="py-3.5 px-4">
                        <Badge
                          variant={
                            c.status === 'Active'
                              ? 'success'
                              : c.status === 'Expired'
                              ? 'danger'
                              : 'secondary'
                          }
                          size="xs"
                        >
                          {c.status}
                        </Badge>
                      </td>
                      <td className="py-3.5 px-4 text-right">
                        <div className="flex items-center justify-end gap-1.5">
                          <button
                            onClick={() => openEditModal(c)}
                            className="p-1.5 rounded-lg text-slate-500 hover:text-slate-900 hover:bg-slate-100 cursor-pointer"
                            title="Edit Coupon"
                          >
                            <Edit className="w-4 h-4" />
                          </button>
                          <button
                            onClick={() => handleToggleStatus(c)}
                            className={`p-1.5 rounded-lg cursor-pointer ${
                              c.status === 'Disabled' ? 'text-amber-600' : 'text-slate-400 hover:text-slate-700'
                            }`}
                            title={c.status === 'Disabled' ? 'Enable' : 'Disable'}
                          >
                            <PowerOff className="w-4 h-4" />
                          </button>
                          <button
                            onClick={() => setDeleteTarget(c)}
                            className="p-1.5 rounded-lg text-slate-400 hover:text-rose-600 hover:bg-rose-50 cursor-pointer"
                            title="Delete Coupon"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>

        {/* Modal */}
        {modalOpen && (
          <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
            <div className="bg-white rounded-2xl border border-slate-200 max-w-md w-full p-6 space-y-4 animate-in zoom-in-95 duration-150 text-xs">
              <div className="flex items-center justify-between pb-3 border-b border-slate-100">
                <h3 className="font-serif font-bold text-slate-900 text-base">
                  {editingCoupon ? 'Edit VIP Coupon' : 'Create VIP Coupon'}
                </h3>
                <button
                  onClick={() => setModalOpen(false)}
                  className="p-1 text-slate-400 hover:text-slate-900 cursor-pointer font-bold"
                >
                  ✕
                </button>
              </div>

              <form onSubmit={handleSave} className="space-y-3">
                <div>
                  <label className="block font-bold text-slate-700 mb-1">
                    Coupon Code *
                  </label>
                  <Input
                    value={formData.code}
                    onChange={(e) => setFormData({ ...formData, code: e.target.value.toUpperCase() })}
                    placeholder="e.g. SOVEREIGN20"
                    size="sm"
                    required
                  />
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block font-bold text-slate-700 mb-1">
                      Type
                    </label>
                    <select
                      value={formData.type}
                      onChange={(e) => setFormData({ ...formData, type: e.target.value })}
                      className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl font-semibold text-slate-800"
                    >
                      <option value="percentage">Percentage (%)</option>
                      <option value="fixed">Fixed Dollar ($)</option>
                    </select>
                  </div>

                  <div>
                    <label className="block font-bold text-slate-700 mb-1">
                      Discount Value *
                    </label>
                    <Input
                      type="number"
                      value={formData.discount}
                      onChange={(e) => setFormData({ ...formData, discount: Number(e.target.value) })}
                      size="sm"
                      required
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block font-bold text-slate-700 mb-1">
                      Min Spend ($)
                    </label>
                    <Input
                      type="number"
                      value={formData.minSpend}
                      onChange={(e) => setFormData({ ...formData, minSpend: Number(e.target.value) })}
                      size="sm"
                    />
                  </div>

                  <div>
                    <label className="block font-bold text-slate-700 mb-1">
                      Max Cap ($)
                    </label>
                    <Input
                      type="number"
                      value={formData.maxDiscount}
                      onChange={(e) => setFormData({ ...formData, maxDiscount: Number(e.target.value) })}
                      size="sm"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block font-bold text-slate-700 mb-1">
                      Usage Limit
                    </label>
                    <Input
                      type="number"
                      value={formData.usageLimit}
                      onChange={(e) => setFormData({ ...formData, usageLimit: Number(e.target.value) })}
                      size="sm"
                    />
                  </div>

                  <div>
                    <label className="block font-bold text-slate-700 mb-1">
                      Expiry Date
                    </label>
                    <Input
                      type="date"
                      value={formData.validUntil}
                      onChange={(e) => setFormData({ ...formData, validUntil: e.target.value })}
                      size="sm"
                    />
                  </div>
                </div>

                <div>
                  <label className="block font-bold text-slate-700 mb-1">
                    Description
                  </label>
                  <textarea
                    value={formData.description}
                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                    placeholder="Short voucher campaign details..."
                    className="w-full px-3 py-2 border border-slate-200 rounded-xl focus:outline-none focus:ring-1 focus:ring-slate-900 h-16"
                  />
                </div>

                <div className="flex justify-end gap-2 pt-3 border-t border-slate-100">
                  <Button variant="outline" size="sm" type="button" onClick={() => setModalOpen(false)}>
                    Cancel
                  </Button>
                  <Button variant="primary" size="sm" type="submit">
                    {editingCoupon ? 'Update' : 'Create Voucher'}
                  </Button>
                </div>
              </form>
            </div>
          </div>
        )}

        {/* Delete Confirmation Modal */}
        <ConfirmModal
          isOpen={Boolean(deleteTarget)}
          onClose={() => setDeleteTarget(null)}
          onConfirm={handleConfirmDelete}
          title="Delete Coupon Voucher?"
          message={`Are you sure you wish to delete promotional code "${deleteTarget?.code}"? Any active campaigns utilizing this code will immediately cease.`}
          confirmText="Delete Coupon"
          variant="danger"
        />
      </div>
    </>
  );
};

export default AdminCouponsPage;
