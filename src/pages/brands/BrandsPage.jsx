import { Link } from 'react-router-dom';
import { Sparkles, Store, ArrowRight, ShieldCheck, MapPin } from 'lucide-react';
import { brands } from '../../data/brands';

export const BrandsPage = () => {
  return (
    <div className="min-h-screen bg-background text-text-main pb-20">
      {/* Header Banner */}
      <section className="bg-primary text-white py-14 lg:py-20 border-b border-border relative overflow-hidden">
        <div className="absolute inset-0 opacity-10 bg-[radial-gradient(#ffffff_1px,transparent_1px)] [background-size:20px_20px]" />
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 text-center space-y-4">
          <div className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full bg-white/10 text-accent-light text-xs font-semibold backdrop-blur-xs">
            <Sparkles className="w-3.5 h-3.5 text-accent" />
            <span>Verified Independent Ateliers</span>
          </div>
          <h1 className="font-serif text-3xl sm:text-4xl lg:text-5xl font-bold tracking-tight">
            The Sovereign Master Directory
          </h1>
          <p className="text-xs sm:text-sm text-slate-300 max-w-2xl mx-auto leading-relaxed">
            Meet the sovereign craftsmen, generational jewelers, and bespoke ateliers sustaining world-class trades without industrial compromise.
          </p>
        </div>
      </section>

      {/* Brands Directory Grid */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
          {brands.map((brand) => (
            <div
              key={brand.id}
              className="bg-surface rounded-2xl border border-border p-6 shadow-subtle hover:shadow-card hover:border-border-dark transition-all duration-300 flex flex-col justify-between group"
            >
              <div className="space-y-4">
                <div className="flex items-start justify-between gap-4">
                  <div className="w-16 h-16 rounded-xl overflow-hidden border border-border bg-surface-muted shrink-0">
                    <img
                      src={brand.logo}
                      alt={brand.name}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform"
                    />
                  </div>
                  <span className="flex items-center gap-1 text-[10px] font-bold uppercase tracking-wider text-success bg-success-light px-2.5 py-1 rounded-full border border-emerald-200">
                    <ShieldCheck className="w-3 h-3" /> Certified Atelier
                  </span>
                </div>

                <div>
                  <h3 className="font-serif text-xl font-bold text-text-main group-hover:text-accent transition-colors">
                    {brand.name}
                  </h3>
                  <p className="flex items-center gap-1 text-xs font-semibold text-text-muted mt-1">
                    <MapPin className="w-3.5 h-3.5 text-accent" />
                    <span>{brand.origin}</span>
                  </p>
                </div>

                <p className="text-xs text-text-muted leading-relaxed">
                  {brand.description}
                </p>
              </div>

              <div className="pt-6 mt-6 border-t border-border/70 flex items-center justify-between">
                <Link
                  to={`/products?brand=${brand.slug}`}
                  className="w-full inline-flex items-center justify-center gap-2 py-2.5 px-4 rounded-lg bg-surface-muted hover:bg-primary hover:text-white text-xs font-semibold text-text-main transition-colors"
                >
                  <span>Explore Atelier Collection</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </Link>
              </div>
            </div>
          ))}
        </div>

        {/* Artisan Invitation CTA Banner */}
        <div className="mt-16 bg-surface rounded-2xl border border-border p-8 sm:p-12 text-center max-w-3xl mx-auto shadow-subtle space-y-4">
          <div className="inline-flex p-3 rounded-2xl bg-accent-light text-accent">
            <Store className="w-6 h-6" />
          </div>
          <h3 className="font-serif text-2xl font-bold text-text-main">
            Are You a Sovereign Master Artisan?
          </h3>
          <p className="text-xs sm:text-sm text-text-muted max-w-lg mx-auto leading-relaxed">
            Zareen provides verified master ateliers with direct global clientele, concierge logistics, insured white-glove transport, and sovereign pricing autonomy.
          </p>
          <div className="pt-2">
            <Link
              to="/seller/register"
              className="inline-flex items-center gap-2 px-6 py-3 rounded-lg bg-primary text-white text-xs font-semibold hover:bg-primary-hover shadow-subtle transition-all"
            >
              <span>Apply for Curation Review</span>
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
};

export default BrandsPage;
