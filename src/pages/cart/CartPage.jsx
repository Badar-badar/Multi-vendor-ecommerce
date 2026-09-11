import { Link } from 'react-router-dom';
import { ShoppingBag, ArrowRight, ArrowLeft, ShieldCheck, Sparkles, RefreshCw } from 'lucide-react';
import useCart from '../../hooks/useCart';
import CartSellerGroup from '../../components/cart/CartSellerGroup';
import CartSummary from '../../components/cart/CartSummary';
import RecentlyViewedSection from '../../components/common/RecentlyViewedSection';
import Button from '../../components/common/Button';

export const CartPage = () => {
  const {
    items,
    groupedBySeller,
    totalQuantity,
    subtotal,
    originalSubtotal,
    productSavings,
    coupon,
    couponDiscount,
    couponError,
    shippingFee,
    freeShippingThreshold,
    freeShippingRemaining,
    freeShippingProgress,
    tax,
    total,
    loading,
    error,
    hasStockIssues,
    setItemQuantity,
    removeItem,
    saveToWishlist,
    applyPromoCode,
    removePromoCode,
    clearPromoError,
    emptyCart,
  } = useCart();

  // Loading State Skeleton
  if (loading) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="h-8 w-64 bg-surface-muted rounded-lg animate-pulse mb-8" />
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 space-y-4">
            {[1, 2].map((n) => (
              <div key={n} className="h-44 bg-surface-muted rounded-2xl animate-pulse" />
            ))}
          </div>
          <div className="h-96 bg-surface-muted rounded-2xl animate-pulse" />
        </div>
      </div>
    );
  }

  // Error State
  if (error) {
    return (
      <div className="max-w-3xl mx-auto px-4 py-20 text-center space-y-4">
        <div className="w-14 h-14 rounded-2xl bg-rose-50 text-rose-600 border border-rose-200 flex items-center justify-center mx-auto">
          <ShoppingBag className="w-7 h-7" />
        </div>
        <h2 className="font-serif text-2xl font-bold text-text-main">
          Unable to Load Shopping Bag
        </h2>
        <p className="text-xs text-text-muted max-w-md mx-auto">
          {error || 'An unexpected connection issue occurred while synchronizing your bag.'}
        </p>
        <Button variant="primary" onClick={() => window.location.reload()} rightIcon={RefreshCw}>
          Retry Synchronization
        </Button>
      </div>
    );
  }

  // Empty Cart State
  if (items.length === 0) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="max-w-md mx-auto text-center space-y-6 bg-surface p-8 sm:p-12 rounded-3xl border border-border shadow-subtle">
          <div className="w-16 h-16 rounded-2xl bg-accent-light text-accent border border-accent/20 flex items-center justify-center mx-auto shadow-xs">
            <ShoppingBag className="w-8 h-8" />
          </div>

          <div className="space-y-2">
            <h1 className="font-serif text-2xl sm:text-3xl font-bold text-text-main">
              Your Shopping Bag is Empty
            </h1>
            <p className="text-xs text-text-muted leading-relaxed">
              Explore our master artisan curations and add rare jewelry, haute couture, timepieces, and bespoke homeware to your private acquisition registry.
            </p>
          </div>

          <div className="pt-2">
            <Link to="/products">
              <Button variant="primary" size="lg" fullWidth rightIcon={ArrowRight}>
                Explore Curated Collections
              </Button>
            </Link>
          </div>

          <div className="pt-2 flex items-center justify-center gap-2 text-[11px] text-text-subtle">
            <ShieldCheck className="w-4 h-4 text-accent" />
            <span>Complimentary Insured Courier on Acquisitions over $300</span>
          </div>
        </div>

        {/* Recently Viewed Curations below empty state */}
        <RecentlyViewedSection className="mt-16" />
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      {/* Top Breadcrumb / Title Bar */}
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-8 pb-4 border-b border-border">
        <div>
          <div className="flex items-center gap-2 text-xs text-text-muted mb-1">
            <Link to="/" className="hover:text-text-main">Home</Link>
            <span>/</span>
            <span className="text-text-main font-semibold">Shopping Bag</span>
          </div>
          <h1 className="font-serif text-2xl sm:text-3xl font-bold text-text-main">
            Sovereign Shopping Bag
          </h1>
          <p className="text-xs text-text-muted mt-1">
            {totalQuantity} {totalQuantity === 1 ? 'creation' : 'creations'} across {groupedBySeller.length} master {groupedBySeller.length === 1 ? 'atelier' : 'ateliers'}.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <Link
            to="/products"
            className="inline-flex items-center gap-1.5 text-xs font-semibold text-text-muted hover:text-text-main transition-colors"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>Continue Discovering</span>
          </Link>

          <button
            type="button"
            onClick={emptyCart}
            className="text-xs font-semibold text-text-muted hover:text-rose-600 transition-colors cursor-pointer px-2.5 py-1 rounded-md hover:bg-rose-50"
          >
            Clear Bag
          </button>
        </div>
      </div>

      {/* Main Cart Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 sm:gap-10">
        {/* Left 2 Cols: Seller-wise Grouped Cart Items */}
        <div className="lg:col-span-2">
          {groupedBySeller.map((group) => (
            <CartSellerGroup
              key={group.seller.id || group.seller.storeName}
              group={group}
              onUpdateQuantity={setItemQuantity}
              onRemove={removeItem}
              onSaveToWishlist={saveToWishlist}
            />
          ))}
        </div>

        {/* Right 1 Col: Summary Card */}
        <div className="lg:col-span-1">
          <CartSummary
            subtotal={subtotal}
            originalSubtotal={originalSubtotal}
            productSavings={productSavings}
            coupon={coupon}
            couponDiscount={couponDiscount}
            couponError={couponError}
            shippingFee={shippingFee}
            freeShippingThreshold={freeShippingThreshold}
            freeShippingRemaining={freeShippingRemaining}
            freeShippingProgress={freeShippingProgress}
            tax={tax}
            total={total}
            hasStockIssues={hasStockIssues}
            onApplyCoupon={applyPromoCode}
            onRemoveCoupon={removePromoCode}
            onClearCouponError={clearPromoError}
          />
        </div>
      </div>

      {/* Recently Viewed Curations Section */}
      <RecentlyViewedSection className="mt-16" />
    </div>
  );
};

export default CartPage;
