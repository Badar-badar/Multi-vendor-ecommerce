import { useState } from 'react';
import { MapPin, Plus, Edit2, Trash2, CheckCircle2, ShieldCheck, X, Globe } from 'lucide-react';
import toast from 'react-hot-toast';
import AccountLayout from '../../components/account/AccountLayout';
import Input from '../../components/forms/Input';
import Checkbox from '../../components/forms/Checkbox';
import Button from '../../components/common/Button';
import ConfirmModal from '../../components/common/ConfirmModal';
import { LUXURY_COUNTRIES } from '../../components/checkout/AddressStep';

const INITIAL_ADDRESSES = [
  {
    id: 'addr-1',
    label: 'Primary Manhattan Residence',
    fullName: 'Sarah Jenkins',
    phone: '+1 (555) 019-2834',
    addressLine1: '740 Park Avenue, Penthouse 14B',
    addressLine2: 'Upper East Side',
    city: 'New York',
    state: 'NY',
    postalCode: '10021',
    country: 'United States',
    isDefault: true,
  },
  {
    id: 'addr-2',
    label: 'Beverly Hills Villa',
    fullName: 'Sarah Jenkins',
    phone: '+1 (555) 839-1120',
    addressLine1: '102 Rodeo Drive, Villa 4',
    addressLine2: '',
    city: 'Beverly Hills',
    state: 'CA',
    postalCode: '90210',
    country: 'United States',
    isDefault: false,
  },
  {
    id: 'addr-3',
    label: 'Parisian Atelier Suite',
    fullName: 'Sarah Jenkins',
    phone: '+33 1 42 68 55 00',
    addressLine1: '28 Place Vendôme, Étage 3',
    addressLine2: '',
    city: 'Paris',
    state: 'Île-de-France',
    postalCode: '75001',
    country: 'France',
    isDefault: false,
  },
];

