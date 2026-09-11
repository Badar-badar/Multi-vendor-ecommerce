import { useState } from 'react';
import { MapPin, Plus, Check, Phone, User, Building, Globe } from 'lucide-react';
import Input from '../forms/Input';
import Checkbox from '../forms/Checkbox';
import Button from '../common/Button';

export const LUXURY_COUNTRIES = [
  { code: 'US', name: 'United States' },
  { code: 'FR', name: 'France' },
  { code: 'GB', name: 'United Kingdom' },
  { code: 'IT', name: 'Italy' },
  { code: 'CH', name: 'Switzerland' },
  { code: 'AE', name: 'United Arab Emirates' },
  { code: 'MC', name: 'Monaco' },
  { code: 'JP', name: 'Japan' },
  { code: 'CA', name: 'Canada' },
  { code: 'DE', name: 'Germany' },
  { code: 'AU', name: 'Australia' },
];

export const AddressStep = ({
  savedAddresses = [],
  selectedAddressId,
  onSelectSavedAddress,
  addressForm,
  onAddressFormChange,
  isAddingNew,
  setIsAddingNew,
  onProceed,
}) => {
  const [errors, setErrors] = useState({});

  const validate = () => {
    if (!isAddingNew && selectedAddressId) {
      return true;
    }

    const errs = {};
    if (!addressForm.fullName?.trim()) errs.fullName = 'Recipient name is required.';
    if (!addressForm.phone?.trim()) errs.phone = 'Contact telephone is required for courier dispatch.';
    if (!addressForm.addressLine1?.trim()) errs.addressLine1 = 'Street address is required.';
    if (!addressForm.city?.trim()) errs.city = 'City is required.';
    if (!addressForm.state?.trim()) errs.state = 'State / Province is required.';
    if (!addressForm.postalCode?.trim()) errs.postalCode = 'Postal / ZIP code is required.';
    if (!addressForm.country?.trim()) errs.country = 'Country is required.';

    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (validate()) {
      onProceed();
    }
  };

  return (
    <div className="bg-surface rounded-2xl border border-border p-6 sm:p-8 space-y-6 shadow-subtle">
      {/* Step Title Header */}
      <div className="flex items-center justify-between pb-4 border-b border-border">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-xl bg-accent-light text-accent flex items-center justify-center">
            <MapPin className="w-5 h-5" />
          </div>
          <div>
            <h2 className="font-serif font-bold text-lg text-text-main">
              1. Delivery Destination
            </h2>
            <p className="text-xs text-text-muted">
              Specify where your insured curations should be securely dispatched.
            </p>
          </div>
        </div>
      </div>

      {/* Saved Address Cards */}
      {savedAddresses.length > 0 && (
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-text-main">
              Saved Sovereign Addresses
            </span>
            <button
              type="button"
              onClick={() => setIsAddingNew(!isAddingNew)}
              className="inline-flex items-center gap-1 text-xs font-semibold text-accent hover:text-accent-hover hover:underline cursor-pointer"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>{isAddingNew ? 'Select Saved Address' : 'Add New Address'}</span>
            </button>
          </div>

          {!isAddingNew && (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
              {savedAddresses.map((addr) => {
                const isSelected = selectedAddressId === addr.id;

                return (
                  <div
                    key={addr.id}
                    onClick={() => onSelectSavedAddress(addr)}
                    className={`p-4 rounded-xl border transition-all cursor-pointer relative ${
                      isSelected
                        ? 'border-primary bg-surface ring-2 ring-primary/10 shadow-xs'
                        : 'border-border bg-surface-muted/60 hover:bg-surface-muted hover:border-border-strong'
                    }`}
                  >
                    <div className="flex items-start justify-between gap-2">
                      <div className="space-y-1 text-xs">
                        <div className="flex items-center gap-2">
                          <span className="font-bold text-text-main">{addr.fullName}</span>
                          {addr.isDefault && (
                            <span className="text-[10px] font-semibold bg-accent-light text-accent px-1.5 py-0.2 rounded">
                              Default
                            </span>
                          )}
                        </div>
                        <p className="text-text-muted text-[11px] leading-relaxed">
                          {addr.addressLine1}
                          {addr.addressLine2 ? `, ${addr.addressLine2}` : ''}
                          <br />
                          {addr.city}, {addr.state} {addr.postalCode}, {addr.country}
                        </p>
                        <p className="text-[11px] text-text-subtle font-medium">{addr.phone}</p>
                      </div>

                      <div
                        className={`w-5 h-5 rounded-full border flex items-center justify-center shrink-0 transition-colors ${
                          isSelected
                            ? 'border-primary bg-primary text-white'
                            : 'border-border bg-surface'
                        }`}
                      >
                        {isSelected && <Check className="w-3 h-3 stroke-[3]" />}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      )}

      {/* New Address Form */}
      {(isAddingNew || savedAddresses.length === 0) && (
        <form onSubmit={handleSubmit} className="space-y-4 pt-2">
          {savedAddresses.length > 0 && (
            <div className="text-xs font-semibold text-text-main pb-1">
              Enter New Delivery Destination
            </div>
          )}

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <Input
              id="checkout-fullName"
              label="Recipient Full Name"
              placeholder="Sarah Jenkins"
              value={addressForm.fullName}
              onChange={(e) => {
                onAddressFormChange('fullName', e.target.value);
                if (errors.fullName) setErrors((prev) => ({ ...prev, fullName: null }));
              }}
              icon={User}
              error={errors.fullName}
              required
            />

            <Input
              id="checkout-phone"
              type="tel"
              label="Contact Telephone"
              placeholder="+1 (555) 019-2834"
              value={addressForm.phone}
              onChange={(e) => {
                onAddressFormChange('phone', e.target.value);
                if (errors.phone) setErrors((prev) => ({ ...prev, phone: null }));
              }}
              icon={Phone}
              error={errors.phone}
              required
            />
          </div>

          <Input
            id="checkout-addressLine1"
            label="Street Address"
            placeholder="740 Park Avenue, Apt 12B"
            value={addressForm.addressLine1}
            onChange={(e) => {
              onAddressFormChange('addressLine1', e.target.value);
              if (errors.addressLine1) setErrors((prev) => ({ ...prev, addressLine1: null }));
            }}
            icon={Building}
            error={errors.addressLine1}
            required
          />

          <Input
            id="checkout-addressLine2"
            label="Apartment, Suite, Unit, Villa (Optional)"
            placeholder="Private Residence / Atelier Floor"
            value={addressForm.addressLine2 || ''}
            onChange={(e) => onAddressFormChange('addressLine2', e.target.value)}
          />

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <Input
              id="checkout-city"
              label="City"
              placeholder="New York"
              value={addressForm.city}
              onChange={(e) => {
                onAddressFormChange('city', e.target.value);
                if (errors.city) setErrors((prev) => ({ ...prev, city: null }));
              }}
              error={errors.city}
              required
            />

            <Input
              id="checkout-state"
              label="State / Province"
              placeholder="NY"
              value={addressForm.state}
              onChange={(e) => {
                onAddressFormChange('state', e.target.value);
                if (errors.state) setErrors((prev) => ({ ...prev, state: null }));
              }}
              error={errors.state}
              required
            />

            <Input
              id="checkout-postalCode"
              label="Postal / ZIP Code"
              placeholder="10021"
              value={addressForm.postalCode}
              onChange={(e) => {
                onAddressFormChange('postalCode', e.target.value);
                if (errors.postalCode) setErrors((prev) => ({ ...prev, postalCode: null }));
              }}
              error={errors.postalCode}
              required
            />
          </div>

          <div>
            <label className="text-xs font-semibold text-text-main block mb-1">Country</label>
            <div className="relative">
              <select
                value={addressForm.country}
                onChange={(e) => {
                  onAddressFormChange('country', e.target.value);
                  if (errors.country) setErrors((prev) => ({ ...prev, country: null }));
                }}
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
              id="save-default-address"
              label="Save as primary sovereign delivery address"
              checked={addressForm.isDefault || false}
              onChange={(e) => onAddressFormChange('isDefault', e.target.checked)}
            />
          </div>
        </form>
      )}

      {/* Action CTA */}
      <div className="pt-4 border-t border-border flex justify-end">
        <Button type="button" variant="primary" size="lg" onClick={handleSubmit}>
          Continue to Shipping Method
        </Button>
      </div>
    </div>
  );
};

export default AddressStep;
