import { useState } from 'react';
import { Tag, Sparkles, Copy, Check, Info, Clock, AlertCircle } from 'lucide-react';
import { useSelector } from 'react-redux';
import toast from 'react-hot-toast';
import Modal from '../common/Modal';
import Button from '../common/Button';
import Badge from '../common/Badge';
import { selectAvailableOffers } from '../../features/coupons/couponSelectors';
import { formatCurrency } from '../../utils/formatCurrency';

export const AvailableCouponsModal = ({
  isOpen,
  onClose,
  cartSubtotal = 0,
  currentCoupon = null,
  onApplyCoupon,
}) => {
  const availableOffers = useSelector(selectAvailableOffers);
  const [copiedCode, setCopiedCode] = useState(null);

  const handleCopyCode = (code) => {
    navigator.clipboard.writeText(code);
    setCopiedCode(code);
    toast.success(`Coupon code "${code}" copied to clipboard!`);
    setTimeout(() => setCopiedCode(null), 2000);
  };

  const handleApply = (code) => {
    onApplyCoupon(code);
    onClose();
    toast.success(`Coupon "${code}" applied to your order!`);
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Available Privileges & Promo Vouchers"
      size="md"
    >
      <div className="space-y-4 text-xs">
        <p className="text-text-muted text-[11px] leading-relaxed">
          Select from our active salon privileges and seasonal promotional vouchers. Apply directly or copy the code to redeem on your bespoke order.
        </p>

        <div className="space-y-3 max-h-[60vh] overflow-y-auto pr-1">
          {availableOffers.map((offer) => {
            const isApplied = currentCoupon?.code === offer.code;
            const isEligible = cartSubtotal >= (offer.minSpend || 0);
            const deficit = (offer.minSpend || 0) - cartSubtotal;

            return (
              <div
                key={offer.id || offer.code}
                className={`p-4 rounded-xl border transition-all ${
                  isApplied
                    ? 'border-accent bg-accent-light/40 ring-1 ring-accent/30'
                    : isEligible
                    ? 'border-border bg-surface hover:border-text-subtle'
                    : 'border-border/60 bg-surface-muted/50 opacity-80'
                }`}
              >
                <div className="flex items-start justify-between gap-3">
                  <div className="space-y-1 min-w-0">
                    <div className="flex items-center gap-2">
                      <span className="font-mono font-bold text-xs uppercase px-2 py-0.5 rounded bg-surface border border-border text-text-main">
                        {offer.code}
                      </span>
                      {offer.type === 'percentage' ? (
                        <Badge variant="accent" size="xs">
                          {offer.value}% OFF
                        </Badge>
                      ) : (
                        <Badge variant="accent" size="xs">
                          ${offer.value} FLAT OFF
                        </Badge>
                      )}
                      {isApplied && (
                        <Badge variant="success" size="xs">
                          Applied
                        </Badge>
                      )}
                    </div>

                    <p className="font-serif font-bold text-text-main text-xs pt-1">
                      {offer.description}
                    </p>

                    <div className="flex flex-wrap items-center gap-3 text-[10px] text-text-muted pt-1">
                      <span>
                        Min Spend: <strong>{formatCurrency(offer.minSpend || 0)}</strong>
                      </span>
                      {offer.maxDiscount && (
                        <span>
                          Max Cap: <strong>{formatCurrency(offer.maxDiscount)}</strong>
                        </span>
                      )}
                      {offer.expiry && (
                        <span className="flex items-center gap-1 text-text-subtle">
                          <Clock className="w-3 h-3" /> Expires {offer.expiry}
                        </span>
                      )}
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="flex flex-col sm:flex-row items-end sm:items-center gap-1.5 shrink-0">
                    <button
                      type="button"
                      onClick={() => handleCopyCode(offer.code)}
                      className="p-1.5 rounded-lg border border-border bg-surface text-text-muted hover:text-text-main hover:bg-surface-muted transition-colors cursor-pointer"
                      title="Copy Code"
                    >
                      {copiedCode === offer.code ? (
                        <Check className="w-3.5 h-3.5 text-success" />
                      ) : (
                        <Copy className="w-3.5 h-3.5" />
                      )}
                    </button>

                    {isApplied ? (
                      <span className="text-[10px] font-bold text-success px-2 py-1">
                        Active
                      </span>
                    ) : isEligible ? (
                      <Button
                        variant="secondary"
                        size="xs"
                        onClick={() => handleApply(offer.code)}
                      >
                        Apply
                      </Button>
                    ) : (
                      <span className="text-[10px] font-medium text-amber-700 bg-amber-50 px-2 py-0.5 rounded border border-amber-200">
                        Add {formatCurrency(deficit)}
                      </span>
                    )}
                  </div>
                </div>

                {!isEligible && (
                  <div className="mt-2.5 pt-2 border-t border-border/50 text-[10px] text-amber-700 flex items-center gap-1">
                    <AlertCircle className="w-3 h-3 shrink-0" />
                    <span>
                      Add {formatCurrency(deficit)} more to your shopping bag to unlock this privilege.
                    </span>
                  </div>
                )}
              </div>
            );
          })}
        </div>

        <div className="pt-3 border-t border-border flex justify-end">
          <Button variant="outline" size="sm" onClick={onClose}>
            Close
          </Button>
        </div>
      </div>
    </Modal>
  );
};

export default AvailableCouponsModal;
