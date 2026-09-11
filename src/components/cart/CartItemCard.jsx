import { Link } from 'react-router-dom';
import { Trash2, Heart, AlertTriangle, Check, Shield } from 'lucide-react';
import { formatCurrency } from '../../utils/formatCurrency';

export const CartItemCard = ({
  item,
  onUpdateQuantity,
  onRemove,
  onSaveToWishlist,
}) => {
  const { product, quantity, price, originalPrice, selectedVariant } = item;
  const maxStock = product?.stock ?? 10;
  const isOutOfStock = maxStock <= 0;
  const isLowStock = maxStock > 0 && maxStock <= 3;
  const isMaxReached = quantity >= maxStock;

  const discountPercent =
    originalPrice && originalPrice > price
      ? Math.round(((originalPrice - price) / originalPrice) * 100)
      : 0;

  const itemSubtotal = (Number(price) || 0) * (Number(quantity) || 1);

  return (
    <div
      className={`p-4 sm:p-5 rounded-2xl border transition-all ${
        isOutOfStock
          ? 'bg-rose-50/40 border-rose-200'
          : 'bg-surface border-border hover:border-border-strong shadow-xs'
      }`}
    >
      <div className="flex flex-col sm:flex-row gap-4 sm:gap-5 items-start">
        {/* Product Image */}
        <Link
          to={`/products/${product?.slug || product?.id}`}
          className="relative shrink-0 w-24 h-24 sm:w-28 sm:h-28 rounded-xl overflow-hidden bg-surface-muted border border-border group"
        >
          <img
            src={product?.images?.[0] || 'https://images.unsplash.com/photo-1522335789203-aabd1fc54bc9?q=80&w=400&auto=format&fit=crop'}
            alt={product?.name}
            className="w-full h-full object-cover object-center group-hover:scale-105 transition-transform duration-500"
          />
          {discountPercent > 0 && (
            <span className="absolute top-1.5 left-1.5 bg-rose-600 text-white text-[10px] font-bold px-1.5 py-0.5 rounded shadow-xs">
              -{discountPercent}%
            </span>
          )}
        </Link>

        {/* Product Meta & Controls */}
        <div className="flex-1 min-w-0 flex flex-col justify-between self-stretch">
          <div>
            {/* Brand & Stock Header */}
            <div className="flex items-center justify-between gap-2 mb-1">
              <span className="text-[11px] font-bold text-accent uppercase tracking-wider">
                {product?.brand || 'Zareen Masterpiece'}
              </span>

              {/* Stock Status Badge */}
              {isOutOfStock ? (
                <span className="inline-flex items-center gap-1 text-[11px] font-bold text-rose-600 bg-rose-100/80 px-2 py-0.5 rounded-md">
                  <AlertTriangle className="w-3 h-3" /> Out of Stock
                </span>
              ) : isLowStock ? (
                <span className="inline-flex items-center gap-1 text-[11px] font-semibold text-amber-700 bg-amber-100/80 px-2 py-0.5 rounded-md">
                  <AlertTriangle className="w-3 h-3" /> Only {maxStock} remaining
                </span>
              ) : (
                <span className="inline-flex items-center gap-1 text-[11px] font-medium text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-md">
                  <Check className="w-3 h-3 text-emerald-600" /> In Atelier
                </span>
              )}
            </div>

            {/* Title */}
            <Link
              to={`/products/${product?.slug || product?.id}`}
              className="text-sm sm:text-base font-serif font-bold text-text-main hover:text-accent transition-colors line-clamp-1 block"
            >
              {product?.name}
            </Link>

            {/* Variant Attributes */}
            {selectedVariant && Object.keys(selectedVariant).length > 0 && (
              <div className="flex flex-wrap gap-1.5 mt-1.5">
                {Object.entries(selectedVariant).map(([key, val]) => (
                  <span
                    key={key}
                    className="inline-flex items-center text-[11px] text-text-muted bg-surface-muted border border-border px-2 py-0.5 rounded-md capitalize"
                  >
                    <strong className="font-semibold text-text-main mr-1">{key}:</strong> {val}
                  </span>
                ))}
              </div>
            )}
          </div>

          {/* Pricing, Quantity & Actions Row */}
          <div className="flex flex-wrap items-center justify-between gap-3 pt-3 mt-3 border-t border-border/60">
            {/* Quantity Controls */}
            <div className="flex items-center gap-2">
              <div className="flex items-center border border-border rounded-xl bg-surface-muted overflow-hidden shadow-xs">
                <button
                  type="button"
                  onClick={() => onUpdateQuantity(item.id, quantity - 1)}
                  disabled={quantity <= 1}
                  className="w-8 h-8 flex items-center justify-center text-xs font-bold text-text-main hover:bg-surface disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
                  aria-label="Decrease quantity"
                >
                  -
                </button>
                <span className="w-9 text-center text-xs font-bold text-text-main select-none">
                  {quantity}
                </span>
                <button
                  type="button"
                  onClick={() => onUpdateQuantity(item.id, quantity + 1)}
                  disabled={isMaxReached || isOutOfStock}
                  className="w-8 h-8 flex items-center justify-center text-xs font-bold text-text-main hover:bg-surface disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
                  aria-label="Increase quantity"
                >
                  +
                </button>
              </div>

              {isMaxReached && !isOutOfStock && (
                <span className="text-[10px] text-text-subtle">Max stock</span>
              )}
            </div>

            {/* Price Breakdown */}
            <div className="flex items-baseline gap-2">
              <span className="text-base sm:text-lg font-serif font-bold text-text-main">
                {formatCurrency(itemSubtotal)}
              </span>
              {quantity > 1 && (
                <span className="text-[11px] text-text-muted">
                  ({formatCurrency(price)} each)
                </span>
              )}
              {originalPrice && originalPrice > price && (
                <span className="text-xs text-text-subtle line-through">
                  {formatCurrency(originalPrice * quantity)}
                </span>
              )}
            </div>

            {/* Quick Actions (Wishlist & Remove) */}
            <div className="flex items-center gap-1 sm:gap-2">
              <button
                type="button"
                onClick={() => onSaveToWishlist(item)}
                className="inline-flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg text-xs font-semibold text-text-muted hover:text-accent hover:bg-accent-light/50 transition-colors cursor-pointer"
                title="Move to Wishlist"
              >
                <Heart className="w-3.5 h-3.5" />
                <span className="hidden sm:inline">Save</span>
              </button>

              <button
                type="button"
                onClick={() => onRemove(item.id)}
                className="inline-flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg text-xs font-semibold text-text-muted hover:text-rose-600 hover:bg-rose-50 transition-colors cursor-pointer"
                title="Remove item"
              >
                <Trash2 className="w-3.5 h-3.5" />
                <span className="hidden sm:inline">Remove</span>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CartItemCard;
