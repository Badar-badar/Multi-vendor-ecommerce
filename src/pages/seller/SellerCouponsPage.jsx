import { useState } from 'react';
import {
  Tag,
  Plus,
  Trash2,
  Edit,
  CheckCircle2,
  Calendar,
  Sparkles,
  Percent,
  DollarSign,
  AlertCircle,
} from 'lucide-react';
import toast from 'react-hot-toast';
import Button from '../../components/common/Button';
import Badge from '../../components/common/Badge';
import Modal from '../../components/common/Modal';
import ConfirmModal from '../../components/common/ConfirmModal';
import Input from '../../components/forms/Input';
import Select from '../../components/forms/Select';
import { formatCurrency } from '../../utils/formatCurrency';

const INITIAL_SELLER_COUPONS = [
  {
    id: 'SC-01',
    code: 'MAISON10',
    type: 'percentage',
    value: 10,
    minSpend: 1500,
    maxDiscount: 500,
    usageLimit: 100,
    timesUsed: 42,
    validUntil: '2026-12-31',
    status: 'Active',
    description: '10% private privilege on all handcrafted leather goods.',
  },
  {
    id: 'SC-02',
    code: 'ATELIER300',
    type: 'fixed',
    value: 300,
    minSpend: 2500,
    maxDiscount: 300,
    usageLimit: 50,
    timesUsed: 28,
    validUntil: '2026-10-15',
    status: 'Active',
    description: '$300 deduction on bespoke cashmere overcoats.',
  },
  {
    id: 'SC-03',
    code: 'AUTUMNNOIR',
    type: 'percentage',
    value: 15,
    minSpend: 3000,
    maxDiscount: 800,
    usageLimit: 25,
    timesUsed: 25,
    validUntil: '2026-08-30',
    status: 'Expired',
    description: 'Early autumn seasonal premiere code.',
  },
];

