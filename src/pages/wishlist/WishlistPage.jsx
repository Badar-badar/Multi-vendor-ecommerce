import { Link } from 'react-router-dom';
import { Heart, ShoppingBag, Trash2, ArrowRight, ArrowLeft, CheckCircle2, AlertTriangle } from 'lucide-react';
import useWishlist from '../../hooks/useWishlist';
import RecentlyViewedSection from '../../components/common/RecentlyViewedSection';
import Button from '../../components/common/Button';
import { formatCurrency } from '../../utils/formatCurrency';

export const WishlistPage = () => {
  const {
    items,
    count,
    loading,
    removeItem,
    moveToCart,
    moveAllToCart,
    emptyWishlist,
  } = useWishlist();

  if (loading) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="h-8 w-64 bg-surface-muted rounded-lg animate-pulse mb-8" />
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {[1, 2, 3, 4].map((n) => (
            <div key={n} className="h-80 bg-surface-muted rounded-2xl animate-pulse" />
          ))}
        </div>
      </div>
    );
  }

  if (items.length === 0) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="max-w-md mx-auto text-center space-y-6 bg-surface p-8 sm:p-12 rounded-3xl border border-border shadow-subtle">
          <div className="w-16 h-16 rounded-2xl bg-rose-50 text-rose-500 border border-rose-200 flex items-center justify-center mx-auto shadow-xs">
            <Heart className="w-8 h-8 fill-rose-50" />
          </div>

          <div className="space-y-2">
            <h1 className="font-serif text-2xl sm:text-3xl font-bold text-text-main">
              Your Wishlist is Empty
            </h1>
            <p className="text-xs text-text-muted leading-relaxed">
              Curate your private archive of master-crafted pieces and revisit them whenever inspiration strikes.
            </p>
          </div>

          <div className="pt-2">
            <Link to="/products">
              <Button variant="primary" size="lg" fullWidth rightIcon={ArrowRight}>
                Discover Artisan Curations
              </Button>
            </Link>
          </div>
        </div>

        {/* Recently viewed section */}
        <RecentlyViewedSection className="mt-16" />
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      {/* Header bar */}
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-8 pb-4 border-b border-border">
        <div>
          <div className="flex items-center gap-2 text-xs text-text-muted mb-1">
            <Link to="/" className="hover:text-text-main">Home</Link>
            <span>/</span>
            <span className="text-text-main font-semibold">Wishlist</span>
          </div>
          <h1 className="font-serif text-2xl sm:text-3xl font-bold text-text-main">
            Saved Curations
          </h1>
          <p className="text-xs text-text-muted mt-1">
            {count} {count === 1 ? 'creation' : 'creations'} archived across your sovereign registry.
          </p>
        </div>

        {/* Actions */}
        <div className="flex flex-wrap items-center gap-3">
          <Button
            variant="primary"
            size="md"
            onClick={moveAllToCart}
            leftIcon={ShoppingBag}
          >
            Move All to Bag
          </Button>

          <button
            type="button"
            onClick={emptyWishlist}
            className="inline-flex items-center gap-1.5 text-xs font-semibold text-text-muted hover:text-rose-600 px-3 py-2 rounded-xl hover:bg-rose-50 transition-colors cursor-pointer"
          >
            <Trash2 className="w-3.5 h-3.5" />
            <span>Clear All</span>
          </button>
        </div>
      </div>

      {/* Wishlist Items Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
        {items.map((product) => {
          const discount =
            product.originalPrice && product.originalPrice > product.price
              ? Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100)
              : 0;

          const isOutOfStock = (product.stock ?? 10) <= 0;
          const isLowStock = (product.stock ?? 10) > 0 && (product.stock ?? 10) <= 3;

          return (
            <div
              key={product.id}
              className="group bg-surface rounded-2xl border border-border hover:border-border-strong p-4 flex flex-col justify-between shadow-xs transition-all hover:shadow-subtle"
            >
              <div>
                {/* Image Container */}
                <div className="relative aspect-square rounded-xl overflow-hidden bg-surface-muted border border-border mb-3.5">
                  <Link to={`/products/${product.slug || product.id}`}>
                    <img
                      src={product.images?.[0] || 'https://images.unsplash.com/photo-1522335789203-aabd1fc54bc9?q=80&w=600&auto=format&fit=crop'}
                      alt={product.name}
                      className="w-full h-full object-cover object-center group-hover:scale-105 transition-transform duration-500"
                    />
                  </Link>

                  {/* Remove floating button */}
                  <button
                    type="button"
                    onClick={() => removeItem(product.id)}
                    className="absolute top-2 right-2 w-8 h-8 rounded-full bg-surface/90 hover:bg-rose-50 text-text-muted hover:text-rose-600 backdrop-blur-sm border border-border flex items-center justify-center transition-colors shadow-xs cursor-pointer"
                    title="Remove from wishlist"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>

                  {/* Discount Badge */}
                  {discount > 0 && (
                    <span className="absolute top-2 left-2 bg-rose-600 text-white text-[10px] font-bold px-2 py-0.5 rounded shadow-xs">
                      -{discount}%
                    </span>
                  )}
                </div>

                {/* Meta details */}
                <div className="space-y-1.5">
                  <div className="flex items-center justify-between text-[11px]">
                    <span className="font-bold text-accent uppercase tracking-wider">
                      {product.brand || 'Zareen Masterpiece'}
                    </span>

                    {/* Stock status */}
                    {isOutOfStock ? (
                      <span className="inline-flex items-center gap-1 text-[10px] font-bold text-rose-600">
                        <AlertTriangle className="w-3 h-3" /> Out of Stock
                      </span>
                    ) : isLowStock ? (
                      <span className="inline-flex items-center gap-1 text-[10px] font-semibold text-amber-700">
                        <AlertTriangle className="w-3 h-3" /> Only {product.stock} left
                      </span>
                    ) : (
                      <span className="inline-flex items-center gap-1 text-[10px] text-emerald-700">
                        <CheckCircle2 className="w-3 h-3 text-emerald-600" /> In Atelier
                      </span>
                    )}
                  </div>

                  <Link
                    to={`/products/${product.slug || product.id}`}
                    className="font-serif font-bold text-sm text-text-main group-hover:text-accent transition-colors line-clamp-1 block"
                  >
                    {product.name}
                  </Link>

                  {/* Price */}
                  <div className="flex items-baseline gap-2 pt-1">
                    <span className="font-serif font-bold text-base text-text-main">
                      {formatCurrency(product.price)}
                    </span>
                    {product.originalPrice && product.originalPrice > product.price && (
                      <span className="text-xs text-text-subtle line-through">
                        {formatCurrency(product.originalPrice)}
                      </span>
                    )}
                  </div>
                </div>
              </div>

              {/* Add to Bag CTA */}
              <div className="pt-4 mt-2">
                <Button
                  variant="primary"
                  size="md"
                  fullWidth
                  disabled={isOutOfStock}
                  onClick={() => moveToCart(product)}
                  leftIcon={ShoppingBag}
                >
                  {isOutOfStock ? 'Currently Unavailable' : 'Move to Bag'}
                </Button>
              </div>
            </div>
          );
        })}
      </div>

      {/* Recently Viewed Curations Section */}
      <RecentlyViewedSection className="mt-16" />
    </div>
  );
};

export default WishlistPage;
