import { useState, useMemo } from 'react';
import { useParams, useSearchParams, Link } from 'react-router-dom';
import {
  Sparkles,
  ArrowLeft,
  ChevronRight,
  Filter,
  SlidersHorizontal,
  Package,
  Layers,
  ArrowRight,
  Check,
} from 'lucide-react';
import { useSelector } from 'react-redux';
import { categories } from '../../data/categories';
import { selectAllProducts } from '../../features/products/productSelectors';
import ProductCard from '../../components/product/ProductCard';
import Button from '../../components/common/Button';
import Badge from '../../components/common/Badge';

export const CategoryDetailPage = () => {
  const { slug } = useParams();
  const [searchParams, setSearchParams] = useSearchParams();
  const activeSubcategory = searchParams.get('subcategory') || 'all';

  const allProducts = useSelector(selectAllProducts);

  const category =
    categories.find((c) => c.slug === slug || c.id === slug) || categories[0];

  const [sortBy, setSortBy] = useState('newest');
  const [priceRange, setPriceRange] = useState('all');
  const [selectedBrand, setSelectedBrand] = useState('all');
  const [inStockOnly, setInStockOnly] = useState(false);
  const [mobileFiltersOpen, setMobileFiltersOpen] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 8;

  // Filter products by category and subcategory
  const filteredProducts = useMemo(() => {
    return allProducts
      .filter((p) => {
        const matchesCategory =
          p.category?.slug === category.slug ||
          p.category?.name?.toLowerCase() === category.name?.toLowerCase();

        const matchesSubcategory =
          activeSubcategory === 'all' ||
          p.subcategory?.slug === activeSubcategory ||
          p.subcategory?.name?.toLowerCase() === activeSubcategory?.toLowerCase();

        const matchesBrand =
          selectedBrand === 'all' ||
          p.brand?.name === selectedBrand ||
          p.brand === selectedBrand;

        const matchesStock = !inStockOnly || p.stock > 0;

        let matchesPrice = true;
        if (priceRange === 'under_1000') matchesPrice = p.price < 1000;
        else if (priceRange === '1000_5000') matchesPrice = p.price >= 1000 && p.price <= 5000;
        else if (priceRange === 'above_5000') matchesPrice = p.price > 5000;

        return (
          matchesCategory &&
          matchesSubcategory &&
          matchesBrand &&
          matchesStock &&
          matchesPrice
        );
      })
      .sort((a, b) => {
        if (sortBy === 'price_asc') return a.price - b.price;
        if (sortBy === 'price_desc') return b.price - a.price;
        if (sortBy === 'rating') return (b.rating || 0) - (a.rating || 0);
        return 0;
      });
  }, [
    allProducts,
    category,
    activeSubcategory,
    selectedBrand,
    inStockOnly,
    priceRange,
    sortBy,
  ]);

  const totalPages = Math.ceil(filteredProducts.length / itemsPerPage) || 1;
  const paginatedProducts = filteredProducts.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  const availableBrands = Array.from(
    new Set(
      allProducts
        .filter((p) => p.category?.slug === category.slug || p.category?.name === category.name)
        .map((p) => p.brand?.name || p.brand)
        .filter(Boolean)
    )
  );

  const handleSubcategorySelect = (subSlug) => {
    if (subSlug === 'all') {
      searchParams.delete('subcategory');
    } else {
      searchParams.set('subcategory', subSlug);
    }
    setSearchParams(searchParams);
    setCurrentPage(1);
  };

  return (
    <div className="min-h-screen bg-background text-text-main pb-20">
      {/* Category Banner Hero */}
      <section className="relative bg-primary text-white py-12 lg:py-16 overflow-hidden border-b border-border">
        <div className="absolute inset-0 z-0 opacity-25">
          <img
            src={category.image}
            alt={category.name}
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-primary via-primary/80 to-transparent" />
        </div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 space-y-4">
          {/* Breadcrumb */}
          <nav className="flex items-center gap-2 text-xs text-slate-300 font-medium">
            <Link to="/" className="hover:text-white transition-colors">
              Home
            </Link>
            <ChevronRight className="w-3.5 h-3.5 text-slate-400" />
            <Link to="/categories" className="hover:text-white transition-colors">
              Departments
            </Link>
            <ChevronRight className="w-3.5 h-3.5 text-slate-400" />
            <span className="text-accent font-semibold">{category.name}</span>
          </nav>

          <div className="max-w-3xl space-y-2">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/10 text-accent-light text-xs font-semibold backdrop-blur-xs">
              <Layers className="w-3.5 h-3.5 text-accent" />
              <span>{category.itemCount || filteredProducts.length} Exclusive Creations</span>
            </div>
            <h1 className="font-serif text-3xl sm:text-4xl lg:text-5xl font-bold tracking-tight text-white">
              {category.name}
            </h1>
            <p className="text-xs sm:text-sm text-slate-200 leading-relaxed max-w-2xl">
              {category.description}
            </p>
          </div>
        </div>
      </section>

      {/* Subcategory Pills Navigation Bar */}
      {category.subcategories?.length > 0 && (
        <section className="sticky top-16 z-30 bg-surface/95 backdrop-blur-md border-b border-border py-3 shadow-xs">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex items-center gap-2 overflow-x-auto no-scrollbar">
            <button
              onClick={() => handleSubcategorySelect('all')}
              className={`px-4 py-1.5 rounded-full text-xs font-semibold whitespace-nowrap transition-all cursor-pointer ${
                activeSubcategory === 'all'
                  ? 'bg-primary text-white shadow-xs'
                  : 'bg-surface-muted text-text-muted hover:text-text-main hover:bg-surface-hover border border-border'
              }`}
            >
              All {category.name}
            </button>
            {category.subcategories.map((sub) => (
              <button
                key={sub.id}
                onClick={() => handleSubcategorySelect(sub.slug)}
                className={`px-4 py-1.5 rounded-full text-xs font-semibold whitespace-nowrap transition-all cursor-pointer ${
                  activeSubcategory === sub.slug
                    ? 'bg-primary text-white shadow-xs'
                    : 'bg-surface-muted text-text-muted hover:text-text-main hover:bg-surface-hover border border-border'
                }`}
              >
                {sub.name}
              </button>
            ))}
          </div>
        </section>
      )}

      {/* Main Content Layout */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-8">
        <div className="flex flex-col lg:flex-row items-start gap-8">
          {/* Desktop Left Filter Sidebar */}
          <aside className="hidden lg:block w-64 shrink-0 space-y-6 bg-surface p-5 rounded-2xl border border-border shadow-subtle sticky top-36">
            <div className="flex items-center justify-between pb-3 border-b border-border">
              <span className="font-serif font-bold text-sm text-text-main flex items-center gap-2">
                <SlidersHorizontal className="w-4 h-4 text-accent" /> Filter Catalog
              </span>
              {(priceRange !== 'all' || selectedBrand !== 'all' || inStockOnly) && (
                <button
                  onClick={() => {
                    setPriceRange('all');
                    setSelectedBrand('all');
                    setInStockOnly(false);
                  }}
                  className="text-[11px] text-accent font-semibold hover:underline cursor-pointer"
                >
                  Reset
                </button>
              )}
            </div>

            {/* Price Filter */}
            <div className="space-y-2">
              <label className="text-xs font-bold text-text-main uppercase tracking-wider block">
                Acquisition Value
              </label>
              <div className="space-y-1 text-xs text-text-muted">
                {[
                  { id: 'all', label: 'All Values' },
                  { id: 'under_1000', label: 'Under $1,000' },
                  { id: '1000_5000', label: '$1,000 – $5,000' },
                  { id: 'above_5000', label: 'Above $5,000' },
                ].map((pr) => (
                  <label key={pr.id} className="flex items-center gap-2 cursor-pointer hover:text-text-main">
                    <input
                      type="radio"
                      name="priceRange"
                      checked={priceRange === pr.id}
                      onChange={() => setPriceRange(pr.id)}
                      className="text-primary"
                    />
                    <span>{pr.label}</span>
                  </label>
                ))}
              </div>
            </div>

            {/* Brand Filter */}
            {availableBrands.length > 0 && (
              <div className="space-y-2 pt-3 border-t border-border">
                <label className="text-xs font-bold text-text-main uppercase tracking-wider block">
                  Artisan Maison
                </label>
                <div className="space-y-1 text-xs text-text-muted">
                  <label className="flex items-center gap-2 cursor-pointer hover:text-text-main">
                    <input
                      type="radio"
                      name="brand"
                      checked={selectedBrand === 'all'}
                      onChange={() => setSelectedBrand('all')}
                      className="text-primary"
                    />
                    <span>All Ateliers</span>
                  </label>
                  {availableBrands.map((b) => (
                    <label key={b} className="flex items-center gap-2 cursor-pointer hover:text-text-main">
                      <input
                        type="radio"
                        name="brand"
                        checked={selectedBrand === b}
                        onChange={() => setSelectedBrand(b)}
                        className="text-primary"
                      />
                      <span className="truncate">{b}</span>
                    </label>
                  ))}
                </div>
              </div>
            )}

            {/* In-Stock Toggle */}
            <div className="pt-3 border-t border-border">
              <label className="flex items-center justify-between text-xs font-semibold text-text-main cursor-pointer">
                <span>In Stock & Ready to Dispatch</span>
                <input
                  type="checkbox"
                  checked={inStockOnly}
                  onChange={(e) => setInStockOnly(e.target.checked)}
                  className="rounded text-primary"
                />
              </label>
            </div>
          </aside>

          {/* Right Product Grid Area */}
          <div className="flex-1 min-w-0 w-full space-y-6">
            {/* Top Results Bar */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-surface p-4 rounded-2xl border border-border shadow-subtle text-xs">
              <div className="text-text-muted">
                Showing <strong className="text-text-main">{filteredProducts.length}</strong> creations in{' '}
                <strong className="text-accent">{category.name}</strong>
              </div>

              <div className="flex items-center gap-2">
                <span className="text-text-muted font-medium">Sort:</span>
                <select
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value)}
                  className="px-3 py-1.5 bg-surface-muted border border-border rounded-xl font-semibold text-text-main cursor-pointer"
                >
                  <option value="newest">Newest Acquisitions</option>
                  <option value="price_asc">Price: Low to High</option>
                  <option value="price_desc">Price: High to Low</option>
                  <option value="rating">Highest Rated</option>
                </select>
              </div>
            </div>

            {/* Product Grid */}
            {filteredProducts.length === 0 ? (
              /* Empty State */
              <div className="bg-surface p-12 rounded-3xl border border-border text-center space-y-4 shadow-subtle">
                <div className="w-16 h-16 rounded-2xl bg-surface-muted flex items-center justify-center mx-auto text-text-muted">
                  <Package className="w-8 h-8" />
                </div>
                <h3 className="font-serif font-bold text-xl text-text-main">
                  No Creations Found
                </h3>
                <p className="text-xs text-text-muted max-w-md mx-auto leading-relaxed">
                  We could not find any creations matching your filter combination in {category.name}. Try resetting filters or browsing other departments.
                </p>
                <div className="pt-2 flex justify-center gap-3">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => {
                      setPriceRange('all');
                      setSelectedBrand('all');
                      setInStockOnly(false);
                      handleSubcategorySelect('all');
                    }}
                  >
                    Reset Filters
                  </Button>
                  <Link to="/categories">
                    <Button variant="primary" size="sm">
                      All Departments
                    </Button>
                  </Link>
                </div>
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                {paginatedProducts.map((product) => (
                  <ProductCard key={product.id} product={product} />
                ))}
              </div>
            )}

            {/* Pagination */}
            {totalPages > 1 && (
              <div className="flex items-center justify-center gap-2 pt-6">
                <button
                  onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
                  disabled={currentPage === 1}
                  className="px-4 py-2 rounded-xl bg-surface border border-border text-xs font-semibold text-text-main disabled:opacity-40 cursor-pointer"
                >
                  Previous
                </button>
                <span className="text-xs text-text-muted px-2">
                  Page {currentPage} of {totalPages}
                </span>
                <button
                  onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
                  disabled={currentPage === totalPages}
                  className="px-4 py-2 rounded-xl bg-surface border border-border text-xs font-semibold text-text-main disabled:opacity-40 cursor-pointer"
                >
                  Next
                </button>
              </div>
            )}
          </div>
        </div>
      </section>
    </div>
  );
};

export default CategoryDetailPage;
