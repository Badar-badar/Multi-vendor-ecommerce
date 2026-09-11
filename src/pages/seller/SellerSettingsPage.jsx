import { useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import {
  Settings,
  Store,
  CreditCard,
  Truck,
  Bell,
  RotateCcw,
  ShieldCheck,
  Lock,
  DollarSign,
  User,
  Sparkles,
  Save,
  CheckCircle2,
} from 'lucide-react';
import toast from 'react-hot-toast';
import { selectSellerProfile } from '../../features/seller/sellerSelectors';
import { updateStoreProfile } from '../../features/seller/sellerSlice';
import Input from '../../components/forms/Input';
import Button from '../../components/common/Button';

const SETTINGS_TABS = [
  { id: 'store', label: 'Store Settings', icon: Store },
  { id: 'account', label: 'Account Profile', icon: User },
  { id: 'notifications', label: 'Notifications', icon: Bell },
  { id: 'shipping', label: 'Shipping Preferences', icon: Truck },
  { id: 'returns', label: 'Return Policies', icon: RotateCcw },
  { id: 'security', label: 'Security & 2FA', icon: Lock },
];

export const SellerSettingsPage = () => {
  const dispatch = useDispatch();
  const profile = useSelector(selectSellerProfile) || {};

  const [activeTab, setActiveTab] = useState('store');

  // Store Settings
  const [storeName, setStoreName] = useState(profile.storeName || 'Atelier Maison');
  const [currency, setCurrency] = useState('USD');
  const [vacationMode, setVacationMode] = useState(false);
  const [storeBio, setStoreBio] = useState(profile.description || '');

  // Account
  const [ownerName, setOwnerName] = useState(profile.ownerName || 'Jean-Luc Moreau');
  const [email, setEmail] = useState(profile.email || 'jeanluc@ateliermaison.fr');
  const [phone, setPhone] = useState(profile.phone || '+33 1 42 68 55 00');
  const [timezone, setTimezone] = useState('Europe/Paris (UTC+01:00)');

  // Notifications
  const [notifyOrders, setNotifyOrders] = useState(true);
  const [notifyLowStock, setNotifyLowStock] = useState(true);
  const [notifyReturns, setNotifyReturns] = useState(true);
  const [notifyPayouts, setNotifyPayouts] = useState(true);

  // Shipping
  const [handlingTimeDays, setHandlingTimeDays] = useState('2');
  const [defaultCarrier, setDefaultCarrier] = useState('Sovereign White-Glove Express');
  const [freeShippingThreshold, setFreeShippingThreshold] = useState('300');

  // Returns
  const [returnWindowDays, setReturnWindowDays] = useState('30');
  const [restockingFee, setRestockingFee] = useState('0');
  const [returnShippingCovered, setReturnShippingCovered] = useState(true);

  // Security
  const [twoFactorEnabled, setTwoFactorEnabled] = useState(true);
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');

  const handleSave = (e) => {
    e.preventDefault();
    dispatch(
      updateStoreProfile({
        storeName,
        ownerName,
        email,
        phone,
        description: storeBio,
      })
    );
    toast.success('Studio configuration saved successfully.');
  };

  return (
    <>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-border">
          <div>
            <h1 className="font-serif font-bold text-xl sm:text-2xl text-text-main">
              Studio Settings & Preferences
            </h1>
            <p className="text-xs text-text-muted">
              Configure atelier operations, dispatch protocols, return guarantees, and security rules.
            </p>
          </div>

          <Button variant="primary" size="sm" leftIcon={Save} onClick={handleSave}>
            Save All Settings
          </Button>
        </div>

        {/* Tab Selector */}
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 border-b border-border">
          {SETTINGS_TABS.map((tab) => {
            const Icon = tab.icon;
            const isSelected = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                type="button"
                onClick={() => setActiveTab(tab.id)}
                className={`px-3.5 py-2 rounded-xl text-xs font-semibold transition-all cursor-pointer shrink-0 flex items-center gap-2 ${
                  isSelected
                    ? 'bg-primary text-white shadow-xs font-bold'
                    : 'text-text-muted hover:text-text-main hover:bg-surface-muted'
                }`}
              >
                <Icon className="w-3.5 h-3.5" />
                <span>{tab.label}</span>
              </button>
            );
          })}
        </div>

        {/* Tab Content Panes */}
        <form onSubmit={handleSave} className="space-y-6">
          {/* 1. STORE SETTINGS */}
          {activeTab === 'store' && (
            <div className="bg-surface rounded-2xl border border-border p-6 space-y-5 shadow-subtle animate-in fade-in duration-200">
              <h2 className="font-serif font-bold text-base text-text-main pb-2 border-b border-border">
                Storefront & Operational Parameters
              </h2>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <Input
                  label="Atelier Public Name"
                  value={storeName}
                  onChange={(e) => setStoreName(e.target.value)}
                  required
                />

                <div>
                  <label className="text-xs font-semibold text-text-main block mb-1">
                    Operating Settlement Currency
                  </label>
                  <select
                    value={currency}
                    onChange={(e) => setCurrency(e.target.value)}
                    className="w-full px-3 py-2 text-xs bg-surface-muted border border-border rounded-xl focus:outline-none focus:border-primary text-text-main cursor-pointer"
                  >
                    <option value="USD">USD ($) - Sovereign Default</option>
                    <option value="EUR">EUR (€) - Eurozone</option>
                    <option value="GBP">GBP (£) - British Pound</option>
                    <option value="CHF">CHF (Fr) - Swiss Franc</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="text-xs font-semibold text-text-main block mb-1">
                  Atelier Tagline & Short Bio
                </label>
                <textarea
                  rows={3}
                  value={storeBio}
                  onChange={(e) => setStoreBio(e.target.value)}
                  className="w-full p-3 text-xs bg-surface-muted border border-border rounded-xl text-text-main focus:outline-none focus:border-primary"
                />
              </div>

              {/* Vacation Mode Toggle */}
              <div className="p-4 bg-surface-muted rounded-xl border border-border flex items-center justify-between gap-4">
                <div className="space-y-0.5">
                  <span className="font-bold text-xs text-text-main block">Atelier Vacation Mode</span>
                  <p className="text-[11px] text-text-muted">
                    Temporarily pause public buy-now capability while workshop is on seasonal break.
                  </p>
                </div>
                <input
                  type="checkbox"
                  checked={vacationMode}
                  onChange={(e) => setVacationMode(e.target.checked)}
                  className="w-5 h-5 rounded text-primary focus:ring-primary cursor-pointer"
                />
              </div>
            </div>
          )}

          {/* 2. ACCOUNT PROFILE */}
          {activeTab === 'account' && (
            <div className="bg-surface rounded-2xl border border-border p-6 space-y-5 shadow-subtle animate-in fade-in duration-200">
              <h2 className="font-serif font-bold text-base text-text-main pb-2 border-b border-border">
                Artisan Account Profile
              </h2>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <Input
                  label="Master Artisan / Legal Representative"
                  value={ownerName}
                  onChange={(e) => setOwnerName(e.target.value)}
                  required
                />
                <Input
                  label="Account Email (Primary Auth)"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />
                <Input
                  label="Direct Telephone"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                />
                <div>
                  <label className="text-xs font-semibold text-text-main block mb-1">
                    Operating Timezone
                  </label>
                  <select
                    value={timezone}
                    onChange={(e) => setTimezone(e.target.value)}
                    className="w-full px-3 py-2 text-xs bg-surface-muted border border-border rounded-xl text-text-main cursor-pointer"
                  >
                    <option value="Europe/Paris (UTC+01:00)">Europe/Paris (UTC+01:00)</option>
                    <option value="Europe/London (UTC+00:00)">Europe/London (UTC+00:00)</option>
                    <option value="America/New_York (UTC-05:00)">America/New_York (UTC-05:00)</option>
                    <option value="Asia/Tokyo (UTC+09:00)">Asia/Tokyo (UTC+09:00)</option>
                  </select>
                </div>
              </div>
            </div>
          )}

          {/* 3. NOTIFICATIONS */}
          {activeTab === 'notifications' && (
            <div className="bg-surface rounded-2xl border border-border p-6 space-y-5 shadow-subtle animate-in fade-in duration-200">
              <h2 className="font-serif font-bold text-base text-text-main pb-2 border-b border-border">
                Live Alert & Notification Rules
              </h2>

              <div className="space-y-3">
                {[
                  {
                    id: 'orders',
                    title: 'New Customer Order Notifications',
                    desc: 'Receive immediate email and push alerts upon new acquisition bookings.',
                    checked: notifyOrders,
                    setter: setNotifyOrders,
                  },
                  {
                    id: 'lowStock',
                    title: 'Inventory Depletion Warnings',
                    desc: 'Trigger alerts when any creation reaches its defined low-stock limit.',
                    checked: notifyLowStock,
                    setter: setNotifyLowStock,
                  },
                  {
                    id: 'returns',
                    title: 'Return Request Telemetry',
                    desc: 'Alert immediately when a customer files an exchange or return claim.',
                    checked: notifyReturns,
                    setter: setNotifyReturns,
                  },
                  {
                    id: 'payouts',
                    title: 'Bi-Weekly Escrow Settlement Receipts',
                    desc: 'Receive bank wire confirmation dossiers upon completed payout cycles.',
                    checked: notifyPayouts,
                    setter: setNotifyPayouts,
                  },
                ].map((item) => (
                  <label
                    key={item.id}
                    className="p-4 bg-surface-muted rounded-xl border border-border flex items-center justify-between gap-4 cursor-pointer"
                  >
                    <div>
                      <span className="font-bold text-xs text-text-main block">{item.title}</span>
                      <span className="text-[11px] text-text-muted">{item.desc}</span>
                    </div>
                    <input
                      type="checkbox"
                      checked={item.checked}
                      onChange={(e) => item.setter(e.target.checked)}
                      className="w-4 h-4 rounded text-primary focus:ring-primary cursor-pointer"
                    />
                  </label>
                ))}
              </div>
            </div>
          )}

          {/* 4. SHIPPING PREFERENCES */}
          {activeTab === 'shipping' && (
            <div className="bg-surface rounded-2xl border border-border p-6 space-y-5 shadow-subtle animate-in fade-in duration-200">
              <h2 className="font-serif font-bold text-base text-text-main pb-2 border-b border-border">
                Logistics & Dispatch Handling
              </h2>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <Input
                  label="Average Preparation Lead Time (Days)"
                  type="number"
                  min="1"
                  value={handlingTimeDays}
                  onChange={(e) => setHandlingTimeDays(e.target.value)}
                  required
                />

                <Input
                  label="Complimentary Courier Threshold (USD)"
                  type="number"
                  min="0"
                  value={freeShippingThreshold}
                  onChange={(e) => setFreeShippingThreshold(e.target.value)}
                  required
                />
              </div>

              <div>
                <label className="text-xs font-semibold text-text-main block mb-1">
                  Default Courier Service Tier
                </label>
                <select
                  value={defaultCarrier}
                  onChange={(e) => setDefaultCarrier(e.target.value)}
                  className="w-full px-3 py-2 text-xs bg-surface-muted border border-border rounded-xl text-text-main cursor-pointer"
                >
                  <option value="Sovereign White-Glove Express">Sovereign White-Glove Express (Primary)</option>
                  <option value="DHL Express Insured">DHL Express Insured Worldwide</option>
                  <option value="Brink's Armored Transport">Brink's Armored High-Value Transport</option>
                </select>
              </div>
            </div>
          )}

          {/* 5. RETURN PREFERENCES */}
          {activeTab === 'returns' && (
            <div className="bg-surface rounded-2xl border border-border p-6 space-y-5 shadow-subtle animate-in fade-in duration-200">
              <h2 className="font-serif font-bold text-base text-text-main pb-2 border-b border-border">
                Sovereign Return & Guarantee Protocols
              </h2>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="text-xs font-semibold text-text-main block mb-1">
                    Acceptance Window (Days from Delivery)
                  </label>
                  <select
                    value={returnWindowDays}
                    onChange={(e) => setReturnWindowDays(e.target.value)}
                    className="w-full px-3 py-2 text-xs bg-surface-muted border border-border rounded-xl text-text-main cursor-pointer"
                  >
                    <option value="14">14 Days</option>
                    <option value="30">30 Days (Zareen Standard Recommended)</option>
                    <option value="60">60 Days (Haute Joaillerie Extension)</option>
                  </select>
                </div>

                <Input
                  label="Restocking Restitution Fee (%)"
                  type="number"
                  min="0"
                  max="20"
                  value={restockingFee}
                  onChange={(e) => setRestockingFee(e.target.value)}
                />
              </div>

              <label className="p-4 bg-surface-muted rounded-xl border border-border flex items-center justify-between gap-4 cursor-pointer">
                <div>
                  <span className="font-bold text-xs text-text-main block">
                    Complimentary Return Courier Coverage
                  </span>
                  <p className="text-[11px] text-text-muted">
                    Atelier pays for insured return waybills for seamless patron experience.
                  </p>
                </div>
                <input
                  type="checkbox"
                  checked={returnShippingCovered}
                  onChange={(e) => setReturnShippingCovered(e.target.checked)}
                  className="w-4 h-4 rounded text-primary focus:ring-primary cursor-pointer"
                />
              </label>
            </div>
          )}

          {/* 6. SECURITY & 2FA */}
          {activeTab === 'security' && (
            <div className="bg-surface rounded-2xl border border-border p-6 space-y-5 shadow-subtle animate-in fade-in duration-200">
              <h2 className="font-serif font-bold text-base text-text-main pb-2 border-b border-border">
                Security & Studio Credentials
              </h2>

              <div className="p-4 bg-surface-muted rounded-xl border border-border flex items-center justify-between gap-4">
                <div>
                  <span className="font-bold text-xs text-text-main block">
                    Hardware / App Two-Factor Authentication (2FA)
                  </span>
                  <p className="text-[11px] text-text-muted">
                    Require TOTP authentication code when updating payout bank coordinates.
                  </p>
                </div>
                <input
                  type="checkbox"
                  checked={twoFactorEnabled}
                  onChange={(e) => setTwoFactorEnabled(e.target.checked)}
                  className="w-4 h-4 rounded text-primary focus:ring-primary cursor-pointer"
                />
              </div>

              <div className="space-y-3 pt-2">
                <h3 className="font-serif font-bold text-xs uppercase tracking-wider text-text-main">
                  Change Password
                </h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <Input
                    label="Current Password"
                    type="password"
                    placeholder="••••••••••••"
                    value={currentPassword}
                    onChange={(e) => setCurrentPassword(e.target.value)}
                  />
                  <Input
                    label="New Secure Password"
                    type="password"
                    placeholder="••••••••••••"
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                  />
                </div>
              </div>
            </div>
          )}

          {/* Bottom Save Trigger */}
          <div className="flex items-center justify-end gap-3 pt-4 border-t border-border">
            <Button type="submit" variant="primary" size="md" leftIcon={Save}>
              Save Preferences
            </Button>
          </div>
        </form>
      </div>
    </>
  );
};

export default SellerSettingsPage;
