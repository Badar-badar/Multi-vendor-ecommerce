import { useState, useEffect, useMemo } from 'react';
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
import { useSelector, useDispatch } from 'react-redux';
import { storeApi } from '../../api';
import { selectAllProducts } from '../../features/products/productSelectors';
import { fetchProducts } from '../../features/products/productThunk';
import ProductCard from '../../components/product/ProductCard';
import Button from '../../components/common/Button';
import Badge from '../../components/common/Badge';
import Input from '../../components/common/Input';
import { formatCurrency } from '../../utils/formatCurrency';

export const StoreDetailPage = () => {
  const { slug } = useParams();
  const dispatch = useDispatch();
  const allProducts = useSelector(selectAllProducts);
  const [store, setStore] = useState(null);
  const [loading, setLoading] = useState(true);

  const [inStoreSearch, setInStoreSearch] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [sortBy, setSortBy] = useState('newest');

  useEffect(() => {
    if (!allProducts || allProducts.length === 0) {
      dispatch(fetchProducts());
    }
  }, [dispatch, allProducts]);

  useEffect(() => {
    const fetchStore = async () => {
      try {
        setLoading(true);
        const res = await storeApi.getStoreBySlug(slug);
        setStore(res?.store || res?.data?.store || res);
      } catch (err) {
        console.error('Failed to load store profile:', err);
      } finally {
        setLoading(false);
      }
    };
    if (slug) fetchStore();
  }, [slug]);

  const getSellerIdentifier = (p) => {
    if (!p) return '';
    const seller = p.seller;
    if (typeof seller === 'string') return seller.toLowerCase();
    if (seller && typeof seller === 'object') {
      return (seller.storeName || seller.name || seller.slug || seller._id || '').toLowerCase();
    }
    const brand = p.brand;
    if (typeof brand === 'string') return brand.toLowerCase();
    if (brand && typeof brand === 'object') {
      return (brand.name || brand.slug || brand._id || '').toLowerCase();
    }
    return '';
  };

  // Filter products by this seller
  const storeProducts = useMemo(() => {
    if (!store) return [];
    const storeTarget = (store.storeName || store.name || store.slug || slug || '').toLowerCase();
    const storeId = store._id ? String(store._id) : '';

    return allProducts.filter((p) => {
      const sellerId = p.seller && typeof p.seller === 'object' ? String(p.seller._id || '') : (typeof p.seller === 'string' ? p.seller : '');
      const sellerName = getSellerIdentifier(p);
      const isThisStore =
        (storeId && sellerId === storeId) ||
        (storeTarget && sellerName.includes(storeTarget)) ||
        (storeTarget && storeTarget.includes(sellerName && sellerName.length > 2 ? sellerName : '____none____'));

      const matchesSearch =
        !inStoreSearch ||
        p.name?.toLowerCase().includes(inStoreSearch.toLowerCase()) ||
        p.description?.toLowerCase().includes(inStoreSearch.toLowerCase());

      const matchesCat =
        selectedCategory === 'all' ||
        p.category?.slug === selectedCategory ||
        p.category?.name === selectedCategory ||
        p.category === selectedCategory;

      return (isThisStore || !storeTarget) && matchesSearch && matchesCat;
    }).sort((a, b) => {
      if (sortBy === 'price_asc') return a.price - b.price;
      if (sortBy === 'price_desc') return b.price - a.price;
      if (sortBy === 'rating') return (b.rating || 0) - (a.rating || 0);
      return 0;
    });
  }, [allProducts, store, slug, inStoreSearch, selectedCategory, sortBy]);

  const storeCategories = useMemo(() => {
    return Array.from(
      new Set(
        storeProducts
          .map((p) => (typeof p.category === 'object' ? p.category?.name : p.category))
          .filter(Boolean)
      )
    );
  }, [storeProducts]);

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center py-20">
        <div className="w-8 h-8 border-2 border-accent border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  if (!store) {
    return (
      <div className="min-h-screen bg-background flex flex-col items-center justify-center py-20 text-center px-4 space-y-4">
        <Store className="w-12 h-12 text-text-muted" />
        <h2 className="font-serif text-2xl font-bold text-text-main">Maison Not Found</h2>
        <p className="text-xs text-text-muted">The requested boutique or artisan studio could not be found.</p>
        <Link to="/stores">
          <Button variant="primary" size="sm">Browse All Stores</Button>
        </Link>
      </div>
    );
  }

  const storeName = store.storeName || store.name || 'Artisan Atelier';
  const storeLogo = store.logo || store.logoUrl || 'https://images.unsplash.com/photo-1534447677768-be436bb09401?w=120&auto=format&fit=crop&q=80';
  const storeBanner = store.banner || store.bannerUrl || 'https://images.unsplash.com/photo-1441986300917-64674bd600d8?w=1200&auto=format&fit=crop&q=80';
  const storeCountry = store.country || store.businessAddress?.country || 'Europe';
  const storeCity = store.city || store.businessAddress?.city || '';

  return (
    <div className="min-h-screen bg-background text-text-main pb-20">
      {/* Store Banner & Brand Header */}
      <section className="relative bg-slate-950 text-white overflow-hidden border-b border-border/80">
        {/* Banner Image with Crystal Clarity */}
        <div className="h-56 sm:h-72 lg:h-96 w-full relative overflow-hidden">
          <img
            src={storeBanner}
            alt={storeName}
            className="w-full h-full object-cover object-center transform scale-100 transition-transform duration-700 hover:scale-105"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-slate-950/95 via-slate-950/40 to-slate-950/20" />
          <div className="absolute inset-0 bg-[radial-gradient(#ffffff_1px,transparent_1px)] [background-size:24px_24px] opacity-10" />
        </div>

        {/* Store Profile Dossier Bar */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 -mt-16 sm:-mt-20 pb-8">
          <div className="bg-surface text-text-main p-6 sm:p-8 rounded-3xl border border-border shadow-modal space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-6">
              <div className="flex items-start sm:items-center gap-4 sm:gap-6">
                <img
                  src={storeLogo}
                  alt={storeName}
                  className="w-20 h-20 sm:w-24 sm:h-24 rounded-2xl object-cover border-2 border-border shadow-md shrink-0 bg-white"
                />
                <div className="space-y-1">
                  <div className="flex flex-wrap items-center gap-2">
                    <h1 className="font-serif font-bold text-2xl sm:text-3xl text-text-main">
                      {storeName}
                    </h1>
                    <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-emerald-50 text-emerald-700 text-xs font-bold border border-emerald-200">
                      <ShieldCheck className="w-3.5 h-3.5" /> Accredited Maison
                    </span>
                  </div>

                  <p className="text-xs text-text-muted flex items-center gap-2">
                    <MapPin className="w-3.5 h-3.5 text-accent" />
                    <span>{storeCity ? `${storeCity}, ${storeCountry}` : storeCountry}</span>
                    <span>·</span>
                    <span className="font-semibold text-text-main">{store.category || 'Atelier'}</span>
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
