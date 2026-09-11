import React from 'react';
import { Link } from 'react-router-dom';
import {
  Sparkles,
  ShieldCheck,
  Award,
  Globe,
  Heart,
  Store,
  Truck,
  Layers,
  ArrowRight,
} from 'lucide-react';
import Button from '../../components/common/Button';

export const AboutPage = () => {
  const pillars = [
    {
      icon: Award,
      title: 'Sovereign Craftsmanship',
      description:
        'Every piece hosted on Zareen is born in independent workshops, non-mass-produced and crafted with artisanal mastery.',
    },
    {
      icon: ShieldCheck,
      title: 'Provenance & Fairmined Assurance',
      description:
        'We vet each atelier with rigorous hallmarks, Fairmined gold verification, and full traceable raw material registries.',
    },
    {
      icon: Truck,
      title: 'White-Glove Insured Transit',
      description:
        'Worldwide private courier dispatch with full transit value indemnity and signature verification at your residence.',
    },
    {
      icon: Heart,
      title: 'Direct Artisan Patronage',
      description:
        'We direct the vast majority of commerce proceeds straight to the creators, sustaining century-old European and Japanese heritage crafts.',
    },
  ];

  return (
    <div className="min-h-screen bg-background text-text-main pb-24 space-y-16 sm:space-y-24">
      {/* Hero Section */}
      <section className="relative bg-surface py-16 sm:py-24 border-b border-border overflow-hidden">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 text-center space-y-6">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-accent/10 border border-accent/20 text-accent text-xs font-semibold uppercase tracking-widest">
            <Sparkles className="w-3.5 h-3.5" /> The Zareen Heritage
          </div>
          <h1 className="font-serif text-3xl sm:text-5xl lg:text-6xl font-bold text-text-main tracking-tight leading-tight">
            Curating the World’s Sovereign Ateliers
          </h1>
          <p className="text-sm sm:text-base text-text-muted max-w-2xl mx-auto leading-relaxed">
            Zareen was founded on a singular conviction: true luxury is not industrial ubiquity, but the soul, time, and irreplaceable touch of the master artisan.
          </p>
        </div>
      </section>

      {/* Story & Philosophy Grid */}
      <section className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          <div className="space-y-6 text-sm text-text-muted leading-relaxed">
            <span className="text-xs font-bold uppercase tracking-widest text-accent block">
              Our Origin
            </span>
            <h2 className="font-serif text-2xl sm:text-3xl font-bold text-text-main">
              A Sanctuary Against Mass Production
            </h2>
            <p>
              In an era dominated by synthetic commodification, Zareen unites discerning collectors with generational goldsmiths in Florence, master horologists in Geneva, bespoke tailors in Paris, and urushi lacquer masters in Kyoto.
            </p>
            <p>
              By offering independent artisans direct access to global patrons under a decentralized studio model, we protect endangered craft techniques while establishing fair economic provenance.
            </p>

            <div className="pt-2">
              <Link to="/products">
                <Button variant="primary" size="md" rightIcon={ArrowRight}>
                  Explore Curated Collections
                </Button>
              </Link>
            </div>
          </div>

          <div className="relative rounded-3xl overflow-hidden border border-border shadow-elevated h-80 sm:h-96">
            <img
              src="https://images.unsplash.com/photo-1441986300917-64674bd600d8?w=800&auto=format&fit=crop&q=80"
              alt="Artisan Studio Paris"
              className="w-full h-full object-cover"
            />
          </div>
        </div>
      </section>

      {/* 4 Pillars of Excellence */}
      <section className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center space-y-2 mb-12">
          <span className="text-xs font-bold uppercase tracking-widest text-accent">
            The Zareen Standard
          </span>
          <h2 className="font-serif text-2xl sm:text-3xl font-bold text-text-main">
            Our Commitments to Discerning Patrons
          </h2>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {pillars.map((p, idx) => {
            const Icon = p.icon;
            return (
              <div
                key={idx}
                className="bg-surface rounded-2xl border border-border p-6 space-y-3 shadow-subtle hover:border-border-strong transition-all"
              >
                <div className="w-10 h-10 rounded-xl bg-accent/10 flex items-center justify-center text-accent">
                  <Icon className="w-5 h-5" />
                </div>
                <h3 className="font-serif font-bold text-base text-text-main">{p.title}</h3>
                <p className="text-xs text-text-muted leading-relaxed">{p.description}</p>
              </div>
            );
          })}
        </div>
      </section>

      {/* Call to Action Banner */}
      <section className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="p-8 sm:p-12 rounded-3xl bg-primary text-white text-center space-y-6 shadow-modal">
          <h2 className="font-serif text-2xl sm:text-4xl font-bold">
            Are You a Sovereign Artisan or Collector?
          </h2>
          <p className="text-xs sm:text-sm text-slate-300 max-w-xl mx-auto leading-relaxed">
            Join the global guild. Apply to showcase your creations or request a private salon appointment with our concierge.
          </p>
          <div className="flex flex-wrap items-center justify-center gap-4 pt-2">
            <Link to="/seller/register">
              <Button variant="accent" size="md">
                Apply as Atelier
              </Button>
            </Link>
            <Link to="/contact">
              <Button
                variant="outline"
                size="md"
                className="text-white border-white/40 hover:bg-white/10"
              >
                Contact Concierge
              </Button>
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
};

export default AboutPage;
