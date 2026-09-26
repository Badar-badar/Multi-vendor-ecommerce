import { Sparkles, Lock, EyeOff, ShieldCheck, Database, Key } from 'lucide-react';

export const PrivacyPolicyPage = () => {
  return (
    <div className="min-h-screen bg-background text-text-main pb-24 space-y-16">
      {/* Hero Header */}
      <section className="relative bg-slate-950 text-white py-20 sm:py-28 border-b border-border/80 overflow-hidden">
        <div className="absolute inset-0 z-0">
          <img
            src="https://images.unsplash.com/photo-1550751827-4bd374c3f58b?q=80&w=2000&auto=format&fit=crop"
            alt="Patron Privacy & Zero Knowledge Data Security"
            className="w-full h-full object-cover object-center"
          />
          <div className="absolute inset-0 bg-gradient-to-b from-slate-950/90 via-slate-950/80 to-slate-950" />
          <div className="absolute inset-0 bg-[radial-gradient(#ffffff_1px,transparent_1px)] [background-size:24px_24px] opacity-10" />
        </div>

        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center space-y-4 relative z-10">
          <span className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white/10 border border-white/15 text-accent-light text-xs font-semibold uppercase tracking-widest backdrop-blur-md">
            <Sparkles className="w-3.5 h-3.5 text-accent" /> Sovereign Patron Privacy
          </span>
          <h1 className="font-serif text-3xl sm:text-5xl lg:text-6xl font-bold text-white tracking-tight leading-tight">
            Privacy Policy & Data Protocol
          </h1>
          <p className="text-xs sm:text-base text-slate-300 max-w-xl mx-auto leading-relaxed font-light">
            We adhere to zero-knowledge data architecture. Your collection history, bespoke commissions, and identity are never commercialized.
          </p>
        </div>
      </section>

      {/* Main Privacy Principles */}
      <section className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-surface rounded-3xl border border-border p-8 sm:p-12 space-y-8 text-sm text-text-muted leading-relaxed shadow-subtle">
          <div className="flex items-center justify-between pb-6 border-b border-border text-xs">
            <span className="font-semibold text-text-main">Standards: GDPR, Swiss FADP, CCPA</span>
            <span className="text-emerald-600 font-bold">Zero-Monetization Guarantee</span>
          </div>

          <div className="space-y-3">
            <h3 className="font-serif font-bold text-xl text-text-main flex items-center gap-2">
              <EyeOff className="w-5 h-5 text-accent" /> 1. Minimalist Data Philosophy
            </h3>
            <p>
              We collect solely the personal data necessary to authenticate acquisitions, coordinate insured armored dispatch, and comply with international anti-money laundering (AML) protocols. We do not engage in third-party behavioral profiling or programmatic ad tracking.
            </p>
          </div>

          <div className="space-y-3">
            <h3 className="font-serif font-bold text-xl text-text-main flex items-center gap-2">
              <Key className="w-5 h-5 text-accent" /> 2. Cryptographic Encryption & Storage
            </h3>
            <p>
              Patron records and delivery coordinates are encrypted using AES-256 at rest and TLS 1.3 in transit. Financial processing is tokenized through PCI-DSS Level 1 certified banking gateways, meaning Zareen never stores raw credit card numbers.
            </p>
          </div>

          <div className="space-y-3">
            <h3 className="font-serif font-bold text-xl text-text-main flex items-center gap-2">
              <Database className="w-5 h-5 text-accent" /> 3. Sovereign Data Custody & Erasure
            </h3>
            <p>
              As a patron, you possess the inviolable right to inspect, export, or permanently erase your digital profile and past activity records from our servers, subject only to statutory tax retention requirements.
            </p>
          </div>

          <div className="space-y-3">
            <h3 className="font-serif font-bold text-xl text-text-main flex items-center gap-2">
              <Lock className="w-5 h-5 text-accent" /> 4. Disclosing Data to Sovereign Ateliers
            </h3>
            <p>
              When you acquire an item, only the delivery name and physical destination coordinates are shared with the fulfilling workshop. Your full contact dossier and payment details remain completely shielded.
            </p>
          </div>
        </div>
      </section>
    </div>
  );
};

export default PrivacyPolicyPage;
