import { useState, useMemo } from 'react';
import { Link } from 'react-router-dom';
import {
  Store,
  Search,
  Star,
  ShieldCheck,
  MapPin,
  ArrowRight,
  Sparkles,
  Package,
} from 'lucide-react';
import { useSelector } from 'react-redux';
import { mockAdminSellers } from '../../data/adminMockData';
import { selectAllProducts } from '../../features/products/productSelectors';
import Button from '../../components/common/Button';
import Badge from '../../components/common/Badge';
import Input from '../../components/common/Input';
import { formatCurrency } from '../../utils/formatCurrency';

export const StoresPage = () => {
  const allProducts = useSelector(selectAllProducts);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');

  const approvedSellers = mockAdminSellers.filter(
    (s) => s.status === 'Approved' || s.status === 'Active'
  );

  const filteredStores = useMemo(() => {
    return approvedSellers.filter((s) => {
      const matchesSearch =
        s.storeName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        s.ownerName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        s.country?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        s.category?.toLowerCase().includes(searchTerm.toLowerCase());

      const matchesCat =
        selectedCategory === 'all' || s.category === selectedCategory;

      return matchesSearch && matchesCat;
    });
  }, [approvedSellers, searchTerm, selectedCategory]);

  return (
    <div className="min-h-screen bg-background text-text-main pb-20">
      {/* Hero Banner */}
      <section className="bg-primary text-white py-14 lg:py-20 border-b border-border relative overflow-hidden">
        <div className="absolute inset-0 opacity-10 bg-[radial-gradient(#ffffff_1px,transparent_1px)] [background-size:20px_20px]" />
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 text-center space-y-4">
          <div className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full bg-white/10 text-accent-light text-xs font-semibold backdrop-blur-xs">
            <Store className="w-3.5 h-3.5 text-accent" />
            <span>Accredited Artisan Ateliers</span>
          </div>
          <h1 className="font-serif text-3xl sm:text-4xl lg:text-5xl font-bold tracking-tight">
            Discover Independent Maisons
          </h1>
          <p className="text-xs sm:text-sm text-slate-300 max-w-2xl mx-auto leading-relaxed">
            Browse our vetted collective of European master goldsmiths, Swiss horologists, French leather ateliers, and bespoke artisans.
          </p>
        </div>
      </section>

      {/* Toolbar */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 -mt-6 relative z-20">
        <div className="bg-surface p-4 rounded-2xl border border-border shadow-subtle flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div className="flex-1 max-w-md">
            <Input
              placeholder="Search stores by name, city, craft..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              leftIcon={Search}
              size="sm"
            />
          </div>

          <div className="flex items-center gap-2 text-xs">
            <span className="text-text-muted font-medium">Department:</span>
            <select
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              className="px-3 py-1.5 bg-surface-muted border border-border rounded-xl font-semibold text-text-main cursor-pointer"
            >
              <option value="all">All Disciplines</option>
              <option value="Haute Couture & Tailoring">Haute Couture</option>
              <option value="Jewelry & Watches">Fine Jewelry</option>
              <option value="Haute Horlogerie">Haute Horlogerie</option>
              <option value="Leather Goods">Leather Goods</option>
            </select>
          </div>
        </div>
      </section>

      {/* Stores Directory Grid */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-10">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredStores.map((store) => {
            const storeProducts = allProducts
              .filter((p) => p.seller === store.storeName || p.brand?.name === store.storeName)
              .slice(0, 3);
            const slug = store.storeName.toLowerCase().replace(/[^a-z0-9]+/g, '-');

            return (
              <div
                key={store.id}
                className="bg-surface rounded-3xl border border-border shadow-subtle overflow-hidden flex flex-col justify-between hover:border-accent/40 hover:shadow-card transition-all group"
              >
                <div>
                  {/* Banner */}
                  <div className="relative h-32 bg-slate-900 overflow-hidden">
                    <img
                      src={store.banner}
                      alt={store.storeName}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500 opacity-75"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-slate-950/70 via-transparent to-transparent" />
                    <div className="absolute top-3 right-3">
                      <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-black/60 text-accent-light text-[10px] font-bold backdrop-blur-xs border border-white/10">
                        <ShieldCheck className="w-3 h-3 text-accent" /> Verified Maison
                      </span>
                    </div>
                  </div>

                  {/* Store Header Info */}
                  <div className="p-5 pt-0 relative space-y-3">
                    <div className="-mt-7 flex items-end justify-between">
                      <img
                        src={store.logo}
                        alt={store.storeName}
                        className="w-14 h-14 rounded-2xl object-cover border-2 border-surface shadow-md bg-surface shrink-0"
                      />
                      {store.rating > 0 && (
                        <div className="flex items-center gap-1 text-xs font-bold text-text-main bg-surface-muted px-2.5 py-1 rounded-xl border border-border">
                          <Star className="w-3.5 h-3.5 text-amber-500 fill-amber-500" />
                          <span>{store.rating}</span>
                        </div>
                      )}
                    </div>

                    <div>
                      <h3 className="font-serif font-bold text-lg text-text-main group-hover:text-accent transition-colors">
                        {store.storeName}
                      </h3>
                      <p className="text-xs text-text-muted flex items-center gap-1.5 mt-0.5">
                        <MapPin className="w-3 h-3 text-accent" />
                        <span>{store.city ? `${store.city}, ${store.country}` : store.country}</span>
                        <span>·</span>
                        <span className="font-semibold text-text-main">{store.category}</span>
                      </p>
                    </div>

                    {/* Featured Product Thumbnails */}
                    {storeProducts.length > 0 && (
                      <div className="pt-2 border-t border-border space-y-1.5">
                        <span className="text-[10px] font-bold uppercase tracking-wider text-text-muted block">
                          Featured Creations
                        </span>
                        <div className="grid grid-cols-3 gap-2">
                          {storeProducts.map((prod) => (
                            <div key={prod.id} className="relative aspect-square rounded-xl overflow-hidden border border-border">
                              <img
                                src={prod.images?.[0] || prod.image}
                                alt={prod.name}
                                className="w-full h-full object-cover"
                              />
                            </div>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                </div>

                <div className="p-5 pt-0">
                  <Link
                    to={`/stores/${slug}`}
                    className="w-full flex items-center justify-center gap-2 py-2.5 rounded-xl bg-surface-muted hover:bg-primary hover:text-white border border-border text-xs font-bold text-text-main transition-all group-hover:bg-primary group-hover:text-white"
                  >
                    <span>Visit Storefront</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </Link>
                </div>
              </div>
            );
          })}
        </div>
      </section>
    </div>
  );
};

export default StoresPage;
