import { X } from 'lucide-react';
import { useDispatch, useSelector } from 'react-redux';
import { selectProductFilters } from '../../features/products/productSelectors';
import { setFilter, resetFilters } from '../../features/products/productSlice';
import { categories } from '../../data/categories';
import { brands } from '../../data/brands';
import { formatCurrency } from '../../utils/formatCurrency';

export const ActiveFilterChips = () => {
  const dispatch = useDispatch();
  const filters = useSelector(selectProductFilters);

  const chips = [];

  // Search Query
  if (filters.searchQuery) {
    chips.push({
      id: 'search',
      label: `Search: "${filters.searchQuery}"`,
      onRemove: () => dispatch(setFilter({ searchQuery: '' })),
    });
  }

  // Category
  if (filters.category && filters.category !== 'all') {
    const cat = categories.find((c) => c.slug === filters.category);
    chips.push({
      id: 'category',
      label: `Department: ${cat?.name || filters.category}`,
      onRemove: () => dispatch(setFilter({ category: 'all', subcategory: 'all' })),
    });
  }

  // Subcategory
  if (filters.subcategory && filters.subcategory !== 'all') {
    chips.push({
      id: 'subcategory',
      label: `Specialty: ${filters.subcategory.replace('-', ' ')}`,
      onRemove: () => dispatch(setFilter({ subcategory: 'all' })),
    });
  }

  // Brand
  if (filters.brand && filters.brand !== 'all') {
    const brand = brands.find((b) => b.slug === filters.brand || b.id === filters.brand);
    chips.push({
      id: 'brand',
      label: `Atelier: ${brand?.name || filters.brand}`,
      onRemove: () => dispatch(setFilter({ brand: 'all' })),
    });
  }

  // Price range
  if (filters.minPrice > 0 || filters.maxPrice < 5000) {
    chips.push({
      id: 'price',
      label: `Price: ${formatCurrency(filters.minPrice)} – ${formatCurrency(filters.maxPrice)}`,
      onRemove: () => dispatch(setFilter({ minPrice: 0, maxPrice: 5000 })),
    });
  }

  // Rating
  if (filters.rating > 0) {
    chips.push({
      id: 'rating',
      label: `Rating: ${filters.rating}★ & above`,
      onRemove: () => dispatch(setFilter({ rating: 0 })),
    });
  }

  // In Stock
  if (filters.inStockOnly) {
    chips.push({
      id: 'inStock',
      label: 'Immediate Dispatch Only',
      onRemove: () => dispatch(setFilter({ inStockOnly: false })),
    });
  }

  // Discount / Vault
  if (filters.discountOnly) {
    chips.push({
      id: 'discount',
      label: 'Artisan Vault Offers Only',
      onRemove: () => dispatch(setFilter({ discountOnly: false })),
    });
  }

  if (chips.length === 0) return null;

  return (
    <div className="flex flex-wrap items-center gap-2 py-3">
      <span className="text-xs text-text-subtle font-medium">Active Refinements:</span>
      {chips.map((chip) => (
        <span
          key={chip.id}
          className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-surface-muted border border-border text-xs text-text-main font-medium shadow-xs"
        >
          <span>{chip.label}</span>
          <button
            type="button"
            onClick={chip.onRemove}
            className="text-text-muted hover:text-text-main p-0.5 rounded-full hover:bg-black/5 cursor-pointer"
            aria-label={`Remove ${chip.label}`}
          >
            <X className="w-3 h-3" />
          </button>
        </span>
      ))}
      <button
        type="button"
        onClick={() => dispatch(resetFilters())}
        className="text-xs text-accent hover:text-accent-hover font-semibold underline ml-1 cursor-pointer"
      >
        Clear All
      </button>
    </div>
  );
};

export default ActiveFilterChips;