export const AccountAddressesPage = () => {
  const [addresses, setAddresses] = useState(INITIAL_ADDRESSES);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingAddressId, setEditingAddressId] = useState(null);
  const [deleteTarget, setDeleteTarget] = useState(null);

  const [formData, setFormData] = useState({
    label: '',
    fullName: '',
    phone: '',
    addressLine1: '',
    addressLine2: '',
    city: '',
    state: '',
    postalCode: '',
    country: 'United States',
    isDefault: false,
  });

  const handleOpenAddModal = () => {
    setEditingAddressId(null);
    setFormData({
      label: 'New Residence',
      fullName: 'Sarah Jenkins',
      phone: '+1 (555) 019-2834',
      addressLine1: '',
      addressLine2: '',
      city: '',
      state: '',
      postalCode: '',
      country: 'United States',
      isDefault: false,
    });
    setIsModalOpen(true);
  };

  const handleOpenEditModal = (addr) => {
    setEditingAddressId(addr.id);
    setFormData({ ...addr });
    setIsModalOpen(true);
  };

  const handleSetDefault = (id) => {
    setAddresses((prev) =>
      prev.map((addr) => ({
        ...addr,
        isDefault: addr.id === id,
      }))
    );
    toast.success('Default delivery destination updated.');
  };

  const handleConfirmDelete = () => {
    if (!deleteTarget) return;
    if (addresses.length <= 1) {
      toast.error('You must keep at least one delivery destination on file.');
      setDeleteTarget(null);
      return;
    }
    setAddresses((prev) => prev.filter((addr) => addr.id !== deleteTarget.id));
    toast.success(`"${deleteTarget.label || deleteTarget.addressLine1}" removed from registry.`);
    setDeleteTarget(null);
  };

  const handleSave = (e) => {
    e.preventDefault();
    if (!formData.fullName || !formData.addressLine1 || !formData.city || !formData.postalCode) {
      toast.error('Please complete all required address fields.');
      return;
    }

    if (editingAddressId) {
      setAddresses((prev) =>
        prev.map((addr) =>
          addr.id === editingAddressId
            ? { ...formData, id: editingAddressId }
            : formData.isDefault
            ? { ...addr, isDefault: false }
            : addr
        )
      );
      toast.success('Address updated.');
    } else {
      const newEntry = {
        ...formData,
        id: `addr-${Date.now()}`,
      };
      setAddresses((prev) => [
        ...(formData.isDefault ? prev.map((a) => ({ ...a, isDefault: false })) : prev),
        newEntry,
      ]);
      toast.success('New delivery destination registered.');
    }

    setIsModalOpen(false);
  };

  return (
    <AccountLayout>
      <div className="space-y-6">
        {/* Header Title & Add Button */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-border">
          <div>
            <h2 className="font-serif font-bold text-xl text-text-main">
              Delivery Destinations ({addresses.length})
            </h2>
            <p className="text-xs text-text-muted">
              Manage verified delivery addresses for white-glove courier dispatch.
            </p>
          </div>

          <Button
            variant="primary"
            size="md"
            onClick={handleOpenAddModal}
            leftIcon={Plus}
          >
            Add New Destination
          </Button>
        </div>

        {/* Addresses Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          {addresses.map((addr) => (
            <div
              key={addr.id}
              className={`p-6 rounded-2xl border transition-all relative flex flex-col justify-between ${
                addr.isDefault
                  ? 'border-primary bg-surface ring-2 ring-primary/10 shadow-subtle'
                  : 'border-border bg-surface hover:border-border-strong shadow-xs'
              }`}
            >
              <div>
                <div className="flex items-start justify-between gap-2 mb-3">
                  <div className="flex items-center gap-2">
                    <div className="w-8 h-8 rounded-lg bg-accent-light text-accent flex items-center justify-center">
                      <MapPin className="w-4 h-4" />
                    </div>
                    <div>
                      <h3 className="font-serif font-bold text-sm text-text-main">
                        {addr.label || 'Residence'}
                      </h3>
                      <span className="text-[11px] text-text-subtle font-medium">
                        {addr.country}
                      </span>
                    </div>
                  </div>

                  {addr.isDefault && (
                    <span className="inline-flex items-center gap-1 text-[10px] font-bold uppercase tracking-wider bg-accent-light text-accent px-2 py-0.5 rounded-md">
                      <CheckCircle2 className="w-3 h-3 text-accent" /> Default Destination
                    </span>
                  )}
                </div>

                <div className="space-y-1 text-xs text-text-muted">
                  <p className="font-semibold text-text-main">{addr.fullName}</p>
                  <p>
                    {addr.addressLine1}
                    {addr.addressLine2 ? `, ${addr.addressLine2}` : ''}
                  </p>
                  <p>
                    {addr.city}, {addr.state} {addr.postalCode}
                  </p>
                  <p className="text-text-subtle text-[11px] pt-1">{addr.phone}</p>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="pt-4 mt-4 border-t border-border flex items-center justify-between gap-2">
                <div>
                  {!addr.isDefault && (
                    <button
                      type="button"
                      onClick={() => handleSetDefault(addr.id)}
                      className="text-xs font-semibold text-accent hover:underline cursor-pointer"
                    >
                      Make Default
                    </button>
                  )}
                </div>

                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={() => handleOpenEditModal(addr)}
                    className="p-1.5 rounded-lg text-text-muted hover:text-text-main hover:bg-surface-muted transition-colors cursor-pointer"
                    title="Edit address"
                  >
                    <Edit2 className="w-4 h-4" />
                  </button>

                  <button
                    type="button"
                    onClick={() => setDeleteTarget(addr)}
                    className="p-1.5 rounded-lg text-text-muted hover:text-rose-600 hover:bg-rose-50 transition-colors cursor-pointer"
                    title="Delete address"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Add / Edit Address Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-in fade-in">
          <div className="bg-surface w-full max-w-lg rounded-3xl border border-border p-6 sm:p-8 space-y-6 shadow-2xl relative max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between pb-3 border-b border-border">
              <h3 className="font-serif font-bold text-lg text-text-main">
                {editingAddressId ? 'Edit Delivery Destination' : 'Add New Sovereign Destination'}
              </h3>
              <button
                type="button"
                onClick={() => setIsModalOpen(false)}
                className="text-text-muted hover:text-text-main p-1.5 rounded-lg hover:bg-surface-muted cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSave} className="space-y-4">
              <Input
                id="addr-label"
                label="Destination Label (e.g. Manhattan Penthouse)"
                placeholder="Upper East Residence"
                value={formData.label}
                onChange={(e) => setFormData({ ...formData, label: e.target.value })}
              />

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <Input
                  id="addr-fullname"
                  label="Recipient Full Name"
                  placeholder="Sarah Jenkins"
                  value={formData.fullName}
                  onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
                  required
                />
                <Input
                  id="addr-phone"
                  label="Contact Telephone"
                  placeholder="+1 (555) 019-2834"
                  value={formData.phone}
                  onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                  required
                />
              </div>

              <Input
                id="addr-line1"
                label="Street Address"
                placeholder="740 Park Avenue"
                value={formData.addressLine1}
                onChange={(e) => setFormData({ ...formData, addressLine1: e.target.value })}
                required
              />

              <Input
                id="addr-line2"
                label="Apartment / Suite / Unit (Optional)"
                placeholder="Penthouse 14B"
                value={formData.addressLine2}
                onChange={(e) => setFormData({ ...formData, addressLine2: e.target.value })}
              />

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <Input
                  id="addr-city"
                  label="City"
                  placeholder="New York"
                  value={formData.city}
                  onChange={(e) => setFormData({ ...formData, city: e.target.value })}
                  required
                />
                <Input
                  id="addr-state"
                  label="State / Province"
                  placeholder="NY"
                  value={formData.state}
                  onChange={(e) => setFormData({ ...formData, state: e.target.value })}
                  required
                />
                <Input
                  id="addr-postal"
                  label="Postal Code"
                  placeholder="10021"
                  value={formData.postalCode}
                  onChange={(e) => setFormData({ ...formData, postalCode: e.target.value })}
                  required
                />
              </div>

              <div>
                <label className="text-xs font-semibold text-text-main block mb-1">Country</label>
                <div className="relative">
                  <select
                    value={formData.country}
                    onChange={(e) => setFormData({ ...formData, country: e.target.value })}
                    className="w-full pl-9 pr-4 py-2.5 text-xs bg-surface border border-border rounded-xl focus:outline-none focus:border-text-main font-medium text-text-main"
                  >
                    {LUXURY_COUNTRIES.map((c) => (
                      <option key={c.code} value={c.name}>
                        {c.name}
                      </option>
                    ))}
                  </select>
                  <Globe className="w-4 h-4 text-text-muted absolute left-3 top-1/2 -translate-y-1/2" />
                </div>
              </div>

              <div className="pt-2">
                <Checkbox
                  id="modal-is-default"
                  label="Set as default delivery destination"
                  checked={formData.isDefault}
                  onChange={(e) => setFormData({ ...formData, isDefault: e.target.checked })}
                />
              </div>

              <div className="pt-4 border-t border-border flex items-center justify-end gap-3">
                <Button type="button" variant="secondary" onClick={() => setIsModalOpen(false)}>
                  Cancel
                </Button>
                <Button type="submit" variant="primary">
                  Save Destination
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
        title="Remove Delivery Destination?"
        message={`Are you sure you wish to remove "${deleteTarget?.label || deleteTarget?.addressLine1}" from your saved delivery registry?`}
        confirmText="Remove Address"
        variant="danger"
      />
    </AccountLayout>
  );
};

export default AccountAddressesPage;
