import { useState, useEffect, useMemo } from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import { X, Sparkles, Store, Search, ArrowRight, Tag, Flame, RefreshCw } from 'lucide-react';
import { useSelector, useDispatch } from 'react-redux';
import {
  selectPaginatedProducts,
  selectProductFilters,
  selectRecentSearches,
  selectPopularSearches,
  selectFeaturedProducts,
} from '../../features/products/productSelectors';
import {
  setFilter,
  setPage,
  resetFilters,
  addRecentSearch,
} from '../../features/products/productSlice';
import { fetchProducts } from '../../features/products/productThunk';
import { categories } from '../../data/categories';
import { brands } from '../../data/brands';
import ProductCard from '../../components/product/ProductCard';
import ProductFilterSidebar from '../../components/marketplace/ProductFilterSidebar';
import ActiveFilterChips from '../../components/marketplace/ActiveFilterChips';
import ProductSortBar from '../../components/marketplace/ProductSortBar';
import Pagination from '../../components/marketplace/Pagination';
import EmptyState from '../../components/common/EmptyState';
import Button from '../../components/common/Button';

export const ProductsPage = () => {
  const dispatch = useDispatch();
  const [searchParams, setSearchParams] = useSearchParams();

  const [mobileFilterOpen, setMobileFilterOpen] = useState(false);
  const [searchInput, setSearchInput] = useState(searchParams.get('q') || '');

  const paginatedData = useSelector(selectPaginatedProducts);
  const filters = useSelector(selectProductFilters);
  const recentSearches = useSelector(selectRecentSearches);
  const popularSearches = useSelector(selectPopularSearches);
  const featuredProducts = useSelector(selectFeaturedProducts);

  const { items, total, totalPages, currentPage, startIndex, endIndex } = paginatedData;

  // 1. Synchronize URL query parameters -> Redux state on initial load or browser back/forward
  useEffect(() => {
    const category = searchParams.get('category') || 'all';
    const subcategory = searchParams.get('subcategory') || 'all';
    const brand = searchParams.get('brand') || 'all';
    const seller = searchParams.get('seller') || 'all';
    const q = searchParams.get('q') || '';
    const sort = searchParams.get('sort') || 'featured';
    const minPrice = searchParams.get('minPrice') ? Number(searchParams.get('minPrice')) : 0;
    const maxPrice = searchParams.get('maxPrice') ? Number(searchParams.get('maxPrice')) : 5000;
    const rating = searchParams.get('rating') ? Number(searchParams.get('rating')) : 0;
    const inStock = searchParams.get('inStock') === 'true';
    const discount = searchParams.get('discount') === 'true';
    const page = searchParams.get('page') ? Number(searchParams.get('page')) : 1;

    const updates = {};
    if (category !== filters.category) updates.category = category;
    if (subcategory !== filters.subcategory) updates.subcategory = subcategory;
    if (brand !== filters.brand) updates.brand = brand;
    if (seller !== filters.seller) updates.seller = seller;
    if (q !== filters.searchQuery) updates.searchQuery = q;
    if (sort !== filters.sortBy) updates.sortBy = sort;
    if (minPrice !== filters.minPrice) updates.minPrice = minPrice;
    if (maxPrice !== filters.maxPrice) updates.maxPrice = maxPrice;
    if (rating !== filters.rating) updates.rating = rating;
    if (inStock !== filters.inStockOnly) updates.inStockOnly = inStock;
    if (discount !== filters.discountOnly) updates.discountOnly = discount;

    if (Object.keys(updates).length > 0) {
      dispatch(setFilter(updates));
    }
    if (page !== currentPage) {
      dispatch(setPage(page));
    }
    if (q) {
      setSearchInput(q);
    }
  }, [searchParams]);

  useEffect(() => {
    const apiParams = {
      page: currentPage,
      limit: 12,
    };
    if (filters.category && filters.category !== 'all') apiParams.category = filters.category;
    if (filters.subcategory && filters.subcategory !== 'all') apiParams.subcategory = filters.subcategory;
    if (filters.brand && filters.brand !== 'all') apiParams.brand = filters.brand;
    if (filters.seller && filters.seller !== 'all') apiParams.seller = filters.seller;
    if (filters.searchQuery) apiParams.search = filters.searchQuery;
    if (filters.sortBy) apiParams.sort = filters.sortBy;
    if (filters.minPrice > 0) apiParams.minPrice = filters.minPrice;
    if (filters.maxPrice < 50000) apiParams.maxPrice = filters.maxPrice;
    if (filters.rating > 0) apiParams.rating = filters.rating;

    dispatch(fetchProducts(apiParams));
  }, [dispatch, filters, currentPage]);

  // 2. Synchronize Redux filter changes -> URL query parameters
  const updateUrlParams = (newFilters, newPage = currentPage) => {
    const params = new URLSearchParams();
    if (newFilters.category && newFilters.category !== 'all')
      params.set('category', newFilters.category);
    if (newFilters.subcategory && newFilters.subcategory !== 'all')
      params.set('subcategory', newFilters.subcategory);
    if (newFilters.brand && newFilters.brand !== 'all')
      params.set('brand', newFilters.brand);
    if (newFilters.seller && newFilters.seller !== 'all')
      params.set('seller', newFilters.seller);
    if (newFilters.searchQuery) params.set('q', newFilters.searchQuery);
    if (newFilters.sortBy && newFilters.sortBy !== 'featured')
      params.set('sort', newFilters.sortBy);
    if (newFilters.minPrice > 0) params.set('minPrice', newFilters.minPrice.toString());
    if (newFilters.maxPrice < 5000) params.set('maxPrice', newFilters.maxPrice.toString());
    if (newFilters.rating > 0) params.set('rating', newFilters.rating.toString());
    if (newFilters.inStockOnly) params.set('inStock', 'true');
    if (newFilters.discountOnly) params.set('discount', 'true');
    if (newPage > 1) params.set('page', newPage.toString());

    setSearchParams(params, { replace: true });
  };

  const handlePageChange = (newPage) => {
    dispatch(setPage(newPage));
    updateUrlParams(filters, newPage);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    const query = searchInput.trim();
    dispatch(setFilter({ searchQuery: query }));
    if (query) dispatch(addRecentSearch(query));
    updateUrlParams({ ...filters, searchQuery: query }, 1);
  };

  const handleClearSearch = () => {
    setSearchInput('');
    dispatch(setFilter({ searchQuery: '' }));
    updateUrlParams({ ...filters, searchQuery: '' }, 1);
  };

  // Current active entity headers (Category, Brand, or Search)
  const currentCategory = categories.find((c) => c.slug === filters.category);
  const currentBrand = brands.find((b) => b.slug === filters.brand || b.id === filters.brand);

  return (
    <div className="min-h-screen bg-background text-text-main pb-20">
      {/* Category / Brand / Search Hero Banner Header */}
      {currentCategory ? (
        <div className="relative bg-slate-950 text-white py-14 lg:py-20 overflow-hidden border-b border-border/80">
          <div className="absolute inset-0 z-0">
            <img
              src={currentCategory.image}
              alt=""
              className="w-full h-full object-cover object-center"
            />
            <div className="absolute inset-0 bg-gradient-to-r from-slate-950/95 via-slate-950/80 to-slate-950/40" />
            <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-transparent to-transparent" />
            <div className="absolute inset-0 bg-[radial-gradient(#ffffff_1px,transparent_1px)] [background-size:24px_24px] opacity-10" />
          </div>

          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 space-y-3">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/10 text-accent-light text-xs font-semibold backdrop-blur-md border border-white/15">
              <Sparkles className="w-3.5 h-3.5 text-accent" />
              <span>Department Spotlight</span>
            </div>
            <h1 className="font-serif text-3xl sm:text-4xl lg:text-5xl font-bold tracking-tight text-white leading-tight">
              {currentCategory.name}
            </h1>
            <p className="text-xs sm:text-base text-slate-300 max-w-2xl leading-relaxed font-light">
              {currentCategory.description}
            </p>

            {/* Subcategory Pills */}
            {currentCategory.subcategories?.length > 0 && (
              <div className="flex flex-wrap items-center gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => {
                    dispatch(setFilter({ subcategory: 'all' }));
                    updateUrlParams({ ...filters, subcategory: 'all' }, 1);
                  }}
                  className={`px-3.5 py-1 rounded-full text-xs font-semibold transition-all cursor-pointer ${
                    filters.subcategory === 'all'
                      ? 'bg-accent text-white shadow-xs'
                      : 'bg-white/10 hover:bg-white/20 text-slate-200 border border-white/10'
                  }`}
                >
                  All {currentCategory.name}
                </button>
                {currentCategory.subcategories.map((sub) => (
                  <button
                    key={sub.id}
                    type="button"
                    onClick={() => {
                      dispatch(setFilter({ subcategory: sub.slug }));
                      updateUrlParams({ ...filters, subcategory: sub.slug }, 1);
                    }}
                    className={`px-3.5 py-1 rounded-full text-xs font-semibold transition-all cursor-pointer ${
                      filters.subcategory === sub.slug
                        ? 'bg-accent text-white shadow-xs'
                        : 'bg-white/10 hover:bg-white/20 text-slate-200 border border-white/10'
                    }`}
                  >
                    {sub.name}
                  </button>
                ))}
              </div>
            )}
          </div>
        </div>
      ) : currentBrand ? (
        <div className="relative bg-slate-950 text-white py-14 lg:py-20 overflow-hidden border-b border-border/80">
          <div className="absolute inset-0 z-0">
            <img
              src="https://images.unsplash.com/photo-1534447677768-be436bb09401?q=80&w=2000&auto=format&fit=crop"
              alt=""
              className="w-full h-full object-cover object-center"
            />
            <div className="absolute inset-0 bg-gradient-to-r from-slate-950/95 via-slate-950/80 to-slate-950/40" />
            <div className="absolute inset-0 bg-[radial-gradient(#ffffff_1px,transparent_1px)] [background-size:24px_24px] opacity-10" />
          </div>

          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 flex flex-col sm:flex-row items-center sm:items-start gap-6">
            <div className="w-20 h-20 sm:w-24 sm:h-24 rounded-2xl overflow-hidden border-2 border-white/20 bg-white shadow-xl shrink-0">
              <img
                src={currentBrand.logo}
                alt={currentBrand.name}
                className="w-full h-full object-cover"
              />
            </div>
            <div className="space-y-2 text-center sm:text-left">
              <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/10 text-accent-light text-xs font-semibold backdrop-blur-md border border-white/15">
                <Store className="w-3.5 h-3.5 text-accent" />
                <span>Verified Sovereign Atelier • {currentBrand.origin}</span>
              </div>
              <h1 className="font-serif text-3xl sm:text-4xl lg:text-5xl font-bold text-white tracking-tight">
                {currentBrand.name}
              </h1>
              <p className="text-xs sm:text-base text-slate-300 max-w-2xl leading-relaxed font-light">
                {currentBrand.description}
              </p>
            </div>
          </div>
        </div>
      ) : filters.searchQuery ? (
        <div className="bg-surface-muted py-8 sm:py-12 border-b border-border">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <span className="text-xs font-bold uppercase tracking-widest text-accent block mb-1">
              Search Results
            </span>
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div>
                <h1 className="font-serif text-2xl sm:text-3xl font-bold text-text-main">
                  Creations matching "{filters.searchQuery}"
                </h1>
                <p className="text-xs text-text-muted mt-1">
                  Found {total} certified artisanal pieces matching your query
                </p>
              </div>

              <button
                type="button"
                onClick={handleClearSearch}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-border bg-surface text-xs font-semibold text-text-muted hover:text-text-main hover:bg-surface-muted transition-colors cursor-pointer self-start sm:self-auto"
              >
                <X className="w-3.5 h-3.5" />
                <span>Clear Query</span>
              </button>
            </div>
          </div>
        </div>
      ) : (
        <div className="relative bg-slate-950 text-white py-14 lg:py-18 overflow-hidden border-b border-border/80">
          <div className="absolute inset-0 z-0">
            <img
              src="https://images.unsplash.com/photo-1441986300917-64674bd600d8?q=80&w=2000&auto=format&fit=crop"
              alt="Artisan Catalog"
              className="w-full h-full object-cover object-center"
            />
            <div className="absolute inset-0 bg-gradient-to-r from-slate-950/95 via-slate-950/80 to-slate-950/40" />
            <div className="absolute inset-0 bg-[radial-gradient(#ffffff_1px,transparent_1px)] [background-size:24px_24px] opacity-10" />
          </div>

          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 space-y-2">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/10 text-accent-light text-xs font-semibold backdrop-blur-md border border-white/15">
              <Sparkles className="w-3.5 h-3.5 text-accent" />
              <span>The Sovereign Collection</span>
            </div>
            <h1 className="font-serif text-3xl sm:text-4xl lg:text-5xl font-bold text-white tracking-tight">
              Explore Sovereign Creations
            </h1>
            <p className="text-xs sm:text-base text-slate-300 max-w-2xl font-light">
              Browse {total} bespoke pieces hand-crafted by verified independent master ateliers worldwide.
            </p>
          </div>
        </div>
      )}

      {/* Main Marketplace Layout */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-8">
        {/* Marketplace Search & Quick Suggestions Bar */}
        <div className="mb-6 p-4 rounded-2xl bg-surface border border-border shadow-2xs space-y-3">
          <form onSubmit={handleSearchSubmit} className="flex items-center gap-2">
            <div className="relative flex-1">
              <Search className="w-4 h-4 text-text-muted absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                placeholder="Search by creation name, atelier, gemstone, material, or SKU..."
                value={searchInput}
                onChange={(e) => setSearchInput(e.target.value)}
                className="w-full pl-10 pr-10 py-2.5 text-xs bg-surface-muted border border-border rounded-xl focus:outline-none focus:border-accent text-text-main placeholder:text-text-subtle"
              />
              {searchInput && (
                <button
                  type="button"
                  onClick={handleClearSearch}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-text-muted hover:text-text-main p-1 cursor-pointer"
                >
                  <X className="w-3.5 h-3.5" />
                </button>
              )}
            </div>
            <Button type="submit" variant="primary" size="md">
              Search
            </Button>
          </form>

          {/* Search suggestions tags */}
          <div className="flex items-center gap-2 flex-wrap text-xs pt-1">
            <span className="text-[11px] font-semibold text-text-muted flex items-center gap-1">
              <Flame className="w-3 h-3 text-amber-500" /> Popular:
            </span>
            {popularSearches.slice(0, 5).map((term) => (
              <button
                key={term}
                type="button"
                onClick={() => {
                  setSearchInput(term);
                  dispatch(setFilter({ searchQuery: term }));
                  updateUrlParams({ ...filters, searchQuery: term }, 1);
                }}
                className="px-2.5 py-0.5 rounded-full bg-surface-muted border border-border text-[11px] text-text-muted hover:text-text-main hover:border-accent transition-colors cursor-pointer"
              >
                {term}
              </button>
            ))}
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* Desktop Left Sidebar Filters (3 Cols) */}
          <aside className="hidden lg:block lg:col-span-3 sticky top-24 bg-surface rounded-2xl border border-border p-5 shadow-subtle">
            <ProductFilterSidebar />
          </aside>

          {/* Right Product Grid Area (9 Cols) */}
          <main className="lg:col-span-9 space-y-6">
            {/* Sort & Refine Control Bar */}
            <ProductSortBar
              total={total}
              startIndex={startIndex}
              endIndex={endIndex}
              onOpenMobileFilters={() => setMobileFilterOpen(true)}
            />

            {/* Active Filter Badges */}
            <ActiveFilterChips />

            {/* Products Grid */}
            {items.length > 0 ? (
              <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
                {items.map((product) => (
                  <ProductCard key={product.id} product={product} />
                ))}
              </div>
            ) : (
              <div className="space-y-8 animate-in fade-in">
                <EmptyState
                  variant="search"
                  title="No creations matched your criteria"
                  description="We couldn't find any artisan pieces matching your current combination of filters. Try widening your price range, checking another department, or resetting filters."
                  actionLabel="Reset All Refinements"
                  onAction={() => {
                    dispatch(resetFilters());
                    setSearchInput('');
                    setSearchParams({});
                  }}
                />

                {/* Useful Alternatives: Recommended Featured Pieces */}
                <div className="p-6 rounded-2xl bg-surface border border-border space-y-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <h3 className="font-serif font-bold text-sm text-text-main">
                        Recommended Sovereign Curations
                      </h3>
                      <p className="text-[11px] text-text-muted">
                        Hand-selected pieces admired by connoisseurs this season.
                      </p>
                    </div>
                    <button
                      type="button"
                      onClick={() => {
                        dispatch(resetFilters());
                        setSearchParams({});
                      }}
                      className="text-xs font-semibold text-accent hover:underline cursor-pointer"
                    >
                      View All Catalog
                    </button>
                  </div>

                  <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
                    {featuredProducts.slice(0, 3).map((prod) => (
                      <ProductCard key={prod.id} product={prod} />
                    ))}
                  </div>
                </div>
              </div>
            )}

            {/* Scalable Multi-Page Pagination */}
            <Pagination
              currentPage={currentPage}
              totalPages={totalPages}
              onPageChange={handlePageChange}
            />
          </main>
        </div>
      </div>

      {/* Mobile Slide-In Filter Drawer / Modal */}
      {mobileFilterOpen && (
        <div className="fixed inset-0 z-50 lg:hidden flex justify-end">
          {/* Backdrop */}
          <div
            className="fixed inset-0 bg-primary/60 backdrop-blur-xs transition-opacity"
            onClick={() => setMobileFilterOpen(false)}
          />

          {/* Drawer Content */}
          <div className="relative w-full max-w-xs sm:max-w-sm bg-surface h-full shadow-2xl flex flex-col z-10 animate-in slide-in-from-right duration-300">
            {/* Drawer Header */}
            <div className="flex items-center justify-between p-4 border-b border-border">
              <h3 className="font-serif text-base font-bold text-text-main">Refine Creations</h3>
              <button
                type="button"
                onClick={() => setMobileFilterOpen(false)}
                className="p-1.5 rounded-lg text-text-muted hover:text-text-main hover:bg-surface-muted cursor-pointer"
                aria-label="Close filters"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Drawer Body (Scrollable) */}
            <div className="p-4 overflow-y-auto flex-1">
              <ProductFilterSidebar
                isMobile={true}
                onCloseMobile={() => setMobileFilterOpen(false)}
              />
            </div>

            {/* Drawer Footer */}
            <div className="p-4 border-t border-border bg-surface-muted/40 flex items-center gap-3">
              <button
                type="button"
                onClick={() => {
                  dispatch(resetFilters());
                  setSearchParams({});
                  setMobileFilterOpen(false);
                }}
                className="flex-1 py-2.5 px-3 rounded-lg border border-border text-xs font-semibold text-text-main hover:bg-surface-muted transition-colors cursor-pointer"
              >
                Reset All
              </button>
              <button
                type="button"
                onClick={() => setMobileFilterOpen(false)}
                className="flex-1 py-2.5 px-3 rounded-lg bg-primary text-white text-xs font-semibold hover:bg-primary-hover transition-colors shadow-subtle cursor-pointer"
              >
                Apply Filters ({total})
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ProductsPage;
