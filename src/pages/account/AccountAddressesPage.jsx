import { useState, useEffect } from 'react';
import { MapPin, Plus, Edit2, Trash2, CheckCircle2, ShieldCheck, X, Globe } from 'lucide-react';
import toast from 'react-hot-toast';
import useAuth from '../../hooks/useAuth';
import AccountLayout from '../../components/account/AccountLayout';
import Input from '../../components/forms/Input';
import Checkbox from '../../components/forms/Checkbox';
import Button from '../../components/common/Button';
import ConfirmModal from '../../components/common/ConfirmModal';
import { LUXURY_COUNTRIES } from '../../data/checkoutConstants';
import { addressApi } from '../../api/addressApi';

export const AccountAddressesPage = () => {
  const { user } = useAuth();
  const [addresses, setAddresses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingAddressId, setEditingAddressId] = useState(null);
  const [deleteTarget, setDeleteTarget] = useState(null);

  const loadAddresses = async () => {
    try {
      const res = await addressApi.getAddresses();
      const list = res?.addresses || res?.data?.addresses || (Array.isArray(res) ? res : []);
      setAddresses(list);
    } catch (err) {
      console.error('Failed to load addresses:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    let isMounted = true;
    const fetchInitial = async () => {
      try {
        const res = await addressApi.getAddresses();
        const list = res?.addresses || res?.data?.addresses || (Array.isArray(res) ? res : []);
        if (isMounted) setAddresses(list);
      } catch (err) {
        console.error('Failed to load addresses:', err);
      } finally {
        if (isMounted) setLoading(false);
      }
    };
    fetchInitial();
    return () => {
      isMounted = false;
    };
  }, []);

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
      label: 'Primary Residence',
      fullName: user?.name || '',
      phone: user?.phone || '',
      addressLine1: '',
      addressLine2: '',
      city: '',
      state: '',
      postalCode: '',
      country: 'United States',
      isDefault: addresses.length === 0,
    });
    setIsModalOpen(true);
  };

  const handleOpenEditModal = (addr) => {
    setEditingAddressId(addr._id || addr.id);
    setFormData({
      label: addr.label || '',
      fullName: addr.fullName || '',
      phone: addr.phone || '',
      addressLine1: addr.addressLine1 || addr.street || '',
      addressLine2: addr.addressLine2 || '',
      city: addr.city || '',
      state: addr.state || '',
      postalCode: addr.postalCode || addr.zipCode || '',
      country: addr.country || 'United States',
      isDefault: Boolean(addr.isDefault),
    });
    setIsModalOpen(true);
  };

  const handleSetDefault = async (id) => {
    try {
      await addressApi.setDefaultAddress(id);
      setAddresses((prev) =>
        prev.map((addr) => ({
          ...addr,
          isDefault: (addr._id || addr.id) === id,
        }))
      );
      toast.success('Default delivery destination updated.');
    } catch (err) {
      toast.error(err.message || 'Failed to update default address.');
    }
  };

  const handleConfirmDelete = async () => {
    if (!deleteTarget) return;
    const targetId = deleteTarget._id || deleteTarget.id;
    try {
      await addressApi.deleteAddress(targetId);
      setAddresses((prev) => prev.filter((addr) => (addr._id || addr.id) !== targetId));
      toast.success(`"${deleteTarget.label || deleteTarget.addressLine1}" removed from registry.`);
    } catch (err) {
      toast.error(err.message || 'Failed to remove address.');
    } finally {
      setDeleteTarget(null);
    }
  };

  const handleSave = async (e) => {
    e.preventDefault();
    if (!formData.fullName || !formData.addressLine1 || !formData.city || !formData.postalCode) {
      toast.error('Please complete all required address fields.');
      return;
    }

    try {
      if (editingAddressId) {
        await addressApi.updateAddress(editingAddressId, formData);
        toast.success('Address updated.');
      } else {
        await addressApi.createAddress(formData);
        toast.success('New delivery destination registered.');
      }
      loadAddresses();
      setIsModalOpen(false);
    } catch (err) {
      toast.error(err.message || 'Failed to save address.');
    }
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
        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            {[1, 2].map((n) => (
              <div key={n} className="h-48 bg-surface-muted rounded-2xl animate-pulse" />
            ))}
          </div>
        ) : addresses.length === 0 ? (
          <div className="bg-surface rounded-2xl border border-border p-10 text-center space-y-3">
            <MapPin className="w-8 h-8 text-text-muted mx-auto" />
            <p className="font-serif font-bold text-base text-text-main">No Destinations on File</p>
            <p className="text-xs text-text-muted max-w-sm mx-auto">
              Add your delivery address for complimentary white-glove insured courier dispatch.
            </p>
            <Button variant="primary" size="sm" onClick={handleOpenAddModal} leftIcon={Plus}>
              Add Address
            </Button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            {addresses.map((addr) => {
              const addrId = addr._id || addr.id;
              const street = addr.addressLine1 || addr.street || '';

              return (
                <div
                  key={addrId}
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
                        {street}
                        {addr.addressLine2 ? `, ${addr.addressLine2}` : ''}
                      </p>
                      <p>
                        {addr.city}, {addr.state} {addr.postalCode || addr.zipCode}
                      </p>
                      {addr.phone && <p className="text-text-subtle text-[11px] pt-1">{addr.phone}</p>}
                    </div>
                  </div>

                  {/* Action Buttons */}
                  <div className="pt-4 mt-4 border-t border-border flex items-center justify-between gap-2">
                    <div>
                      {!addr.isDefault && (
                        <button
                          type="button"
                          onClick={() => handleSetDefault(addrId)}
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
              );
            })}
          </div>
        )}
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
