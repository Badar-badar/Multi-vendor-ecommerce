import { Link } from 'react-router-dom';
import {
  Sparkles,
  ShieldCheck,
  Award,
  Gem,
  CheckCircle2,
  FileCheck,
  Scale,
  ArrowRight,
} from 'lucide-react';
import Button from '../../components/common/Button';

export const AuthenticityPage = () => {
  const guarantees = [
    {
      icon: Award,
      title: 'Official State Assay Hallmarks',
      description: 'Precious metals (18k/24k gold, 950 platinum) undergo independent assay and hallmark stamping according to Swiss and British Hallmarking Act standards.',
    },
    {
      icon: Gem,
      title: 'Kimberley Protocol & GIA Certification',
      description: 'Every diamond and high-grade colored gemstone is 100% ethically sourced and accompanied by GIA, HRD Antwerp, or SSEF laboratory dossiers.',
    },
    {
      icon: FileCheck,
      title: 'Signed Archival Provenance Deed',
      description: 'Acquisitions receive a physical deckle-edged deed inscribed with the master artisan’s personal hallmark and unique cryptographic registration ID.',
    },
    {
      icon: ShieldCheck,
      title: 'Lifetime Atelier Authenticity Guarantee',
      description: 'We guarantee the genuine origin and sovereign provenance of every creation on Zareen for perpetuity with full restitution warranty.',
    },
  ];

  return (
    <div className="min-h-screen bg-background text-text-main pb-24 space-y-16">
      {/* Hero Header */}
      <section className="relative bg-slate-950 text-white py-20 sm:py-28 border-b border-border/80 overflow-hidden">
        <div className="absolute inset-0 z-0">
          <img
            src="https://images.unsplash.com/photo-1535632066927-ab7c9ab60908?q=80&w=2000&auto=format&fit=crop"
            alt="Authenticity & Hallmark Vetting"
            className="w-full h-full object-cover object-center"
          />
          <div className="absolute inset-0 bg-gradient-to-b from-slate-950/90 via-slate-950/80 to-slate-950" />
          <div className="absolute inset-0 bg-[radial-gradient(#ffffff_1px,transparent_1px)] [background-size:24px_24px] opacity-10" />
        </div>

        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center space-y-4 relative z-10">
          <span className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white/10 border border-white/15 text-accent-light text-xs font-semibold uppercase tracking-widest backdrop-blur-md">
            <Sparkles className="w-3.5 h-3.5 text-accent" /> Sovereign Provenance
          </span>
          <h1 className="font-serif text-3xl sm:text-5xl lg:text-6xl font-bold text-white tracking-tight leading-tight">
            Authenticity & Hallmarking Charter
          </h1>
          <p className="text-xs sm:text-base text-slate-300 max-w-xl mx-auto leading-relaxed font-light">
            Every piece hosted on Zareen is certified with museum-grade provenance, laboratory testing, and master artisan signatures.
          </p>
        </div>
      </section>

      {/* 4 Guarantees Grid */}
      <section className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 -mt-10 relative z-20">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {guarantees.map((g, idx) => {
            const Icon = g.icon;
            return (
              <div key={idx} className="bg-surface rounded-3xl border border-border p-6 shadow-subtle space-y-3">
                <div className="w-10 h-10 rounded-xl bg-accent/10 flex items-center justify-center text-accent">
                  <Icon className="w-5 h-5" />
                </div>
                <h3 className="font-serif font-bold text-base text-text-main">{g.title}</h3>
                <p className="text-xs text-text-muted leading-relaxed">{g.description}</p>
              </div>
            );
          })}
        </div>
      </section>

      {/* Detailed Vetting Process */}
      <section className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        <div className="bg-surface rounded-3xl border border-border p-8 sm:p-12 space-y-6 text-sm text-text-muted leading-relaxed shadow-subtle">
          <h2 className="font-serif font-bold text-2xl text-text-main">
            The Atelier Vetting & Accreditation Protocol
          </h2>
          <p>
            Before an independent craftsperson or generational maison can list a single creation on Zareen, our Curatorial Council conducts an on-site audit of their workshop, master artisan credentials, and raw material sourcing supply chain.
          </p>
          <div className="space-y-3 pt-2">
            {[
              'Verification of physical manufacturing premises and traditional non-industrial tooling.',
              'Spectroscopic verification of precious metal composition and diamond authenticity.',
              'Legal verification of fair wage practices and non-exploitative labor conditions.',
              'Immutable signing of the Sovereign Artisan Charter and Escrow Compact.',
            ].map((item, i) => (
              <div key={i} className="flex items-start gap-3">
                <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                <span className="text-xs text-text-main">{item}</span>
              </div>
            ))}
          </div>
        </div>

        <div className="text-center pt-2">
          <Link to="/products">
            <Button variant="primary" size="md" rightIcon={ArrowRight}>
              Explore Authenticated Collections
            </Button>
          </Link>
        </div>
      </section>
    </div>
  );
};

export default AuthenticityPage;
