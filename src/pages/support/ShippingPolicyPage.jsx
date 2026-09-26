import { Link } from 'react-router-dom';
import {
  Sparkles,
  Truck,
  ShieldCheck,
  Globe,
  Clock,
  CheckCircle2,
  Box,
  Lock,
} from 'lucide-react';
import Button from '../../components/common/Button';

export const ShippingPolicyPage = () => {
  const transitTiers = [
    {
      title: 'Standard Insured Courier',
      threshold: 'Complimentary over $200 (or $15 flat)',
      deliveryTime: '3 – 5 Business Days',
      carrier: 'DHL Express Private / FedEx Priority',
      features: ['Signature Verification', 'Real-time GPS Tracking', 'Transit Indemnity up to $50,000'],
    },
    {
      title: 'Ferrari / Brinks Armored Transit',
      threshold: 'Complimentary on pieces > $10,000',
      deliveryTime: '1 – 3 Business Days',
      carrier: 'Ferrari Armored Group / Malca-Amit',
      features: ['Armed Courier Hand-Delivery', 'Tamper-Evident Vault Casing', 'Full $500,000 Insurance'],
    },
  ];

  return (
    <div className="min-h-screen bg-background text-text-main pb-24 space-y-16">
      {/* Hero Header */}
      <section className="relative bg-slate-950 text-white py-20 sm:py-28 border-b border-border/80 overflow-hidden">
        <div className="absolute inset-0 z-0">
          <img
            src="https://images.unsplash.com/photo-1578575437130-527eed3abbec?q=80&w=2000&auto=format&fit=crop"
            alt="Armored Logistics & Insured Shipping"
            className="w-full h-full object-cover object-center"
          />
          <div className="absolute inset-0 bg-gradient-to-b from-slate-950/90 via-slate-950/80 to-slate-950" />
          <div className="absolute inset-0 bg-[radial-gradient(#ffffff_1px,transparent_1px)] [background-size:24px_24px] opacity-10" />
        </div>

        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center space-y-4 relative z-10">
          <span className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white/10 border border-white/15 text-accent-light text-xs font-semibold uppercase tracking-widest backdrop-blur-md">
            <Sparkles className="w-3.5 h-3.5 text-accent" /> White-Glove Global Logistics
          </span>
          <h1 className="font-serif text-3xl sm:text-5xl lg:text-6xl font-bold text-white tracking-tight leading-tight">
            Shipping & Transit Policy
          </h1>
          <p className="text-xs sm:text-base text-slate-300 max-w-xl mx-auto leading-relaxed font-light">
            Every acquisition is dispatched under high-security custody, full monetary insurance, and direct recipient signature verification.
          </p>
        </div>
      </section>

      {/* Transit Tier Cards */}
      <section className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 -mt-10 relative z-20">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {transitTiers.map((tier, idx) => (
            <div key={idx} className="bg-surface rounded-3xl border border-border p-6 sm:p-8 shadow-subtle space-y-5">
              <div className="flex items-center justify-between">
                <div className="w-12 h-12 rounded-2xl bg-accent/10 flex items-center justify-center text-accent">
                  <Truck className="w-6 h-6" />
                </div>
                <span className="text-[10px] font-bold uppercase tracking-wider text-accent bg-accent/10 px-2.5 py-1 rounded-full">
                  {tier.deliveryTime}
                </span>
              </div>

              <div>
                <h3 className="font-serif font-bold text-xl text-text-main">{tier.title}</h3>
                <p className="text-xs text-text-muted mt-1">{tier.threshold}</p>
              </div>

              <div className="space-y-2.5 pt-2 border-t border-border/70">
                {tier.features.map((f, i) => (
                  <div key={i} className="flex items-center gap-2 text-xs text-text-main">
                    <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                    <span>{f}</span>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Policy Details */}
      <section className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        <div className="bg-surface rounded-3xl border border-border p-8 sm:p-12 space-y-8 text-sm text-text-muted leading-relaxed shadow-subtle">
          <div className="space-y-3">
            <h3 className="font-serif font-bold text-xl text-text-main flex items-center gap-2">
              <ShieldCheck className="w-5 h-5 text-accent" /> 1. Temperature & Tamper Packaging
            </h3>
            <p>
              Fine horological mechanisms, gemstone jewelry, and artisanal leather pieces are encased in climate-controlled inner linings and sealed with serialization tamper tapes. If a seal arrives broken, do not sign for the package and notify concierge immediately.
            </p>
          </div>

          <div className="space-y-3">
            <h3 className="font-serif font-bold text-xl text-text-main flex items-center gap-2">
              <Globe className="w-5 h-5 text-accent" /> 2. Delivered Duty Paid (DDP) Protocol
            </h3>
            <p>
              For dispatches to the United States, United Kingdom, European Union, UAE, Switzerland, Singapore, and Japan, all duties and VAT are settled upon checkout. You will never receive an unexpected brokerage bill from customs upon arrival.
            </p>
          </div>

          <div className="space-y-3">
            <h3 className="font-serif font-bold text-xl text-text-main flex items-center gap-2">
              <Lock className="w-5 h-5 text-accent" /> 3. Real-Time Tracking & Private Rescheduling
            </h3>
            <p>
              Once your piece completes final hallmarking and atelier dispatch, a private tracking dossier is issued. You may coordinate delivery windows or reroute to a secure bank vault via our concierge.
            </p>
          </div>
        </div>

        <div className="text-center pt-4">
          <Link to="/orders/track">
            <Button variant="primary" size="md">
              Track an Active Dispatch
            </Button>
          </Link>
        </div>
      </section>
    </div>
  );
};

export default ShippingPolicyPage;
