import {
  Sparkles,
  Newspaper,
  ExternalLink,
  Download,
  Mail,
  Award,
  BookOpen,
} from 'lucide-react';
import Button from '../../components/common/Button';

export const PressPage = () => {
  const pressArticles = [
    {
      outlet: 'Financial Times • How To Spend It',
      date: 'Autumn 2026',
      title: 'The Digital Guild Protecting Generational European Maisons',
      quote: 'Zareen is doing for master watchmakers and Florentine jewelers what haute couture salons once did in pre-industrial Paris.',
      image: 'https://images.unsplash.com/photo-1522335789203-aabd1fc54bc9?q=80&w=600&auto=format&fit=crop',
      readTime: '6 min read',
    },
    {
      outlet: 'Robb Report Luxury Review',
      date: 'Summer 2026',
      title: 'Why Discerning Collectors Are Bypassing Conglomerate Brands',
      quote: 'Direct atelier patronage with escrow protection proves to be the new benchmark of authentic high luxury.',
      image: 'https://images.unsplash.com/photo-1513094735237-8f2714d57c13?q=80&w=600&auto=format&fit=crop',
      readTime: '4 min read',
    },
    {
      outlet: 'Vogue International Atelier Edition',
      date: 'Spring 2026',
      title: 'The Rebirth of Bespoke: Hand-Stitched Leather & Fairmined Diamonds',
      quote: 'An antidote to mass consumerism, Zareen curates items that carry the irreplaceable fingerprint of the maker.',
      image: 'https://images.unsplash.com/photo-1490481651871-ab68de25d43d?q=80&w=600&auto=format&fit=crop',
      readTime: '5 min read',
    },
    {
      outlet: 'Monocle Design Monograph',
      date: 'Winter 2026',
      title: 'Kyoto Lacquerware to Vallée de Joux: The Decentralized Luxury Guild',
      quote: 'The marketplace where independent craftspeople hold sovereignty over their art, trade, and economic destiny.',
      image: 'https://images.unsplash.com/photo-1509631179647-0177331693ae?q=80&w=600&auto=format&fit=crop',
      readTime: '8 min read',
    },
  ];

  const highlights = [
    { label: 'Accredited Ateliers', value: '200+' },
    { label: 'Global Press Features', value: '65+' },
    { label: 'Curated Heritage Regions', value: '18' },
    { label: 'Collector Satisfaction', value: '99.8%' },
  ];

  return (
    <div className="min-h-screen bg-background text-text-main pb-24 space-y-16">
      {/* Hero Header */}
      <section className="relative bg-slate-950 text-white py-20 sm:py-28 border-b border-border/80 overflow-hidden">
        <div className="absolute inset-0 z-0">
          <img
            src="https://images.unsplash.com/photo-1504711434969-e33886168f5c?q=80&w=2000&auto=format&fit=crop"
            alt="International Press Room"
            className="w-full h-full object-cover object-center"
          />
          <div className="absolute inset-0 bg-gradient-to-b from-slate-950/90 via-slate-950/80 to-slate-950" />
          <div className="absolute inset-0 bg-[radial-gradient(#ffffff_1px,transparent_1px)] [background-size:24px_24px] opacity-10" />
        </div>

        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center space-y-4 relative z-10">
          <span className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white/10 border border-white/15 text-accent-light text-xs font-semibold uppercase tracking-widest backdrop-blur-md">
            <Sparkles className="w-3.5 h-3.5 text-accent" /> Press & Editorial Room
          </span>
          <h1 className="font-serif text-3xl sm:text-5xl lg:text-6xl font-bold text-white tracking-tight leading-tight">
            International Press & Media
          </h1>
          <p className="text-xs sm:text-base text-slate-300 max-w-xl mx-auto leading-relaxed font-light">
            Read how global cultural critics, horological authorities, and leading luxury publications chronicle Zareen’s sovereign artisan guild.
          </p>
        </div>
      </section>

      {/* Metrics Strip */}
      <section className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 -mt-10 relative z-20">
        <div className="bg-surface p-6 rounded-3xl border border-border shadow-modal grid grid-cols-2 md:grid-cols-4 gap-6 text-center">
          {highlights.map((h, i) => (
            <div key={i} className="space-y-1">
              <span className="font-serif text-2xl sm:text-3xl font-bold text-accent">{h.value}</span>
              <p className="text-xs text-text-muted">{h.label}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Press Coverage Articles */}
      <section className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        <div className="text-center space-y-2 max-w-xl mx-auto">
          <span className="text-xs font-bold uppercase tracking-widest text-accent">
            Published Features
          </span>
          <h2 className="font-serif text-2xl sm:text-3xl font-bold text-text-main">
            Selected Editorial Coverage
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {pressArticles.map((article, idx) => (
            <div
              key={idx}
              className="bg-surface rounded-3xl border border-border overflow-hidden shadow-subtle flex flex-col justify-between group hover:border-accent/40 transition-all"
            >
              <div className="relative h-48 sm:h-56 overflow-hidden">
                <img
                  src={article.image}
                  alt={article.title}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                />
                <div className="absolute top-3 right-3 bg-black/60 backdrop-blur-md text-white px-2.5 py-1 rounded-full text-[10px] font-semibold">
                  {article.readTime}
                </div>
              </div>

              <div className="p-6 sm:p-8 space-y-4 flex-1 flex flex-col justify-between">
                <div className="space-y-3">
                  <div className="flex items-center justify-between text-xs font-semibold text-accent">
                    <span>{article.outlet}</span>
                    <span className="text-text-muted font-normal">{article.date}</span>
                  </div>
                  <h3 className="font-serif font-bold text-lg sm:text-xl text-text-main group-hover:text-accent transition-colors">
                    "{article.title}"
                  </h3>
                  <p className="text-xs text-text-muted leading-relaxed italic">
                    "{article.quote}"
                  </p>
                </div>

                <div className="pt-4 border-t border-border flex items-center justify-between text-xs font-semibold text-accent">
                  <span className="flex items-center gap-1.5">
                    <BookOpen className="w-3.5 h-3.5" /> Read Publication Dossier
                  </span>
                  <ExternalLink className="w-3.5 h-3.5" />
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Press Kit Download Dossier */}
      <section className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-surface rounded-3xl border border-border p-8 sm:p-12 flex flex-col sm:flex-row items-center justify-between gap-8 shadow-subtle">
          <div className="space-y-2 text-center sm:text-left">
            <div className="inline-flex items-center gap-2 text-xs font-bold text-accent uppercase tracking-wider">
              <Award className="w-4 h-4" /> Official Media Assets
            </div>
            <h3 className="font-serif font-bold text-xl sm:text-2xl text-text-main">
              Official Zareen Media Kit (2026 Edition)
            </h3>
            <p className="text-xs text-text-muted max-w-xl leading-relaxed">
              Includes ultra-high-resolution photography of accredited master ateliers, official brand hallmarks, executive bios, and raw material provenance guides.
            </p>
          </div>

          <div className="flex items-center gap-3 shrink-0">
            <a href="mailto:press@zareen-luxury.com">
              <Button variant="outline" size="md" leftIcon={Mail}>
                Press Inquiry
              </Button>
            </a>
            <Button
              variant="primary"
              size="md"
              leftIcon={Download}
              onClick={() => alert('Media kit package download initiated.')}
            >
              Download Press Kit
            </Button>
          </div>
        </div>
      </section>
    </div>
  );
};

export default PressPage;
