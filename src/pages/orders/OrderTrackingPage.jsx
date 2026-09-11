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
} from 'lucide-react';
import toast from 'react-hot-toast';
import Button from '../../components/common/Button';
import Input from '../../components/forms/Input';
import Badge from '../../components/common/Badge';
import { formatCurrency } from '../../utils/formatCurrency';

export const OrderTrackingPage = () => {
  const [orderNumber, setOrderNumber] = useState('ZRN-2026-9821');
  const [email, setEmail] = useState('v.sterling@mayfair.co.uk');
  const [trackingResult, setTrackingResult] = useState({
    orderNumber: 'ZRN-2026-9821',
    carrier: 'DHL Express Insured Sovereign Signature',
    trackingNumber: 'DHL-ZRN-894029102-CH',
    status: 'In Air Transit',
    origin: 'Florence Atelier, Italy',
    destination: 'London W1K 6ZA, United Kingdom',
    estimatedDelivery: 'September 8, 2026 (Before 12:00 PM)',
    items: [
      { name: '18k Solstice Choker with Pavé Diamonds', qty: 1, price: 4850 },
      { name: 'Midnight Cashmere Structured Overcoat', qty: 1, price: 3200 },
    ],
    timeline: [
      {
        title: 'Commission Authorized & Escrow Locked',
        date: 'Sept 6, 2026 • 14:10',
        done: true,
        desc: 'Payment captured securely via Stripe 3D Secure.',
      },
      {
        title: 'Atelier Hallmarked & Inspected',
        date: 'Sept 6, 2026 • 16:30',
        done: true,
        desc: 'Piece passed 100% material provenance audit in Florence.',
      },
      {
        title: 'Collected by Private Air Courier',
        date: 'Sept 7, 2026 • 09:15',
        done: true,
        desc: 'Handed to DHL Express with full $8,050.00 transit insurance.',
      },
      {
        title: 'Customs Pre-Clearance Complete',
        date: 'Sept 7, 2026 • 14:40',
        done: true,
        desc: 'UK border import clearance completed without duty holds.',
      },
      {
        title: 'Out for White-Glove Signature Delivery',
        date: 'Estimated Sept 8, 2026',
        done: false,
        desc: 'Courier will request recipient government photo ID and signature.',
      },
    ],
  });

  const handleSearch = (e) => {
    e.preventDefault();
    if (!orderNumber.trim()) {
      toast.error('Please enter an order number.');
      return;
    }
    toast.success(`Tracking coordinates located for ${orderNumber}.`);
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
      </div>
    </div>
  );
};

export default OrderTrackingPage;
