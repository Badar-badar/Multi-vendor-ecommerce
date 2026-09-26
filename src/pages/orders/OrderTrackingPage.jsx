import { useState } from 'react';
import {
  Truck,
  Search,
  CheckCircle2,
  Clock,
  ShieldCheck,
  Package,
  MapPin,
  ExternalLink,
  AlertCircle,
  Loader2,
} from 'lucide-react';
import toast from 'react-hot-toast';
import Button from '../../components/common/Button';
import Input from '../../components/forms/Input';
import Badge from '../../components/common/Badge';
import { formatCurrency } from '../../utils/formatCurrency';
import orderApi from '../../api/orderApi';

export const OrderTrackingPage = () => {
  const [orderNumber, setOrderNumber] = useState('');
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [searched, setSearched] = useState(false);
  const [trackingResult, setTrackingResult] = useState(null);

  const buildTimelineFromOrder = (order) => {
    const status = (order.status || 'Pending').toLowerCase();
    const createdDate = order.createdAt ? new Date(order.createdAt).toLocaleDateString() : 'Recent';
    
    return [
      {
        title: 'Commission Registered & Payment Verified',
        date: createdDate,
        done: true,
        desc: 'Payment captured securely via Stripe Sovereign Escrow.',
      },
      {
        title: 'Maison Verified & Prepared in Atelier',
        date: status !== 'pending' ? 'Verified' : 'Pending',
        done: ['processing', 'packed', 'confirmed', 'shipped', 'in transit', 'out for delivery', 'delivered'].includes(status),
        desc: 'Item authenticity verified and prepared for armored transport.',
      },
      {
        title: 'Collected by Private Air Courier',
        date: ['shipped', 'in transit', 'out for delivery', 'delivered'].includes(status) ? 'Dispatched' : 'Pending',
        done: ['shipped', 'in transit', 'out for delivery', 'delivered'].includes(status),
        desc: `Handed to ${order.courier || 'DHL Express'} with full transit insurance.`,
      },
      {
        title: 'Out for White-Glove Signature Delivery',
        date: ['out for delivery', 'delivered'].includes(status) ? 'Out for Handover' : 'Pending',
        done: ['out for delivery', 'delivered'].includes(status),
        desc: 'Courier will request recipient signature and government ID upon arrival.',
      },
      {
        title: 'Commission Handover Completed',
        date: status === 'delivered' ? 'Delivered' : 'Pending',
        done: status === 'delivered',
        desc: 'Package successfully delivered and signed for.',
      },
    ];
  };

  const handleSearch = async (e) => {
    e.preventDefault();
    const trimmed = orderNumber.trim();
    if (!trimmed) {
      toast.error('Please enter an order number or ID.');
      return;
    }

    setLoading(true);
    setSearched(true);
    try {
      const res = await orderApi.getOrderById(trimmed);
      const order = res?.order || res?.data?.order || res?.data || res;
      if (order && (order._id || order.id || order.orderNumber)) {
        setTrackingResult({
          orderNumber: order.orderNumber || order.id || order._id,
          carrier: order.courier || 'DHL Express Insured Sovereign Signature',
          trackingNumber: order.trackingNumber || `TRK-ZRN-${(order._id || order.id || '').slice(-6).toUpperCase()}`,
          status: order.status || 'In Transit',
          origin: order.origin || 'European Master Atelier',
          destination: order.shippingAddress ? `${order.shippingAddress.city || ''}, ${order.shippingAddress.country || ''}` : 'Recipient Destination',
          estimatedDelivery: order.deliveryEstimate || 'Estimated 2-4 Business Days',
          items: (order.items || []).map((it) => ({
            name: it.name || it.product?.name || 'Artisan Creation',
            qty: it.quantity || 1,
            price: it.price || it.product?.price || 0,
          })),
          timeline: buildTimelineFromOrder(order),
        });
        toast.success(`Tracking coordinates located for ${trimmed}.`);
      } else {
        setTrackingResult(null);
        toast.error('No tracking record found for this order reference.');
      }
    } catch (err) {
      setTrackingResult(null);
      toast.error(err.message || 'Unable to locate tracking telemetry for this reference.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-background text-text-main pb-24 space-y-12">
      {/* Header */}
      <section className="bg-surface py-16 border-b border-border">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center space-y-4">
          <span className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-accent/10 border border-accent/20 text-accent text-xs font-semibold uppercase tracking-widest">
            <Truck className="w-3.5 h-3.5" /> Insured Logistics Radar
          </span>
          <h1 className="font-serif text-3xl sm:text-5xl font-bold text-text-main tracking-tight">
            Track Your Sovereign Commission
          </h1>
          <p className="text-xs sm:text-sm text-text-muted max-w-xl mx-auto leading-relaxed">
            Live telemetry, customs clearance checkpoints, and white-glove courier status.
          </p>
        </div>
      </section>

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        {/* Search Bar Card */}
        <div className="bg-surface rounded-3xl border border-border p-6 shadow-subtle">
          <form onSubmit={handleSearch} className="grid grid-cols-1 sm:grid-cols-12 gap-3 items-end">
            <div className="sm:col-span-5">
              <Input
                label="Order Reference Number"
                placeholder="e.g. ZRN-2026-9821"
                value={orderNumber}
                onChange={(e) => setOrderNumber(e.target.value)}
                required
              />
            </div>
            <div className="sm:col-span-5">
              <Input
                label="Billing / Patron Email"
                placeholder="v.sterling@mayfair.co.uk"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>
            <div className="sm:col-span-2">
              <Button variant="primary" size="md" type="submit" leftIcon={Search} fullWidth>
                Track
              </Button>
            </div>
          </form>
        </div>

        {/* Tracking Dossier */}
        {trackingResult && (
          <div className="bg-surface rounded-3xl border border-border p-6 sm:p-8 shadow-subtle space-y-8">
            {/* Top Status Banner */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-border">
              <div>
                <div className="flex items-center gap-2">
                  <h2 className="font-serif font-bold text-xl text-text-main">
                    Order {trackingResult.orderNumber}
                  </h2>
                  <Badge variant="accent" size="xs">
                    {trackingResult.status}
                  </Badge>
                </div>
                <p className="text-xs text-text-muted mt-1 font-mono">
                  Waybill: {trackingResult.trackingNumber}
                </p>
              </div>

              <div className="text-left sm:text-right">
                <span className="text-[10px] uppercase text-text-subtle font-semibold block">
                  Estimated Arrival
                </span>
                <span className="font-serif font-bold text-sm text-accent">
                  {trackingResult.estimatedDelivery}
                </span>
              </div>
            </div>

            {/* Logistics Coordinates Bar */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
              <div className="p-4 bg-surface-muted rounded-2xl border border-border space-y-1">
                <span className="text-[10px] text-text-subtle uppercase flex items-center gap-1">
                  <MapPin className="w-3.5 h-3.5 text-accent" /> Origin Atelier
                </span>
                <p className="font-semibold text-text-main">{trackingResult.origin}</p>
              </div>

              <div className="p-4 bg-surface-muted rounded-2xl border border-border space-y-1">
                <span className="text-[10px] text-text-subtle uppercase flex items-center gap-1">
                  <MapPin className="w-3.5 h-3.5 text-emerald-600" /> Insured Destination
                </span>
                <p className="font-semibold text-text-main">{trackingResult.destination}</p>
              </div>
            </div>

            {/* Visual Milestones Timeline */}
            <div className="space-y-4">
              <h3 className="font-serif font-bold text-base text-text-main">
                Transit Milestone History
              </h3>

              <div className="relative pl-6 space-y-6 before:absolute before:left-2 before:top-2 before:bottom-2 before:w-0.5 before:bg-border">
                {trackingResult.timeline.map((step, idx) => (
                  <div key={idx} className="relative space-y-1">
                    <span
                      className={`absolute -left-6 top-1 w-4 h-4 rounded-full border-2 bg-surface flex items-center justify-center ${
                        step.done
                          ? 'border-accent bg-accent text-white'
                          : 'border-border text-transparent'
                      }`}
                    >
                      {step.done && <CheckCircle2 className="w-3 h-3 text-white" />}
                    </span>

                    <div className="flex flex-col sm:flex-row sm:items-center justify-between text-xs gap-1">
                      <h4 className="font-bold text-text-main">{step.title}</h4>
                      <span className="text-[10px] text-text-subtle font-mono">{step.date}</span>
                    </div>
                    <p className="text-xs text-text-muted">{step.desc}</p>
                  </div>
                ))}
              </div>
            </div>

            {/* Courier Security Guarantee */}
            <div className="pt-4 border-t border-border flex items-center justify-between text-xs text-text-muted">
              <span className="flex items-center gap-1.5 font-medium text-text-main">
                <ShieldCheck className="w-4 h-4 text-accent" /> Insured Signature Delivery Service
              </span>
              <span className="text-[11px] text-text-subtle font-mono">Carrier: DHL Express Private</span>
            </div>
          </div>
        )}

        {!trackingResult && !loading && (
          <div className="bg-surface rounded-3xl border border-border p-10 text-center space-y-3 shadow-subtle">
            <Package className="w-10 h-10 text-text-muted mx-auto" />
            <h3 className="font-serif font-bold text-lg text-text-main">Live Telemetry Lookup</h3>
            <p className="text-xs text-text-muted max-w-md mx-auto">
              Enter your Zareen order reference number (e.g. ZAR-2026-05C433 or your MongoDB Order ID) to view armored dispatch coordinates, courier checkpoints, and live transit status.
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default OrderTrackingPage;
