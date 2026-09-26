import { Link } from 'react-router-dom';
import {
  Sparkles,
  RotateCcw,
  ShieldCheck,
  CheckCircle2,
  Clock,
  Truck,
  ArrowRight,
} from 'lucide-react';
import Button from '../../components/common/Button';

export const ReturnsPage = () => {
  const steps = [
    {
      step: '01',
      title: 'Initiate Request',
      description: 'Submit a return request from your account dashboard or contact concierge within 14 calendar days of delivery.',
    },
    {
      step: '02',
      title: 'Complimentary Pick-Up',
      description: 'Our private courier arrives at your location with insured tamper-proof packaging and verification credentials.',
    },
    {
      step: '03',
      title: 'Provenance Inspection',
      description: 'The originating atelier verifies that original hallmarks, security tags, and gem certifications remain intact.',
    },
    {
      step: '04',
      title: 'Instant Escrow Release',
      description: 'Upon verification approval, full funds are immediately released back to your original payment method.',
    },
  ];

  return (
    <div className="min-h-screen bg-background text-text-main pb-24 space-y-16">
      {/* Hero Header */}
      <section className="relative bg-slate-950 text-white py-20 sm:py-28 border-b border-border/80 overflow-hidden">
        <div className="absolute inset-0 z-0">
          <img
            src="https://images.unsplash.com/photo-1549465220-1a8b9238cd48?q=80&w=2000&auto=format&fit=crop"
            alt="Returns & Buyer Guarantee"
            className="w-full h-full object-cover object-center"
          />
          <div className="absolute inset-0 bg-gradient-to-b from-slate-950/90 via-slate-950/80 to-slate-950" />
          <div className="absolute inset-0 bg-[radial-gradient(#ffffff_1px,transparent_1px)] [background-size:24px_24px] opacity-10" />
        </div>

        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center space-y-4 relative z-10">
          <span className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white/10 border border-white/15 text-accent-light text-xs font-semibold uppercase tracking-widest backdrop-blur-md">
            <Sparkles className="w-3.5 h-3.5 text-accent" /> 14-Day Examination Window
          </span>
          <h1 className="font-serif text-3xl sm:text-5xl lg:text-6xl font-bold text-white tracking-tight leading-tight">
            Returns, Exchanges & Escrow Guarantees
          </h1>
          <p className="text-xs sm:text-base text-slate-300 max-w-xl mx-auto leading-relaxed font-light">
            Acquire with absolute peace of mind. Every piece is protected by Zareen Multi-Sig Escrow throughout your examination period.
          </p>
        </div>
      </section>

      {/* 4-Step Visual Process */}
      <section className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 -mt-10 relative z-20">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {steps.map((s, idx) => (
            <div key={idx} className="bg-surface rounded-3xl border border-border p-6 shadow-subtle space-y-3">
              <span className="text-2xl font-serif font-bold text-accent">{s.step}</span>
              <h3 className="font-serif font-bold text-base text-text-main">{s.title}</h3>
              <p className="text-xs text-text-muted leading-relaxed">{s.description}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Detailed Policy Text */}
      <section className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        <div className="bg-surface rounded-3xl border border-border p-8 sm:p-12 space-y-8 text-sm text-text-muted leading-relaxed shadow-subtle">
          <div className="space-y-3">
            <h3 className="font-serif font-bold text-xl text-text-main">
              1. Pristine Condition Standard
            </h3>
            <p>
              To maintain the integrity of our sovereign ateliers, returned pieces must be unworn, undamaged, and presented with all original packaging, certificates of authenticity, and intact security tags.
            </p>
          </div>

          <div className="space-y-3">
            <h3 className="font-serif font-bold text-xl text-text-main">
              2. Custom Bespoke Commissions Exemption
            </h3>
            <p>
              Items customized with personalized engraving, bespoke sizing tailored to unique non-standard measurements, or made-to-order gem settings cannot be returned for cash refund, but carry an atelier lifetime adjustment warranty.
            </p>
          </div>

          <div className="space-y-3">
            <h3 className="font-serif font-bold text-xl text-text-main">
              3. Fully Insured Return Dispatch
            </h3>
            <p>
              Zareen assumes all return courier transit fees and full insurance coverage. You will never bear financial risk for loss or transit damage during a verified return.
            </p>
          </div>
        </div>

        <div className="flex flex-wrap items-center justify-center gap-4 pt-4">
          <Link to="/account/returns">
            <Button variant="primary" size="md">
              Initiate a Return
            </Button>
          </Link>
          <Link to="/contact">
            <Button variant="outline" size="md">
              Speak with Concierge
            </Button>
          </Link>
        </div>
      </section>
    </div>
  );
};

export default ReturnsPage;
