import { useState } from 'react';
import { ChevronDown, ChevronUp, Tag, Sparkles, X, ShieldCheck, Lock, AlertCircle } from 'lucide-react';
import { formatCurrency } from '../../utils/formatCurrency';
import Button from '../common/Button';
import AvailableCouponsModal from '../cart/AvailableCouponsModal';

export const CheckoutOrderSummary = ({
  items = [],
  subtotal = 0,
  productSavings = 0,
  coupon = null,
  couponDiscount = 0,
  couponError = null,
  shippingFee = 0,
  shippingMethodName = 'Standard Insured Courier',
  tax = 0,
  total = 0,
  onApplyCoupon,
  onRemoveCoupon,
  onClearCouponError,
}) => {
  const [isCollapsedMobile, setIsCollapsedMobile] = useState(true);
  const [couponCodeInput, setCouponCodeInput] = useState('');
  const [isOffersModalOpen, setIsOffersModalOpen] = useState(false);

  const handleApplyCoupon = (e) => {
    e.preventDefault();
    if (!couponCodeInput.trim()) return;
    onApplyCoupon(couponCodeInput.trim());
    setCouponCodeInput('');
  };

  return (
    <div className="bg-surface rounded-2xl border border-border p-6 space-y-5 shadow-subtle sticky top-24">
      {/* Mobile Toggle Bar */}
      <div className="lg:hidden">
        <button
          type="button"
          onClick={() => setIsCollapsedMobile(!isCollapsedMobile)}
          className="w-full flex items-center justify-between pb-3 border-b border-border text-xs font-semibold text-text-main cursor-pointer"
        >
          <span className="font-serif font-bold text-sm">
            {isCollapsedMobile ? 'Show Order Summary' : 'Hide Order Summary'} ({items.length} items)
          </span>
          <div className="flex items-center gap-2">
            <span className="font-bold text-accent">{formatCurrency(total)}</span>
            {isCollapsedMobile ? <ChevronDown className="w-4 h-4" /> : <ChevronUp className="w-4 h-4" />}
          </div>
        </button>
      </div>

      {/* Desktop Header */}
      <div className="hidden lg:flex items-center justify-between pb-3 border-b border-border">
        <h2 className="font-serif font-bold text-base text-text-main">
          Order Summary ({items.length})
        </h2>
        <span className="text-xs text-text-muted">USD</span>
      </div>

      {/* Item List (Collapsible on mobile) */}
      <div className={`${isCollapsedMobile ? 'hidden lg:block' : 'block'} space-y-4`}>
        <div className="max-h-64 overflow-y-auto divide-y divide-border pr-1">
          {items.map((item) => (
            <div key={item.id} className="py-3 flex items-center justify-between gap-3 first:pt-0 last:pb-0">
              <div className="flex items-center gap-3 min-w-0">
                <div className="relative shrink-0">
                  <img
                    src={item.product?.images?.[0]}
                    alt={item.product?.name}
                    className="w-12 h-12 object-cover rounded-lg bg-surface-muted border border-border"
                  />
                  <span className="absolute -top-1.5 -right-1.5 w-4 h-4 rounded-full bg-primary text-white text-[10px] font-bold flex items-center justify-center shadow-xs">
                    {item.quantity}
                  </span>
                </div>

                <div className="min-w-0">
                  <p className="text-xs font-serif font-semibold text-text-main truncate">
                    {item.product?.name}
                  </p>
                  <p className="text-[10px] text-text-muted truncate">
                    {item.product?.seller?.storeName || 'Atelier'}
                  </p>
                  {item.selectedVariant && (
                    <p className="text-[10px] text-text-subtle">
                      {Object.values(item.selectedVariant).join(' • ')}
                    </p>
                  )}
                </div>
              </div>

              <span className="text-xs font-bold text-text-main shrink-0 whitespace-nowrap">
                {formatCurrency((item.price || 0) * (item.quantity || 1))}
              </span>
            </div>
          ))}
        </div>

        {/* Coupon Input Section */}
        <div className="pt-3 border-t border-border space-y-2">
          <div className="flex items-center justify-between">
            <label className="text-[11px] font-semibold text-text-muted block">
              Promo Privilege
            </label>
            <button
              type="button"
              onClick={() => setIsOffersModalOpen(true)}
              className="text-[10px] font-semibold text-accent hover:underline flex items-center gap-1 cursor-pointer"
            >
              <Sparkles className="w-3 h-3" />
              <span>Available Offers</span>
            </button>
          </div>

          {coupon ? (
            <div className="flex items-center justify-between p-2.5 bg-accent-light/60 border border-accent/30 rounded-xl text-xs">
              <div className="flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-accent" />
                <div>
                  <span className="font-bold text-accent uppercase tracking-wider text-[11px]">
                    {coupon.code}
                  </span>
                  <p className="text-[10px] text-text-muted">{coupon.description}</p>
                </div>
              </div>
              <button
                type="button"
                onClick={onRemoveCoupon}
                className="text-text-muted hover:text-text-main p-1 cursor-pointer"
                title="Remove promo code"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            </div>
          ) : (
            <form onSubmit={handleApplyCoupon} className="flex gap-2">
              <div className="relative flex-1">
                <input
                  type="text"
                  placeholder="Promo code (e.g. ZAREEN10)"
                  value={couponCodeInput}
                  onChange={(e) => {
                    setCouponCodeInput(e.target.value);
                    if (couponError) onClearCouponError();
                  }}
                  className="w-full pl-8 pr-2.5 py-2 text-xs bg-surface-muted border border-border rounded-xl uppercase tracking-wider text-text-main placeholder:normal-case placeholder:tracking-normal focus:outline-none focus:border-text-main"
                />
                <Tag className="w-3.5 h-3.5 text-text-muted absolute left-2.5 top-1/2 -translate-y-1/2" />
              </div>
              <Button type="submit" variant="secondary" size="md">
                Apply
              </Button>
            </form>
          )}

          {couponError && (
            <p className="text-[11px] text-error flex items-center gap-1">
              <AlertCircle className="w-3.5 h-3.5" />
              <span>{couponError}</span>
            </p>
          )}
        </div>

        <AvailableCouponsModal
          isOpen={isOffersModalOpen}
          onClose={() => setIsOffersModalOpen(false)}
          cartSubtotal={subtotal}
          currentCoupon={coupon}
          onApplyCoupon={onApplyCoupon}
        />

        {/* Financial Line Items */}
        <div className="space-y-2.5 text-xs pt-3 border-t border-border">
          <div className="flex justify-between text-text-muted">
            <span>Items Subtotal</span>
            <span className="font-semibold text-text-main">{formatCurrency(subtotal)}</span>
          </div>

          {productSavings > 0 && (
            <div className="flex justify-between text-emerald-600 font-medium">
              <span>Catalog Savings</span>
              <span>-{formatCurrency(productSavings)}</span>
            </div>
          )}

          {couponDiscount > 0 && (
            <div className="flex justify-between text-emerald-600 font-medium">
              <span>Promo Discount</span>
              <span>-{formatCurrency(couponDiscount)}</span>
            </div>
          )}

          <div className="flex justify-between text-text-muted">
            <span className="truncate pr-2">{shippingMethodName}</span>
            <span className="font-semibold text-text-main shrink-0">
              {shippingFee === 0 ? 'Complimentary' : formatCurrency(shippingFee)}
            </span>
          </div>

          <div className="flex justify-between text-text-muted">
            <span>Estimated Taxes (8%)</span>
            <span className="font-medium text-text-main">{formatCurrency(tax)}</span>
          </div>

          {/* Total */}
          <div className="pt-3 border-t border-border flex justify-between items-baseline text-text-main">
            <span className="font-serif font-bold text-sm">Grand Total</span>
            <span className="font-serif font-bold text-lg text-accent">
              {formatCurrency(total)}
            </span>
          </div>
        </div>

        {/* Security badge */}
        <div className="flex items-center justify-center gap-1.5 text-[11px] text-text-subtle pt-2">
          <Lock className="w-3.5 h-3.5 text-accent" />
          <span>256-Bit Encrypted Sovereign Checkout</span>
        </div>
      </div>
    </div>
  );
};

export default CheckoutOrderSummary;
