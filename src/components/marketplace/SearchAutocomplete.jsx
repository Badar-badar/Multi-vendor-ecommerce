import { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { Search, X, ArrowRight, Sparkles, Store, Layers } from 'lucide-react';
import { useSelector } from 'react-redux';
import { selectAllProducts } from '../../features/products/productSelectors';
import { categories } from '../../data/categories';
import { brands } from '../../data/brands';
import { formatCurrency } from '../../utils/formatCurrency';

const trendingSearches = [
  '18k Gold Choker',
  'Mulberry Silk Coat',
  'Damascus Chef Knife',
  'Full Grain Leather Duffel',
  'Murano Glass',
  'Kyoto Ceramics',
];

export const SearchAutocomplete = ({ className = '', placeholder = 'Search luxury fashion, fine jewelry, master ceramics...' }) => {
  const navigate = useNavigate();
  const allProducts = useSelector(selectAllProducts);

  const [query, setQuery] = useState('');
  const [debouncedQuery, setDebouncedQuery] = useState('');
  const [isOpen, setIsOpen] = useState(false);
  const containerRef = useRef(null);

  // Debounce query
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedQuery(query);
    }, 250);
    return () => clearTimeout(timer);
  }, [query]);

  // Click outside to close
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (containerRef.current && !containerRef.current.contains(e.target)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Compute matching items
  const q = debouncedQuery.toLowerCase().trim();

  const matchingProducts = q
    ? allProducts
        .filter(
          (p) =>
            p.name.toLowerCase().includes(q) ||
            p.description.toLowerCase().includes(q) ||
            p.category?.name?.toLowerCase().includes(q) ||
            p.brand?.name?.toLowerCase().includes(q)
        )
        .slice(0, 4)
    : [];

  const matchingCategories = q
    ? categories.filter((c) => c.name.toLowerCase().includes(q)).slice(0, 3)
    : [];

  const matchingBrands = q
    ? brands.filter((b) => b.name.toLowerCase().includes(q) || b.origin.toLowerCase().includes(q)).slice(0, 3)
    : [];

  const handleSubmit = (e) => {
    e?.preventDefault();
    if (query.trim()) {
      navigate(`/products?q=${encodeURIComponent(query.trim())}`);
      setIsOpen(false);
    }
  };

  const handleSelectSuggestion = (searchVal) => {
    setQuery(searchVal);
    navigate(`/products?q=${encodeURIComponent(searchVal)}`);
    setIsOpen(false);
  };

  return (
    <div ref={containerRef} className={`relative w-full ${className}`}>
      {/* Search Input Bar */}
      <form onSubmit={handleSubmit} className="relative w-full flex items-center">
        <input
          type="text"
          value={query}
          onFocus={() => setIsOpen(true)}
          onChange={(e) => {
            setQuery(e.target.value);
            setIsOpen(true);
          }}
          placeholder={placeholder}
          className="w-full pl-10 pr-9 py-2.5 text-xs sm:text-sm bg-surface border border-border rounded-xl focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary/10 transition-all"
        />
        <Search className="w-4 h-4 text-text-muted absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />

        {query && (
          <button
            type="button"
            onClick={() => {
              setQuery('');
              setDebouncedQuery('');
            }}
            className="absolute right-3 top-1/2 -translate-y-1/2 text-text-muted hover:text-text-main p-0.5 rounded cursor-pointer"
            aria-label="Clear search query"
          >
            <X className="w-3.5 h-3.5" />
          </button>
        )}
      </form>

      {/* Autocomplete Suggestions Popover */}
      {isOpen && (
        <div className="absolute top-full left-0 right-0 mt-2 bg-surface rounded-2xl border border-border shadow-modal p-4 z-50 animate-in fade-in zoom-in-95 duration-150 max-h-[75vh] overflow-y-auto">
          {q ? (
            /* Results found when query exists */
            <div className="space-y-4">
              {/* Matching Products */}
              {matchingProducts.length > 0 && (
                <div>
                  <div className="flex items-center justify-between pb-2 mb-2 border-b border-border text-[11px] font-bold uppercase tracking-wider text-text-muted">
                    <span>Matching Creations</span>
                    <button
                      type="button"
                      onClick={handleSubmit}
                      className="text-accent hover:underline flex items-center gap-1 font-semibold cursor-pointer"
                    >
                      See all for "{query}" <ArrowRight className="w-3 h-3" />
                    </button>
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                    {matchingProducts.map((product) => (
                      <div
                        key={product.id}
                        onClick={() => {
                          navigate(`/products/${product.id}`);
                          setIsOpen(false);
                        }}
                        className="flex items-center gap-3 p-2 rounded-xl hover:bg-surface-muted transition-colors cursor-pointer group"
                      >
                        <img
                          src={product.images?.[0]}
                          alt={product.name}
                          className="w-12 h-12 rounded-lg object-cover border border-border shrink-0"
                        />
                        <div className="min-w-0 flex-1">
                          <p className="text-xs font-semibold text-text-main group-hover:text-accent transition-colors truncate">
                            {product.name}
                          </p>
                          <p className="text-[11px] text-text-muted truncate">
                            {product.brand?.name || product.seller?.storeName}
                          </p>
                          <p className="text-xs font-bold text-text-main mt-0.5">
                            {formatCurrency(product.price)}
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Matching Departments */}
              {matchingCategories.length > 0 && (
                <div className="pt-2 border-t border-border">
                  <span className="text-[11px] font-bold uppercase tracking-wider text-text-muted block mb-2">
                    Departments
                  </span>
                  <div className="flex flex-wrap gap-2">
                    {matchingCategories.map((cat) => (
                      <button
                        key={cat.id}
                        type="button"
                        onClick={() => {
                          navigate(`/products?category=${cat.slug}`);
                          setIsOpen(false);
                        }}
                        className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-surface-muted hover:bg-surface-hover text-xs font-semibold text-text-main border border-border transition-colors cursor-pointer"
                      >
                        <Layers className="w-3.5 h-3.5 text-accent" />
                        <span>{cat.name}</span>
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {/* Matching Ateliers */}
              {matchingBrands.length > 0 && (
                <div className="pt-2 border-t border-border">
                  <span className="text-[11px] font-bold uppercase tracking-wider text-text-muted block mb-2">
                    Master Ateliers
                  </span>
                  <div className="flex flex-wrap gap-2">
                    {matchingBrands.map((brand) => (
                      <button
                        key={brand.id}
                        type="button"
                        onClick={() => {
                          navigate(`/products?brand=${brand.slug}`);
                          setIsOpen(false);
                        }}
                        className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-surface-muted hover:bg-surface-hover text-xs font-semibold text-text-main border border-border transition-colors cursor-pointer"
                      >
                        <Store className="w-3.5 h-3.5 text-accent" />
                        <span>{brand.name} ({brand.origin})</span>
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {matchingProducts.length === 0 &&
                matchingCategories.length === 0 &&
                matchingBrands.length === 0 && (
                  <div className="py-6 text-center space-y-2">
                    <p className="text-xs font-semibold text-text-main">
                      No exact matches found for "{query}"
                    </p>
                    <p className="text-xs text-text-muted">
                      Press enter to search across all atelier archives.
                    </p>
                    <button
                      type="button"
                      onClick={handleSubmit}
                      className="inline-flex items-center gap-1.5 px-4 py-2 rounded-lg bg-primary text-white text-xs font-semibold hover:bg-primary-hover transition-colors cursor-pointer mt-2"
                    >
                      Search All Archive <ArrowRight className="w-3 h-3" />
                    </button>
                  </div>
                )}
            </div>
          ) : (
            /* Empty Query: Trending searches & quick discovery */
            <div className="space-y-4">
              <div>
                <div className="flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-text-muted mb-2.5">
                  <Sparkles className="w-3.5 h-3.5 text-accent" />
                  <span>Trending Curations</span>
                </div>
                <div className="flex flex-wrap gap-2">
                  {trendingSearches.map((item) => (
                    <button
                      key={item}
                      type="button"
                      onClick={() => handleSelectSuggestion(item)}
                      className="px-3 py-1.5 rounded-lg bg-surface-muted hover:bg-surface-hover border border-border text-xs font-medium text-text-main transition-colors cursor-pointer"
                    >
                      {item}
                    </button>
                  ))}
                </div>
              </div>

              <div className="pt-3 border-t border-border">
                <span className="text-[11px] font-bold uppercase tracking-wider text-text-muted block mb-2">
                  Browse by Discipline
                </span>
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                  {categories.slice(0, 6).map((cat) => (
                    <button
                      key={cat.id}
                      type="button"
                      onClick={() => {
                        navigate(`/products?category=${cat.slug}`);
                        setIsOpen(false);
                      }}
                      className="text-left px-2.5 py-1.5 rounded-lg hover:bg-surface-muted text-xs text-text-main font-medium truncate transition-colors cursor-pointer"
                    >
                      • {cat.name}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default SearchAutocomplete;
