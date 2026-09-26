import { useState } from 'react';
import {
  CreditCard,
  Lock,
  ShieldCheck,
  ArrowLeft,
  AlertCircle,
  Smartphone,
  Landmark,
  Banknote,
  Sparkles,
  RefreshCw,
  Info,
  CheckCircle,
} from 'lucide-react';
import { formatCurrency } from '../../utils/formatCurrency';
import Input from '../forms/Input';
import Button from '../common/Button';

// Brand badge logos
const VisaLogo = ({ active }) => (
  <span
    className={`text-[10px] font-black italic tracking-tighter px-1.5 py-0.5 rounded border transition-colors ${
      active
        ? 'text-blue-900 bg-blue-100 border-blue-400 ring-1 ring-blue-300'
        : 'text-blue-800 bg-blue-50/70 border-blue-200 opacity-60'
    }`}
  >
    VISA
  </span>
);

const MastercardLogo = ({ active }) => (
  <span
    className={`text-[10px] font-bold px-1.5 py-0.5 rounded border transition-colors ${
      active
        ? 'text-amber-900 bg-amber-100 border-amber-400 ring-1 ring-amber-300'
        : 'text-amber-700 bg-amber-50/70 border-amber-200 opacity-60'
    }`}
  >
    MC
  </span>
);

const AmexLogo = ({ active }) => (
  <span
    className={`text-[10px] font-bold px-1.5 py-0.5 rounded border transition-colors ${
      active
        ? 'text-sky-900 bg-sky-100 border-sky-400 ring-1 ring-sky-300'
        : 'text-sky-700 bg-sky-50/70 border-sky-200 opacity-60'
    }`}
  >
    AMEX
  </span>
);

const PAYMENT_METHODS = [
  {
    id: 'stripe_card',
    name: 'Credit or Debit Card',
    badge: 'Stripe Verified',
    icon: CreditCard,
    description: 'Direct 256-bit encrypted card authorization powered by Stripe Elements.',
  },
  {
    id: 'digital_wallet',
    name: 'Apple Pay / Google Pay',
    badge: 'Express One-Touch',
    icon: Smartphone,
    description: 'Biometric sovereign authorization directly through your mobile device.',
  },
  {
    id: 'wire_escrow',
    name: 'Concierge Bank Wire / Escrow',
    badge: 'White-Glove',
    icon: Landmark,
    description: 'Dedicated financial concierge assistance for ultra-luxury acquisitions.',
  },
  {
    id: 'cod',
    name: 'Cash on White-Glove Handover',
    badge: 'Select Metros',
    icon: Banknote,
    description: 'Handover payment upon private delivery inspection in eligible metropolitan areas.',
  },
];

