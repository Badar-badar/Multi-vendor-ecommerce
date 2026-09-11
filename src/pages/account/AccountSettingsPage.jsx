import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Settings,
  Bell,
  ShieldCheck,
  Globe,
  DollarSign,
  Trash2,
  Lock,
  AlertTriangle,
  CheckCircle2,
  X,
} from 'lucide-react';
import toast from 'react-hot-toast';
import useAuth from '../../hooks/useAuth';
import AccountLayout from '../../components/account/AccountLayout';
import Checkbox from '../../components/forms/Checkbox';
import Button from '../../components/common/Button';

export const AccountSettingsPage = () => {
  const navigate = useNavigate();
  const { logout } = useAuth();

  // Notification toggles
  const [notifPrefs, setNotifPrefs] = useState({
    orderUpdates: true,
    artisanInvites: true,
    priceDrops: false,
    gazette: true,
  });

  // Privacy toggles
  const [privacyPrefs, setPrivacyPrefs] = useState({
    twoFactor: true,
    zeroKnowledge: true,
    browsingHistory: true,
  });

  // Preferences
  const [currency, setCurrency] = useState('USD');
  const [language, setLanguage] = useState('en');
  const [timezone, setTimezone] = useState('America/New_York');

  // Deletion modal
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [deleteConfirmText, setDeleteConfirmText] = useState('');

  const handleSavePreferences = () => {
    toast.success('Account preferences saved.');
  };

  const handleConfirmDelete = async () => {
    if (deleteConfirmText.toLowerCase() !== 'delete') {
      toast.error('Please type DELETE to confirm.');
      return;
    }
    setIsDeleteModalOpen(false);
    toast.success('Your registry account has been deactivated.');
    await logout();
    navigate('/');
  };

  return (
    <AccountLayout>
      <div className="space-y-8">
        {/* Header Title */}
        <div className="pb-4 border-b border-border">
          <h2 className="font-serif font-bold text-xl text-text-main">
            Registry Settings & Preferences
          </h2>
          <p className="text-xs text-text-muted">
            Configure privacy boundaries, sovereign currency preferences, and notification protocols.
          </p>
        </div>

        {/* Currency, Language & Localization */}
        <div className="bg-surface rounded-2xl border border-border p-6 sm:p-8 space-y-5 shadow-subtle">
          <div className="flex items-center gap-2 pb-3 border-b border-border">
            <Globe className="w-4 h-4 text-accent" />
            <h3 className="font-serif font-bold text-base text-text-main">
              Regional & Currency Preferences
            </h3>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div>
              <label className="text-xs font-semibold text-text-main block mb-1">
                Display Currency
              </label>
              <select
                value={currency}
                onChange={(e) => setCurrency(e.target.value)}
                className="w-full px-3 py-2.5 text-xs bg-surface border border-border rounded-xl focus:outline-none focus:border-text-main font-medium"
              >
                <option value="USD">USD ($) — United States Dollar</option>
                <option value="EUR">EUR (€) — Euro</option>
                <option value="GBP">GBP (£) — British Pound</option>
                <option value="CHF">CHF (CHF) — Swiss Franc</option>
                <option value="AED">AED (د.إ) — UAE Dirham</option>
                <option value="JPY">JPY (¥) — Japanese Yen</option>
              </select>
            </div>

            <div>
              <label className="text-xs font-semibold text-text-main block mb-1">
                Preferred Language
              </label>
              <select
                value={language}
                onChange={(e) => setLanguage(e.target.value)}
                className="w-full px-3 py-2.5 text-xs bg-surface border border-border rounded-xl focus:outline-none focus:border-text-main font-medium"
              >
                <option value="en">English (International)</option>
                <option value="fr">Français (France)</option>
                <option value="it">Italiano (Italia)</option>
                <option value="ja">日本語 (Japan)</option>
              </select>
            </div>

            <div>
              <label className="text-xs font-semibold text-text-main block mb-1">
                Timezone
              </label>
              <select
                value={timezone}
                onChange={(e) => setTimezone(e.target.value)}
                className="w-full px-3 py-2.5 text-xs bg-surface border border-border rounded-xl focus:outline-none focus:border-text-main font-medium"
              >
                <option value="America/New_York">Eastern Time (EST / EDT)</option>
                <option value="America/Los_Angeles">Pacific Time (PST / PDT)</option>
                <option value="Europe/Paris">Central European Time (CET)</option>
                <option value="Europe/London">Greenwich Mean Time (GMT / BST)</option>
                <option value="Asia/Dubai">Gulf Standard Time (GST)</option>
                <option value="Asia/Tokyo">Japan Standard Time (JST)</option>
              </select>
            </div>
          </div>
        </div>

        {/* Notification Preferences */}
        <div className="bg-surface rounded-2xl border border-border p-6 sm:p-8 space-y-5 shadow-subtle">
          <div className="flex items-center gap-2 pb-3 border-b border-border">
            <Bell className="w-4 h-4 text-accent" />
            <h3 className="font-serif font-bold text-base text-text-main">
              Subscription & Advisory Notifications
            </h3>
          </div>

          <div className="space-y-3.5">
            <Checkbox
              id="pref-orders"
              label="Real-time order milestone dispatches and delivery confirmations"
              checked={notifPrefs.orderUpdates}
              onChange={(e) =>
                setNotifPrefs({ ...notifPrefs, orderUpdates: e.target.checked })
              }
            />

            <Checkbox
              id="pref-artisan"
              label="Exclusive atelier private invitations and bespoke allocation announcements"
              checked={notifPrefs.artisanInvites}
              onChange={(e) =>
                setNotifPrefs({ ...notifPrefs, artisanInvites: e.target.checked })
              }
            />

            <Checkbox
              id="pref-price"
              label="Wishlist curation availability and rarity alerts"
              checked={notifPrefs.priceDrops}
              onChange={(e) =>
                setNotifPrefs({ ...notifPrefs, priceDrops: e.target.checked })
              }
            />

            <Checkbox
              id="pref-gazette"
              label="Zareen Monthly Gazette — Curated chronicles of global mastercraft"
              checked={notifPrefs.gazette}
              onChange={(e) =>
                setNotifPrefs({ ...notifPrefs, gazette: e.target.checked })
              }
            />
          </div>
        </div>

        {/* Security & Privacy Settings */}
        <div className="bg-surface rounded-2xl border border-border p-6 sm:p-8 space-y-5 shadow-subtle">
          <div className="flex items-center gap-2 pb-3 border-b border-border">
            <ShieldCheck className="w-4 h-4 text-accent" />
            <h3 className="font-serif font-bold text-base text-text-main">
              Privacy & Authentication Protocol
            </h3>
          </div>

          <div className="space-y-3.5">
            <Checkbox
              id="pref-2fa"
              label="Require 2-Factor Authentication on new device authorizations"
              checked={privacyPrefs.twoFactor}
              onChange={(e) =>
                setPrivacyPrefs({ ...privacyPrefs, twoFactor: e.target.checked })
              }
            />

            <Checkbox
              id="pref-zero-knowledge"
              label="Enforce Sovereign Zero-Knowledge Client Encryption (never share purchasing telemetry with third parties)"
              checked={privacyPrefs.zeroKnowledge}
              onChange={(e) =>
                setPrivacyPrefs({ ...privacyPrefs, zeroKnowledge: e.target.checked })
              }
            />

            <Checkbox
              id="pref-history"
              label="Retain recently viewed curations across local browser sessions"
              checked={privacyPrefs.browsingHistory}
              onChange={(e) =>
                setPrivacyPrefs({ ...privacyPrefs, browsingHistory: e.target.checked })
              }
            />
          </div>
        </div>

        {/* Save Changes Button */}
        <div className="flex justify-end">
          <Button variant="primary" size="lg" onClick={handleSavePreferences}>
            Save All Preferences
          </Button>
        </div>

        {/* Danger Zone: Account Deactivation */}
        <div className="bg-rose-50/50 rounded-2xl border border-rose-200 p-6 sm:p-8 space-y-4">
          <div className="flex items-center gap-2 text-rose-800">
            <AlertTriangle className="w-5 h-5 text-rose-600" />
            <h3 className="font-serif font-bold text-base">
              Deactivate Sovereign Registry
            </h3>
          </div>

          <p className="text-xs text-rose-700 leading-relaxed max-w-xl">
            Deactivating your registry will purge saved delivery destinations, cancel pending wishlists, and revoke VIP collector status. Completed order receipts remain archived in our sovereign tax ledger.
          </p>

          <Button
            type="button"
            variant="secondary"
            size="md"
            onClick={() => setIsDeleteModalOpen(true)}
            className="border-rose-200 text-rose-700 hover:bg-rose-100"
            leftIcon={Trash2}
          >
            Deactivate Account
          </Button>
        </div>
      </div>

      {/* Delete Confirmation Modal */}
      {isDeleteModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-in fade-in">
          <div className="bg-surface w-full max-w-md rounded-3xl border border-border p-6 sm:p-8 space-y-5 shadow-2xl">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2 text-rose-600">
                <AlertTriangle className="w-5 h-5" />
                <h4 className="font-serif font-bold text-base text-text-main">
                  Confirm Deactivation
                </h4>
              </div>
              <button
                type="button"
                onClick={() => setIsDeleteModalOpen(false)}
                className="text-text-muted hover:text-text-main p-1 rounded-lg"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <p className="text-xs text-text-muted leading-relaxed">
              This action cannot be undone. Please type <strong className="text-text-main font-mono">DELETE</strong> below to finalize deactivation.
            </p>

            <input
              type="text"
              placeholder="Type DELETE"
              value={deleteConfirmText}
              onChange={(e) => setDeleteConfirmText(e.target.value)}
              className="w-full px-3.5 py-2.5 text-xs bg-surface border border-border rounded-xl focus:outline-none focus:border-rose-500 font-mono text-text-main"
            />

            <div className="pt-2 border-t border-border flex items-center justify-end gap-3">
              <Button
                variant="secondary"
                size="md"
                onClick={() => setIsDeleteModalOpen(false)}
              >
                Cancel
              </Button>
              <Button
                variant="primary"
                size="md"
                onClick={handleConfirmDelete}
                className="bg-rose-600 hover:bg-rose-700 text-white"
              >
                Deactivate Forever
              </Button>
            </div>
          </div>
        </div>
      )}
    </AccountLayout>
  );
};

export default AccountSettingsPage;
