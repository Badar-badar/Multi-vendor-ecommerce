import { useState } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import {
  Package,
  ArrowLeft,
  Truck,
  MapPin,
  CheckCircle2,
  Clock,
  Printer,
  User,
  ShieldCheck,
  Send,
  X,
  AlertTriangle,
  RotateCcw,
  Sparkles,
  DollarSign,
  Phone,
  Mail,
  Building,
} from 'lucide-react';
import toast from 'react-hot-toast';
import { selectSellerOrders } from '../../features/seller/sellerSelectors';
import { updateOrderStatus } from '../../features/seller/sellerSlice';
import { formatCurrency } from '../../utils/formatCurrency';
import Button from '../../components/common/Button';
import Badge from '../../components/common/Badge';

const TIMELINE_STEPS = [
  { key: 'Pending', label: 'Order Registered' },
  { key: 'Confirmed', label: 'Maison Confirmed' },
  { key: 'Processing', label: 'Bespoke Finishing' },
  { key: 'Shipped', label: 'Dispatched Transit' },
  { key: 'Delivered', label: 'Handover Completed' },
];

export const SellerOrderDetailPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const orders = useSelector(selectSellerOrders) || [];

  const order = orders.find((o) => o.id === id || o.orderNumber === id) || orders[0];

  const [isAssignTrackingModalOpen, setIsAssignTrackingModalOpen] = useState(false);
  const [courierName, setCourierName] = useState('Sovereign White-Glove Express');
  const [trackingNumberInput, setTrackingNumberInput] = useState(
    order?.trackingNumber || `TRK-ZRN-${Math.floor(100000 + Math.random() * 900000)}-FR`
  );

  const [isCancelModalOpen, setIsCancelModalOpen] = useState(false);
  const [cancelReason, setCancelReason] = useState('Out of raw materials in atelier');

  if (!order) {
    return (
      <>
        <div className="text-center py-20 space-y-4">
          <h2 className="font-serif font-bold text-xl text-text-main">Order Not Located</h2>
          <Link to="/seller/orders">
            <Button variant="primary">Return to Orders Queue</Button>
          </Link>
        </div>
      </>
    );
  }

  // Financial commission model (8% marketplace fee)
  const commissionFee = Math.round(order.amount * 0.08);
  const netPayout = order.amount - commissionFee;

  // Compute step active index
  const getStepIndex = () => {
    switch (order.status) {
      case 'Pending':
        return 0;
      case 'Confirmed':
        return 1;
      case 'Processing':
        return 2;
      case 'Shipped':
      case 'In Transit':
        return 3;
      case 'Delivered':
        return 4;
      default:
        return 2;
    }
  };

  const currentStepIdx = getStepIndex();

  const handleUpdateStatus = (newStatus) => {
    dispatch(
      updateOrderStatus({
        orderId: order.id,
        status: newStatus,
      })
    );
    toast.success(`Order status advanced to "${newStatus}".`);
  };

  const handleSaveTracking = (e) => {
    e.preventDefault();
    if (!trackingNumberInput.trim()) return;

    dispatch(
      updateOrderStatus({
        orderId: order.id,
        status: 'In Transit',
        trackingNumber: trackingNumberInput.trim(),
      })
    );
    setIsAssignTrackingModalOpen(false);
    toast.success('Insured waybill assigned & order marked as Dispatched.');
  };

  const handleConfirmCancel = (e) => {
    e.preventDefault();
    dispatch(
      updateOrderStatus({
        orderId: order.id,
        status: 'Cancelled',
      })
    );
    setIsCancelModalOpen(false);
    toast.success(`Order #${order.orderNumber || order.id} has been cancelled.`);
  };

  return (
    <>
      <div className="space-y-6">
        {/* Top Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-border">
          <div className="space-y-1">
            <Link
              to="/seller/orders"
              className="inline-flex items-center gap-1.5 text-xs font-semibold text-text-muted hover:text-text-main transition-colors mb-1"
            >
              <ArrowLeft className="w-3.5 h-3.5" />
              <span>Back to Fulfillment Queue</span>
            </Link>
            <div className="flex items-center gap-3">
              <h1 className="font-serif font-bold text-xl sm:text-2xl text-text-main">
                Order #{order.orderNumber || order.id}
              </h1>
              <Badge
                variant={
                  order.status === 'Delivered'
                    ? 'success'
                    : order.status === 'Cancelled'
                    ? 'error'
                    : order.status === 'Processing'
                    ? 'warning'
                    : 'primary'
                }
                size="xs"
              >
                {order.status}
              </Badge>
            </div>
            <p className="text-xs text-text-muted">Registered on {order.date}</p>
          </div>

          <div className="flex flex-wrap items-center gap-2.5">
            <button
              onClick={() => window.print()}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl border border-border bg-surface text-xs font-semibold text-text-main hover:bg-surface-muted transition-colors cursor-pointer shadow-xs"
            >
              <Printer className="w-3.5 h-3.5" />
              <span>Print Manifest</span>
            </button>

            {order.status === 'Pending' && (
              <Button
                variant="primary"
                size="sm"
                onClick={() => handleUpdateStatus('Confirmed')}
              >
                Confirm Order
              </Button>
            )}

            {order.status === 'Confirmed' && (
              <Button
                variant="primary"
                size="sm"
                onClick={() => handleUpdateStatus('Processing')}
              >
                Start Bespoke Processing
              </Button>
            )}

            {(order.status === 'Processing' || order.status === 'Confirmed') && (
              <Button
                variant="accent"
                size="sm"
                leftIcon={Truck}
                onClick={() => setIsAssignTrackingModalOpen(true)}
              >
                Mark Shipped & Assign Waybill
              </Button>
            )}

            {order.status !== 'Delivered' && order.status !== 'Cancelled' && (
              <button
                onClick={() => setIsCancelModalOpen(true)}
                className="px-3 py-1.5 rounded-xl border border-rose-200 text-rose-600 hover:bg-rose-50 text-xs font-semibold cursor-pointer"
              >
                Cancel Order
              </button>
            )}
          </div>
        </div>

        {/* Chronological Fulfillment Timeline */}
        <div className="bg-surface rounded-2xl border border-border p-6 shadow-subtle space-y-4">
          <h2 className="font-serif font-bold text-xs uppercase tracking-wider text-text-muted">
            Fulfillment Progression
          </h2>

          <div className="grid grid-cols-2 sm:grid-cols-5 gap-3 pt-2">
            {TIMELINE_STEPS.map((step, idx) => {
              const isCompleted = idx <= currentStepIdx && order.status !== 'Cancelled';
              const isCurrent = idx === currentStepIdx && order.status !== 'Cancelled';

              return (
                <div key={step.key} className="space-y-2 text-center sm:text-left">
                  <div className="flex items-center">
                    <div
                      className={`w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold transition-all ${
                        isCompleted
                          ? 'bg-primary text-white shadow-xs'
                          : 'bg-surface-muted border border-border text-text-subtle'
                      }`}
                    >
                      {isCompleted ? <CheckCircle2 className="w-4 h-4" /> : idx + 1}
                    </div>
                    {idx < TIMELINE_STEPS.length - 1 && (
                      <div
                        className={`hidden sm:block flex-1 h-0.5 ml-2 ${
                          idx < currentStepIdx && order.status !== 'Cancelled'
                            ? 'bg-primary'
                            : 'bg-border'
                        }`}
                      />
                    )}
                  </div>
                  <div>
                    <span className="font-bold text-xs text-text-main block">{step.label}</span>
                    <span className="text-[10px] text-text-muted">
                      {isCurrent ? 'Current Stage' : isCompleted ? 'Completed' : 'Pending'}
                    </span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Main 2-Column Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
          {/* Left Column (8 Cols): Items & Commission Summary */}
          <div className="lg:col-span-8 space-y-6">
            {/* Items List */}
            <div className="bg-surface rounded-2xl border border-border p-6 space-y-4 shadow-subtle">
              <h3 className="font-serif font-bold text-sm text-text-main pb-2 border-b border-border">
                Ordered Creations ({order.items?.length || 1})
              </h3>

              <div className="divide-y divide-border">
                {(order.items || []).map((item, idx) => (
                  <div key={idx} className="py-4 flex items-center justify-between gap-4 text-xs">
                    <div className="flex items-center gap-3">
                      <img
                        src={item.image}
                        alt={item.name}
                        className="w-14 h-14 rounded-xl object-cover border border-border shrink-0"
                      />
                      <div className="space-y-0.5">
                        <span className="font-serif font-bold text-sm text-text-main block">
                          {item.name}
                        </span>
                        <span className="text-[11px] font-mono text-text-subtle block">
                          SKU: {item.sku}
                        </span>
                        {item.variant && (
                          <span className="text-[11px] text-text-muted block">
                            Variant: {item.variant}
                          </span>
                        )}
                      </div>
                    </div>

                    <div className="text-right shrink-0">
                      <span className="font-serif font-bold text-sm text-text-main block">
                        {formatCurrency(item.price * (item.quantity || 1))}
                      </span>
                      <span className="text-[11px] text-text-muted">
                        Qty: {item.quantity || 1} × {formatCurrency(item.price)}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Financial Commission & Escrow Payout Audit */}
            <div className="bg-surface rounded-2xl border border-border p-6 space-y-3 shadow-subtle text-xs">
              <h3 className="font-serif font-bold text-sm text-text-main pb-2 border-b border-border">
                Settlement & Escrow Financials
              </h3>

              <div className="space-y-2 text-text-muted">
                <div className="flex justify-between">
                  <span>Gross Order Value</span>
                  <span className="font-semibold text-text-main">{formatCurrency(order.amount)}</span>
                </div>
                <div className="flex justify-between">
                  <span>Platform Commission (8%)</span>
                  <span className="text-rose-600 font-semibold">-{formatCurrency(commissionFee)}</span>
                </div>
                <div className="flex justify-between">
                  <span>Insured Courier Allocation</span>
                  <span className="text-emerald-700 font-semibold">Covered by Platform</span>
                </div>
                <div className="pt-3 border-t border-border flex justify-between items-baseline">
                  <div>
                    <span className="font-serif font-bold text-sm text-text-main block">
                      Net Atelier Escrow Payout
                    </span>
                    <span className="text-[10px] text-text-subtle">
                      Scheduled for next bi-weekly settlement
                    </span>
                  </div>
                  <span className="font-serif font-bold text-base text-accent">
                    {formatCurrency(netPayout)}
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Right Column (4 Cols): Customer & Logistics */}
          <div className="lg:col-span-4 space-y-6">
            {/* Customer Dossier */}
            <div className="bg-surface rounded-2xl border border-border p-6 space-y-4 shadow-subtle text-xs">
              <div className="flex items-center gap-2 pb-2 border-b border-border">
                <User className="w-4 h-4 text-accent" />
                <h3 className="font-serif font-bold text-sm text-text-main">Patron Profile</h3>
              </div>

              <div className="space-y-2">
                <span className="font-bold text-sm text-text-main block">
                  {order.customer?.name}
                </span>

                <div className="flex items-center gap-2 text-text-muted">
                  <Mail className="w-3.5 h-3.5 text-text-subtle" />
                  <a href={`mailto:${order.customer?.email}`} className="hover:underline truncate">
                    {order.customer?.email}
                  </a>
                </div>

                {order.customer?.phone && (
                  <div className="flex items-center gap-2 text-text-muted">
                    <Phone className="w-3.5 h-3.5 text-text-subtle" />
                    <span>{order.customer.phone}</span>
                  </div>
                )}
              </div>

              <div className="pt-2 border-t border-border space-y-1">
                <span className="text-[11px] font-semibold text-text-muted block">
                  Delivery Destination
                </span>
                <p className="font-medium text-text-main leading-relaxed">
                  {order.customer?.address || '740 Park Avenue, Penthouse 14B'}
                  <br />
                  {order.customer?.city}, {order.customer?.country}
                </p>
              </div>
            </div>

            {/* Courier & Waybill */}
            <div className="bg-surface rounded-2xl border border-border p-6 space-y-4 shadow-subtle text-xs">
              <div className="flex items-center gap-2 pb-2 border-b border-border">
                <Truck className="w-4 h-4 text-accent" />
                <h3 className="font-serif font-bold text-sm text-text-main">Logistics Dispatch</h3>
              </div>

              <div className="space-y-2">
                <div>
                  <span className="text-[10px] text-text-subtle uppercase block">Service Tier</span>
                  <span className="font-semibold text-text-main">
                    {order.shippingMethod || 'Sovereign White-Glove Express'}
                  </span>
                </div>

                <div>
                  <span className="text-[10px] text-text-subtle uppercase block">Tracking Waybill #</span>
                  {order.trackingNumber ? (
                    <span className="font-mono font-bold text-accent text-xs">
                      {order.trackingNumber}
                    </span>
                  ) : (
                    <span className="text-amber-600 font-semibold">Not yet assigned</span>
                  )}
                </div>

                <div className="pt-2">
                  <button
                    onClick={() => setIsAssignTrackingModalOpen(true)}
                    className="w-full py-2 px-3 rounded-xl border border-border bg-surface-muted hover:bg-surface-hover text-text-main font-semibold text-center transition-colors cursor-pointer"
                  >
                    {order.trackingNumber ? 'Edit Waybill' : 'Assign Waybill #'}
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Modal: Assign Tracking Waybill */}
        {isAssignTrackingModalOpen && (
          <div className="fixed inset-0 z-50 bg-primary/60 backdrop-blur-xs flex items-center justify-center p-4">
            <div className="bg-surface rounded-2xl border border-border p-6 max-w-md w-full shadow-elevated space-y-4 animate-in fade-in zoom-in-95 duration-200">
              <div className="flex items-center justify-between pb-3 border-b border-border">
                <div className="flex items-center gap-2">
                  <Truck className="w-4 h-4 text-accent" />
                  <h3 className="font-serif font-bold text-sm text-text-main">
                    Assign Courier Waybill
                  </h3>
                </div>
                <button
                  onClick={() => setIsAssignTrackingModalOpen(false)}
                  className="p-1 text-text-muted hover:text-text-main"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              <form onSubmit={handleSaveTracking} className="space-y-4">
                <div>
                  <label className="text-xs font-semibold text-text-main block mb-1">
                    Courier Service
                  </label>
                  <select
                    value={courierName}
                    onChange={(e) => setCourierName(e.target.value)}
                    className="w-full px-3 py-2 text-xs bg-surface-muted border border-border rounded-xl text-text-main focus:outline-none focus:border-primary cursor-pointer"
                  >
                    <option value="Sovereign White-Glove Express">Sovereign White-Glove Express</option>
                    <option value="DHL Express Insured">DHL Express Insured</option>
                    <option value="FedEx Custom Critical">FedEx Custom Critical</option>
                    <option value="Brink's Armored Secure Transport">Brink's Armored Secure Transport</option>
                  </select>
                </div>

                <div>
                  <label className="text-xs font-semibold text-text-main block mb-1">
                    Waybill / Airbill Reference #
                  </label>
                  <input
                    type="text"
                    value={trackingNumberInput}
                    onChange={(e) => setTrackingNumberInput(e.target.value)}
                    placeholder="e.g. TRK-ZRN-981024-FR"
                    className="w-full px-3 py-2 text-xs bg-surface-muted border border-border rounded-xl font-mono text-text-main focus:outline-none focus:border-primary"
                    required
                  />
                </div>

                <div className="flex items-center gap-3 pt-2">
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    fullWidth
                    onClick={() => setIsAssignTrackingModalOpen(false)}
                  >
                    Cancel
                  </Button>
                  <Button type="submit" variant="primary" size="sm" fullWidth>
                    Confirm Dispatch
                  </Button>
                </div>
              </form>
            </div>
          </div>
        )}

        {/* Modal: Cancel Order */}
        {isCancelModalOpen && (
          <div className="fixed inset-0 z-50 bg-primary/60 backdrop-blur-xs flex items-center justify-center p-4">
            <div className="bg-surface rounded-2xl border border-border p-6 max-w-md w-full shadow-elevated space-y-4 animate-in fade-in zoom-in-95 duration-200">
              <div className="w-12 h-12 rounded-2xl bg-rose-50 text-rose-600 border border-rose-200 flex items-center justify-center mx-auto">
                <AlertTriangle className="w-6 h-6" />
              </div>

              <div className="text-center space-y-1">
                <h3 className="font-serif font-bold text-base text-text-main">
                  Cancel Fulfillment of Order #{order.orderNumber || order.id}?
                </h3>
                <p className="text-xs text-text-muted leading-relaxed">
                  The client payment will be automatically refunded to their payment card via escrow.
                </p>
              </div>

              <form onSubmit={handleConfirmCancel} className="space-y-4 pt-2">
                <div>
                  <label className="text-xs font-semibold text-text-main block mb-1">
                    Reason for Cancellation
                  </label>
                  <select
                    value={cancelReason}
                    onChange={(e) => setCancelReason(e.target.value)}
                    className="w-full px-3 py-2 text-xs bg-surface-muted border border-border rounded-xl text-text-main focus:outline-none focus:border-primary cursor-pointer"
                  >
                    <option value="Out of raw materials in atelier">Out of raw materials in atelier</option>
                    <option value="Customer requested cancellation">Customer requested cancellation</option>
                    <option value="Unable to deliver to destination region">Unable to deliver to destination region</option>
                    <option value="Pricing / variant mismatch">Pricing / variant mismatch</option>
                  </select>
                </div>

                <div className="flex items-center gap-3 pt-2">
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    fullWidth
                    onClick={() => setIsCancelModalOpen(false)}
                  >
                    Keep Active
                  </Button>
                  <button
                    type="submit"
                    className="w-full py-2 px-3 rounded-xl bg-rose-600 hover:bg-rose-700 text-white text-xs font-semibold transition-colors cursor-pointer"
                  >
                    Confirm Cancellation
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}
      </div>
    </>
  );
};

export default SellerOrderDetailPage;