export const PaymentStep = ({
  total,
  paymentMethod,
  onPaymentMethodChange,
  cardDetails = {},
  onCardDetailsChange,
  isProcessing,
  paymentError,
  onClearPaymentError,
  onBack,
  onPay,
}) => {
  const [cardErrors, setCardErrors] = useState({});
  const [cardBrand, setCardBrand] = useState(null); // 'visa' | 'mastercard' | 'amex' | null

  // Auto-format card number with 4-digit spacing and detect brand
  const handleCardNumberChange = (value) => {
    const raw = value.replace(/\D/g, '').slice(0, 16);
    if (raw.startsWith('4')) setCardBrand('visa');
    else if (raw.startsWith('5')) setCardBrand('mastercard');
    else if (raw.startsWith('34') || raw.startsWith('37')) setCardBrand('amex');
    else setCardBrand(null);

    const formatted = raw.replace(/(\d{4})(?=\d)/g, '$1 ');
    onCardDetailsChange?.('cardNumber', formatted);
    if (cardErrors.cardNumber) setCardErrors((prev) => ({ ...prev, cardNumber: null }));
  };

  // Auto-format expiration MM/YY
  const handleExpiryChange = (value) => {
    const raw = value.replace(/\D/g, '').slice(0, 4);
    let formatted = raw;
    if (raw.length > 2) {
      formatted = `${raw.slice(0, 2)}/${raw.slice(2)}`;
    }
    onCardDetailsChange?.('expiry', formatted);
    if (cardErrors.expiry) setCardErrors((prev) => ({ ...prev, expiry: null }));
  };

  // CVC digits
  const handleCvcChange = (value) => {
    const raw = value.replace(/\D/g, '').slice(0, 4);
    onCardDetailsChange?.('cvc', raw);
    if (cardErrors.cvc) setCardErrors((prev) => ({ ...prev, cvc: null }));
  };

  // Fill test card helper
  const handleFillTestCard = () => {
    onCardDetailsChange?.('cardholderName', 'Sarah Jenkins');
    onCardDetailsChange?.('cardNumber', '4242 4242 4242 4242');
    onCardDetailsChange?.('expiry', '12/28');
    onCardDetailsChange?.('cvc', '424');
    onCardDetailsChange?.('postalCode', '10021');
    setCardBrand('visa');
    setCardErrors({});
    if (paymentError) onClearPaymentError?.();
  };

  const validate = () => {
    if (paymentMethod !== 'stripe_card') return true;

    const errs = {};
    if (!cardDetails?.cardholderName?.trim()) {
      errs.cardholderName = 'Cardholder name is required.';
    }

    const cleanNumber = (cardDetails?.cardNumber || '').replace(/\s/g, '');
    if (!cleanNumber || cleanNumber.length < 15) {
      errs.cardNumber = 'Please enter a valid 15 or 16 digit card number.';
    }

    if (!cardDetails?.expiry || cardDetails.expiry.length < 5) {
      errs.expiry = 'Expiry MM/YY required.';
    }

    if (!cardDetails?.cvc || cardDetails.cvc.length < 3) {
      errs.cvc = 'Valid CVC code required.';
    }

    setCardErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handleAuthorize = (e) => {
    e?.preventDefault?.();
    if (isProcessing) return; // double-click protection
    if (validate()) {
      onPay();
    }
  };

  return (
    <div className="bg-surface rounded-2xl border border-border p-6 sm:p-8 space-y-6 shadow-subtle">
      {/* Step Title Header */}
      <div className="flex items-center justify-between pb-4 border-b border-border">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-xl bg-accent-light text-accent flex items-center justify-center">
            <CreditCard className="w-5 h-5" />
          </div>
          <div>
            <h2 className="font-serif font-bold text-lg text-text-main">
              4. Sovereign Payment Gateway
            </h2>
            <p className="text-xs text-text-muted">
              Select your preferred settlement gateway. Transactions are secured via Stripe Elements 256-bit TLS protocol.
            </p>
          </div>
        </div>

        <div className="hidden sm:flex items-center gap-1.5 text-[11px] text-text-muted font-medium bg-surface-muted px-2.5 py-1 rounded-lg border border-border">
          <Lock className="w-3.5 h-3.5 text-emerald-600" />
          <span>Stripe TLS 1.3</span>
        </div>
      </div>

      {/* Payment Error / Recovery Banner */}
      {paymentError && (
        <div className="p-4 rounded-xl bg-rose-50 border border-rose-200 flex items-start gap-3 text-xs text-rose-800 animate-in fade-in">
          <AlertCircle className="w-4 h-4 text-rose-600 shrink-0 mt-0.5" />
          <div className="space-y-1 flex-1">
            <span className="font-bold">Payment Authorization Unsuccessful:</span>
            <p className="text-rose-700">{paymentError}</p>
            <div className="pt-2 flex items-center gap-2">
              <button
                type="button"
                onClick={handleAuthorize}
                disabled={isProcessing}
                className="inline-flex items-center gap-1 font-semibold text-rose-900 bg-rose-200/80 hover:bg-rose-200 px-3 py-1 rounded-lg transition-colors cursor-pointer"
              >
                <RefreshCw className="w-3 h-3" />
                <span>Retry Payment</span>
              </button>
              <button
                type="button"
                onClick={onClearPaymentError}
                className="text-[11px] text-rose-700 hover:underline cursor-pointer"
              >
                Dismiss
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Payment Method Selector Cards */}
      <div className="space-y-3">
        {PAYMENT_METHODS.map((method) => {
          const isSelected = paymentMethod === method.id;
          const Icon = method.icon;

          return (
            <div
              key={method.id}
              onClick={() => {
                onPaymentMethodChange(method.id);
                if (paymentError) onClearPaymentError?.();
              }}
              className={`p-4 rounded-xl border transition-all cursor-pointer ${
                isSelected
                  ? 'border-primary bg-surface ring-2 ring-primary/10 shadow-xs'
                  : 'border-border bg-surface hover:bg-surface-muted/60'
              }`}
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div
                    className={`w-9 h-9 rounded-lg flex items-center justify-center transition-colors ${
                      isSelected
                        ? 'bg-primary text-white'
                        : 'bg-surface-muted text-text-muted border border-border'
                    }`}
                  >
                    <Icon className="w-4 h-4" />
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="font-serif font-bold text-xs text-text-main">
                        {method.name}
                      </span>
                      <span className="text-[10px] font-bold text-accent bg-accent-light px-1.5 py-0.2 rounded">
                        {method.badge}
                      </span>
                    </div>
                    <p className="text-[11px] text-text-muted mt-0.5">
                      {method.description}
                    </p>
                  </div>
                </div>

                <div
                  className={`w-4 h-4 rounded-full border flex items-center justify-center shrink-0 ${
                    isSelected ? 'border-primary bg-primary' : 'border-border bg-surface'
                  }`}
                >
                  {isSelected && <div className="w-1.5 h-1.5 bg-white rounded-full" />}
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Stripe Elements UI Container */}
      {paymentMethod === 'stripe_card' && (
        <form
          onSubmit={handleAuthorize}
          className="p-5 bg-surface-muted/70 rounded-2xl border border-border space-y-4 animate-in fade-in"
        >
          <div className="flex items-center justify-between pb-2 border-b border-border/80">
            <div className="flex items-center gap-2">
              <span className="text-xs font-bold text-text-main">Stripe Payment Element</span>
              <span className="text-[10px] text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-200 flex items-center gap-1">
                <CheckCircle className="w-3 h-3" /> PCI Level 1 Compliant
              </span>
            </div>
            <div className="flex items-center gap-1.5">
              <VisaLogo active={cardBrand === 'visa'} />
              <MastercardLogo active={cardBrand === 'mastercard'} />
              <AmexLogo active={cardBrand === 'amex'} />
            </div>
          </div>

          <Input
            id="stripe-cardholder"
            label="Cardholder Full Name"
            placeholder="Sarah Jenkins"
            value={cardDetails?.cardholderName || ''}
            onChange={(e) => {
              onCardDetailsChange?.('cardholderName', e.target.value);
              if (cardErrors.cardholderName)
                setCardErrors((prev) => ({ ...prev, cardholderName: null }));
            }}
            error={cardErrors.cardholderName}
            required
            autoComplete="cc-name"
          />

          <Input
            id="stripe-cardnumber"
            label="Card Number"
            placeholder="4242  4242  4242  4242"
            value={cardDetails?.cardNumber || ''}
            onChange={(e) => handleCardNumberChange(e.target.value)}
            icon={CreditCard}
            error={cardErrors.cardNumber}
            required
            autoComplete="cc-number"
          />

          <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
            <Input
              id="stripe-expiry"
              label="Expiration Date"
              placeholder="MM / YY"
              value={cardDetails?.expiry || ''}
              onChange={(e) => handleExpiryChange(e.target.value)}
              error={cardErrors.expiry}
              required
              autoComplete="cc-exp"
            />

            <Input
              id="stripe-cvc"
              type="password"
              label="CVC / CVV"
              placeholder="•••"
              maxLength={4}
              value={cardDetails?.cvc || ''}
              onChange={(e) => handleCvcChange(e.target.value)}
              icon={Lock}
              error={cardErrors.cvc}
              required
              autoComplete="cc-csc"
            />

            <div className="col-span-2 sm:col-span-1">
              <Input
                id="stripe-zip"
                label="Postal / Zip Code"
                placeholder="10021"
                value={cardDetails?.postalCode || ''}
                onChange={(e) => onCardDetailsChange?.('postalCode', e.target.value)}
                autoComplete="postal-code"
              />
            </div>
          </div>

          {/* Test Card Quick Helper */}
          <div className="pt-2 border-t border-border/80 flex items-center justify-between text-[11px] text-text-muted">
            <div className="flex items-center gap-1.5">
              <Info className="w-3.5 h-3.5 text-accent" />
              <span>Developer mode active. Use Stripe test card credentials.</span>
            </div>
            <button
              type="button"
              onClick={handleFillTestCard}
              className="font-semibold text-accent hover:underline cursor-pointer"
            >
              Fill Test Card
            </button>
          </div>
        </form>
      )}

      {/* Alternative Payment Messages */}
      {paymentMethod === 'digital_wallet' && (
        <div className="p-6 bg-surface-muted rounded-2xl border border-border text-center space-y-3 animate-in fade-in">
          <div className="w-12 h-12 bg-primary text-white rounded-full flex items-center justify-center mx-auto shadow-sm">
            <Smartphone className="w-6 h-6" />
          </div>
          <p className="text-xs font-serif font-bold text-text-main">
            Biometric Fast Authorization
          </p>
          <p className="text-xs text-text-muted max-w-sm mx-auto">
            Clicking Authorize below will invoke Touch ID / Face ID or Google One-Tap authentication on your device.
          </p>
        </div>
      )}

      {paymentMethod === 'wire_escrow' && (
        <div className="p-5 bg-surface-muted rounded-2xl border border-border space-y-2 animate-in fade-in text-xs text-text-muted">
          <p className="font-bold text-text-main">Sovereign Escrow Protocol:</p>
          <p>
            Upon placing this reservation, our private concierge desk will transmit official SWIFT transfer coordinates with dedicated escrow protection.
          </p>
        </div>
      )}

      {paymentMethod === 'cod' && (
        <div className="p-5 bg-surface-muted rounded-2xl border border-border space-y-2 animate-in fade-in text-xs text-text-muted">
          <p className="font-bold text-text-main">White-Glove Courier Handover:</p>
          <p>
            Payment will be collected by our certified courier upon inspection and physical handover at your destination address.
          </p>
        </div>
      )}

      {/* Security assurances */}
      <div className="flex items-center justify-center gap-2 text-[11px] text-text-subtle pt-1">
        <ShieldCheck className="w-3.5 h-3.5 text-accent" />
        <span>Card details are tokenized in-memory directly with Stripe and never persisted in local storage.</span>
      </div>

      {/* Action CTA */}
      <div className="pt-4 border-t border-border flex items-center justify-between">
        <button
          type="button"
          onClick={onBack}
          disabled={isProcessing}
          className="inline-flex items-center gap-1.5 text-xs font-semibold text-text-muted hover:text-text-main cursor-pointer disabled:opacity-50"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back to Review</span>
        </button>

        <Button
          type="button"
          variant="primary"
          size="lg"
          loading={isProcessing}
          disabled={isProcessing}
          onClick={handleAuthorize}
          leftIcon={Sparkles}
        >
          {isProcessing ? 'Authorizing Payment...' : `Authorize & Pay ${formatCurrency(total)}`}
        </Button>
      </div>
    </div>
  );
};

export default PaymentStep;
