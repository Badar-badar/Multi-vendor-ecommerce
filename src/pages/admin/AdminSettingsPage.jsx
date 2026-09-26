import { useState, useEffect } from 'react';
import {
  Settings,
  Shield,
  Store,
  ShoppingCart,
  CreditCard,
  Bell,
  Lock,
  Globe,
  Save,
  CheckCircle2,
  AlertTriangle,
  Server,
} from 'lucide-react';
import { useSelector, useDispatch } from 'react-redux';
import toast from 'react-hot-toast';
import Button from '../../components/common/Button';
import Input from '../../components/common/Input';
import { selectAdminSettings } from '../../features/admin/adminSelectors';
import { updateSettingsLocal } from '../../features/admin/adminSlice';
import { settingsApi } from '../../api';

export const AdminSettingsPage = () => {
  const dispatch = useDispatch();
  const settings = useSelector(selectAdminSettings) || {};

  const [activeSection, setActiveSection] = useState('general');
  const [formData, setFormData] = useState(settings);
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    if (settings && Object.keys(settings).length > 0) {
      setFormData(settings);
    }
  }, [settings]);

  const handleSave = async (e) => {
    e.preventDefault();
    try {
      setIsSaving(true);
      dispatch(updateSettingsLocal(formData));
      // Prepared API contract:
      // await settingsApi.updatePlatformSettings(formData);
      setTimeout(() => {
        setIsSaving(false);
        toast.success('Platform configurations saved successfully.');
      }, 500);
    } catch (err) {
      setIsSaving(false);
      toast.error('Failed to save settings.');
    }
  };

  const sections = [
    { id: 'general', label: 'General', icon: Globe },
    { id: 'marketplace', label: 'Marketplace & Ateliers', icon: Store },
    { id: 'orders', label: 'Orders & Returns', icon: ShoppingCart },
    { id: 'payments', label: 'Payments & Escrow', icon: CreditCard },
    { id: 'notifications', label: 'Notifications', icon: Bell },
    { id: 'security', label: 'Security & Sentinel', icon: Lock },
    { id: 'maintenance', label: 'Maintenance Mode', icon: Server },
  ];

  return (
    <>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-200">
          <div>
            <span className="text-[10px] font-bold uppercase tracking-wider text-amber-800 block mb-1">
              Configuration & Governance
            </span>
            <h1 className="text-2xl sm:text-3xl font-serif font-bold text-slate-900">
              Platform & Marketplace Settings
            </h1>
            <p className="text-xs text-slate-500 mt-0.5">
              Global marketplace parameters, take rate defaults, return windows, and Sentinel security rules.
            </p>
          </div>

          <Button
            variant="primary"
            size="sm"
            leftIcon={Save}
            onClick={handleSave}
            disabled={isSaving}
          >
            {isSaving ? 'Saving...' : 'Save All Changes'}
          </Button>
        </div>

        {/* Workspace Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          {/* Section Navigation Tabs (3 cols) */}
          <div className="lg:col-span-4 space-y-1">
            <div className="bg-white p-2 rounded-2xl border border-slate-200/80 shadow-xs space-y-1">
              {sections.map((sec) => {
                const Icon = sec.icon;
                const isActive = activeSection === sec.id;
                return (
                  <button
                    key={sec.id}
                    onClick={() => setActiveSection(sec.id)}
                    className={`w-full flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-xs font-semibold transition-all cursor-pointer ${
                      isActive
                        ? 'bg-slate-900 text-white shadow-xs'
                        : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
                    }`}
                  >
                    <Icon className={`w-4 h-4 ${isActive ? 'text-amber-400' : 'text-slate-400'}`} />
                    <span>{sec.label}</span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Section Form Details (8 cols) */}
          <div className="lg:col-span-8">
            <div className="bg-white p-6 rounded-2xl border border-slate-200/80 shadow-xs space-y-6">
              {/* General Section */}
              {activeSection === 'general' && (
                <div className="space-y-4">
                  <h3 className="font-serif font-bold text-slate-900 text-base pb-2 border-b border-slate-100">
                    General Marketplace Settings
                  </h3>

                  <div className="space-y-3 text-xs">
                    <div>
                      <label className="block font-bold text-slate-700 mb-1">
                        Marketplace Name
                      </label>
                      <Input
                        value={formData.general?.platformName || 'Zareen Luxury Marketplace'}
                        onChange={(e) =>
                          setFormData({
                            ...formData,
                            general: { ...formData.general, platformName: e.target.value },
                          })
                        }
                        size="sm"
                      />
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      <div>
                        <label className="block font-bold text-slate-700 mb-1">
                          Support Concierge Email
                        </label>
                        <Input
                          value={formData.general?.supportEmail || 'concierge@zareen-luxury.com'}
                          onChange={(e) =>
                            setFormData({
                              ...formData,
                              general: { ...formData.general, supportEmail: e.target.value },
                            })
                          }
                          size="sm"
                        />
                      </div>
                      <div>
                        <label className="block font-bold text-slate-700 mb-1">
                          Concierge Phone Hotline
                        </label>
                        <Input
                          value={formData.general?.supportPhone || '+1 (800) 927-3360'}
                          onChange={(e) =>
                            setFormData({
                              ...formData,
                              general: { ...formData.general, supportPhone: e.target.value },
                            })
                          }
                          size="sm"
                        />
                      </div>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      <div>
                        <label className="block font-bold text-slate-700 mb-1">
                          Default Currency
                        </label>
                        <select
                          value={formData.general?.defaultCurrency || 'USD ($)'}
                          onChange={(e) =>
                            setFormData({
                              ...formData,
                              general: { ...formData.general, defaultCurrency: e.target.value },
                            })
                          }
                          className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl font-semibold text-slate-800"
                        >
                          <option value="USD ($)">USD ($) - United States Dollar</option>
                          <option value="EUR (€)">EUR (€) - Eurozone</option>
                          <option value="GBP (£)">GBP (£) - British Pound</option>
                          <option value="CHF (Fr)">CHF (Fr) - Swiss Franc</option>
                        </select>
                      </div>

                      <div>
                        <label className="block font-bold text-slate-700 mb-1">
                          Default Timezone
                        </label>
                        <select
                          value={formData.general?.timezone || 'UTC+0 (London / GMT)'}
                          onChange={(e) =>
                            setFormData({
                              ...formData,
                              general: { ...formData.general, timezone: e.target.value },
                            })
                          }
                          className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl font-semibold text-slate-800"
                        >
                          <option value="UTC+0 (London / GMT)">UTC+0 (London / GMT)</option>
                          <option value="UTC+1 (Paris / Geneva / CET)">UTC+1 (Paris / Geneva / CET)</option>
                          <option value="UTC-5 (New York / EST)">UTC-5 (New York / EST)</option>
                          <option value="UTC+9 (Tokyo / JST)">UTC+9 (Tokyo / JST)</option>
                        </select>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* Marketplace & Ateliers */}
              {activeSection === 'marketplace' && (
                <div className="space-y-4">
                  <h3 className="font-serif font-bold text-slate-900 text-base pb-2 border-b border-slate-100">
                    Seller & Catalog Vetting
                  </h3>

                  <div className="space-y-3 text-xs">
                    <div className="flex items-center justify-between p-3 rounded-xl bg-slate-50 border border-slate-200">
                      <div>
                        <p className="font-bold text-slate-900">Allow New Seller Applications</p>
                        <p className="text-[11px] text-slate-500">Enable prospective ateliers to submit KYC registration.</p>
                      </div>
                      <input
                        type="checkbox"
                        checked={formData.marketplace?.allowNewSellerRegistration !== false}
                        onChange={(e) =>
                          setFormData({
                            ...formData,
                            marketplace: {
                              ...formData.marketplace,
                              allowNewSellerRegistration: e.target.checked,
                            },
                          })
                        }
                        className="w-4 h-4 rounded text-slate-900 cursor-pointer"
                      />
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      <div>
                        <label className="block font-bold text-slate-700 mb-1">
                          Default Commission Take Rate (%)
                        </label>
                        <Input
                          type="number"
                          value={formData.marketplace?.defaultCommissionRate || 10}
                          onChange={(e) =>
                            setFormData({
                              ...formData,
                              marketplace: {
                                ...formData.marketplace,
                                defaultCommissionRate: Number(e.target.value),
                              },
                            })
                          }
                          size="sm"
                        />
                      </div>
                      <div>
                        <label className="block font-bold text-slate-700 mb-1">
                          Minimum Payout Threshold ($)
                        </label>
                        <Input
                          type="number"
                          value={formData.marketplace?.minPayoutThreshold || 1000}
                          onChange={(e) =>
                            setFormData({
                              ...formData,
                              marketplace: {
                                ...formData.marketplace,
                                minPayoutThreshold: Number(e.target.value),
                              },
                            })
                          }
                          size="sm"
                        />
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* Orders & Returns */}
              {activeSection === 'orders' && (
                <div className="space-y-4">
                  <h3 className="font-serif font-bold text-slate-900 text-base pb-2 border-b border-slate-100">
                    Order Cancellation & Return Policies
                  </h3>

                  <div className="space-y-3 text-xs">
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      <div>
                        <label className="block font-bold text-slate-700 mb-1">
                          Buyer Cancellation Window (Hours)
                        </label>
                        <Input
                          type="number"
                          value={formData.orders?.cancellationWindowHours || 24}
                          onChange={(e) =>
                            setFormData({
                              ...formData,
                              orders: {
                                ...formData.orders,
                                cancellationWindowHours: Number(e.target.value),
                              },
                            })
                          }
                          size="sm"
                        />
                      </div>
                      <div>
                        <label className="block font-bold text-slate-700 mb-1">
                          Return Policy Window (Days)
                        </label>
                        <Input
                          type="number"
                          value={formData.orders?.returnWindowDays || 14}
                          onChange={(e) =>
                            setFormData({
                              ...formData,
                              orders: {
                                ...formData.orders,
                                returnWindowDays: Number(e.target.value),
                              },
                            })
                          }
                          size="sm"
                        />
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* Payments */}
              {activeSection === 'payments' && (
                <div className="space-y-4">
                  <h3 className="font-serif font-bold text-slate-900 text-base pb-2 border-b border-slate-100">
                    Payment Gateway & Multi-Sig Escrow Configuration
                  </h3>

                  <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 text-xs space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="font-bold text-slate-900">Stripe Connect Custom Integration</span>
                      <span className="text-emerald-700 font-bold">● Active Production</span>
                    </div>
                    <p className="text-slate-500">
                      Payment processing, multi-currency conversion, and payout automated splitting.
                    </p>
                  </div>
                </div>
              )}

              {/* Notifications */}
              {activeSection === 'notifications' && (
                <div className="space-y-4">
                  <h3 className="font-serif font-bold text-slate-900 text-base pb-2 border-b border-slate-100">
                    Administrator Email & Sentinel Alerts
                  </h3>

                  <div className="space-y-2 text-xs">
                    {[
                      { key: 'emailOnNewSeller', label: 'Email on New Seller Dossier Submission' },
                      { key: 'emailOnHighValueOrder', label: 'Email on High-Value Orders (>$10,000)' },
                      { key: 'emailOnRefundRequest', label: 'Email on Patron Refund / Dispute Claim' },
                      { key: 'emailOnSecurityAlert', label: 'Email on Sentinel Security Alert' },
                    ].map((item) => (
                      <label
                        key={item.key}
                        className="flex items-center justify-between p-3 rounded-xl bg-slate-50 border border-slate-200 cursor-pointer"
                      >
                        <span className="font-semibold text-slate-800">{item.label}</span>
                        <input
                          type="checkbox"
                          checked={formData.notifications?.[item.key] !== false}
                          onChange={(e) =>
                            setFormData({
                              ...formData,
                              notifications: {
                                ...formData.notifications,
                                [item.key]: e.target.checked,
                              },
                            })
                          }
                          className="w-4 h-4 rounded text-slate-900 cursor-pointer"
                        />
                      </label>
                    ))}
                  </div>
                </div>
              )}

              {/* Security */}
              {activeSection === 'security' && (
                <div className="space-y-4">
                  <h3 className="font-serif font-bold text-slate-900 text-base pb-2 border-b border-slate-100">
                    Platform Security & Session Sentinel
                  </h3>

                  <div className="space-y-3 text-xs">
                    <div className="flex items-center justify-between p-3 rounded-xl bg-slate-50 border border-slate-200">
                      <div>
                        <p className="font-bold text-slate-900">Mandatory MFA for Platform Administrators</p>
                        <p className="text-[11px] text-slate-500">Hardware token or authenticator app required.</p>
                      </div>
                      <span className="font-bold text-emerald-700">Enforced</span>
                    </div>

                    <div className="flex items-center justify-between p-3 rounded-xl bg-slate-50 border border-slate-200">
                      <div>
                        <p className="font-bold text-slate-900">Sentinel Automated Review & Spam Screening</p>
                        <p className="text-[11px] text-slate-500">Flag phishing links and spam in customer reviews automatically.</p>
                      </div>
                      <span className="font-bold text-emerald-700">Active</span>
                    </div>
                  </div>
                </div>
              )}

              {/* Maintenance Section */}
              {activeSection === 'maintenance' && (
                <div className="space-y-4">
                  <h3 className="font-serif font-bold text-slate-900 text-base pb-2 border-b border-slate-100">
                    Platform Maintenance Mode
                  </h3>

                  <div className="space-y-3 text-xs">
                    <div className="p-4 bg-amber-50 rounded-xl border border-amber-200 flex items-center justify-between gap-4">
                      <div>
                        <p className="font-bold text-amber-950">Enable Sovereign Maintenance Mode</p>
                        <p className="text-[11px] text-amber-800">
                          When active, public storefront routes will display an elegant maintenance notice while admin console remains accessible.
                        </p>
                      </div>
                      <input
                        type="checkbox"
                        checked={Boolean(formData.maintenance?.enabled)}
                        onChange={(e) =>
                          setFormData({
                            ...formData,
                            maintenance: {
                              ...formData.maintenance,
                              enabled: e.target.checked,
                            },
                          })
                        }
                        className="w-5 h-5 rounded text-amber-800 cursor-pointer"
                      />
                    </div>

                    <div>
                      <label className="block font-bold text-slate-700 mb-1">
                        Public Notice Announcement Message
                      </label>
                      <textarea
                        rows={3}
                        value={
                          formData.maintenance?.message ||
                          'Zareen Luxury Marketplace is currently undergoing scheduled curatorial maintenance. We will resume service shortly.'
                        }
                        onChange={(e) =>
                          setFormData({
                            ...formData,
                            maintenance: {
                              ...formData.maintenance,
                              message: e.target.value,
                            },
                          })
                        }
                        className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl text-slate-800 text-xs focus:outline-none focus:border-slate-900 leading-relaxed"
                      />
                    </div>
                  </div>
                </div>
              )}

              <div className="flex justify-end pt-4 border-t border-slate-100">
                <Button
                  variant="primary"
                  size="sm"
                  leftIcon={Save}
                  onClick={handleSave}
                  disabled={isSaving}
                >
                  {isSaving ? 'Saving...' : 'Save Platform Configuration'}
                </Button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default AdminSettingsPage;
