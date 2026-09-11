import { SlidersHorizontal, ArrowUpDown } from 'lucide-react';
import { useDispatch, useSelector } from 'react-redux';
import { selectProductFilters, selectPagination } from '../../features/products/productSelectors';
import { setFilter, setLimit } from '../../features/products/productSlice';

export const ProductSortBar = ({
  total,
  startIndex,
  endIndex,
  onOpenMobileFilters,
}) => {
  const dispatch = useDispatch();
  const filters = useSelector(selectProductFilters);
  const pagination = useSelector(selectPagination);

  // Count active non-default filters
  const activeFiltersCount = [
    filters.category !== 'all',
    filters.subcategory !== 'all',
    filters.brand !== 'all',
    filters.minPrice > 0,
    filters.maxPrice < 5000,
    filters.rating > 0,
    filters.inStockOnly,
    filters.discountOnly,
    Boolean(filters.searchQuery),
  ].filter(Boolean).length;

  const sortOptions = [
    { label: 'Featured Curations', value: 'featured' },
    { label: 'Newest Arrivals', value: 'newest' },
    { label: 'Price: Low to High', value: 'price_asc' },
    { label: 'Price: High to Low', value: 'price_desc' },
    { label: 'Highest Patron Rating', value: 'rating' },
    { label: 'Most Popular', value: 'popular' },
  ];

  return (
    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 py-4 border-y border-border/80 bg-surface px-4 rounded-xl">
      {/* Left: Results Count */}
      <div className="text-xs text-text-muted">
        {total > 0 ? (
          <span>
            Showing <strong className="text-text-main font-semibold">{startIndex}–{endIndex}</strong> of{' '}
            <strong className="text-text-main font-semibold">{total}</strong> certified creations
          </span>
        ) : (
          <span>No matching creations</span>
        )}
      </div>

      {/* Right: Mobile filter trigger + Sort & Limit Selectors */}
      <div className="flex items-center gap-2.5 flex-wrap sm:flex-nowrap">
        {/* Mobile Filter Button */}
        <button
          type="button"
          onClick={onOpenMobileFilters}
          className="lg:hidden flex-1 sm:flex-none flex items-center justify-center gap-2 px-3.5 py-2 rounded-lg bg-surface border border-border text-xs font-semibold text-text-main hover:bg-surface-muted transition-colors cursor-pointer shadow-xs"
        >
          <SlidersHorizontal className="w-3.5 h-3.5 text-accent" />
          <span>Refine</span>
          {activeFiltersCount > 0 && (
            <span className="min-w-[18px] h-[18px] px-1 bg-primary text-white text-[10px] font-bold rounded-full flex items-center justify-center">
              {activeFiltersCount}
            </span>
          )}
        </button>

        {/* Sort Select */}
        <div className="relative flex items-center">
          <div className="absolute left-2.5 pointer-events-none text-text-muted">
            <ArrowUpDown className="w-3.5 h-3.5" />
          </div>
          <select
            value={filters.sortBy}
            onChange={(e) => dispatch(setFilter({ sortBy: e.target.value }))}
            className="appearance-none text-xs bg-surface-muted hover:bg-surface-hover border border-border rounded-lg pl-8 pr-7 py-2 text-text-main font-medium focus:outline-none focus:border-primary transition-colors cursor-pointer"
            aria-label="Sort products"
          >
            {sortOptions.map((opt) => (
              <option key={opt.value} value={opt.value}>
                {opt.label}
              </option>
            ))}
          </select>
        </div>

        {/* Per page limit */}
        <div className="hidden sm:flex items-center gap-1.5 text-xs text-text-muted">
          <span>Show:</span>
          {[12, 24, 36].map((lim) => (
            <button
              key={lim}
              type="button"
              onClick={() => dispatch(setLimit(lim))}
              className={`px-2 py-1 rounded text-xs transition-colors cursor-pointer ${
                pagination.limit === lim
                  ? 'bg-primary text-white font-bold'
                  : 'hover:bg-surface-muted text-text-muted'
              }`}
            >
              {lim}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};

export default ProductSortBar;
