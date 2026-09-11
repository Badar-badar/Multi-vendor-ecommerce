import { useState } from 'react';
import { Link } from 'react-router-dom';
import {
  ArrowRight,
  ShieldCheck,
  Tag,
  Truck,
  Sparkles,
  X,
  Lock,
  RotateCcw,
  CheckCircle2,
  AlertCircle,
} from 'lucide-react';
import { formatCurrency } from '../../utils/formatCurrency';
import Button from '../common/Button';
import AvailableCouponsModal from './AvailableCouponsModal';

export const CartSummary = ({
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
  hasStockIssues,
  onApplyCoupon,
  onRemoveCoupon,
  onClearCouponError,
}) => {
  const [couponCodeInput, setCouponCodeInput] = useState('');
  const [isOffersModalOpen, setIsOffersModalOpen] = useState(false);

  const handleApply = (e) => {
    e.preventDefault();
    if (!couponCodeInput.trim()) return;
    onApplyCoupon(couponCodeInput.trim());
    setCouponCodeInput('');
  };

  return (
    <div className="bg-surface rounded-2xl border border-border p-6 sm:p-7 space-y-6 shadow-subtle sticky top-24">
      {/* Free Shipping Milestone Progress Bar */}
      <div className="p-4 bg-surface-muted rounded-xl border border-border space-y-2.5">
        <div className="flex items-center justify-between text-xs">
          <span className="flex items-center gap-1.5 font-semibold text-text-main">
            <Truck className="w-4 h-4 text-accent" />
            {freeShippingRemaining === 0 ? (
              <span className="text-emerald-700">Complimentary Courier Unlocked</span>
            ) : (
              <span>Insured White-Glove Courier</span>
            )}
          </span>
          <span className="font-bold text-accent">
            {freeShippingRemaining === 0 ? 'FREE' : `+$${freeShippingRemaining} to unlock`}
          </span>
        </div>

        {/* Progress Track */}
        <div className="w-full bg-border h-2 rounded-full overflow-hidden">
          <div
            className="bg-accent h-full rounded-full transition-all duration-500 ease-out"
            style={{ width: `${freeShippingProgress}%` }}
          />
        </div>

        <p className="text-[11px] text-text-muted">
          {freeShippingRemaining === 0
            ? 'Your order qualifies for sovereign complimentary insured shipping.'
            : `Add ${formatCurrency(freeShippingRemaining)} more of luxury curations for free insured delivery.`}
        </p>
      </div>

      {/* Coupon / Promo Code Input Section */}
      <div className="space-y-2">
        <div className="flex items-center justify-between">
          <label className="text-xs font-semibold text-text-main block">
            Artisan Privilege or Promo Code
          </label>
          <button
            type="button"
            onClick={() => setIsOffersModalOpen(true)}
            className="text-[11px] font-semibold text-accent hover:underline flex items-center gap-1 cursor-pointer"
          >
            <Sparkles className="w-3 h-3" />
            <span>Available Offers</span>
          </button>
        </div>

        {coupon ? (
          <div className="flex items-center justify-between p-3 bg-accent-light/60 border border-accent/30 rounded-xl text-xs">
            <div className="flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-accent" />
              <div>
                <span className="font-bold text-accent tracking-wider uppercase">
                  {coupon.code}
                </span>
                <p className="text-[11px] text-text-muted">{coupon.description}</p>
              </div>
            </div>
            <button
              type="button"
              onClick={onRemoveCoupon}
              className="text-text-muted hover:text-text-main p-1 rounded-md transition-colors cursor-pointer"
              title="Remove promo code"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        ) : (
          <form onSubmit={handleApply} className="flex gap-2">
            <div className="relative flex-1">
              <input
                type="text"
                placeholder="e.g. ZAREEN10, ROYAL50"
                value={couponCodeInput}
                onChange={(e) => {
                  setCouponCodeInput(e.target.value);
                  if (couponError) onClearCouponError();
                }}
                className="w-full pl-9 pr-3 py-2 text-xs bg-surface-muted border border-border rounded-xl uppercase tracking-wider text-text-main placeholder:normal-case placeholder:tracking-normal focus:outline-none focus:border-text-main"
              />
              <Tag className="w-4 h-4 text-text-muted absolute left-3 top-1/2 -translate-y-1/2" />
            </div>

            <Button type="submit" variant="secondary" size="md">
              Apply
            </Button>
          </form>
        )}

        {couponError && (
          <p className="text-[11px] text-error flex items-center gap-1 mt-1">
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
      <div className="space-y-3 text-xs pt-2 border-t border-border">
        <div className="flex justify-between text-text-muted">
          <span>Items Subtotal</span>
          <span className="font-semibold text-text-main">{formatCurrency(subtotal)}</span>
        </div>

        {productSavings > 0 && (
          <div className="flex justify-between text-emerald-600 font-medium">
            <span>Special Promotional Savings</span>
            <span>-{formatCurrency(productSavings)}</span>
          </div>
        )}

        {couponDiscount > 0 && (
          <div className="flex justify-between text-emerald-600 font-medium">
            <span>Privilege Discount ({coupon?.code})</span>
            <span>-{formatCurrency(couponDiscount)}</span>
          </div>
        )}

        <div className="flex justify-between text-text-muted">
          <span>Insured White-Glove Courier</span>
          <span>{shippingFee === 0 ? 'Complimentary' : formatCurrency(shippingFee)}</span>
        </div>

        <div className="flex justify-between text-text-muted">
          <span>Estimated Sales Tax (8%)</span>
          <span className="font-medium text-text-main">{formatCurrency(tax)}</span>
        </div>

        {/* Grand Total */}
        <div className="pt-4 border-t border-border flex justify-between items-baseline text-text-main">
          <div>
            <span className="text-sm font-bold font-serif block">Grand Total</span>
            <span className="text-[11px] text-text-muted">USD Currency (All Duties Included)</span>
          </div>
          <span className="text-xl font-serif font-bold text-accent">
            {formatCurrency(total)}
          </span>
        </div>
      </div>

      {/* Stock warning notification if issue exists */}
      {hasStockIssues && (
        <div className="p-3 bg-amber-50 border border-amber-200 rounded-xl text-xs text-amber-800 flex items-start gap-2">
          <AlertCircle className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
          <span>
            Some creations in your bag exceed available atelier inventory. Please adjust quantities to proceed to checkout.
          </span>
        </div>
      )}

      {/* Checkout CTA */}
      <div>
        <Link to={hasStockIssues ? '#' : '/checkout'} className="block">
          <Button
            variant="primary"
            size="lg"
            fullWidth
            disabled={hasStockIssues}
            rightIcon={ArrowRight}
            className="shadow-md"
          >
            Proceed to Secure Checkout
          </Button>
        </Link>
      </div>

      {/* Sovereign Assurances */}
      <div className="pt-2 space-y-2 border-t border-border/70 text-[11px] text-text-muted">
        <div className="flex items-center gap-2">
          <Lock className="w-3.5 h-3.5 text-accent shrink-0" />
          <span>256-Bit TLS Sovereign Encrypted Checkout</span>
        </div>
        <div className="flex items-center gap-2">
          <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
          <span>Certificate of Authenticity Guaranteed</span>
        </div>
        <div className="flex items-center gap-2">
          <RotateCcw className="w-3.5 h-3.5 text-accent shrink-0" />
          <span>30-Day Complimentary Sovereign Returns</span>
        </div>
      </div>
    </div>
  );
};

export default CartSummary;
