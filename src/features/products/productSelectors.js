export const selectAllProducts = (state) => state.products.items;
export const selectSelectedProduct = (state) => state.products.selectedProduct;
export const selectProductFilters = (state) => state.products.filters;
export const selectProductsLoading = (state) => state.products.loading;
export const selectProductsError = (state) => state.products.error;
export const selectPagination = (state) => state.products.pagination;
export const selectRecentSearches = (state) => state.products.recentSearches || [];
export const selectPopularSearches = (state) => state.products.popularSearches || [];

export const selectFeaturedProducts = (state) =>
  state.products.items.filter((item) => item.isFeatured);

export const selectNewArrivals = (state) =>
  state.products.items.filter((item) => item.isNew);

export const selectBestSellers = (state) =>
  state.products.items.filter((item) => item.isBestSeller);

export const selectFlashDeals = (state) =>
  state.products.items.filter(
    (item) =>
      item.isFlashDeal ||
      (item.compareAtPrice && item.compareAtPrice > item.price * 1.15)
  );

// Selector to filter and sort all products
export const selectFilteredAndSortedProducts = (state) => {
  const items = state.products.items || [];
  const filters = state.products.filters || {};

  const filtered = items.filter((product) => {
    // Category
    if (filters.category && filters.category !== 'all') {
      if (product.category?.slug !== filters.category && product.category?.id !== filters.category)
        return false;
    }

    // Subcategory
    if (filters.subcategory && filters.subcategory !== 'all') {
      if (
        product.subcategory?.slug !== filters.subcategory &&
        product.subcategory?.id !== filters.subcategory
      )
        return false;
    }

    // Brand
    if (filters.brand && filters.brand !== 'all') {
      if (product.brand?.slug !== filters.brand && product.brand?.id !== filters.brand && product.brand !== filters.brand)
        return false;
    }

    // Seller / Atelier
    if (filters.seller && filters.seller !== 'all') {
      const sellerId = product.seller?.id || product.seller?._id || product.seller;
      if (sellerId !== filters.seller && product.seller?.slug !== filters.seller)
        return false;
    }

    // Price range
    if (filters.minPrice !== undefined && product.price < Number(filters.minPrice)) {
      return false;
    }
    if (filters.maxPrice !== undefined && product.price > Number(filters.maxPrice)) {
      return false;
    }

    // Minimum Rating
    if (filters.rating && filters.rating > 0) {
      if ((product.rating || 0) < Number(filters.rating)) return false;
    }

    // Availability / In Stock Only
    if (filters.inStockOnly) {
      if (!product.inStock && product.stock <= 0 && product.stockCount <= 0) return false;
    }

    // Discount / Sale Only
    if (filters.discountOnly) {
      if (!product.compareAtPrice || product.compareAtPrice <= product.price) return false;
    }

    // Only Featured
    if (filters.onlyFeatured && !product.isFeatured) {
      return false;
    }

    // Only New
    if (filters.onlyNew && !product.isNew) {
      return false;
    }

    // Only Best Seller
    if (filters.onlyBestSeller && !product.isBestSeller) {
      return false;
    }

    // Search Query (Name, Description, Brand, Category, Features, SKU)
    if (filters.searchQuery && filters.searchQuery.trim()) {
      const q = filters.searchQuery.toLowerCase().trim();
      const inName = product.name?.toLowerCase().includes(q);
      const inDesc = product.description?.toLowerCase().includes(q);
      const inBrand = (typeof product.brand === 'string' ? product.brand : product.brand?.name)
        ?.toLowerCase()
        .includes(q);
      const inCat = product.category?.name?.toLowerCase().includes(q);
      const inSubcat = product.subcategory?.name?.toLowerCase().includes(q);
      const inSeller = product.seller?.storeName?.toLowerCase().includes(q);
      const inSku = product.sku?.toLowerCase().includes(q);
      const inFeatures = product.features?.some((f) => f.toLowerCase().includes(q));

      if (
        !inName &&
        !inDesc &&
        !inBrand &&
        !inCat &&
        !inSubcat &&
        !inSeller &&
        !inSku &&
        !inFeatures
      ) {
        return false;
      }
    }

    return true;
  });

  // Sorting
  const sorted = [...filtered].sort((a, b) => {
    switch (filters.sortBy) {
      case 'price_asc':
        return a.price - b.price;
      case 'price_desc':
        return b.price - a.price;
      case 'newest':
        return (b.isNew ? 1 : 0) - (a.isNew ? 1 : 0);
      case 'rating':
        return (b.rating || 0) - (a.rating || 0);
      case 'popular':
        return (b.reviewsCount || b.salesCount || 0) - (a.reviewsCount || a.salesCount || 0);
      case 'discount': {
        const discountA =
          a.compareAtPrice && a.compareAtPrice > a.price
            ? (a.compareAtPrice - a.price) / a.compareAtPrice
            : 0;
        const discountB =
          b.compareAtPrice && b.compareAtPrice > b.price
            ? (b.compareAtPrice - b.price) / b.compareAtPrice
            : 0;
        return discountB - discountA;
      }
      case 'featured':
      default:
        return (b.isFeatured ? 1 : 0) - (a.isFeatured ? 1 : 0);
    }
  });

  return sorted;
};

// Selector with pagination calculation
export const selectPaginatedProducts = (state) => {
  const allFiltered = selectFilteredAndSortedProducts(state);
  const pagination = state.products.pagination || { page: 1, limit: 12 };
  const page = pagination.page || 1;
  const limit = pagination.limit || 12;

  const total = allFiltered.length;
  const totalPages = Math.ceil(total / limit) || 1;
  const startIndex = (page - 1) * limit;
  const endIndex = Math.min(startIndex + limit, total);
  const paginatedItems = allFiltered.slice(startIndex, endIndex);

  return {
    items: paginatedItems,
    total,
    totalPages,
    currentPage: page,
    limit,
    startIndex: total > 0 ? startIndex + 1 : 0,
    endIndex,
  };
};
