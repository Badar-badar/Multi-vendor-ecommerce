export const LUXURY_COUNTRIES = [
  { code: 'US', name: 'United States' },
  { code: 'FR', name: 'France' },
  { code: 'GB', name: 'United Kingdom' },
  { code: 'IT', name: 'Italy' },
  { code: 'CH', name: 'Switzerland' },
  { code: 'AE', name: 'United Arab Emirates' },
  { code: 'MC', name: 'Monaco' },
  { code: 'JP', name: 'Japan' },
  { code: 'CA', name: 'Canada' },
  { code: 'DE', name: 'Germany' },
  { code: 'AU', name: 'Australia' },
];

export const SHIPPING_METHODS = [
  {
    id: 'standard',
    name: 'Sovereign White-Glove Courier',
    description: 'Armored direct transit with real-time biometric tracking.',
    estimatedDays: '3 - 5 business days',
    price: 0,
  },
  {
    id: 'express',
    name: 'Atelier Priority Air Cargo',
    description: 'Dedicated chartered private air delivery within 48 hours.',
    estimatedDays: '1 - 2 business days',
    price: 85,
  },
  {
    id: 'concierge',
    name: 'Personal Curatorial Hand-Delivery',
    description: 'Delivered directly to your residence by a certified Zareen curator.',
    estimatedDays: 'Same-day / Scheduled VIP delivery',
    price: 250,
  },
];

export const PAYMENT_METHODS = [
  {
    id: 'stripe_card',
    name: 'Encrypted Credit / Debit Card',
    description: 'Visa, Mastercard, American Express, UnionPay & Diners Club.',
  },
  {
    id: 'apple_pay',
    name: 'Digital Wallet (Apple Pay / Google Pay)',
    description: 'Biometric one-touch tokenized checkout.',
  },
  {
    id: 'wire_transfer',
    name: 'Private Bank Wire (Escrow Clearance)',
    description: 'Direct sovereign wire clearance with dedicated escrow receipt.',
  },
];
