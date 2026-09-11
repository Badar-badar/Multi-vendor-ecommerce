import { useState, useEffect, useMemo } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import {
  Heart,
  ShoppingBag,
  ShieldCheck,
  Truck,
  RefreshCw,
  Star,
  Store,
  Share2,
  Sparkles,
  Award,
  ChevronRight,
} from 'lucide-react';
import toast from 'react-hot-toast';
import { selectAllProducts } from '../../features/products/productSelectors';
import { addToCart } from '../../features/cart/cartSlice';
import { toggleWishlist } from '../../features/wishlist/wishlistSlice';
import { selectIsInWishlist } from '../../features/wishlist/wishlistSelectors';
import { formatCurrency } from '../../utils/formatCurrency';
import useProductVariants, { swatchColorMap } from '../../hooks/useProductVariants';
import ProductImageGallery from '../../components/product/ProductImageGallery';
import ProductReviewsSection from '../../components/product/ProductReviewsSection';
import ProductCard from '../../components/product/ProductCard';
import RecentlyViewedSection from '../../components/common/RecentlyViewedSection';
import Button from '../../components/common/Button';
import Badge from '../../components/common/Badge';
import EmptyState from '../../components/common/EmptyState';

export const ProductDetailPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const allProducts = useSelector(selectAllProducts);

  // Find product by id or slug
  const product = allProducts.find((p) => p.id === id || p.slug === id);
  const isInWishlist = useSelector(selectIsInWishlist(product?.id));

  // Dynamic Variants Hook
  const {
    selectedVariants,
    selectVariant,
    adjustedPrice,
    adjustedComparePrice,
    stockAvailable,
  } = useProductVariants(product);

  const [quantity, setQuantity] = useState(1);
  const [activeTab, setActiveTab] = useState('description');
  const [isAdded, setIsAdded] = useState(false);

  // Track Recently Viewed via Redux
  useEffect(() => {
    if (!product) return;
    dispatch({
      type: 'recentlyViewed/addRecentlyViewed',
      payload: product,
    });

    // Scroll to top
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, [dispatch, product]);

  // Related products from same category
  const relatedProducts = useMemo(() => {
    if (!product) return [];
    return allProducts
      .filter((p) => p.id !== product.id && p.category?.slug === product.category?.slug)
      .slice(0, 4);
  }, [allProducts, product]);

  if (!product) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-16">
        <EmptyState
          variant="products"
          title="Creation Not Found"
          description="The artisanal piece you are seeking may have been acquired, retired, or temporarily sequestered."
          actionLabel="Return to Market Collections"
          onAction={() => navigate('/products')}
        />
        <RecentlyViewedSection className="mt-12" />
      </div>
    );
  }

  // Calculate discount percentage
  const discountPercent =
    adjustedComparePrice && adjustedComparePrice > adjustedPrice
      ? Math.round(((adjustedComparePrice - adjustedPrice) / adjustedComparePrice) * 100)
      : null;

  const handleAddToCart = () => {
    dispatch(
      addToCart({
        product,
        quantity,
        selectedVariants,
      })
    );
    setIsAdded(true);
    toast.success(`Added ${quantity} × "${product.name}" to your shopping bag.`);
    setTimeout(() => setIsAdded(false), 2000);
  };

  const handleBuyNow = () => {
    dispatch(
      addToCart({
        product,
        quantity,
        selectedVariants,
      })
    );
    navigate('/checkout');
  };

  const handleWishlistToggle = () => {
    dispatch(toggleWishlist(product));
    if (isInWishlist) {
      toast.success(`Removed "${product.name}" from your wishlist.`);
    } else {
      toast.success(`Saved "${product.name}" to your private wishlist.`);
    }
  };

  const handleShare = () => {
    navigator.clipboard?.writeText(window.location.href);
    toast.success('Creation link copied to clipboard.');
  };

  const scrollToReviews = () => {
    const el = document.getElementById('reviews-section');
    if (el) el.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <div className="min-h-screen bg-background text-text-main pb-24">
      {/* Breadcrumb Navigation Bar */}
      <div className="border-b border-border/80 bg-surface">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3.5">
          <nav className="text-xs text-text-muted flex items-center gap-2 overflow-x-auto whitespace-nowrap">
            <Link to="/" className="hover:text-text-main transition-colors">
              Home
            </Link>
            <ChevronRight className="w-3 h-3 text-text-subtle shrink-0" />
            <Link to="/products" className="hover:text-text-main transition-colors">
              Collections
            </Link>
            <ChevronRight className="w-3 h-3 text-text-subtle shrink-0" />
            <Link
              to={`/products?category=${product.category?.slug}`}
              className="hover:text-text-main transition-colors"
            >
              {product.category?.name || 'Department'}
            </Link>
            <ChevronRight className="w-3 h-3 text-text-subtle shrink-0" />
            <span className="text-text-main font-semibold truncate max-w-xs">{product.name}</span>
          </nav>
        </div>
      </div>

      {/* Main Product Showcase Section */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-8 sm:pt-12">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-14 items-start">
          {/* Left Column: Image Gallery (6 Cols) */}
          <div className="lg:col-span-6 lg:sticky lg:top-24">
            <ProductImageGallery images={product.images} productName={product.name} />
          </div>

          {/* Right Column: Information, Atelier Box, Variants & Buying Controls (6 Cols) */}
          <div className="lg:col-span-6 space-y-6">
            {/* Header: Badges, Brand, Title, Rating */}
            <div className="space-y-3 pb-6 border-b border-border/80">
              <div className="flex items-center justify-between gap-4">
                <Link
                  to={`/products?brand=${product.brand?.slug || product.seller?.storeName}`}
                  className="inline-flex items-center gap-1.5 text-xs font-bold uppercase tracking-widest text-accent hover:underline"
                >
                  <Sparkles className="w-3.5 h-3.5" />
                  <span>{product.brand?.name || 'Sovereign Atelier'}</span>
                </Link>

                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={handleShare}
                    className="p-2 rounded-lg bg-surface border border-border text-text-muted hover:text-text-main hover:bg-surface-muted transition-colors cursor-pointer"
                    title="Share Creation"
                  >
                    <Share2 className="w-4 h-4" />
                  </button>
                  <button
                    type="button"
                    onClick={handleWishlistToggle}
                    className={`p-2 rounded-lg border transition-colors cursor-pointer ${
                      isInWishlist
                        ? 'bg-rose-50 border-rose-200 text-rose-600'
                        : 'bg-surface border-border text-text-muted hover:text-rose-500 hover:bg-surface-muted'
                    }`}
                    title={isInWishlist ? 'In Wishlist' : 'Add to Wishlist'}
                  >
                    <Heart className={`w-4 h-4 ${isInWishlist ? 'fill-rose-500' : ''}`} />
                  </button>
                </div>
              </div>

              <h1 className="font-serif text-3xl sm:text-4xl font-bold text-text-main tracking-tight leading-tight">
                {product.name}
              </h1>

              {/* Rating & Reviews Jump */}
              <div className="flex items-center gap-3 pt-1">
                <button
                  type="button"
                  onClick={scrollToReviews}
                  className="flex items-center gap-1 text-amber-500 hover:opacity-80 transition-opacity cursor-pointer"
                >
                  <div className="flex items-center">
                    {[...Array(5)].map((_, i) => (
                      <Star
                        key={i}
                        className={`w-4 h-4 ${
                          i < Math.round(product.rating || 5)
                            ? 'fill-amber-400 text-amber-400'
                            : 'text-border'
                        }`}
                      />
                    ))}
                  </div>
                  <span className="text-xs font-bold text-text-main ml-1">
                    {product.rating?.toFixed(1) || '5.0'}
                  </span>
                  <span className="text-xs text-text-muted underline ml-1">
                    ({product.reviewsCount || 24} patron reviews)
                  </span>
                </button>
                <span className="text-text-subtle">•</span>
                <span className="text-xs text-text-muted font-mono">SKU: {product.sku || 'ZRN-001'}</span>
              </div>
            </div>

            {/* Pricing & Stock Status */}
            <div className="space-y-3 pb-6 border-b border-border/80">
              <div className="flex items-baseline gap-3">
                <span className="font-serif text-3xl sm:text-4xl font-bold text-text-main">
                  {formatCurrency(adjustedPrice)}
                </span>
                {adjustedComparePrice && adjustedComparePrice > adjustedPrice && (
                  <span className="text-base text-text-subtle line-through">
                    {formatCurrency(adjustedComparePrice)}
                  </span>
                )}
                {discountPercent && (
                  <Badge variant="accent" size="sm">
                    Save {discountPercent}%
                  </Badge>
                )}
              </div>

              {/* Stock status readout */}
              <div className="flex items-center gap-2">
                <span className="w-2.5 h-2.5 rounded-full bg-success animate-pulse" />
                <span className="text-xs font-semibold text-success-dark">
                  {stockAvailable <= 5
                    ? `Limited Allocation • Only ${stockAvailable} pieces remaining`
                    : 'Certified Available • Ready for Immediate Insured Dispatch'}
                </span>
              </div>
            </div>

            {/* Seller / Master Atelier Card */}
            <div className="p-4 rounded-xl bg-surface border border-border shadow-subtle flex items-center justify-between gap-4">
              <div className="flex items-center gap-3">
                <div className="w-11 h-11 rounded-xl bg-primary flex items-center justify-center text-white font-serif font-bold text-lg shadow-xs">
                  {product.seller?.storeName?.[0] || 'A'}
                </div>
                <div>
                  <div className="flex items-center gap-1.5">
                    <h4 className="text-xs font-bold text-text-main">
                      {product.seller?.storeName || 'Verified Independent Atelier'}
                    </h4>
                    <ShieldCheck className="w-3.5 h-3.5 text-accent" />
                  </div>
                  <p className="text-[11px] text-text-muted mt-0.5">
                    {product.seller?.rating || '4.98'} ★ ({product.seller?.reviewsCount || '320'} verified reviews)
                  </p>
                </div>
              </div>
              <Link
                to="/sellers"
                className="text-xs font-semibold text-accent hover:underline flex items-center gap-1 shrink-0"
              >
                <Store className="w-3.5 h-3.5" /> Visit Atelier
              </Link>
            </div>

            {/* Dynamic Product Variants */}
            {product.variants?.map((group) => (
              <div key={group.id} className="space-y-2.5 pt-2">
                <div className="flex items-center justify-between text-xs">
                  <span className="font-semibold text-text-main">
                    Select {group.name}:{' '}
                    <strong className="text-accent font-bold">
                      {selectedVariants[group.name] || 'Choose'}
                    </strong>
                  </span>
                </div>

                {/* Color swatches or option buttons */}
                <div className="flex flex-wrap gap-2.5">
                  {group.options.map((opt) => {
                    const isSelected = selectedVariants[group.name] === opt;
                    const swatchHex = swatchColorMap[opt];

                    return (
                      <button
                        key={opt}
                        type="button"
                        onClick={() => selectVariant(group.name, opt)}
                        className={`inline-flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-medium border transition-all cursor-pointer ${
                          isSelected
                            ? 'bg-primary text-white border-primary shadow-subtle'
                            : 'bg-surface hover:bg-surface-muted border-border text-text-main hover:border-border-dark'
                        }`}
                      >
                        {swatchHex && (
                          <span
                            className="w-3.5 h-3.5 rounded-full border border-white/20 shrink-0"
                            style={{ backgroundColor: swatchHex }}
                          />
                        )}
                        <span>{opt}</span>
                      </button>
                    );
                  })}
                </div>
              </div>
            ))}

            {/* Quantity Selector & CTAs */}
            <div className="space-y-4 pt-4 border-t border-border/80">
              <div className="flex items-center gap-4">
                {/* Quantity */}
                <div className="flex items-center border border-border rounded-xl bg-surface">
                  <button
                    type="button"
                    onClick={() => setQuantity((q) => Math.max(1, q - 1))}
                    className="px-3.5 py-3 text-text-muted hover:text-text-main text-xs font-bold transition-colors cursor-pointer"
                  >
                    -
                  </button>
                  <span className="px-4 py-3 text-xs font-bold text-text-main min-w-[36px] text-center">
                    {quantity}
                  </span>
                  <button
                    type="button"
                    onClick={() => setQuantity((q) => Math.min(stockAvailable, q + 1))}
                    className="px-3.5 py-3 text-text-muted hover:text-text-main text-xs font-bold transition-colors cursor-pointer"
                  >
                    +
                  </button>
                </div>

                {/* Add to Cart */}
                <Button
                  variant="primary"
                  size="lg"
                  className="flex-1"
                  onClick={handleAddToCart}
                  disabled={!product.inStock}
                  leftIcon={ShoppingBag}
                >
                  {isAdded ? 'Added to Bag' : `Add to Bag • ${formatCurrency(adjustedPrice * quantity)}`}
                </Button>
              </div>

              {/* Buy Now Direct Button */}
              <Button
                variant="accent"
                size="lg"
                fullWidth
                onClick={handleBuyNow}
                disabled={!product.inStock}
              >
                Instant Sovereign Checkout
              </Button>
            </div>

            {/* Logistics & Security Guarantees Bar */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-4 border-t border-border/80 text-xs text-text-muted">
              <div className="flex items-start gap-2.5 p-3 rounded-xl bg-surface-muted/60 border border-border/60">
                <Truck className="w-4 h-4 text-accent shrink-0 mt-0.5" />
                <div>
                  <h5 className="font-semibold text-text-main">Complimentary Insured Transit</h5>
                  <p className="text-[11px] text-text-muted mt-0.5">
                    Estimated arrival in 3–5 business days with signature receipt.
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-2.5 p-3 rounded-xl bg-surface-muted/60 border border-border/60">
                <RefreshCw className="w-4 h-4 text-accent shrink-0 mt-0.5" />
                <div>
                  <h5 className="font-semibold text-text-main">30-Day Effortless Returns</h5>
                  <p className="text-[11px] text-text-muted mt-0.5">
                    Includes pre-paid insured packaging and full authenticity guarantee.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Detailed Tabs: Specifications, Craftsmanship, Shipping, Returns */}
        <div className="mt-16 pt-10 border-t border-border/80">
          <div className="flex items-center gap-4 border-b border-border/80 pb-px overflow-x-auto">
            <button
              type="button"
              onClick={() => setActiveTab('description')}
              className={`py-3 px-1 text-sm font-semibold border-b-2 transition-all cursor-pointer ${
                activeTab === 'description'
                  ? 'border-primary text-text-main'
                  : 'border-transparent text-text-muted hover:text-text-main'
              }`}
            >
              Craftsmanship & Story
            </button>
            <button
              type="button"
              onClick={() => setActiveTab('specifications')}
              className={`py-3 px-1 text-sm font-semibold border-b-2 transition-all cursor-pointer ${
                activeTab === 'specifications'
                  ? 'border-primary text-text-main'
                  : 'border-transparent text-text-muted hover:text-text-main'
              }`}
            >
              Piece Specifications
            </button>
            <button
              type="button"
              onClick={() => setActiveTab('shipping')}
              className={`py-3 px-1 text-sm font-semibold border-b-2 transition-all cursor-pointer ${
                activeTab === 'shipping'
                  ? 'border-primary text-text-main'
                  : 'border-transparent text-text-muted hover:text-text-main'
              }`}
            >
              Insured Transit & Customs
            </button>
            <button
              type="button"
              onClick={() => setActiveTab('returns')}
              className={`py-3 px-1 text-sm font-semibold border-b-2 transition-all cursor-pointer ${
                activeTab === 'returns'
                  ? 'border-primary text-text-main'
                  : 'border-transparent text-text-muted hover:text-text-main'
              }`}
            >
              30-Day Guarantee
            </button>
          </div>

          <div className="py-8 text-xs sm:text-sm text-text-muted leading-relaxed">
            {activeTab === 'description' && (
              <div className="space-y-4 max-w-3xl">
                <p>{product.description}</p>
                <div className="p-4 rounded-xl bg-surface border border-border space-y-2 mt-4">
                  <h4 className="font-serif text-sm font-bold text-text-main flex items-center gap-1.5">
                    <Award className="w-4 h-4 text-accent" />
                    <span>The Zareen Provenance Certificate</span>
                  </h4>
                  <p className="text-xs text-text-muted">
                    This creation is certified authentic, non-mass-produced, and individually hallmarked by the master artisan's studio before departure.
                  </p>
                </div>
              </div>
            )}

            {activeTab === 'specifications' && (
              <div className="max-w-3xl space-y-4">
                <div className="border border-border rounded-xl overflow-hidden bg-surface shadow-2xs">
                  <table className="w-full text-left text-xs">
                    <tbody className="divide-y divide-border">
                      <tr className="bg-surface-muted/30">
                        <td className="p-3.5 font-semibold text-text-main w-1/3">Department</td>
                        <td className="p-3.5 text-text-muted">{product.category?.name || product.category || 'Luxury Goods'}</td>
                      </tr>
                      {product.subcategory && (
                        <tr>
                          <td className="p-3.5 font-semibold text-text-main">Classification</td>
                          <td className="p-3.5 text-text-muted">{product.subcategory?.name || product.subcategory}</td>
                        </tr>
                      )}
                      <tr className="bg-surface-muted/30">
                        <td className="p-3.5 font-semibold text-text-main">Master Atelier / Brand</td>
                        <td className="p-3.5 text-text-muted">{product.brand?.name || product.brand || product.seller?.storeName || 'Independent Studio'}</td>
                      </tr>
                      {product.sku && (
                        <tr>
                          <td className="p-3.5 font-semibold text-text-main">Registry SKU</td>
                          <td className="p-3.5 text-text-muted font-mono">{product.sku}</td>
                        </tr>
                      )}
                      {product.origin && (
                        <tr className="bg-surface-muted/30">
                          <td className="p-3.5 font-semibold text-text-main">Country of Provenance</td>
                          <td className="p-3.5 text-text-muted">{product.origin}</td>
                        </tr>
                      )}
                      {product.material && (
                        <tr>
                          <td className="p-3.5 font-semibold text-text-main">Primary Material</td>
                          <td className="p-3.5 text-text-muted">{product.material}</td>
                        </tr>
                      )}
                      {product.dimensions && (
                        <tr className="bg-surface-muted/30">
                          <td className="p-3.5 font-semibold text-text-main">Physical Dimensions</td>
                          <td className="p-3.5 text-text-muted">
                            {typeof product.dimensions === 'object'
                              ? `${product.dimensions.length || ''} × ${product.dimensions.width || ''} × ${product.dimensions.height || ''} ${product.dimensions.unit || 'cm'}`
                              : product.dimensions}
                          </td>
                        </tr>
                      )}
                      {product.weight && (
                        <tr>
                          <td className="p-3.5 font-semibold text-text-main">Weight</td>
                          <td className="p-3.5 text-text-muted">
                            {typeof product.weight === 'object'
                              ? `${product.weight.value} ${product.weight.unit || 'g'}`
                              : product.weight}
                          </td>
                        </tr>
                      )}
                      {product.warranty && (
                        <tr className="bg-surface-muted/30">
                          <td className="p-3.5 font-semibold text-text-main">Atelier Warranty</td>
                          <td className="p-3.5 text-text-muted">{product.warranty}</td>
                        </tr>
                      )}
                      {/* Dynamic Custom Attributes Array */}
                      {product.attributes && Array.isArray(product.attributes) && product.attributes.map((attr, idx) => (
                        <tr key={idx} className={idx % 2 === 0 ? 'bg-surface' : 'bg-surface-muted/30'}>
                          <td className="p-3.5 font-semibold text-text-main">{attr.name || attr.key}</td>
                          <td className="p-3.5 text-text-muted">{attr.value}</td>
                        </tr>
                      ))}
                      {product.features?.length > 0 && (
                        <tr className="bg-surface-muted/30">
                          <td className="p-3.5 font-semibold text-text-main align-top">Craftsmanship Hallmarks</td>
                          <td className="p-3.5 text-text-muted">
                            <ul className="list-disc list-inside space-y-1">
                              {product.features.map((feat, idx) => (
                                <li key={idx}>{feat}</li>
                              ))}
                            </ul>
                          </td>
                        </tr>
                      )}
                    </tbody>
                  </table>
                </div>
              </div>
            )}

            {activeTab === 'shipping' && (
              <div className="max-w-2xl space-y-3">
                <p>
                  Every order on Zareen is dispatched under full transit insurance via private courier (DHL Express / FedEx Signature).
                </p>
                <ul className="list-disc list-inside space-y-1.5 text-xs text-text-muted">
                  <li>Complimentary insured worldwide delivery on commissions exceeding $200.</li>
                  <li>Direct tracking link and SMS dispatch updates upon atelier collection.</li>
                  <li>All customs duties and import taxes are pre-cleared with zero hidden fees.</li>
                </ul>
              </div>
            )}

            {activeTab === 'returns' && (
              <div className="max-w-2xl space-y-3">
                <p>
                  We stand by the master craftsmanship of every verified atelier on Zareen.
                </p>
                <ul className="list-disc list-inside space-y-1.5 text-xs text-text-muted">
                  <li>30-day effortless return window from date of documented receipt.</li>
                  <li>Complimentary return courier pickup scheduled at your residence or office.</li>
                  <li>Full refund processed to original payment method within 48 hours of return inspection.</li>
                </ul>
              </div>
            )}
          </div>
        </div>

        {/* Customer Reviews & Breakdown Section */}
        <div className="mt-12 pt-10 border-t border-border/80">
          <div className="mb-6">
            <span className="text-xs font-bold uppercase tracking-widest text-accent block mb-1">
              Patron Testimonials
            </span>
            <h2 className="font-serif text-2xl sm:text-3xl font-bold text-text-main">
              Patron Reviews & Experiences
            </h2>
          </div>
          <ProductReviewsSection productId={product.id} productName={product.name} />
        </div>

        {/* Related Products ("You May Also Admire") */}
        {relatedProducts.length > 0 && (
          <div className="mt-20 pt-12 border-t border-border/80">
            <div className="flex items-end justify-between mb-8">
              <div>
                <span className="text-xs font-bold uppercase tracking-widest text-accent block mb-1">
                  Curated Affinity
                </span>
                <h2 className="font-serif text-2xl sm:text-3xl font-bold text-text-main">
                  You May Also Admire
                </h2>
              </div>
              <Link
                to={`/products?category=${product.category?.slug}`}
                className="text-xs font-semibold text-text-main hover:text-accent flex items-center gap-1 transition-colors"
              >
                Explore Department <ChevronRight className="w-3.5 h-3.5" />
              </Link>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {relatedProducts.map((rel) => (
                <ProductCard key={rel.id} product={rel} />
              ))}
            </div>
          </div>
        )}

        {/* Recently Viewed Products */}
        <RecentlyViewedSection className="mt-20" />
      </div>

      {/* Sticky Mobile Purchase Action Bar */}
      <div className="sm:hidden fixed bottom-0 left-0 right-0 z-40 bg-surface/95 backdrop-blur-md border-t border-border px-4 py-3 shadow-modal">
        <div className="flex items-center justify-between gap-3">
          <div className="min-w-0">
            <span className="text-[10px] text-text-muted block uppercase tracking-wider font-semibold">
              Acquisition Value
            </span>
            <div className="flex items-baseline gap-1.5">
              <span className="font-serif font-bold text-lg text-text-main">
                {formatCurrency(adjustedPrice)}
              </span>
              {discountPercent && (
                <span className="text-[10px] font-bold text-accent">
                  -{discountPercent}%
                </span>
              )}
            </div>
          </div>

          <div className="flex items-center gap-2 shrink-0">
            <button
              onClick={handleWishlistToggle}
              className="p-2.5 rounded-xl border border-border bg-surface-muted text-text-muted hover:text-accent cursor-pointer"
              aria-label="Wishlist"
            >
              <Heart className={`w-4 h-4 ${isInWishlist ? 'fill-accent text-accent' : ''}`} />
            </button>
            <Button
              variant="primary"
              size="sm"
              disabled={stockAvailable <= 0}
              onClick={handleAddToCart}
              leftIcon={ShoppingBag}
            >
              {stockAvailable <= 0 ? 'Allocated' : isAdded ? 'Added' : 'Add to Bag'}
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductDetailPage;