export const SellerCouponsPage = () => {
  const [coupons, setCoupons] = useState(INITIAL_SELLER_COUPONS);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [deleteTarget, setDeleteTarget] = useState(null);
  const [editingCoupon, setEditingCoupon] = useState(null);

  const [formData, setFormData] = useState({
    code: '',
    type: 'percentage',
    value: '',
    minSpend: '',
    maxDiscount: '',
    usageLimit: '',
    validUntil: '',
    description: '',
  });

  const handleOpenCreateModal = () => {
    setEditingCoupon(null);
    setFormData({
      code: '',
      type: 'percentage',
      value: '',
      minSpend: '',
      maxDiscount: '',
      usageLimit: '100',
      validUntil: '2026-12-31',
      description: '',
    });
    setIsModalOpen(true);
  };

  const handleOpenEditModal = (coupon) => {
    setEditingCoupon(coupon);
    setFormData({
      code: coupon.code,
      type: coupon.type,
      value: coupon.value.toString(),
      minSpend: coupon.minSpend.toString(),
      maxDiscount: coupon.maxDiscount.toString(),
      usageLimit: coupon.usageLimit.toString(),
      validUntil: coupon.validUntil,
      description: coupon.description,
    });
    setIsModalOpen(true);
  };

  const handleConfirmDelete = () => {
    if (!deleteTarget) return;
    setCoupons((prev) => prev.filter((c) => c.id !== deleteTarget.id));
    toast.success(`Privilege coupon "${deleteTarget.code}" deactivated.`);
    setDeleteTarget(null);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!formData.code || !formData.value) {
      toast.error('Please specify coupon code and discount value.');
      return;
    }

    if (editingCoupon) {
      setCoupons((prev) =>
        prev.map((c) =>
          c.id === editingCoupon.id
            ? {
                ...c,
                code: formData.code.toUpperCase().trim(),
                type: formData.type,
                value: Number(formData.value),
                minSpend: Number(formData.minSpend) || 0,
                maxDiscount: Number(formData.maxDiscount) || Number(formData.value),
                usageLimit: Number(formData.usageLimit) || 100,
                validUntil: formData.validUntil,
                description: formData.description,
              }
            : c
        )
      );
      toast.success(`Coupon ${formData.code.toUpperCase()} updated.`);
    } else {
      const newC = {
        id: `SC-${Date.now()}`,
        code: formData.code.toUpperCase().trim(),
        type: formData.type,
        value: Number(formData.value),
        minSpend: Number(formData.minSpend) || 0,
        maxDiscount: Number(formData.maxDiscount) || Number(formData.value),
        usageLimit: Number(formData.usageLimit) || 100,
        timesUsed: 0,
        validUntil: formData.validUntil || '2026-12-31',
        status: 'Active',
        description: formData.description || 'Exclusive Atelier privilege discount.',
      };
      setCoupons([newC, ...coupons]);
      toast.success(`Coupon "${newC.code}" created successfully.`);
    }

    setIsModalOpen(false);
  };

  return (
    <>
      <div className="space-y-8">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-border">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <Sparkles className="w-4 h-4 text-accent" />
              <span className="text-xs font-bold uppercase tracking-wider text-accent">
                Promotions & Patron Privileges
              </span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-serif font-bold text-text-main">
              Atelier Privilege Coupons
            </h1>
            <p className="text-xs text-text-muted mt-1">
              Create and manage bespoke promotional codes applicable to your creations.
            </p>
          </div>

          <Button
            variant="primary"
            size="md"
            leftIcon={Plus}
            onClick={handleOpenCreateModal}
          >
            Create Atelier Coupon
          </Button>
        </div>

        {/* Overview Stats */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
          <div className="bg-surface rounded-2xl border border-border p-5 space-y-1 shadow-subtle">
            <span className="text-xs text-text-muted">Active Promotional Codes</span>
            <p className="text-2xl font-serif font-bold text-text-main">
              {coupons.filter((c) => c.status === 'Active').length} Active
            </p>
            <span className="text-[11px] text-emerald-600 font-medium">Valid across store</span>
          </div>

          <div className="bg-surface rounded-2xl border border-border p-5 space-y-1 shadow-subtle">
            <span className="text-xs text-text-muted">Total Redemptions</span>
            <p className="text-2xl font-serif font-bold text-text-main">
              {coupons.reduce((acc, c) => acc + c.timesUsed, 0)} Orders
            </p>
            <span className="text-[11px] text-text-muted">Patrons engaged</span>
          </div>

          <div className="bg-surface rounded-2xl border border-border p-5 space-y-1 shadow-subtle">
            <span className="text-xs text-text-muted">Discount Value Generated</span>
            <p className="text-2xl font-serif font-bold text-accent">
              {formatCurrency(14850)}
            </p>
            <span className="text-[11px] text-text-muted">In patron concessions</span>
          </div>
        </div>

        {/* Coupons Table */}
        <div className="bg-surface rounded-2xl border border-border overflow-hidden shadow-subtle">
          <div className="p-4 sm:p-5 border-b border-border flex items-center justify-between">
            <h3 className="font-serif font-bold text-sm text-text-main">
              Issued Promotional Codes
            </h3>
            <span className="text-xs text-text-muted">{coupons.length} total codes</span>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-surface-muted border-b border-border text-text-subtle uppercase text-[10px] tracking-wider">
                <tr>
                  <th className="p-4 font-semibold">Code & Type</th>
                  <th className="p-4 font-semibold">Benefit</th>
                  <th className="p-4 font-semibold">Rules / Minimum</th>
                  <th className="p-4 font-semibold">Usage</th>
                  <th className="p-4 font-semibold">Expiry</th>
                  <th className="p-4 font-semibold">Status</th>
                  <th className="p-4 font-semibold text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border">
                {coupons.map((c) => (
                  <tr key={c.id} className="hover:bg-surface-muted/40 transition-colors">
                    <td className="p-4">
                      <div className="flex items-center gap-2">
                        <span className="font-mono font-bold text-xs sm:text-sm text-text-main px-2 py-1 bg-surface-muted rounded-lg border border-border">
                          {c.code}
                        </span>
                      </div>
                      <p className="text-[11px] text-text-muted mt-1">{c.description}</p>
                    </td>

                    <td className="p-4 font-semibold text-text-main">
                      {c.type === 'percentage' ? `${c.value}% OFF` : `${formatCurrency(c.value)} OFF`}
                    </td>

                    <td className="p-4 text-text-muted">
                      <div>Min Spend: {formatCurrency(c.minSpend)}</div>
                      <div className="text-[10px] text-text-subtle">Cap: {formatCurrency(c.maxDiscount)}</div>
                    </td>

                    <td className="p-4">
                      <div className="font-semibold text-text-main">
                        {c.timesUsed} / {c.usageLimit}
                      </div>
                      <div className="w-24 h-1.5 bg-surface-muted rounded-full overflow-hidden mt-1 border border-border">
                        <div
                          className="h-full bg-accent"
                          style={{ width: `${Math.min(100, (c.timesUsed / c.usageLimit) * 100)}%` }}
                        />
                      </div>
                    </td>

                    <td className="p-4 text-text-muted font-mono">{c.validUntil}</td>

                    <td className="p-4">
                      <Badge variant={c.status === 'Active' ? 'success' : 'default'} size="sm">
                        {c.status}
                      </Badge>
                    </td>

                    <td className="p-4 text-right">
                      <div className="flex items-center justify-end gap-2">
                        <button
                          type="button"
                          onClick={() => handleOpenEditModal(c)}
                          className="p-1.5 rounded-lg border border-border text-text-muted hover:text-text-main hover:bg-surface-muted transition-colors cursor-pointer"
                          title="Edit coupon"
                        >
                          <Edit className="w-3.5 h-3.5" />
                        </button>
                        <button
                          type="button"
                          onClick={() => setDeleteTarget(c)}
                          className="p-1.5 rounded-lg border border-border text-text-muted hover:text-rose-600 hover:bg-rose-50 transition-colors cursor-pointer"
                          title="Delete coupon"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Create / Edit Modal */}
        <Modal
          isOpen={isModalOpen}
          onClose={() => setIsModalOpen(false)}
          size="md"
          title={editingCoupon ? 'Edit Atelier Privilege Code' : 'Issue New Privilege Code'}
          description="Establish promotional parameters for your creations on Zareen."
        >
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <Input
                label="Coupon Code *"
                placeholder="e.g. MAISON20"
                value={formData.code}
                onChange={(e) => setFormData({ ...formData, code: e.target.value })}
                required
              />
              <Select
                label="Discount Type *"
                value={formData.type}
                onChange={(e) => setFormData({ ...formData, type: e.target.value })}
                options={[
                  { value: 'percentage', label: 'Percentage (%) Off' },
                  { value: 'fixed', label: 'Fixed Amount ($) Off' },
                ]}
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <Input
                label="Value *"
                type="number"
                placeholder={formData.type === 'percentage' ? '15' : '200'}
                value={formData.value}
                onChange={(e) => setFormData({ ...formData, value: e.target.value })}
                required
              />
              <Input
                label="Min Spend ($)"
                type="number"
                placeholder="1000"
                value={formData.minSpend}
                onChange={(e) => setFormData({ ...formData, minSpend: e.target.value })}
              />
              <Input
                label="Max Cap ($)"
                type="number"
                placeholder="500"
                value={formData.maxDiscount}
                onChange={(e) => setFormData({ ...formData, maxDiscount: e.target.value })}
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <Input
                label="Usage Limit"
                type="number"
                placeholder="100"
                value={formData.usageLimit}
                onChange={(e) => setFormData({ ...formData, usageLimit: e.target.value })}
              />
              <Input
                label="Valid Until"
                type="date"
                value={formData.validUntil}
                onChange={(e) => setFormData({ ...formData, validUntil: e.target.value })}
              />
            </div>

            <Input
              label="Description / Terms"
              placeholder="e.g. VIP appreciation concession for Haute Couture pieces."
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
            />

            <div className="pt-2 flex items-center justify-end gap-3">
              <Button variant="outline" type="button" onClick={() => setIsModalOpen(false)}>
                Cancel
              </Button>
              <Button variant="primary" type="submit">
                {editingCoupon ? 'Save Changes' : 'Issue Privilege Code'}
              </Button>
            </div>
          </form>
        </Modal>

        {/* Delete Confirmation Modal */}
        <ConfirmModal
          isOpen={Boolean(deleteTarget)}
          onClose={() => setDeleteTarget(null)}
          onConfirm={handleConfirmDelete}
          title="Deactivate Privilege Coupon?"
          message={`Are you sure you wish to deactivate code "${deleteTarget?.code}"? Clients will no longer be able to claim this concession at checkout.`}
          confirmText="Deactivate Code"
          variant="danger"
        />
      </div>
    </>
  );
};

export default SellerCouponsPage;
