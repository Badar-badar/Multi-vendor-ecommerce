import { useState } from 'react';
import { Link } from 'react-router-dom';
import {
  CheckCircle2,
  Package,
  Truck,
  MapPin,
  Calendar,
  ArrowRight,
  ShieldCheck,
  ShoppingBag,
  ExternalLink,
  Printer,
  Sparkles,
  CreditCard,
  FileText,
  Clock,
  Store,
} from 'lucide-react';
import { formatCurrency } from '../../utils/formatCurrency';
import Button from '../common/Button';
import InvoiceModal from '../orders/InvoiceModal';

export const OrderConfirmationView = ({ order }) => {
  const [showInvoiceModal, setShowInvoiceModal] = useState(false);

  if (!order) return null;

  const {
    id = 'ord-recent',
    _id,
    orderNumber = 'ZRN-84920-7712',
    createdAt = new Date().toLocaleDateString('en-US', {
      month: 'long',
      day: 'numeric',
      year: 'numeric',
    }),
    paymentStatus = 'Paid',
    paymentMethodName = 'Stripe 256-Bit Encrypted Card',
    paymentMethod = 'card',
    deliveryEstimate = '3 – 5 Business Days',
    trackingNumber = 'TRK-ZRN-981240-US',
    shippingAddress,
    shippingMethodName = 'Sovereign White-Glove Courier',
    items = [],
    subtotal = 0,
    discount = 0,
    shippingFee = 0,
    tax = 0,
    total = 0,
    sellerDeliveryNotes = {},
    orderNotes = '',
  } = order;

  const targetOrderId = _id || id;

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
      };
    }

    acc[sellerId].items.push(item);
    return acc;
  }, {});

  const sellerList = Object.values(sellerGroups);

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8 animate-in fade-in zoom-in-95 duration-400">
      {/* Success Hero Card */}
      <div className="bg-surface rounded-3xl border border-border p-8 sm:p-12 text-center space-y-6 shadow-subtle">
        <div className="w-16 h-16 rounded-3xl bg-emerald-50 text-emerald-600 border border-emerald-200 flex items-center justify-center mx-auto shadow-sm">
          <CheckCircle2 className="w-9 h-9 stroke-[2.5]" />
        </div>

        <div className="space-y-2">
          <span className="text-xs font-bold uppercase tracking-widest text-accent block">
            Acquisition Confirmed
          </span>
          <h1 className="font-serif text-3xl sm:text-4xl font-bold text-text-main">
            Thank You for Your Patronage
          </h1>
          <p className="text-xs sm:text-sm text-text-muted max-w-lg mx-auto leading-relaxed">
            Your bespoke order has been registered in the Zareen Sovereign Ledger and dispatched to our verified artisan ateliers for curated preparation.
          </p>
        </div>

        {/* Order Identifier & Tracking Banner */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 p-4 bg-surface-muted rounded-2xl border border-border text-xs text-left">
          <div>
            <span className="text-text-muted block text-[11px]">Order Registry #</span>
            <span className="font-mono font-bold text-text-main text-sm">{orderNumber}</span>
          </div>
          <div>
            <span className="text-text-muted block text-[11px]">Payment Status</span>
            <span className="font-semibold text-emerald-600 flex items-center gap-1">
              <ShieldCheck className="w-3.5 h-3.5" />
              {paymentStatus === 'Paid' ? 'Paid & Authenticated' : paymentStatus}
            </span>
          </div>
          <div>
            <span className="text-text-muted block text-[11px]">Tracking Reference</span>
            <span className="font-mono font-bold text-accent">{trackingNumber}</span>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="pt-2 flex flex-wrap items-center justify-center gap-3">
          <Link to={`/account/orders/${targetOrderId}`}>
            <Button variant="primary" size="lg" rightIcon={ArrowRight}>
              Track Order Status
            </Button>
          </Link>

          <button
            type="button"
            onClick={() => setShowInvoiceModal(true)}
            className="inline-flex items-center gap-2 px-5 py-3 rounded-xl border border-border bg-surface text-xs font-semibold text-text-main hover:bg-surface-muted hover:border-text-muted transition-colors cursor-pointer shadow-2xs"
          >
            <FileText className="w-4 h-4 text-accent" />
            <span>View Sovereign Invoice</span>
          </button>

          <Link to="/products">
            <Button variant="secondary" size="lg" leftIcon={ShoppingBag}>
              Continue Discovering
            </Button>
          </Link>

          <button
            type="button"
            onClick={() => window.print()}
            className="hidden sm:inline-flex items-center gap-1.5 px-4 py-2.5 rounded-xl border border-border text-xs font-semibold text-text-muted hover:text-text-main hover:bg-surface-muted transition-colors cursor-pointer"
          >
            <Printer className="w-4 h-4" />
            <span>Print Receipt</span>
          </button>
        </div>
      </div>

      {/* Order Logistics & Details Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Delivery Details */}
        <div className="bg-surface rounded-2xl border border-border p-6 space-y-4 shadow-subtle">
          <div className="flex items-center gap-2 pb-3 border-b border-border">
            <MapPin className="w-4 h-4 text-accent" />
            <h2 className="font-serif font-bold text-sm text-text-main">
              Delivery Coordinates
            </h2>
          </div>

          <div className="space-y-3 text-xs">
            <div>
              <span className="text-[11px] text-text-muted block">Recipient Destination</span>
              <p className="font-semibold text-text-main mt-0.5">{shippingAddress?.fullName}</p>
              <p className="text-text-muted">
                {shippingAddress?.addressLine1} {shippingAddress?.addressLine2 ? `, ${shippingAddress.addressLine2}` : ''}
              </p>
              <p className="text-text-muted">
                {shippingAddress?.city}, {shippingAddress?.state} {shippingAddress?.postalCode}, {shippingAddress?.country}
              </p>
              <p className="text-text-subtle text-[11px] mt-1">{shippingAddress?.phone}</p>
            </div>

            <div className="pt-2 border-t border-border">
              <span className="text-[11px] text-text-muted block">Courier Protocol</span>
              <p className="font-semibold text-text-main mt-0.5">{shippingMethodName}</p>
              <p className="text-accent text-[11px] font-medium flex items-center gap-1 mt-0.5">
                <Clock className="w-3.5 h-3.5" /> Estimated Handover: {deliveryEstimate}
              </p>
            </div>

            {orderNotes && (
              <div className="pt-2 border-t border-border">
                <span className="text-[11px] text-text-muted block">Concierge Order Notes:</span>
                <p className="text-text-main italic text-[11px] mt-0.5">{orderNotes}</p>
              </div>
            )}
          </div>
        </div>

        {/* Payment & Security Details */}
        <div className="bg-surface rounded-2xl border border-border p-6 space-y-4 shadow-subtle">
          <div className="flex items-center gap-2 pb-3 border-b border-border">
            <ShieldCheck className="w-4 h-4 text-accent" />
            <h2 className="font-serif font-bold text-sm text-text-main">
              Settlement Protocol
            </h2>
          </div>

          <div className="space-y-3 text-xs">
            <div>
              <span className="text-[11px] text-text-muted block">Payment Method</span>
              <p className="font-semibold text-text-main mt-0.5">{paymentMethodName}</p>
              <p className="text-text-muted text-[11px] mt-0.5">
                Processed via 256-bit Stripe TLS cryptographic vault.
              </p>
            </div>

            <div className="pt-2 border-t border-border">
              <span className="text-[11px] text-text-muted block">Customer Payment Records</span>
              <Link
                to="/account/payments"
                className="text-accent text-xs font-semibold hover:underline inline-flex items-center gap-1 mt-1"
              >
                <span>View All Payment Receipts in Account</span>
                <ExternalLink className="w-3 h-3" />
              </Link>
            </div>

            <div className="pt-2 border-t border-border">
              <span className="text-[11px] text-text-muted block">Concierge Support</span>
              <p className="text-text-muted text-[11px] leading-relaxed mt-0.5">
                Need adjustments or delivery scheduling? Contact our concierge desk at <strong className="text-text-main">concierge@zareen.luxury</strong>.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Itemized Acquisitions Summary Grouped by Atelier */}
      <div className="bg-surface rounded-2xl border border-border p-6 sm:p-8 space-y-6 shadow-subtle">
        <div className="flex items-center justify-between pb-4 border-b border-border">
          <div className="flex items-center gap-2">
            <Package className="w-4 h-4 text-accent" />
            <h2 className="font-serif font-bold text-base text-text-main">
              Acquisition Breakdown ({items.length} {items.length === 1 ? 'creation' : 'creations'})
            </h2>
          </div>
          <span className="text-xs text-text-muted">{createdAt}</span>
        </div>

        {/* Atelier Packages */}
        <div className="space-y-4">
          {sellerList.map((sellerGroup) => (
            <div
              key={sellerGroup.sellerId}
              className="rounded-xl border border-border overflow-hidden bg-surface"
            >
              <div className="p-3 bg-surface-muted border-b border-border flex items-center justify-between text-xs">
                <div className="flex items-center gap-2">
                  <Store className="w-4 h-4 text-accent" />
                  <span className="font-serif font-bold text-text-main">
                    {sellerGroup.sellerName}
                  </span>
                </div>
                {sellerDeliveryNotes[sellerGroup.sellerId] && (
                  <span className="text-[11px] text-text-muted italic">
                    Note: "{sellerDeliveryNotes[sellerGroup.sellerId]}"
                  </span>
                )}
              </div>

              <div className="divide-y divide-border">
                {sellerGroup.items.map((item) => (
                  <div
                    key={item.id || item._id}
                    className="p-3.5 flex items-center justify-between gap-4"
                  >
                    <div className="flex items-center gap-3.5 min-w-0">
                      <img
                        src={item.product?.images?.[0] || '/placeholder.png'}
                        alt={item.product?.name || item.name}
                        className="w-13 h-13 object-cover rounded-xl bg-surface-muted border border-border shrink-0"
                      />
                      <div className="min-w-0">
                        <span className="text-[10px] font-bold text-accent uppercase tracking-wider block">
                          {item.product?.brand || 'Zareen Masterpiece'}
                        </span>
                        <p className="text-xs sm:text-sm font-serif font-bold text-text-main truncate">
                          {item.product?.name || item.name}
                        </p>
                        <p className="text-[11px] text-text-muted mt-0.5">
                          Qty: {item.quantity}
                          {item.selectedVariant &&
                            ` • ${Object.values(item.selectedVariant).join(', ')}`}
                        </p>
                      </div>
                    </div>

                    <div className="text-right shrink-0">
                      <span className="text-xs sm:text-sm font-bold text-text-main block">
                        {formatCurrency((item.price || 0) * (item.quantity || 1))}
                      </span>
                      <span className="text-[10px] text-text-subtle">
                        {formatCurrency(item.price)} each
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>

        {/* Financial Recap Table */}
        <div className="p-4 bg-surface-muted rounded-xl border border-border space-y-2 text-xs">
          <div className="flex justify-between text-text-muted">
            <span>Subtotal</span>
            <span className="font-semibold text-text-main">{formatCurrency(subtotal)}</span>
          </div>

          {discount > 0 && (
            <div className="flex justify-between text-emerald-600 font-medium">
              <span>Privilege Savings</span>
              <span>-{formatCurrency(discount)}</span>
            </div>
          )}

          <div className="flex justify-between text-text-muted">
            <span>Insured White-Glove Transport</span>
            <span>{shippingFee === 0 ? 'Complimentary' : formatCurrency(shippingFee)}</span>
          </div>

          <div className="flex justify-between text-text-muted">
            <span>Estimated Sales Taxes (8%)</span>
            <span>{formatCurrency(tax)}</span>
          </div>

          <div className="pt-2 border-t border-border flex justify-between items-baseline text-text-main">
            <span className="font-serif font-bold text-sm">Grand Total</span>
            <span className="font-serif font-bold text-base text-accent">
              {formatCurrency(total)}
            </span>
          </div>
        </div>
      </div>

      {/* Invoice Modal */}
      {showInvoiceModal && (
        <InvoiceModal
          isOpen={showInvoiceModal}
          onClose={() => setShowInvoiceModal(false)}
          order={order}
        />
      )}
    </div>
  );
};

export default OrderConfirmationView;
