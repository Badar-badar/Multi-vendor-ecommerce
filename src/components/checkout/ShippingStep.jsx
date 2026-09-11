import { Truck, Zap, ShieldCheck, Check, ArrowLeft } from 'lucide-react';
import { formatCurrency } from '../../utils/formatCurrency';
import Button from '../common/Button';

export const SHIPPING_METHODS = [
  {
    id: 'standard',
    name: 'Standard Insured Courier',
    estimate: '4 – 6 Business Days',
    description: 'Climate-controlled insured ground transit with digital signature confirmation upon arrival.',
    baseFee: 25,
    freeThreshold: 300,
    icon: Truck,
  },
  {
    id: 'express',
    name: 'Sovereign White-Glove Express',
    estimate: '1 – 2 Business Days',
    description: 'Expedited air transport with dedicated concierge escort and scheduled direct handover.',
    baseFee: 45,
    freeThreshold: null,
    icon: Zap,
  },
];

export const ShippingStep = ({
  selectedMethodId,
  onSelectMethod,
  subtotal,
  onBack,
  onProceed,
}) => {
  return (
    <div className="bg-surface rounded-2xl border border-border p-6 sm:p-8 space-y-6 shadow-subtle">
      {/* Step Title Header */}
      <div className="flex items-center justify-between pb-4 border-b border-border">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-xl bg-accent-light text-accent flex items-center justify-center">
            <Truck className="w-5 h-5" />
          </div>
          <div>
            <h2 className="font-serif font-bold text-lg text-text-main">
              2. Select Courier Method
            </h2>
            <p className="text-xs text-text-muted">
              Choose the delivery speed and specialized handling for your acquisitions.
            </p>
          </div>
        </div>
      </div>

      {/* Shipping Options */}
      <div className="space-y-4">
        {SHIPPING_METHODS.map((method) => {
          const isSelected = selectedMethodId === method.id;
          const Icon = method.icon;
          const isComplimentary =
            method.freeThreshold !== null && subtotal >= method.freeThreshold;
          const fee = isComplimentary ? 0 : method.baseFee;

          return (
            <div
              key={method.id}
              onClick={() => onSelectMethod(method.id, fee)}
              className={`p-5 rounded-2xl border transition-all cursor-pointer relative ${
                isSelected
                  ? 'border-primary bg-surface ring-2 ring-primary/10 shadow-xs'
                  : 'border-border bg-surface hover:bg-surface-muted/60 hover:border-border-strong'
              }`}
            >
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div className="flex items-start gap-4">
                  <div
                    className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 transition-colors ${
                      isSelected
                        ? 'bg-primary text-white'
                        : 'bg-surface-muted text-text-main border border-border'
                    }`}
                  >
                    <Icon className="w-5 h-5" />
                  </div>

                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <span className="font-serif font-bold text-sm text-text-main">
                        {method.name}
                      </span>
                      {method.id === 'express' && (
                        <span className="text-[10px] font-bold bg-accent-light text-accent px-2 py-0.5 rounded-full">
                          Fastest
                        </span>
                      )}
                    </div>
                    <p className="text-xs font-semibold text-accent">
                      Estimated Delivery: {method.estimate}
                    </p>
                    <p className="text-[11px] text-text-muted leading-relaxed max-w-lg">
                      {method.description}
                    </p>
                  </div>
                </div>

                <div className="flex items-center sm:flex-col items-end justify-between sm:justify-center gap-2 pt-2 sm:pt-0 border-t sm:border-t-0 border-border">
                  <div className="text-right">
                    <span className="text-base font-serif font-bold text-text-main block">
                      {fee === 0 ? 'Complimentary' : formatCurrency(fee)}
                    </span>
                    {isComplimentary && (
                      <span className="text-[10px] text-emerald-600 font-semibold block">
                        Order qualifies over $300
                      </span>
                    )}
                  </div>

                  <div
                    className={`w-5 h-5 rounded-full border flex items-center justify-center transition-colors ${
                      isSelected
                        ? 'border-primary bg-primary text-white'
                        : 'border-border bg-surface'
                    }`}
                  >
                    {isSelected && <Check className="w-3 h-3 stroke-[3]" />}
                  </div>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Assurance banner */}
      <div className="p-3.5 bg-surface-muted rounded-xl border border-border flex items-center gap-2.5 text-xs text-text-muted">
        <ShieldCheck className="w-4 h-4 text-accent shrink-0" />
        <span>All shipments are 100% insured against loss or damage during transit.</span>
      </div>

      {/* Action CTA */}
      <div className="pt-4 border-t border-border flex items-center justify-between">
        <button
          type="button"
          onClick={onBack}
          className="inline-flex items-center gap-1.5 text-xs font-semibold text-text-muted hover:text-text-main cursor-pointer"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back to Address</span>
        </button>

        <Button type="button" variant="primary" size="lg" onClick={onProceed}>
          Review Order Details
        </Button>
      </div>
    </div>
  );
};

export default ShippingStep;
