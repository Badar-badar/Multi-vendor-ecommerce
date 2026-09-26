import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Sparkles, ArrowRight, Layers, Package, Star } from 'lucide-react';
import { useSelector } from 'react-redux';
import { categories as staticCategories } from '../../data/categories';
import { categoryApi } from '../../api';
import { selectAllProducts } from '../../features/products/productSelectors';
import Button from '../../components/common/Button';
import Badge from '../../components/common/Badge';
import { formatCurrency } from '../../utils/formatCurrency';

export const CategoriesPage = () => {
  const allProducts = useSelector(selectAllProducts);
  const [categoriesList, setCategoriesList] = useState(staticCategories);

  useEffect(() => {
    const fetchCats = async () => {
      try {
        const res = await categoryApi.getCategories();
        const cats = res?.categories || res?.data?.categories || (Array.isArray(res) ? res : []);
        if (cats && cats.length > 0) {
          setCategoriesList(cats);
        }
      } catch (err) {
        console.error('Failed to load categories:', err);
      }
    };
    fetchCats();
  }, []);

  return (
    <div className="min-h-screen bg-background text-text-main pb-20">
      {/* Category Hero / Banner with High-Resolution Backdrop */}
      <section className="relative bg-slate-950 text-white py-16 lg:py-24 border-b border-border/80 overflow-hidden">
        {/* High-Resolution Craftsmanship Background Image */}
        <div className="absolute inset-0 z-0">
          <img
            src="https://images.unsplash.com/photo-1441984904996-e0b6ba687e04?q=80&w=2000&auto=format&fit=crop"
            alt="Master Craft Disciplines"
            className="w-full h-full object-cover object-center"
          />
          <div className="absolute inset-0 bg-gradient-to-b from-slate-950/90 via-slate-950/80 to-slate-950" />
          <div className="absolute inset-0 bg-[radial-gradient(#ffffff_1px,transparent_1px)] [background-size:24px_24px] opacity-10" />
        </div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 text-center space-y-4">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white/10 text-accent-light text-xs font-semibold backdrop-blur-md border border-white/15">
            <Sparkles className="w-3.5 h-3.5 text-accent" />
            <span>Master Craft Disciplines & Ateliers</span>
          </div>
          <h1 className="font-serif text-3xl sm:text-5xl lg:text-6xl font-bold tracking-tight text-white leading-tight">
            Curated Departments & Specialties
          </h1>
          <p className="text-xs sm:text-base text-slate-300 max-w-2xl mx-auto leading-relaxed font-light">
            Explore sovereign artisan disciplines. From bespoke haute tailoring to museum-grade fine jewelry, master horology, and wheel-thrown ceramics.
          </p>

          <div className="pt-2 flex items-center justify-center gap-6 text-xs text-slate-400">
            <span className="flex items-center gap-1.5 font-medium text-slate-200">
              <Layers className="w-4 h-4 text-accent" /> {categoriesList.length} Sovereign Disciplines
            </span>
            <span>•</span>
            <span className="font-semibold text-accent">{allProducts.length} Artisanal Creations</span>
          </div>
        </div>
      </section>

      {/* Featured Department Quick Bar */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 -mt-6 relative z-20">
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3">
          {categoriesList.map((cat) => (
            <Link
              key={cat.id}
              to={`/categories/${cat.slug}`}
              className="bg-surface p-3.5 rounded-2xl border border-border shadow-subtle hover:border-accent/40 hover:shadow-card transition-all text-center space-y-1.5 group"
            >
              <img
                src={cat.image}
                alt={cat.name}
                className="w-12 h-12 rounded-xl object-cover mx-auto group-hover:scale-105 transition-transform"
              />
              <p className="text-xs font-bold text-text-main truncate group-hover:text-accent transition-colors">
                {cat.name}
              </p>
              <span className="text-[10px] text-text-muted block">
                {cat.itemCount || 24} Items
              </span>
            </Link>
          ))}
        </div>
      </section>

      {/* Main Categories & Subcategories Grid */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-12 space-y-12">
        {categoriesList.map((cat, idx) => {
          const catId = cat._id || cat.id;
          const categoryProducts = allProducts
            .filter((p) => p.category?.slug === cat.slug || p.category?.name === cat.name || p.category?._id === catId)
            .slice(0, 3);

          return (
            <div
              key={catId}
              className={`grid grid-cols-1 lg:grid-cols-12 gap-8 items-center bg-surface rounded-3xl border border-border p-6 sm:p-8 shadow-subtle ${
                idx % 2 === 1 ? 'lg:flex-row-reverse' : ''
              }`}
            >
              {/* Image Column */}
              <div className="lg:col-span-5 relative aspect-[4/3] rounded-2xl overflow-hidden border border-border group">
                <img
                  src={cat.image}
                  alt={cat.name}
                  className="w-full h-full object-cover object-center group-hover:scale-105 transition-transform duration-700 ease-out"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-primary/80 via-transparent to-transparent" />
                <div className="absolute bottom-4 left-4 text-white">
                  <span className="text-[10px] uppercase tracking-wider font-bold text-accent-light px-2.5 py-1 rounded-full bg-black/50 backdrop-blur-xs">
                    {cat.itemCount || 24} Masterpieces Available
                  </span>
                </div>
              </div>

              {/* Info & Subcategories Column */}
              <div className="lg:col-span-7 space-y-5">
                <div>
                  <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-accent mb-1">
                    <Layers className="w-3.5 h-3.5" />
                    <span>Artisanal Discipline</span>
                  </div>
                  <h2 className="font-serif text-2xl sm:text-3xl font-bold text-text-main">
                    {cat.name}
                  </h2>
                  <p className="text-xs sm:text-sm text-text-muted mt-2 leading-relaxed">
                    {cat.description}
                  </p>
                </div>

                {/* Subcategories Tags */}
                {cat.subcategories?.length > 0 && (
                  <div className="space-y-2 pt-1">
                    <span className="text-xs font-semibold text-text-main block">
                      Specializations & Crafts:
                    </span>
                    <div className="flex flex-wrap gap-2">
                      {cat.subcategories.map((sub) => (
                        <Link
                          key={sub.id}
                          to={`/categories/${cat.slug}?subcategory=${sub.slug}`}
                          className="px-3 py-1.5 rounded-xl bg-surface-muted hover:bg-surface-hover border border-border text-xs font-medium text-text-main transition-colors"
                        >
                          {sub.name}
                        </Link>
                      ))}
                    </div>
                  </div>
                )}

                {/* Popular Creations Preview */}
                {categoryProducts.length > 0 && (
                  <div className="pt-2 border-t border-border space-y-2">
                    <span className="text-[11px] font-bold uppercase tracking-wider text-text-muted block">
                      Popular Acquisitions:
                    </span>
                    <div className="grid grid-cols-3 gap-2">
                      {categoryProducts.map((prod) => (
                        <Link
                          key={prod.id}
                          to={`/products/${prod.id}`}
                          className="flex items-center gap-2 p-1.5 rounded-xl hover:bg-surface-muted transition-colors group"
                        >
                          <img
                            src={prod.images?.[0] || prod.image}
                            alt={prod.name}
                            className="w-9 h-9 rounded-lg object-cover border border-border shrink-0"
                          />
                          <div className="min-w-0">
                            <p className="text-[11px] font-bold text-text-main truncate group-hover:text-accent transition-colors">
                              {prod.name}
                            </p>
                            <span className="text-[10px] font-serif font-semibold text-text-muted block">
                              {formatCurrency(prod.price)}
                            </span>
                          </div>
                        </Link>
                      ))}
                    </div>
                  </div>
                )}

                {/* Action */}
                <div className="pt-2 flex items-center gap-3">
                  <Link
                    to={`/categories/${cat.slug}`}
                    className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-primary text-white text-xs font-semibold hover:bg-primary-hover shadow-subtle transition-all cursor-pointer"
                  >
                    <span>Browse {cat.name} Collection</span>
                    <ArrowRight className="w-4 h-4" />
                  </Link>
                </div>
              </div>
            </div>
          );
        })}
      </section>
    </div>
  );
};

export default CategoriesPage;
