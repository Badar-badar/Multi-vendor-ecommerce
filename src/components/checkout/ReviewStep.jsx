import { useState } from 'react';
import {
  FileText,
  MapPin,
  Truck,
  Gift,
  Edit2,
  ArrowLeft,
  Store,
  MessageSquare,
  Sparkles,
  ShieldCheck,
  Clock,
} from 'lucide-react';
import { formatCurrency } from '../../utils/formatCurrency';
import Checkbox from '../forms/Checkbox';
import Button from '../common/Button';

export const ReviewStep = ({
  items = [],
  address,
  shippingMethod,
  giftOptions = {},
  onGiftOptionsChange,
  sellerDeliveryNotes = {},
  onSellerDeliveryNoteChange,
  orderNotes = '',
  onOrderNotesChange,
  onEditStep,
  onBack,
  onProceed,
  isSubmitting = false,
}) => {
  // Group items by seller atelier
  const sellerGroups = items.reduce((acc, item) => {
    const sellerId =
      item.product?.seller?._id ||
      item.product?.seller?.id ||
      item.seller?._id ||
      item.seller?.id ||
      item.product?.brand ||
      'zareen_atelier';

    const sellerName =
      item.product?.seller?.storeName ||
      item.product?.seller?.name ||
      item.seller?.storeName ||
      item.product?.brand ||
      'Zareen Master Atelier';

    if (!acc[sellerId]) {
      acc[sellerId] = {
        sellerId,
        sellerName,
        items: [],
        subtotal: 0,
      };
    }

    acc[sellerId].items.push(item);
    acc[sellerId].subtotal += (item.price || 0) * (item.quantity || 1);
    return acc;
  }, {});

  const sellerList = Object.values(sellerGroups);

  return (
    <div className="bg-surface rounded-2xl border border-border p-6 sm:p-8 space-y-6 shadow-subtle">
      {/* Step Title Header */}
      <div className="flex items-center justify-between pb-4 border-b border-border">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-xl bg-accent-light text-accent flex items-center justify-center">
            <FileText className="w-5 h-5" />
          </div>
          <div>
            <h2 className="font-serif font-bold text-lg text-text-main">
              3. Review Order & Multi-Atelier Summary
            </h2>
            <p className="text-xs text-text-muted">
              Verify your delivery coordinates, shipping protocol, and itemized creations grouped by artisan atelier.
            </p>
          </div>
        </div>
      </div>

      {/* Recap Cards Grid (Address & Courier) */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {/* Address Recap */}
        <div className="p-4 rounded-xl border border-border bg-surface-muted/50 space-y-2 relative">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-1.5 text-xs font-bold text-text-main">
              <MapPin className="w-3.5 h-3.5 text-accent" />
              <span>Destination Coordinates</span>
            </div>
            <button
              type="button"
              onClick={() => onEditStep(1)}
              className="inline-flex items-center gap-1 text-[11px] font-semibold text-accent hover:underline cursor-pointer"
            >
              <Edit2 className="w-3 h-3" />
              <span>Change</span>
            </button>
          </div>
          <div className="text-xs text-text-muted space-y-0.5">
            <p className="font-semibold text-text-main">{address?.fullName}</p>
            <p>{address?.addressLine1} {address?.addressLine2 ? `, ${address.addressLine2}` : ''}</p>
            <p>{address?.city}, {address?.state} {address?.postalCode}, {address?.country}</p>
            <p className="text-text-subtle text-[11px]">{address?.phone}</p>
          </div>
        </div>

        {/* Shipping Method Recap */}
        <div className="p-4 rounded-xl border border-border bg-surface-muted/50 space-y-2 relative">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-1.5 text-xs font-bold text-text-main">
              <Truck className="w-3.5 h-3.5 text-accent" />
              <span>Insured Transport Tier</span>
            </div>
            <button
              type="button"
              onClick={() => onEditStep(2)}
              className="inline-flex items-center gap-1 text-[11px] font-semibold text-accent hover:underline cursor-pointer"
            >
              <Edit2 className="w-3 h-3" />
              <span>Change</span>
            </button>
          </div>
          <div className="text-xs text-text-muted space-y-0.5">
            <p className="font-semibold text-text-main">{shippingMethod?.name}</p>
            <p className="text-accent font-medium flex items-center gap-1">
              <Clock className="w-3 h-3" />
              Estimated: {shippingMethod?.estimate || '3-5 business days'}
            </p>
            <p className="text-text-subtle text-[11px] leading-relaxed">
              {shippingMethod?.description}
            </p>
          </div>
        </div>
      </div>

      {/* Multi-Seller Marketplace Grouping */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <span className="text-xs font-bold text-text-main uppercase tracking-wider">
            Creations by Atelier ({items.length} {items.length === 1 ? 'item' : 'items'} across {sellerList.length} {sellerList.length === 1 ? 'partner' : 'partners'})
          </span>
          <span className="text-[11px] text-text-muted">Separate atelier packaging</span>
        </div>

        <div className="space-y-4">
          {sellerList.map((sellerGroup) => (
            <div
              key={sellerGroup.sellerId}
              className="rounded-xl border border-border bg-surface overflow-hidden shadow-2xs"
            >
              {/* Atelier Header */}
              <div className="p-3.5 bg-surface-muted/80 border-b border-border flex items-center justify-between flex-wrap gap-2">
                <div className="flex items-center gap-2">
                  <Store className="w-4 h-4 text-accent" />
                  <span className="font-serif font-bold text-xs text-text-main">
                    {sellerGroup.sellerName}
                  </span>
                  <span className="text-[10px] font-medium text-accent bg-accent-light px-2 py-0.5 rounded-full">
                    Verified Atelier
                  </span>
                </div>
                <div className="text-[11px] text-text-muted">
                  Package Subtotal:{' '}
                  <strong className="text-text-main font-semibold">
                    {formatCurrency(sellerGroup.subtotal)}
                  </strong>
                </div>
              </div>

              {/* Items in this Atelier */}
              <div className="divide-y divide-border">
                {sellerGroup.items.map((item) => (
                  <div
                    key={item.id || item._id}
                    className="p-3.5 flex items-center justify-between gap-3"
                  >
                    <div className="flex items-center gap-3 min-w-0">
                      <img
                        src={item.product?.images?.[0] || '/placeholder.png'}
                        alt={item.product?.name || item.name}
                        className="w-13 h-13 object-cover rounded-lg bg-surface-muted border border-border shrink-0"
                      />
                      <div className="min-w-0">
                        <p className="text-xs font-serif font-bold text-text-main truncate">
                          {item.product?.name || item.name}
                        </p>
                        <div className="flex items-center gap-2 text-[11px] text-text-muted mt-0.5">
                          <span>Qty: {item.quantity}</span>
                          {item.selectedVariant && (
                            <span>
                              •{' '}
                              {Object.entries(item.selectedVariant)
                                .map(([k, v]) => `${k}: ${v}`)
                                .join(', ')}
                            </span>
                          )}
                        </div>
                      </div>
                    </div>

                    <div className="text-right shrink-0">
                      <span className="text-xs font-bold text-text-main block">
                        {formatCurrency((item.price || 0) * (item.quantity || 1))}
                      </span>
                      {item.quantity > 1 && (
                        <span className="text-[10px] text-text-subtle">
                          {formatCurrency(item.price)} each
                        </span>
                      )}
                    </div>
                  </div>
                ))}
              </div>

              {/* Atelier Specific Delivery Instructions */}
              <div className="p-3 bg-surface-muted/30 border-t border-border/80">
                <label className="text-[11px] font-medium text-text-muted flex items-center gap-1.5 mb-1">
                  <MessageSquare className="w-3 h-3 text-accent" />
                  <span>Special delivery notes for {sellerGroup.sellerName} (optional):</span>
                </label>
                <input
                  type="text"
                  placeholder="e.g. Ring doorbell, custom engraving initials, ring size confirmation..."
                  value={sellerDeliveryNotes[sellerGroup.sellerId] || ''}
                  onChange={(e) =>
                    onSellerDeliveryNoteChange?.(sellerGroup.sellerId, e.target.value)
                  }
                  className="w-full px-3 py-1.5 text-xs bg-surface border border-border rounded-lg focus:outline-none focus:border-accent text-text-main placeholder:text-text-subtle"
                />
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Complimentary Signature Gift Presentation */}
      <div className="p-4 rounded-xl border border-border bg-surface-muted/60 space-y-3">
        <div className="flex items-center gap-2">
          <Gift className="w-4 h-4 text-accent" />
          <span className="text-xs font-semibold text-text-main">
            Complimentary Signature Gift Presentation
          </span>
        </div>

        <Checkbox
          id="is-gift"
          label="Include luxury signature gold-embossed gift packaging with custom wax seal"
          checked={giftOptions.isGift || false}
          onChange={(e) => onGiftOptionsChange?.('isGift', e.target.checked)}
        />

        {giftOptions.isGift && (
          <div className="space-y-1.5 pt-1 animate-in fade-in">
            <label className="text-[11px] font-medium text-text-main block">
              Handwritten Calligraphy Message Card (Optional)
            </label>
            <textarea
              rows={2}
              placeholder="Inscribe a personal note to accompany this presentation..."
              value={giftOptions.giftMessage || ''}
              onChange={(e) => onGiftOptionsChange?.('giftMessage', e.target.value)}
              className="w-full px-3 py-2 text-xs bg-surface border border-border rounded-xl focus:outline-none focus:border-text-main placeholder:text-text-subtle resize-none"
            />
          </div>
        )}
      </div>

      {/* General Order Instructions */}
      <div className="space-y-1.5">
        <label className="text-xs font-semibold text-text-main block">
          General Concierge Instructions (Optional)
        </label>
        <textarea
          rows={2}
          placeholder="Leave any overarching gate codes, concierge instructions, or delivery preferences..."
          value={orderNotes || ''}
          onChange={(e) => onOrderNotesChange?.(e.target.value)}
          className="w-full px-3.5 py-2.5 text-xs bg-surface border border-border rounded-xl focus:outline-none focus:border-accent text-text-main placeholder:text-text-subtle resize-none"
        />
      </div>

      {/* Action CTA */}
      <div className="pt-4 border-t border-border flex items-center justify-between">
        <button
          type="button"
          onClick={onBack}
          disabled={isSubmitting}
          className="inline-flex items-center gap-1.5 text-xs font-semibold text-text-muted hover:text-text-main cursor-pointer disabled:opacity-50"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back to Shipping</span>
        </button>

        <Button
          type="button"
          variant="primary"
          size="lg"
          rightIcon={Sparkles}
          loading={isSubmitting}
          onClick={onProceed}
        >
          Proceed to Sovereign Payment
        </Button>
      </div>
    </div>
  );
};

export default ReviewStep;
