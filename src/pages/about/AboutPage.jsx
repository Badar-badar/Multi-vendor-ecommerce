import { Link } from 'react-router-dom';
import {
  Sparkles,
  Award,
  ShieldCheck,
  Truck,
  Heart,
  ArrowRight,
  Gem,
  Compass,
  Hammer,
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

  const milestones = [
    {
      year: '2021',
      title: 'The Florentine Gathering',
      description: 'Founded by a collective of master jewelers and horologists seeking independence from commercial fashion conglomerates.',
    },
    {
      year: '2023',
      title: 'Decentralized Guild Protocol',
      description: 'Expanded across 14 European and Asian heritage enclaves with multi-sig escrow protection for global collectors.',
    },
    {
      year: '2025',
      title: 'The Fairmined Alliance',
      description: '100% of fine jewelry listings verified under ethical gold, conflict-free diamond, and fair artisan wage standards.',
    },
    {
      year: '2026',
      title: 'Global Sovereign Sanctuary',
      description: 'Over 200 accredited master ateliers connecting directly with collectors across 80+ nations.',
    },
  ];

  return (
    <div className="min-h-screen bg-background text-text-main pb-24 space-y-16 sm:space-y-20">
      {/* Hero Section */}
      <section className="relative bg-slate-950 text-white py-20 sm:py-28 border-b border-border/80 overflow-hidden">
        <div className="absolute inset-0 z-0">
          <img
            src="https://images.unsplash.com/photo-1509631179647-0177331693ae?q=80&w=2000&auto=format&fit=crop"
            alt="Artisan Heritage Atelier"
            className="w-full h-full object-cover object-center"
          />
          <div className="absolute inset-0 bg-gradient-to-b from-slate-950/90 via-slate-950/80 to-slate-950" />
          <div className="absolute inset-0 bg-[radial-gradient(#ffffff_1px,transparent_1px)] [background-size:24px_24px] opacity-10" />
        </div>

        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 text-center space-y-6 relative z-10">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white/10 border border-white/15 text-accent-light text-xs font-semibold uppercase tracking-widest backdrop-blur-md">
            <Sparkles className="w-3.5 h-3.5 text-accent" /> The Zareen Origin & Manifesto
          </div>
          <h1 className="font-serif text-3xl sm:text-5xl lg:text-6xl font-bold text-white tracking-tight leading-tight">
            Curating the World’s Sovereign Ateliers
          </h1>
          <p className="text-sm sm:text-base text-slate-300 max-w-2xl mx-auto leading-relaxed font-light">
            Zareen was founded on a singular conviction: true luxury is not industrial ubiquity, but the soul, time, and irreplaceable touch of the master artisan.
          </p>
        </div>
      </section>

      {/* Origin Story Narrative */}
      <section className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          <div className="space-y-6 text-sm text-text-muted leading-relaxed">
            <span className="text-xs font-bold uppercase tracking-widest text-accent block">
              Our Philosophy
            </span>
            <h2 className="font-serif text-2xl sm:text-4xl font-bold text-text-main">
              A Sanctuary Against Mass Industrialization
            </h2>
            <p>
              In an era dominated by synthetic commodification, Zareen unites discerning collectors with generational goldsmiths in Florence, master horologists in Geneva, bespoke tailors in Paris, and urushi lacquer masters in Kyoto.
            </p>
            <p>
              By offering independent artisans direct access to global patrons under a decentralized studio model, we protect endangered craft techniques while establishing fair economic provenance.
            </p>
            <div className="pt-2 flex flex-wrap gap-4">
              <Link to="/products">
                <Button variant="primary" size="md" rightIcon={ArrowRight}>
                  Explore Curated Collections
                </Button>
              </Link>
              <Link to="/sellers">
                <Button variant="outline" size="md">
                  Meet The Ateliers
                </Button>
              </Link>
            </div>
          </div>

          <div className="relative rounded-3xl overflow-hidden border border-border shadow-elevated h-80 sm:h-96 group">
            <img
              src="https://images.unsplash.com/photo-1441986300917-64674bd600d8?w=800&auto=format&fit=crop&q=80"
              alt="Artisan Studio Paris"
              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
            <div className="absolute bottom-4 left-6 text-white text-xs font-medium">
              Atelier Haute Couture · Place Vendôme, Paris
            </div>
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
                className="bg-surface rounded-2xl border border-border p-6 space-y-3 shadow-subtle hover:border-border-strong hover:shadow-card transition-all"
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

      {/* Heritage Guild Timeline */}
      <section className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center space-y-2 mb-12">
          <span className="text-xs font-bold uppercase tracking-widest text-accent">
            Historical Evolution
          </span>
          <h2 className="font-serif text-2xl sm:text-3xl font-bold text-text-main">
            The Guild Journey
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          {milestones.map((m, idx) => (
            <div key={idx} className="bg-surface p-6 rounded-2xl border border-border space-y-2 shadow-subtle relative">
              <span className="text-2xl font-serif font-bold text-accent">{m.year}</span>
              <h4 className="font-serif font-bold text-sm text-text-main">{m.title}</h4>
              <p className="text-xs text-text-muted leading-relaxed">{m.description}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Call to Action Banner */}
      <section className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="p-8 sm:p-12 rounded-3xl bg-slate-950 text-white text-center space-y-6 shadow-2xl border border-white/15">
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
                className="text-white border-white/30 hover:bg-white/10"
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
