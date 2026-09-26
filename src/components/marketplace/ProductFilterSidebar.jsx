import { useMemo, useState, useEffect } from 'react';
import { SlidersHorizontal, RotateCcw, Star, Check } from 'lucide-react';
import { useDispatch, useSelector } from 'react-redux';
import { selectAllProducts, selectProductFilters } from '../../features/products/productSelectors';
import { setFilter, resetFilters } from '../../features/products/productSlice';
import { categories as staticCategories } from '../../data/categories';
import { brands as staticBrands } from '../../data/brands';
import { categoryApi } from '../../api/categoryApi';
import { brandApi } from '../../api/brandApi';
import { formatCurrency } from '../../utils/formatCurrency';

export const ProductFilterSidebar = ({ isMobile = false, onCloseMobile }) => {
  const dispatch = useDispatch();
  const allProducts = useSelector(selectAllProducts) || [];
  const filters = useSelector(selectProductFilters);

  const [categoriesList, setCategoriesList] = useState(staticCategories);
  const [brandsList, setBrandsList] = useState(staticBrands);

  useEffect(() => {
    const fetchMetadata = async () => {
      try {
        const [catRes, brandRes] = await Promise.allSettled([
          categoryApi.getCategories(),
          brandApi.getBrands(),
        ]);
        if (catRes.status === 'fulfilled') {
          const cList = catRes.value?.categories || catRes.value?.data?.categories || (Array.isArray(catRes.value) ? catRes.value : []);
          if (cList.length > 0) setCategoriesList(cList);
        }
        if (brandRes.status === 'fulfilled') {
          const bList = brandRes.value?.brands || brandRes.value?.data?.brands || (Array.isArray(brandRes.value) ? brandRes.value : []);
          if (bList.length > 0) setBrandsList(bList);
        }
      } catch {
        // Safe fallback
      }
    };
    fetchMetadata();
  }, []);

  const getCategorySlug = (p) => {
    if (!p) return '';
    if (typeof p.category === 'string') return p.category.toLowerCase();
    return (p.category?.slug || p.category?.name || '').toLowerCase();
  };

  const getBrandSlug = (p) => {
    if (!p) return '';
    if (typeof p.brand === 'string') return p.brand.toLowerCase();
    return (p.brand?.slug || p.brand?.name || '').toLowerCase();
  };

  // Compute category product counts
  const categoryCounts = useMemo(() => {
    const counts = { all: allProducts.length };
    categoriesList.forEach((cat) => {
      const target = (cat.slug || cat.name || '').toLowerCase();
      counts[cat.slug || target] = allProducts.filter((p) => {
        const cSlug = getCategorySlug(p);
        return cSlug === target || cSlug === (cat.slug || '').toLowerCase();
      }).length;
    });
    return counts;
  }, [allProducts, categoriesList]);

  // Compute brand product counts
  const brandCounts = useMemo(() => {
    const counts = {};
    brandsList.forEach((b) => {
      const target = (b.slug || b.name || '').toLowerCase();
      counts[b.slug || target] = allProducts.filter((p) => {
        const bSlug = getBrandSlug(p);
        return bSlug === target || bSlug === (b.slug || '').toLowerCase();
      }).length;
    });
    return counts;
  }, [allProducts, brandsList]);

  // Available subcategories for current category
  const activeCategoryObj = useMemo(() => {
    return categoriesList.find((c) => (c.slug || c.name?.toLowerCase()) === filters.category);
  }, [categoriesList, filters.category]);

  const pricePresets = [
    { label: 'All Prices', min: 0, max: 5000 },
    { label: 'Under $300', min: 0, max: 300 },
    { label: '$300 to $700', min: 300, max: 700 },
    { label: '$700 to $1,500', min: 700, max: 1500 },
    { label: '$1,500 & Above', min: 1500, max: 5000 },
  ];

  return (
    <div className={`space-y-6 ${isMobile ? 'p-1' : ''}`}>
      {/* Header with Reset */}
      <div className="flex items-center justify-between pb-3 border-b border-border">
        <div className="flex items-center gap-2">
          <SlidersHorizontal className="w-4 h-4 text-accent" />
          <span className="text-xs font-bold uppercase tracking-wider text-text-main">
            Filters & Refinements
          </span>
        </div>
        <button
          type="button"
          onClick={() => dispatch(resetFilters())}
          className="text-xs text-text-muted hover:text-accent font-medium flex items-center gap-1 transition-colors cursor-pointer"
        >
          <RotateCcw className="w-3 h-3" /> Reset
        </button>
      </div>

      {/* 1. Departments / Categories */}
      <div className="space-y-2.5">
        <label className="text-xs font-bold uppercase tracking-wider text-text-main block">
          Departments
        </label>
        <div className="space-y-1">
          <button
            type="button"
            onClick={() => {
              dispatch(setFilter({ category: 'all', subcategory: 'all' }));
              if (isMobile && onCloseMobile) onCloseMobile();
            }}
            className={`w-full flex items-center justify-between px-2.5 py-1.5 rounded-lg text-xs transition-colors cursor-pointer ${
              filters.category === 'all'
                ? 'bg-primary text-white font-semibold'
                : 'text-text-muted hover:bg-surface-muted hover:text-text-main'
            }`}
          >
            <span>All Departments</span>
            <span className="text-[10px] opacity-75">{categoryCounts.all}</span>
          </button>

          {categoriesList.map((cat) => {
            const catSlug = cat.slug || cat.name?.toLowerCase();
            return (
              <button
                key={cat._id || cat.id || catSlug}
                type="button"
                onClick={() => {
                  dispatch(setFilter({ category: catSlug, subcategory: 'all' }));
                  if (isMobile && onCloseMobile) onCloseMobile();
                }}
                className={`w-full flex items-center justify-between px-2.5 py-1.5 rounded-lg text-xs transition-colors cursor-pointer ${
                  filters.category === catSlug
                    ? 'bg-primary text-white font-semibold'
                    : 'text-text-muted hover:bg-surface-muted hover:text-text-main'
                }`}
              >
                <span>{cat.name}</span>
                <span className="text-[10px] opacity-75">{categoryCounts[catSlug] || categoryCounts[cat.slug] || 0}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* 2. Subcategories (If Category is selected) */}
      {activeCategoryObj && activeCategoryObj.subcategories?.length > 0 && (
        <div className="space-y-2.5 pt-3 border-t border-border/70">
          <label className="text-xs font-bold uppercase tracking-wider text-text-main block">
            {activeCategoryObj.name} Specialization
          </label>
          <div className="space-y-1">
            <button
              type="button"
              onClick={() => dispatch(setFilter({ subcategory: 'all' }))}
              className={`w-full flex items-center justify-between px-2.5 py-1.5 rounded-lg text-xs transition-colors cursor-pointer ${
                filters.subcategory === 'all'
                  ? 'bg-surface-muted text-text-main font-semibold border border-border'
                  : 'text-text-muted hover:bg-surface-muted'
              }`}
            >
              <span>All Subcategories</span>
            </button>
            {activeCategoryObj.subcategories.map((sub) => {
              const subSlug = sub.slug || sub.name?.toLowerCase();
              return (
                <button
                  key={sub._id || sub.id || subSlug}
                  type="button"
                  onClick={() => dispatch(setFilter({ subcategory: subSlug }))}
                  className={`w-full flex items-center justify-between px-2.5 py-1.5 rounded-lg text-xs transition-colors cursor-pointer ${
                    filters.subcategory === subSlug
                      ? 'bg-primary text-white font-semibold'
                      : 'text-text-muted hover:bg-surface-muted hover:text-text-main'
                  }`}
                >
                  <span>{sub.name}</span>
                </button>
              );
            })}
          </div>
        </div>
      )}

      {/* 3. Artisan Ateliers / Brands */}
      <div className="space-y-2.5 pt-3 border-t border-border/70">
        <label className="text-xs font-bold uppercase tracking-wider text-text-main block">
          Master Ateliers
        </label>
        <div className="space-y-1 max-h-48 overflow-y-auto pr-1">
          <button
            type="button"
            onClick={() => dispatch(setFilter({ brand: 'all' }))}
            className={`w-full flex items-center justify-between px-2.5 py-1.5 rounded-lg text-xs transition-colors cursor-pointer ${
              filters.brand === 'all'
                ? 'bg-primary text-white font-semibold'
                : 'text-text-muted hover:bg-surface-muted hover:text-text-main'
            }`}
          >
            <span>All Ateliers</span>
          </button>
          {brandsList.map((b) => {
            const bSlug = b.slug || b.name?.toLowerCase();
            return (
              <button
                key={b._id || b.id || bSlug}
                type="button"
                onClick={() => dispatch(setFilter({ brand: bSlug }))}
                className={`w-full flex items-center justify-between px-2.5 py-1.5 rounded-lg text-xs transition-colors cursor-pointer ${
                  filters.brand === bSlug
                    ? 'bg-primary text-white font-semibold'
                    : 'text-text-muted hover:bg-surface-muted hover:text-text-main'
                }`}
              >
                <span className="truncate">{b.name}</span>
                <span className="text-[10px] opacity-75">{brandCounts[bSlug] || brandCounts[b.slug] || 0}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* 4. Price Range */}
      <div className="space-y-3 pt-3 border-t border-border/70">
        <div className="flex items-center justify-between">
          <label className="text-xs font-bold uppercase tracking-wider text-text-main">
            Price Range
          </label>
          <span className="text-[11px] font-semibold text-text-muted">
            {formatCurrency(filters.minPrice)} – {formatCurrency(filters.maxPrice)}
          </span>
        </div>

        {/* Quick Presets */}
        <div className="grid grid-cols-2 gap-1.5">
          {pricePresets.map((preset) => {
            const isSelected =
              filters.minPrice === preset.min && filters.maxPrice === preset.max;
            return (
              <button
                key={preset.label}
                type="button"
                onClick={() =>
                  dispatch(setFilter({ minPrice: preset.min, maxPrice: preset.max }))
                }
                className={`px-2 py-1 text-[11px] rounded border transition-colors cursor-pointer text-center ${
                  isSelected
                    ? 'bg-primary text-white border-primary font-semibold'
                    : 'bg-surface hover:bg-surface-muted border-border text-text-muted hover:text-text-main'
                }`}
              >
                {preset.label}
              </button>
            );
          })}
        </div>

        {/* Min / Max Inputs */}
        <div className="flex items-center gap-2 pt-1">
          <div className="flex-1">
            <span className="text-[10px] text-text-subtle uppercase">Min ($)</span>
            <input
              type="number"
              min="0"
              max={filters.maxPrice}
              value={filters.minPrice}
              onChange={(e) =>
                dispatch(setFilter({ minPrice: Math.max(0, Number(e.target.value)) }))
              }
              className="w-full px-2.5 py-1.5 text-xs bg-surface border border-border rounded-md focus:outline-none focus:border-primary"
            />
          </div>
          <span className="text-text-subtle pt-4">–</span>
          <div className="flex-1">
            <span className="text-[10px] text-text-subtle uppercase">Max ($)</span>
            <input
              type="number"
              min={filters.minPrice}
              max="10000"
              value={filters.maxPrice}
              onChange={(e) =>
                dispatch(setFilter({ maxPrice: Math.max(Number(e.target.value), filters.minPrice) }))
              }
              className="w-full px-2.5 py-1.5 text-xs bg-surface border border-border rounded-md focus:outline-none focus:border-primary"
            />
          </div>
        </div>
      </div>

      {/* 5. Minimum Patron Rating */}
      <div className="space-y-2 pt-3 border-t border-border/70">
        <label className="text-xs font-bold uppercase tracking-wider text-text-main block">
          Patron Rating
        </label>
        <div className="space-y-1">
          {[0, 4.8, 4.5, 4.0].map((ratingVal) => (
            <button
              key={ratingVal}
              type="button"
              onClick={() => dispatch(setFilter({ rating: ratingVal }))}
              className={`w-full flex items-center justify-between px-2.5 py-1.5 rounded-lg text-xs transition-colors cursor-pointer ${
                filters.rating === ratingVal
                  ? 'bg-primary text-white font-semibold'
                  : 'text-text-muted hover:bg-surface-muted hover:text-text-main'
              }`}
            >
              <div className="flex items-center gap-1.5">
                {ratingVal === 0 ? (
                  <span>All Ratings</span>
                ) : (
                  <>
                    <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
                    <span>{ratingVal.toFixed(1)} & Above</span>
                  </>
                )}
              </div>
            </button>
          ))}
        </div>
      </div>

      {/* 6. Availability & Sale Status */}
      <div className="space-y-2.5 pt-3 border-t border-border/70">
        <label className="text-xs font-bold uppercase tracking-wider text-text-main block">
          Privileges & Stock
        </label>
        <div className="space-y-2">
          {/* In Stock Only */}
          <label className="flex items-center gap-2.5 cursor-pointer text-xs font-medium text-text-main select-none">
            <div
              onClick={() => dispatch(setFilter({ inStockOnly: !filters.inStockOnly }))}
              className={`w-4 h-4 rounded border transition-colors flex items-center justify-center ${
                filters.inStockOnly
                  ? 'bg-primary border-primary text-white'
                  : 'border-border bg-surface'
              }`}
            >
              {filters.inStockOnly && <Check className="w-3 h-3 stroke-[3]" />}
            </div>
            <span>Ready for Immediate Dispatch</span>
          </label>

          {/* Discount / Flash Vault Only */}
          <label className="flex items-center gap-2.5 cursor-pointer text-xs font-medium text-text-main select-none">
            <div
              onClick={() => dispatch(setFilter({ discountOnly: !filters.discountOnly }))}
              className={`w-4 h-4 rounded border transition-colors flex items-center justify-center ${
                filters.discountOnly
                  ? 'bg-accent border-accent text-white'
                  : 'border-border bg-surface'
              }`}
            >
              {filters.discountOnly && <Check className="w-3 h-3 stroke-[3]" />}
            </div>
            <span>Artisan Vault Special Offers</span>
          </label>
        </div>
      </div>
    </div>
  );
};

export default ProductFilterSidebar;
