import { useState } from 'react';
import { Link } from 'react-router-dom';
import { Heart, ShoppingBag, Star, Eye, Check, ShieldCheck } from 'lucide-react';
import { useDispatch, useSelector } from 'react-redux';
import toast from 'react-hot-toast';
import { toggleWishlist } from '../../features/wishlist/wishlistSlice';
import { selectIsInWishlist } from '../../features/wishlist/wishlistSelectors';
import { addToCart } from '../../features/cart/cartSlice';
import { formatCurrency } from '../../utils/formatCurrency';
import Badge from '../common/Badge';
import Modal from '../common/Modal';
import Button from '../common/Button';

export const ProductCard = ({ product, className = '' }) => {
  const dispatch = useDispatch();
  const productId = product?.id || product?._id;
  const isInWishlist = useSelector(selectIsInWishlist(productId));

  const [isQuickViewOpen, setIsQuickViewOpen] = useState(false);
  const [selectedImage, setSelectedImage] = useState(0);
  const [selectedVariants, setSelectedVariants] = useState({});
  const [quantity, setQuantity] = useState(1);
  const [isAdded, setIsAdded] = useState(false);

  if (!product) return null;

  // Discount percentage calculation
  const compareAt = Number(product.compareAtPrice) || 0;
  const price = Number(product.price) || 0;
  const discountPercent =
    compareAt > price && price > 0
      ? Math.round(((compareAt - price) / compareAt) * 100)
      : null;

  const handleWishlistToggle = (e) => {
    e.preventDefault();
    e.stopPropagation();
    dispatch(toggleWishlist(product));
    if (isInWishlist) {
      toast.success(`Removed "${product.name || 'item'}" from your wishlist.`);
    } else {
      toast.success(`Saved "${product.name || 'item'}" to your wishlist.`);
    }
  };

  const handleQuickAdd = (e) => {
    e.preventDefault();
    e.stopPropagation();
    dispatch(addToCart({ product, quantity: 1, selectedVariants }));
    setIsAdded(true);
    toast.success(`Added "${product.name || 'item'}" to your cart.`);
    setTimeout(() => setIsAdded(false), 1800);
  };

  const handleModalAddToCart = () => {
    dispatch(addToCart({ product, quantity, selectedVariants }));
    toast.success(`Added ${quantity} × "${product.name || 'item'}" to your cart.`);
    setIsQuickViewOpen(false);
  };

  const productUrl = `/products/${product.slug || product.id || product._id || ''}`;
  const firstImage = Array.isArray(product.images) && product.images.length > 0
    ? (typeof product.images[0] === 'string' ? product.images[0] : product.images[0]?.url)
    : (product.image || 'https://images.unsplash.com/photo-1544441893-675973e31985?q=80&w=800&auto=format&fit=crop');

  return (
    <>
      <div
        className={`group relative bg-surface rounded-xl border border-border overflow-hidden hover:shadow-card-hover transition-all duration-300 flex flex-col justify-between ${className}`}
      >
        {/* Product Image & Badges Container */}
        <div className="relative aspect-square w-full overflow-hidden bg-surface-muted">
          <Link to={productUrl} className="block w-full h-full">
            <img
              src={firstImage}
              alt={product.name || 'Product'}
              className="w-full h-full object-cover object-center group-hover:scale-105 transition-transform duration-700 ease-out"
              loading="lazy"
            />
            {product.images?.[1] && (
              <img
                src={typeof product.images[1] === 'string' ? product.images[1] : product.images[1]?.url}
                alt={`${product.name || 'Product'} alternate angle`}
                className="absolute inset-0 w-full h-full object-cover object-center opacity-0 group-hover:opacity-100 transition-opacity duration-500 ease-in-out"
                loading="lazy"
              />
            )}
          </Link>

          {/* Status Badges */}
          <div className="absolute top-3 left-3 flex flex-col gap-1.5 z-10 pointer-events-none">
            {product.promotionBadge && (
              <Badge variant="accent" size="xs">
                {product.promotionBadge}
              </Badge>
            )}
            {product.isNew && (
              <Badge variant="primary" size="xs">
                New Arrival
              </Badge>
            )}
            {discountPercent && (
              <Badge variant="accent" size="xs">
                Save {discountPercent}%
              </Badge>
            )}
            {product.isBestSeller && (
              <Badge variant="accent" size="xs">
                Best Seller
              </Badge>
            )}
            {product.stockCount <= 5 && product.stockCount > 0 && (
              <Badge variant="error" size="xs">
                Only {product.stockCount} left
              </Badge>
            )}
          </div>

          {/* Top Right Actions: Wishlist & Quick View */}
          <div className="absolute top-3 right-3 flex flex-col gap-1.5 z-10">
            {/* Wishlist Button */}
            <button
              onClick={handleWishlistToggle}
              aria-label={isInWishlist ? 'Remove from wishlist' : 'Save to wishlist'}
              className="p-2 rounded-full bg-surface/90 backdrop-blur-xs text-text-muted hover:text-accent hover:bg-surface shadow-subtle transition-all cursor-pointer"
            >
              <Heart
                className={`w-4 h-4 transition-colors ${
                  isInWishlist ? 'fill-accent text-accent' : ''
                }`}
              />
            </button>

            {/* Quick View Button */}
            <button
              onClick={(e) => {
                e.preventDefault();
                e.stopPropagation();
                setIsQuickViewOpen(true);
              }}
              aria-label="Quick preview"
              className="p-2 rounded-full bg-surface/90 backdrop-blur-xs text-text-muted hover:text-text-main hover:bg-surface shadow-subtle transition-all opacity-0 group-hover:opacity-100 translate-x-2 group-hover:translate-x-0 duration-200 cursor-pointer hidden sm:flex items-center justify-center"
            >
              <Eye className="w-4 h-4" />
            </button>
          </div>

          {/* Quick Add Overlay on Hover (Desktop) */}
          <div className="absolute inset-x-3 bottom-3 opacity-0 group-hover:opacity-100 transition-all duration-300 z-10 translate-y-2 group-hover:translate-y-0 hidden sm:block">
            <button
              onClick={handleQuickAdd}
              disabled={!product.inStock}
              className={`w-full py-2.5 px-4 text-xs font-semibold rounded-lg shadow-md flex items-center justify-center gap-2 backdrop-blur-xs transition-all cursor-pointer ${
                isAdded
                  ? 'bg-success text-white'
                  : 'bg-primary/95 text-white hover:bg-primary active:scale-[0.98]'
              } disabled:opacity-50 disabled:cursor-not-allowed`}
            >
              {isAdded ? (
                <>
                  <Check className="w-4 h-4" />
                  <span>Added to Cart</span>
                </>
              ) : (
                <>
                  <ShoppingBag className="w-3.5 h-3.5" />
                  <span>{product.inStock ? 'Quick Add' : 'Out of Stock'}</span>
                </>
              )}
            </button>
          </div>
        </div>

        {/* Product Information Body */}
        <div className="p-4 flex flex-col flex-grow justify-between">
          <div>
            {/* Category / Brand & Rating */}
            <div className="flex items-center justify-between text-xs text-text-muted mb-1.5">
              <span className="text-[11px] font-medium tracking-wide uppercase text-text-subtle truncate">
                {product.brand?.name || product.seller?.storeName || 'Artisan Atelier'}
              </span>
              <div className="flex items-center gap-1 text-amber-500 font-medium shrink-0">
                <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
                <span className="text-xs text-text-main font-semibold">
                  {product.rating?.toFixed(1) || '5.0'}
                </span>
                {product.reviewsCount && (
                  <span className="text-[10px] text-text-subtle">
                    ({product.reviewsCount})
                  </span>
                )}
              </div>
            </div>

            {/* Title */}
            <Link
              to={productUrl}
              className="block font-medium text-sm text-text-main hover:text-accent transition-colors line-clamp-1 mb-1 font-serif tracking-tight"
            >
              {product.name || 'Artisan Creation'}
            </Link>

            {/* Seller provenance subtitle */}
            <p className="text-[11px] text-text-muted line-clamp-1 mb-3">
              By {product.seller?.storeName || 'Verified Independent Maker'}
            </p>
          </div>

          {/* Pricing & Mobile Quick Add */}
          <div className="flex items-center justify-between pt-2.5 border-t border-border/60 mt-auto">
            <div className="flex items-baseline gap-2">
              <span className="font-bold text-sm sm:text-base text-text-main">
                {formatCurrency(product.price)}
              </span>
              {product.compareAtPrice && product.compareAtPrice > product.price && (
                <span className="text-xs text-text-subtle line-through">
                  {formatCurrency(product.compareAtPrice)}
                </span>
              )}
            </div>

            {/* Mobile Touch Quick Add Button */}
            <button
              onClick={handleQuickAdd}
              disabled={!product.inStock}
              aria-label="Add to cart"
              className={`sm:hidden p-2 rounded-lg transition-colors cursor-pointer ${
                isAdded
                  ? 'bg-success text-white'
                  : 'bg-surface-muted hover:bg-surface-hover text-text-main border border-border'
              }`}
            >
              {isAdded ? <Check className="w-4 h-4" /> : <ShoppingBag className="w-4 h-4" />}
            </button>
          </div>
        </div>
      </div>

      {/* Quick View Modal */}
      <Modal
        isOpen={isQuickViewOpen}
        onClose={() => setIsQuickViewOpen(false)}
        size="lg"
        title="Artisan Creation Preview"
      >
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-start">
          {/* Gallery */}
          <div className="space-y-3">
            <div className="aspect-square rounded-xl overflow-hidden bg-surface-muted border border-border">
              <img
                src={product.images?.[selectedImage] || product.images?.[0]}
                alt={product.name}
                className="w-full h-full object-cover object-center"
              />
            </div>

            {product.images?.length > 1 && (
              <div className="flex items-center gap-2 overflow-x-auto pb-1">
                {product.images.map((img, idx) => (
                  <button
                    key={idx}
                    onClick={() => setSelectedImage(idx)}
                    className={`w-16 h-16 rounded-lg overflow-hidden border-2 transition-all shrink-0 cursor-pointer ${
                      selectedImage === idx
                        ? 'border-primary shadow-xs'
                        : 'border-border opacity-70 hover:opacity-100'
                    }`}
                  >
                    <img src={img} alt="" className="w-full h-full object-cover" />
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Details & Selectors */}
          <div className="space-y-4">
            <div>
              <span className="text-xs font-semibold text-accent uppercase tracking-wider block mb-1">
                {product.category?.name || 'Curated Goods'}
              </span>
              <h2 className="font-serif text-xl font-bold text-text-main leading-snug">
                {product.name}
              </h2>
              <p className="text-xs text-text-muted mt-1">
                Crafted by <strong className="text-text-main">{product.seller?.storeName}</strong>
              </p>
            </div>

            {/* Price & Rating */}
            <div className="flex items-baseline justify-between pb-3 border-b border-border">
              <div className="flex items-baseline gap-2">
                <span className="text-xl font-bold text-text-main font-serif">
                  {formatCurrency(product.price)}
                </span>
                {product.compareAtPrice && product.compareAtPrice > product.price && (
                  <span className="text-sm text-text-subtle line-through">
                    {formatCurrency(product.compareAtPrice)}
                  </span>
                )}
              </div>
              <div className="flex items-center gap-1 text-amber-500 text-xs font-semibold">
                <Star className="w-4 h-4 fill-amber-400 text-amber-400" />
                <span>{product.rating?.toFixed(1) || '5.0'}</span>
                <span className="text-text-subtle">({product.reviewsCount || 12} reviews)</span>
              </div>
            </div>

            {/* Description */}
            <p className="text-xs text-text-muted leading-relaxed line-clamp-3">
              {product.description}
            </p>

            {/* Variants if any */}
            {product.variants?.map((v) => (
              <div key={v.id} className="space-y-1.5">
                <span className="text-xs font-semibold text-text-main">{v.name}:</span>
                <div className="flex flex-wrap gap-2">
                  {v.options.map((opt) => {
                    const isSelected = selectedVariants[v.name] === opt;
                    return (
                      <button
                        key={opt}
                        type="button"
                        onClick={() =>
                          setSelectedVariants((prev) => ({ ...prev, [v.name]: opt }))
                        }
                        className={`px-3 py-1.5 text-xs rounded-lg border font-medium transition-all cursor-pointer ${
                          isSelected
                            ? 'bg-primary text-white border-primary shadow-xs'
                            : 'bg-surface hover:bg-surface-muted border-border text-text-main'
                        }`}
                      >
                        {opt}
                      </button>
                    );
                  })}
                </div>
              </div>
            ))}

            {/* Quantity Selector */}
            <div className="flex items-center gap-3 pt-2">
              <span className="text-xs font-semibold text-text-main">Quantity:</span>
              <div className="flex items-center border border-border rounded-lg bg-surface">
                <button
                  type="button"
                  onClick={() => setQuantity((q) => Math.max(1, q - 1))}
                  className="px-3 py-1.5 text-xs text-text-muted hover:text-text-main hover:bg-surface-muted rounded-l-lg transition-colors cursor-pointer"
                >
                  -
                </button>
                <span className="px-3 py-1.5 text-xs font-bold text-text-main min-w-[32px] text-center">
                  {quantity}
                </span>
                <button
                  type="button"
                  onClick={() => setQuantity((q) => Math.min(product.stockCount || 10, q + 1))}
                  className="px-3 py-1.5 text-xs text-text-muted hover:text-text-main hover:bg-surface-muted rounded-r-lg transition-colors cursor-pointer"
                >
                  +
                </button>
              </div>
              <span className="text-xs text-text-subtle">
                {product.stockCount > 0 ? `${product.stockCount} in stock` : 'Out of stock'}
              </span>
            </div>

            {/* Actions */}
            <div className="pt-3 space-y-2">
              <Button
                variant="primary"
                size="lg"
                fullWidth
                onClick={handleModalAddToCart}
                disabled={!product.inStock}
                leftIcon={ShoppingBag}
              >
                Add {quantity} to Bag • {formatCurrency(product.price * quantity)}
              </Button>

              <div className="flex items-center justify-between text-xs text-text-muted pt-1">
                <span className="flex items-center gap-1 text-[11px]">
                  <ShieldCheck className="w-3.5 h-3.5 text-accent" /> Verified Artisan Provenance
                </span>
                <Link
                  to={`/products/${product.id}`}
                  onClick={() => setIsQuickViewOpen(false)}
                  className="text-xs font-semibold text-text-main hover:text-accent hover:underline"
                >
                  View Full Specs →
                </Link>
              </div>
            </div>
          </div>
        </div>
      </Modal>
    </>
  );
};

export default ProductCard;
