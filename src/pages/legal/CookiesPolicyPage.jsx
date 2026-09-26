import { useState } from 'react';
import { Sparkles, Cookie, ShieldCheck, Check, Settings, ToggleLeft, ToggleRight } from 'lucide-react';
import toast from 'react-hot-toast';
import Button from '../../components/common/Button';

export const CookiesPolicyPage = () => {
  const [preferences, setPreferences] = useState({
    essential: true,
    functional: true,
    analytics: false,
  });

  const handleSave = () => {
    toast.success('Your cookie and privacy preferences have been updated.');
  };

  return (
    <div className="min-h-screen bg-background text-text-main pb-24 space-y-16">
      {/* Hero Header */}
      <section className="relative bg-slate-950 text-white py-20 sm:py-28 border-b border-border/80 overflow-hidden">
        <div className="absolute inset-0 z-0">
          <img
            src="https://images.unsplash.com/photo-1563986768609-322da13575f3?q=80&w=2000&auto=format&fit=crop"
            alt="Cookies & Consent Management"
            className="w-full h-full object-cover object-center"
          />
          <div className="absolute inset-0 bg-gradient-to-b from-slate-950/90 via-slate-950/80 to-slate-950" />
          <div className="absolute inset-0 bg-[radial-gradient(#ffffff_1px,transparent_1px)] [background-size:24px_24px] opacity-10" />
        </div>

        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center space-y-4 relative z-10">
          <span className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white/10 border border-white/15 text-accent-light text-xs font-semibold uppercase tracking-widest backdrop-blur-md">
            <Sparkles className="w-3.5 h-3.5 text-accent" /> Transparent Consent Architecture
          </span>
          <h1 className="font-serif text-3xl sm:text-5xl lg:text-6xl font-bold text-white tracking-tight leading-tight">
            Cookie Policy & Preferences
          </h1>
          <p className="text-xs sm:text-base text-slate-300 max-w-xl mx-auto leading-relaxed font-light">
            We use minimal cookies strictly required to maintain secure patron sessions and preserve localized currency preferences.
          </p>
        </div>
      </section>

      {/* Interactive Cookie Toggles */}
      <section className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        <div className="bg-surface rounded-3xl border border-border p-8 sm:p-12 space-y-8 shadow-subtle">
          <div className="space-y-2">
            <h2 className="font-serif font-bold text-2xl text-text-main">
              Manage Your Cookie Consent
            </h2>
            <p className="text-xs text-text-muted leading-relaxed">
              Tailor the storage parameters active during your browsing sessions across the Zareen marketplace.
            </p>
          </div>

          <div className="space-y-4 divide-y divide-border">
            {/* Essential */}
            <div className="pt-4 flex items-center justify-between gap-4">
              <div className="space-y-1 max-w-xl">
                <div className="flex items-center gap-2">
                  <h4 className="font-serif font-bold text-base text-text-main">Strictly Essential Cookies</h4>
                  <span className="text-[10px] font-bold uppercase tracking-wider text-emerald-600 bg-emerald-50 dark:bg-emerald-950/40 px-2 py-0.5 rounded">
                    Required
                  </span>
                </div>
                <p className="text-xs text-text-muted leading-relaxed">
                  Necessary for session persistence, CSRF authentication tokens, and holding items in your cart. Cannot be deactivated.
                </p>
              </div>
              <div className="p-2 text-emerald-600 font-semibold text-xs flex items-center gap-1">
                <Check className="w-4 h-4" /> Active
              </div>
            </div>

            {/* Functional */}
            <div className="pt-4 flex items-center justify-between gap-4">
              <div className="space-y-1 max-w-xl">
                <h4 className="font-serif font-bold text-base text-text-main">Functional & Currency Cookies</h4>
                <p className="text-xs text-text-muted leading-relaxed">
                  Remembers your currency selection (USD, EUR, GBP, CHF), localized tax settings, and dark/light theme preferences.
                </p>
              </div>
              <button
                type="button"
                onClick={() => setPreferences({ ...preferences, functional: !preferences.functional })}
                className="cursor-pointer text-accent hover:opacity-80 transition-opacity"
              >
                {preferences.functional ? (
                  <ToggleRight className="w-8 h-8 text-primary" />
                ) : (
                  <ToggleLeft className="w-8 h-8 text-text-muted" />
                )}
              </button>
            </div>

            {/* Performance */}
            <div className="pt-4 flex items-center justify-between gap-4">
              <div className="space-y-1 max-w-xl">
                <h4 className="font-serif font-bold text-base text-text-main">Anonymized Performance Telemetry</h4>
                <p className="text-xs text-text-muted leading-relaxed">
                  Helps our engineers diagnose latency bottlenecks and improve client load times without storing IP or personal identifiers.
                </p>
              </div>
              <button
                type="button"
                onClick={() => setPreferences({ ...preferences, analytics: !preferences.analytics })}
                className="cursor-pointer text-accent hover:opacity-80 transition-opacity"
              >
                {preferences.analytics ? (
                  <ToggleRight className="w-8 h-8 text-primary" />
                ) : (
                  <ToggleLeft className="w-8 h-8 text-text-muted" />
                )}
              </button>
            </div>
          </div>

          <div className="pt-4 border-t border-border flex justify-end">
            <Button variant="primary" size="md" onClick={handleSave}>
              Save Cookie Preferences
            </Button>
          </div>
        </div>
      </section>
    </div>
  );
};

export default CookiesPolicyPage;
