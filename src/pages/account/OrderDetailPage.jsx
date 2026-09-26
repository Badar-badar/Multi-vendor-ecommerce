import { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import {
  Package,
  ArrowLeft,
  Truck,
  MapPin,
  CreditCard,
  Printer,
  ShoppingBag,
  RotateCcw,
  XCircle,
  CheckCircle2,
  AlertCircle,
  ExternalLink,
  ShieldCheck,
  Building,
  Sparkles,
  Calendar,
  Lock,
  Clock,
  RefreshCw,
} from 'lucide-react';
import toast from 'react-hot-toast';
import { selectOrders } from '../../features/orders/orderSelectors';
import { fetchOrderDetails } from '../../features/orders/orderThunk';
import { cancelOrderAction } from '../../features/orders/orderSlice';
import { addToCart } from '../../features/cart/cartSlice';
import { formatCurrency } from '../../utils/formatCurrency';
import AccountLayout from '../../components/account/AccountLayout';
import Button from '../../components/common/Button';
import Badge from '../../components/common/Badge';
import ConfirmModal from '../../components/common/ConfirmModal';
import InvoiceModal from '../../components/orders/InvoiceModal';
import ReturnRequestModal from '../../components/orders/ReturnRequestModal';

const STANDARD_STEPS = [
  { key: 'Order Placed', label: 'Order Registered' },
  { key: 'Confirmed', label: 'Maison Confirmed' },
  { key: 'Processing', label: 'Bespoke Finishing' },
  { key: 'Shipped', label: 'Dispatched Transit' },
  { key: 'Out for Delivery', label: 'Out for Handover' },
  { key: 'Delivered', label: 'Handover Completed' },
];

export const OrderDetailPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const orders = useSelector(selectOrders) || [];

  // Match order by id or orderNumber
  const matchedOrder = orders.find((o) => (o._id || o.id) === id || o.orderNumber === id);
  const [fetchedOrder, setFetchedOrder] = useState(null);
  const [loading, setLoading] = useState(!matchedOrder);

  useEffect(() => {
    if (!matchedOrder && id) {
      let isMounted = true;
      dispatch(fetchOrderDetails(id))
        .unwrap()
        .then((fetched) => {
          if (isMounted) setFetchedOrder(fetched);
        })
        .catch(() => {
          // Keep null
        })
        .finally(() => {
          if (isMounted) setLoading(false);
        });
      return () => {
        isMounted = false;
      };
    }
  }, [id, matchedOrder, dispatch]);

  const order = matchedOrder || fetchedOrder;

  // Modals state
  const [isCancelModalOpen, setIsCancelModalOpen] = useState(false);
  const [isReturnModalOpen, setIsReturnModalOpen] = useState(false);
  const [isInvoiceModalOpen, setIsInvoiceModalOpen] = useState(false);

  if (loading) {
    return (
      <AccountLayout>
        <div className="space-y-6">
          <div className="h-8 w-64 bg-surface-muted rounded-xl animate-pulse" />
          <div className="h-48 bg-surface-muted rounded-2xl animate-pulse" />
          <div className="h-64 bg-surface-muted rounded-2xl animate-pulse" />
        </div>
      </AccountLayout>
    );
  }

  if (!order) {
    return (
      <AccountLayout>
        <div className="p-12 bg-surface rounded-2xl border border-border text-center space-y-4">
          <Package className="w-12 h-12 text-text-muted mx-auto" />
          <h2 className="font-serif font-bold text-xl text-text-main">Order Not Found</h2>
          <p className="text-xs text-text-muted">The requested sovereign commission could not be located in your private registry.</p>
          <Link to="/account/orders">
            <Button variant="primary" size="sm">
              View All Orders
            </Button>
          </Link>
        </div>
      </AccountLayout>
    );
  }

  // Status flags
  const isDelivered = order.status === 'Delivered';
  const isCancelled = order.status === 'Cancelled';
  const isReturnRequested = order.status === 'Return Requested';
  const isEligibleForCancel = !isDelivered && !isCancelled && order.status !== 'Shipped' && order.status !== 'Out for Delivery';
  const isEligibleForReturn = isDelivered && !isReturnRequested;

  // Determine current step index in standard timeline
  const getStepStatusIndex = () => {
    switch (order.status) {
      case 'Order Placed':
      case 'Pending':
        return 0;
      case 'Confirmed':
        return 1;
      case 'Processing':
      case 'Packed':
        return 2;
      case 'Shipped':
      case 'In Transit':
        return 3;
      case 'Out for Delivery':
        return 4;
      case 'Delivered':
        return 5;
      default:
        return 2;
    }
  };

  const currentStepIndex = getStepStatusIndex();

  const handleConfirmCancel = () => {
    dispatch(
      cancelOrderAction({
        orderId: order.id,
        reason: 'Cancelled by patron before courier dispatch.',
      })
    );
    setIsCancelModalOpen(false);
    toast.success(`Order #${order.orderNumber || order.id} has been cancelled.`);
  };

  const handleReorder = () => {
    if (!order.items || order.items.length === 0) return;
    order.items.forEach((item) => {
      dispatch(
        addToCart({
          product: {
            id: item.productId || item.id || `reord-${Date.now()}`,
            name: item.name || item.product?.name,
            price: item.price,
            originalPrice: item.originalPrice || item.price,
            images: [item.image || item.product?.images?.[0]],
            brand: item.brand,
            seller: item.seller,
          },
          quantity: item.quantity || 1,
          selectedVariant: item.selectedVariant,
        })
      );
    });
    toast.success('Creations re-added to your shopping bag.');
    navigate('/cart');
  };

  const getStatusBadge = (status) => {
    switch (status) {
      case 'Delivered':
        return <Badge variant="success" size="sm">Delivered</Badge>;
      case 'Shipped':
      case 'Out for Delivery':
      case 'In Transit':
        return <Badge variant="info" size="sm">{status}</Badge>;
      case 'Processing':
      case 'Packed':
      case 'Confirmed':
        return <Badge variant="accent" size="sm">{status}</Badge>;
      case 'Pending':
        return <Badge variant="warning" size="sm">Pending</Badge>;
      case 'Cancelled':
        return <Badge variant="danger" size="sm">Cancelled</Badge>;
      case 'Return Requested':
      case 'Returned':
        return <Badge variant="secondary" size="sm">{status}</Badge>;
      default:
        return <Badge variant="default" size="sm">{status}</Badge>;
    }
  };

  return (
    <AccountLayout>
      <div className="space-y-8">
        {/* Top Header & Breadcrumb */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-border">
          <div className="space-y-1">
            <Link
              to="/account/orders"
              className="inline-flex items-center gap-1.5 text-xs font-semibold text-text-muted hover:text-text-main transition-colors mb-1"
            >
              <ArrowLeft className="w-3.5 h-3.5" />
              <span>Back to All Orders</span>
            </Link>
            <div className="flex items-center gap-3">
              <h1 className="font-serif font-bold text-2xl text-text-main">
                Order #{order.orderNumber || order.id}
              </h1>
              {getStatusBadge(order.status)}
            </div>
            <p className="text-xs text-text-muted">
              Placed on {order.createdAt} • Registry Identifier: {order.id}
            </p>
          </div>

          {/* Action Buttons */}
          <div className="flex flex-wrap items-center gap-2">
            <Button
              type="button"
              variant="secondary"
              size="sm"
              leftIcon={Printer}
              onClick={() => setIsInvoiceModalOpen(true)}
            >
              Invoice
            </Button>

            <Button
              type="button"
              variant="secondary"
              size="sm"
              leftIcon={ShoppingBag}
              onClick={handleReorder}
            >
              Buy Again
            </Button>

            {isEligibleForCancel && (
              <Button
                type="button"
                variant="outline"
                size="sm"
                leftIcon={XCircle}
                onClick={() => setIsCancelModalOpen(true)}
                className="text-error hover:bg-error-light border-error/30"
              >
                Cancel Order
              </Button>
            )}

            {isEligibleForReturn && (
              <Button
                type="button"
                variant="outline"
                size="sm"
                leftIcon={RotateCcw}
                onClick={() => setIsReturnModalOpen(true)}
              >
                Return / Exchange
              </Button>
            )}
          </div>
        </div>

        {/* Cancelled / Return Alert Banners */}
        {isCancelled && (
          <div className="p-4 rounded-2xl bg-error-light border border-error/20 text-xs text-error-dark space-y-1">
            <div className="flex items-center gap-2 font-bold">
              <XCircle className="w-4 h-4 text-error" />
              <span>Order Cancellation Confirmed</span>
            </div>
            <p className="text-error-dark">
              Reason: {order.cancelReason || 'Cancelled by customer request'}. Payment authorization voided.
            </p>
          </div>
        )}

        {isReturnRequested && (
          <div className="p-4 rounded-2xl bg-amber-50 border border-amber-200 text-xs text-amber-900 space-y-1">
            <div className="flex items-center gap-2 font-bold">
              <RotateCcw className="w-4 h-4 text-amber-700" />
              <span>Return Evaluation in Progress</span>
            </div>
            <p>
              Reason: {order.returnReason || 'Fit / specification adjustment'}. White-glove courier will contact you upon approval.
            </p>
          </div>
        )}

        {/* Live Courier Tracking Timeline Card */}
        {!isCancelled && (
          <div className="bg-surface rounded-2xl border border-border p-6 sm:p-8 space-y-6 shadow-subtle">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-4 border-b border-border">
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-lg bg-accent-light text-accent flex items-center justify-center">
                  <Truck className="w-4 h-4" />
                </div>
                <div>
                  <h3 className="font-serif font-bold text-base text-text-main">
                    Live Courier Transit Timeline
                  </h3>
                  <p className="text-[11px] text-text-muted">
                    Tracking Code:{' '}
                    <strong className="font-mono text-accent">{order.trackingNumber || 'TRK-ZRN-981240-US'}</strong>
                  </p>
                </div>
              </div>

              <div className="text-right">
                <span className="text-xs font-semibold text-accent block">
                  Est. Delivery: {order.deliveryEstimate || 'In Transit'}
                </span>
                <span className="text-[11px] text-text-subtle">
                  Courier: {order.courier || order.shippingMethodName || 'Sovereign White-Glove'}
                </span>
              </div>
            </div>

            {/* Desktop Horizontal Stepper */}
            <div className="hidden md:block py-4">
              <div className="flex items-center justify-between relative">
                {/* Track Line */}
                <div className="absolute top-4 left-0 w-full h-0.5 bg-border -z-0" />
                <div
                  className="absolute top-4 left-0 h-0.5 bg-accent transition-all duration-500 -z-0"
                  style={{
                    width: `${(currentStepIndex / (STANDARD_STEPS.length - 1)) * 100}%`,
                  }}
                />

                {STANDARD_STEPS.map((step, idx) => {
                  const isCompleted = idx <= currentStepIndex;
                  const isCurrent = idx === currentStepIndex;

                  return (
                    <div key={step.key} className="relative z-10 flex flex-col items-center">
                      <div
                        className={`w-8 h-8 rounded-full flex items-center justify-center font-bold text-xs transition-all ${
                          isCompleted
                            ? 'bg-accent text-white shadow-xs'
                            : 'bg-surface border-2 border-border text-text-muted'
                        } ${isCurrent ? 'ring-4 ring-accent/20 scale-110' : ''}`}
                      >
                        {isCompleted ? <CheckCircle2 className="w-4 h-4" /> : idx + 1}
                      </div>
                      <span
                        className={`text-xs mt-2 text-center font-semibold ${
                          isCompleted ? 'text-text-main' : 'text-text-muted'
                        }`}
                      >
                        {step.label}
                      </span>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Mobile Vertical Timeline */}
            <div className="md:hidden space-y-4 pt-2">
              {STANDARD_STEPS.map((step, idx) => {
                const isCompleted = idx <= currentStepIndex;
                const isCurrent = idx === currentStepIndex;

                return (
                  <div key={step.key} className="flex items-start gap-3">
                    <div
                      className={`w-6 h-6 rounded-full flex items-center justify-center text-xs shrink-0 mt-0.5 ${
                        isCompleted
                          ? 'bg-accent text-white'
                          : 'bg-surface border border-border text-text-muted'
                      }`}
                    >
                      {isCompleted ? <CheckCircle2 className="w-3.5 h-3.5" /> : idx + 1}
                    </div>
                    <div>
                      <p
                        className={`text-xs font-semibold ${
                          isCompleted ? 'text-text-main' : 'text-text-muted'
                        }`}
                      >
                        {step.label}
                      </p>
                      {isCurrent && (
                        <p className="text-[10px] text-accent font-medium mt-0.5">
                          In Progress • {order.deliveryEstimate || 'Active Courier Escort'}
                        </p>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* 2-Column Order Body */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left 2 Cols: Order Items */}
          <div className="lg:col-span-2 space-y-6">
            <div className="bg-surface rounded-2xl border border-border p-6 shadow-subtle space-y-4">
              <h3 className="font-serif font-bold text-base text-text-main pb-3 border-b border-border">
                Acquired Creations ({order.items?.length || 0})
              </h3>

              <div className="divide-y divide-border">
                {order.items?.map((item, idx) => (
                  <div
                    key={item.id || idx}
                    className="py-4 first:pt-0 last:pb-0 flex flex-col sm:flex-row sm:items-center justify-between gap-4"
                  >
                    <div className="flex items-center gap-4">
                      <img
                        src={item.image || item.product?.images?.[0] || 'https://images.unsplash.com/photo-1544441893-675973e31985?w=300'}
                        alt={item.name}
                        className="w-20 h-20 object-cover rounded-xl bg-surface-muted border border-border shrink-0"
                      />
                      <div className="space-y-1">
                        <span className="text-[10px] font-bold text-accent uppercase tracking-wider block">
                          {item.brand || item.seller?.storeName || item.product?.seller?.storeName || 'Atelier Masterpiece'}
                        </span>
                        <h4 className="text-sm font-serif font-bold text-text-main">
                          {item.name || item.product?.name}
                        </h4>
                        <p className="text-xs text-text-muted">
                          Qty: {item.quantity || 1} • {formatCurrency(item.price)} each
                        </p>
                        {item.selectedVariant && (
                          <p className="text-[11px] text-text-subtle">
                            Specs: {Object.entries(item.selectedVariant).map(([k, v]) => `${k}: ${v}`).join(', ')}
                          </p>
                        )}
                      </div>
                    </div>

                    <div className="text-right sm:self-center shrink-0">
                      <span className="font-serif font-bold text-base text-text-main block">
                        {formatCurrency((item.price || 0) * (item.quantity || 1))}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Delivery & Payment Metadata Details */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {/* Shipping Address */}
              <div className="bg-surface rounded-2xl border border-border p-5 space-y-2 text-xs">
                <div className="flex items-center gap-2 text-text-main font-semibold pb-2 border-b border-border">
                  <MapPin className="w-4 h-4 text-accent" />
                  <span>Insured Shipping Destination</span>
                </div>
                <p className="font-bold text-text-main">{order.shippingAddress?.fullName || 'Sarah Jenkins'}</p>
                <p className="text-text-muted">{order.shippingAddress?.addressLine1}</p>
                {order.shippingAddress?.addressLine2 && (
                  <p className="text-text-muted">{order.shippingAddress.addressLine2}</p>
                )}
                <p className="text-text-muted">
                  {order.shippingAddress?.city}, {order.shippingAddress?.state} {order.shippingAddress?.postalCode}
                </p>
                <p className="text-text-subtle pt-1">{order.shippingAddress?.phone}</p>
              </div>

              {/* Payment Settlement */}
              <div className="bg-surface rounded-2xl border border-border p-5 space-y-2 text-xs">
                <div className="flex items-center gap-2 text-text-main font-semibold pb-2 border-b border-border">
                  <CreditCard className="w-4 h-4 text-accent" />
                  <span>Settlement & Escrow</span>
                </div>
                <p className="font-bold text-text-main">{order.paymentMethodName || 'Stripe 256-Bit Encrypted Card'}</p>
                <p className="text-text-muted">Status: <strong className="text-emerald-600">{order.paymentStatus || 'Paid & Authenticated'}</strong></p>
                <p className="text-text-subtle">
                  Curated Currency: <span className="font-mono font-bold">USD</span>
                </p>
                <div className="flex items-center gap-1 text-[11px] text-accent pt-1">
                  <Lock className="w-3 h-3" />
                  <span>TLS 256-Bit Escrow Protection</span>
                </div>
              </div>
            </div>
          </div>

          {/* Right 1 Col: Summary Card */}
          <div className="lg:col-span-1">
            <div className="bg-surface rounded-2xl border border-border p-6 space-y-4 shadow-subtle sticky top-24">
              <h3 className="font-serif font-bold text-base text-text-main pb-3 border-b border-border">
                Financial Summary
              </h3>

              <div className="space-y-2.5 text-xs text-text-muted">
                <div className="flex justify-between">
                  <span>Gross Subtotal</span>
                  <span className="font-semibold text-text-main">{formatCurrency(order.subtotal || 0)}</span>
                </div>

                {order.discount > 0 && (
                  <div className="flex justify-between text-emerald-600 font-medium">
                    <span>VIP Privilege / Discount</span>
                    <span>-{formatCurrency(order.discount)}</span>
                  </div>
                )}

                <div className="flex justify-between">
                  <span>Insured White-Glove Courier</span>
                  <span>{order.shippingFee === 0 ? 'Complimentary' : formatCurrency(order.shippingFee || 0)}</span>
                </div>

                <div className="flex justify-between">
                  <span>Estimated Duties & Taxes</span>
                  <span className="font-medium text-text-main">{formatCurrency(order.tax || 0)}</span>
                </div>

                <div className="pt-3 border-t border-border flex justify-between items-baseline text-text-main font-bold">
                  <span className="font-serif text-sm">Grand Total</span>
                  <span className="font-serif text-lg text-accent">
                    {formatCurrency(order.total || 0)}
                  </span>
                </div>
              </div>

              <div className="pt-2 border-t border-border space-y-2">
                <Button
                  variant="primary"
                  size="md"
                  fullWidth
                  leftIcon={Printer}
                  onClick={() => setIsInvoiceModalOpen(true)}
                >
                  View Sovereign Invoice
                </Button>

                <Button
                  variant="secondary"
                  size="md"
                  fullWidth
                  leftIcon={ShoppingBag}
                  onClick={handleReorder}
                >
                  Buy Again
                </Button>
              </div>

              <div className="p-3 bg-surface-muted rounded-xl text-[11px] text-text-subtle flex items-center gap-2">
                <ShieldCheck className="w-4 h-4 text-accent shrink-0" />
                <span>Backed by Zareen 30-Day Certificate of Authenticity.</span>
              </div>
            </div>
          </div>
        </div>

        {/* Printable Invoice Modal */}
        <InvoiceModal
          isOpen={isInvoiceModalOpen}
          onClose={() => setIsInvoiceModalOpen(false)}
          order={order}
        />

        {/* Return Request Wizard */}
        <ReturnRequestModal
          isOpen={isReturnModalOpen}
          onClose={() => setIsReturnModalOpen(false)}
          order={order}
        />

        {/* Cancel Confirmation Dialog */}
        <ConfirmModal
          isOpen={isCancelModalOpen}
          onClose={() => setIsCancelModalOpen(false)}
          onConfirm={handleConfirmCancel}
          title="Cancel Sovereign Commission?"
          message={`Are you sure you wish to cancel order #${order.orderNumber || order.id}? Any reserved atelier pieces will be unallocated and funds released.`}
          confirmText="Confirm Cancellation"
          variant="danger"
        />
      </div>
    </AccountLayout>
  );
};

export default OrderDetailPage;
