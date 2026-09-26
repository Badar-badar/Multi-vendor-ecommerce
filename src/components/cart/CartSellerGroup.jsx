import { ShieldCheck, Store, MapPin } from 'lucide-react';
import CartItemCard from './CartItemCard';
import { formatCurrency } from '../../utils/formatCurrency';

export const CartSellerGroup = ({
  group,
  onUpdateQuantity,
  onRemove,
  onSaveToWishlist,
}) => {
  if (!group) return null;
  const seller = group.seller || {};
  const items = group.items || [];
  const sellerSubtotal = group.sellerSubtotal || 0;

  return (
    <div className="bg-surface rounded-2xl border border-border overflow-hidden shadow-subtle mb-6">
      {/* Seller Header */}
      <div className="px-5 py-3.5 bg-surface-muted/70 border-b border-border flex flex-wrap items-center justify-between gap-2">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-lg bg-primary/10 text-primary flex items-center justify-center">
            <Store className="w-4 h-4 text-primary" />
          </div>
          <div>
            <div className="flex items-center gap-1.5">
              <span className="font-serif font-bold text-sm text-text-main">
                {seller.storeName || 'Zareen Master Atelier'}
              </span>
              {seller.verified !== false && (
                <span className="inline-flex items-center gap-0.5 text-[10px] font-semibold text-accent bg-accent-light px-1.5 py-0.2 rounded" title="Verified Sovereign Artisan">
                  <ShieldCheck className="w-3 h-3" />
                  Verified
                </span>
              )}
            </div>
            {seller.country && (
              <span className="inline-flex items-center gap-1 text-[11px] text-text-subtle">
                <MapPin className="w-3 h-3" />
                Artisan Origin: {seller.country}
              </span>
            )}
          </div>
        </div>

        <div className="text-right">
          <span className="text-[11px] text-text-muted block">Artisan Subtotal</span>
          <span className="text-xs font-bold text-text-main">
            {formatCurrency(sellerSubtotal)} ({items.length} {items.length === 1 ? 'piece' : 'pieces'})
          </span>
        </div>
      </div>

      {/* Seller's Item List */}
      <div className="p-4 sm:p-5 space-y-3.5">
        {items.map((item, idx) => (
          <CartItemCard
            key={item.id || item._id || `${item.product?.id || idx}-${item.variantKey || idx}`}
            item={item}
            onUpdateQuantity={onUpdateQuantity}
            onRemove={onRemove}
            onSaveToWishlist={onSaveToWishlist}
          />
        ))}
      </div>
    </div>
  );
};

export default CartSellerGroup;
