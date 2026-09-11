import { useState, useMemo } from 'react';
import { useParams, Link } from 'react-router-dom';
import {
  Store,
  MapPin,
  Star,
  ShieldCheck,
  Search,
  SlidersHorizontal,
  Package,
  ArrowLeft,
  ChevronRight,
  Mail,
  Award,
  Sparkles,
} from 'lucide-react';
import { useSelector } from 'react-redux';
import { mockAdminSellers } from '../../data/adminMockData';
import { selectAllProducts } from '../../features/products/productSelectors';
import ProductCard from '../../components/product/ProductCard';
import Button from '../../components/common/Button';
import Badge from '../../components/common/Badge';
import Input from '../../components/common/Input';
import { formatCurrency } from '../../utils/formatCurrency';

export const StoreDetailPage = () => {
  const { slug } = useParams();
  const allProducts = useSelector(selectAllProducts);

  // Match store by slug or name
  const store =
    mockAdminSellers.find(
      (s) =>
        s.storeName.toLowerCase().replace(/[^a-z0-9]+/g, '-') === slug ||
        s.id.toLowerCase() === slug?.toLowerCase()
    ) || mockAdminSellers[0];

  const [inStoreSearch, setInStoreSearch] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [sortBy, setSortBy] = useState('newest');

  // Filter products by this seller
  const storeProducts = useMemo(() => {
    return allProducts.filter((p) => {
      const isThisStore =
        p.seller?.toLowerCase() === store.storeName.toLowerCase() ||
        p.brand?.name?.toLowerCase() === store.storeName.toLowerCase();

      const matchesSearch =
        !inStoreSearch ||
        p.name.toLowerCase().includes(inStoreSearch.toLowerCase()) ||
        p.description?.toLowerCase().includes(inStoreSearch.toLowerCase());

      const matchesCat =
        selectedCategory === 'all' ||
        p.category?.slug === selectedCategory ||
        p.category?.name === selectedCategory;

      return isThisStore && matchesSearch && matchesCat;
    }).sort((a, b) => {
      if (sortBy === 'price_asc') return a.price - b.price;
      if (sortBy === 'price_desc') return b.price - a.price;
      if (sortBy === 'rating') return (b.rating || 0) - (a.rating || 0);
      return 0;
    });
  }, [allProducts, store, inStoreSearch, selectedCategory, sortBy]);

  const storeCategories = Array.from(
    new Set(
      allProducts
        .filter(
          (p) =>
            p.seller?.toLowerCase() === store.storeName.toLowerCase() ||
            p.brand?.name?.toLowerCase() === store.storeName.toLowerCase()
        )
        .map((p) => p.category?.name)
        .filter(Boolean)
    )
  );

  return (
    <div className="min-h-screen bg-background text-text-main pb-20">
      {/* Store Banner & Brand Header */}
      <section className="relative bg-slate-900 text-white overflow-hidden border-b border-border">
        {/* Banner Image */}
        <div className="h-48 sm:h-64 lg:h-80 w-full relative overflow-hidden">
          <img
            src={store.banner || 'https://images.unsplash.com/photo-1441986300917-64674bd600d8?w=1200&auto=format&fit=crop&q=80'}
            alt={store.storeName}
            className="w-full h-full object-cover opacity-60"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/40 to-transparent" />
        </div>

        {/* Store Profile Dossier Bar */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 -mt-16 sm:-mt-20 pb-8">
          <div className="bg-surface text-text-main p-6 sm:p-8 rounded-3xl border border-border shadow-modal space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-6">
              <div className="flex items-start sm:items-center gap-4 sm:gap-6">
                <img
                  src={store.logo}
                  alt={store.storeName}
                  className="w-20 h-20 sm:w-24 sm:h-24 rounded-2xl object-cover border-2 border-border shadow-md shrink-0 bg-white"
                />
                <div className="space-y-1">
                  <div className="flex flex-wrap items-center gap-2">
                    <h1 className="font-serif font-bold text-2xl sm:text-3xl text-text-main">
                      {store.storeName}
                    </h1>
                    <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-emerald-50 text-emerald-700 text-xs font-bold border border-emerald-200">
                      <ShieldCheck className="w-3.5 h-3.5" /> Accredited Maison
                    </span>
                  </div>

                  <p className="text-xs text-text-muted flex items-center gap-2">
                    <MapPin className="w-3.5 h-3.5 text-accent" />
                    <span>{store.city ? `${store.city}, ${store.country}` : store.country}</span>
                    <span>·</span>
                    <span className="font-semibold text-text-main">{store.category}</span>
                  </p>

                  <div className="flex items-center gap-3 pt-1 text-xs text-text-muted">
                    {store.rating > 0 && (
                      <span className="flex items-center gap-1 font-bold text-text-main">
                        <Star className="w-3.5 h-3.5 text-amber-500 fill-amber-500" />
                        {store.rating} Rating
                      </span>
                    )}
                    <span>·</span>
                    <span>{storeProducts.length} Available Creations</span>
                  </div>
                </div>
              </div>

              {/* Atelier Accreditations */}
              <div className="flex sm:flex-col items-center sm:items-end justify-between gap-2 border-t sm:border-t-0 pt-4 sm:pt-0 border-border">
                <Badge variant="accent" size="sm">
                  {store.tier || 'Maison Premier'}
                </Badge>
                <span className="text-[11px] text-text-subtle">
                  Accredited since {store.appliedDate?.slice(0, 4) || '2025'}
                </span>
              </div>
            </div>

            {/* About Statement */}
            <div className="pt-4 border-t border-border text-xs text-text-muted leading-relaxed">
              <p>
                {store.about ||
                  `${store.storeName} is a master artisan atelier located in ${store.city || store.country}, adhering strictly to the Zareen Luxury Provenance charter. Each piece is crafted in limited small batches using certified ethical materials and heritage techniques.`}
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Store Catalog Search & Filter Toolbar */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-6 space-y-6">
        <div className="bg-surface p-4 rounded-2xl border border-border shadow-subtle flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div className="flex-1 max-w-sm">
            <Input
              placeholder={`Search within ${store.storeName}...`}
              value={inStoreSearch}
              onChange={(e) => setInStoreSearch(e.target.value)}
              leftIcon={Search}
              size="sm"
            />
          </div>

          <div className="flex flex-wrap items-center gap-2 text-xs">
            {storeCategories.length > 0 && (
              <select
                value={selectedCategory}
                onChange={(e) => setSelectedCategory(e.target.value)}
                className="px-3 py-1.5 bg-surface-muted border border-border rounded-xl font-semibold text-text-main cursor-pointer"
              >
                <option value="all">All Departments</option>
                {storeCategories.map((c) => (
                  <option key={c} value={c}>
                    {c}
                  </option>
                ))}
              </select>
            )}

            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="px-3 py-1.5 bg-surface-muted border border-border rounded-xl font-semibold text-text-main cursor-pointer"
            >
              <option value="newest">Newest First</option>
              <option value="price_asc">Price: Low to High</option>
              <option value="price_desc">Price: High to Low</option>
              <option value="rating">Top Rated</option>
            </select>
          </div>
        </div>

        {/* Product Grid */}
        {storeProducts.length === 0 ? (
          <div className="bg-surface p-12 rounded-3xl border border-border text-center space-y-4 shadow-subtle">
            <div className="w-16 h-16 rounded-2xl bg-surface-muted flex items-center justify-center mx-auto text-text-muted">
              <Package className="w-8 h-8" />
            </div>
            <h3 className="font-serif font-bold text-xl text-text-main">
              No Creations Found in this Atelier
            </h3>
            <p className="text-xs text-text-muted max-w-md mx-auto">
              No creations matched your search in {store.storeName}. Reset filters to see all available pieces.
            </p>
            <Button
              variant="outline"
              size="sm"
              onClick={() => {
                setInStoreSearch('');
                setSelectedCategory('all');
              }}
            >
              Clear Search
            </Button>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {storeProducts.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        )}
      </section>
    </div>
  );
};

export default StoreDetailPage;
