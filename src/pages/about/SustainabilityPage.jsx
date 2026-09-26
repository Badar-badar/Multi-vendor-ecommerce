import { Link } from 'react-router-dom';
import {
  Sparkles,
  Leaf,
  Globe,
  Recycle,
  HeartHandshake,
  CheckCircle2,
  ArrowRight,
} from 'lucide-react';
import Button from '../../components/common/Button';

export const SustainabilityPage = () => {
  const commitments = [
    {
      icon: Leaf,
      title: '100% Fairmined & Recycled Gold',
      description: 'We partner directly with certified artisanal mining cooperatives in the Andes, ensuring miners receive guaranteed fair-trade premiums without toxic mercury runoff.',
    },
    {
      icon: Recycle,
      title: 'Zero-Waste Atelier Production',
      description: 'Creations are crafted made-to-order or in micro-batches, preventing the mass overproduction and landfill destruction typical of conglomerate fast-luxury.',
    },
    {
      icon: Globe,
      title: 'Carbon-Neutral Insured Transit',
      description: 'Every air transit mile across our 80+ destination countries is 100% carbon-offset through verified European woodland regeneration and mangrove restoration.',
    },
    {
      icon: HeartHandshake,
      title: 'Living Wages for Master Artisans',
      description: 'Over 85% of each transaction flows directly to the maker, sustaining traditional guilds and supporting apprenticeship programs for next-generation artisans.',
    },
  ];

  return (
    <div className="min-h-screen bg-background text-text-main pb-24 space-y-16">
      {/* Hero Header */}
      <section className="relative bg-slate-950 text-white py-20 sm:py-28 border-b border-border/80 overflow-hidden">
        <div className="absolute inset-0 z-0">
          <img
            src="https://images.unsplash.com/photo-1542601906990-b4d3fb778b09?q=80&w=2000&auto=format&fit=crop"
            alt="Ethical Provenance & Sustainability"
            className="w-full h-full object-cover object-center"
          />
          <div className="absolute inset-0 bg-gradient-to-b from-slate-950/90 via-slate-950/80 to-slate-950" />
          <div className="absolute inset-0 bg-[radial-gradient(#ffffff_1px,transparent_1px)] [background-size:24px_24px] opacity-10" />
        </div>

        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center space-y-4 relative z-10">
          <span className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white/10 border border-white/15 text-emerald-400 text-xs font-semibold uppercase tracking-widest backdrop-blur-md">
            <Sparkles className="w-3.5 h-3.5 text-emerald-400" /> Generational Ecology
          </span>
          <h1 className="font-serif text-3xl sm:text-5xl lg:text-6xl font-bold text-white tracking-tight leading-tight">
            Ethical Provenance & Sustainability
          </h1>
          <p className="text-xs sm:text-base text-slate-300 max-w-xl mx-auto leading-relaxed font-light">
            True luxury endures for centuries without burdening the earth. Discover our environmental charters and fair artisan supply chain.
          </p>
        </div>
      </section>

      {/* 4 Pillars */}
      <section className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 -mt-10 relative z-20">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {commitments.map((c, idx) => {
            const Icon = c.icon;
            return (
              <div key={idx} className="bg-surface rounded-3xl border border-border p-6 shadow-subtle space-y-3">
                <div className="w-10 h-10 rounded-xl bg-emerald-500/10 flex items-center justify-center text-emerald-600">
                  <Icon className="w-5 h-5" />
                </div>
                <h3 className="font-serif font-bold text-base text-text-main">{c.title}</h3>
                <p className="text-xs text-text-muted leading-relaxed">{c.description}</p>
              </div>
            );
          })}
        </div>
      </section>

      {/* Narrative Section */}
      <section className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        <div className="bg-surface rounded-3xl border border-border p-8 sm:p-12 space-y-6 text-sm text-text-muted leading-relaxed shadow-subtle">
          <h2 className="font-serif font-bold text-2xl text-text-main">
            Preserving Earth’s Heritage Alongside Human Craft
          </h2>
          <p>
            Unlike mass fashion companies that manufacture tens of thousands of duplicate SKUs every quarter, Zareen’s sovereign model operates entirely around low-volume craftsmanship. Our artisans use vegetable-tanned Italian leathers, reclaimed precious metals, and responsibly mined colored gems with complete mine-to-finger traceability.
          </p>
          <div className="p-4 rounded-2xl bg-emerald-50 dark:bg-emerald-950/20 border border-emerald-200 dark:border-emerald-800 text-xs text-emerald-900 dark:text-emerald-300 font-medium">
            🌱 100% of our packaging is FSC-certified, non-plastic, and fully recyclable with plant-based soy inks.
          </div>
        </div>
      </section>
    </div>
  );
};

export default SustainabilityPage;
