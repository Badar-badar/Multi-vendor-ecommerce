import React from 'react';
import {
  PackageOpen,
  Search,
  ShoppingBag,
  Heart,
  FileText,
  AlertCircle,
  BellOff,
  MessageSquareOff,
  Boxes,
  ShieldCheck,
  History,
  Store,
  Layers,
} from 'lucide-react';
import Button from './Button';

const variantPresets = {
  default: {
    icon: PackageOpen,
    title: 'No items found',
    description: 'There are currently no items available to display in this view.',
  },
  cart: {
    icon: ShoppingBag,
    title: 'Your shopping bag is empty',
    description: 'Discover our curated selection of bespoke artisan pieces and fine craftsmanship.',
    actionLabel: 'Explore Collections',
  },
  wishlist: {
    icon: Heart,
    title: 'Your wishlist is empty',
    description: 'Save pieces you love to your personal wishlist to revisit and acquire anytime.',
    actionLabel: 'Browse Artisan Goods',
  },
  products: {
    icon: Layers,
    title: 'No products in this catalog',
    description: 'We could not find any products matching the selected category or criteria.',
    actionLabel: 'View All Products',
  },
  search: {
    icon: Search,
    title: 'No matching creations found',
    description: 'Try adjusting your search terms, removing filters, or browsing by category.',
    actionLabel: 'Clear All Filters',
  },
  orders: {
    icon: FileText,
    title: 'No order history yet',
    description: 'When you commission or purchase items, your order tracking will appear here.',
    actionLabel: 'Start Shopping',
  },
  notifications: {
    icon: BellOff,
    title: 'All caught up',
    description: 'You have no new alerts, status updates, or notifications at this time.',
  },
  reviews: {
    icon: MessageSquareOff,
    title: 'No client reviews yet',
    description: 'Be the first connoisseur to share an authentic review for this piece.',
    actionLabel: 'Write a Review',
  },
  'seller-products': {
    icon: Boxes,
    title: 'No products in your catalog',
    description: 'Begin showcasing your atelier craftsmanship to clients worldwide.',
    actionLabel: 'Add New Product',
  },
  'seller-orders': {
    icon: ShoppingBag,
    title: 'No client orders yet',
    description: 'When clients purchase your bespoke items, they will appear here for fulfillment.',
  },
  'admin-results': {
    icon: ShieldCheck,
    title: 'No administrative records',
    description: 'No matching records or accounts found matching current query parameters.',
  },
  'audit-logs': {
    icon: History,
    title: 'Audit log is clean',
    description: 'No privileged system operations or state modifications recorded for this period.',
  },
};

export const EmptyState = ({
  icon: CustomIcon,
  variant = 'default',
  title,
  description,
  actionLabel,
  onAction,
  actionComponent,
  secondaryActionLabel,
  onSecondaryAction,
  className = '',
}) => {
  const preset = variantPresets[variant] || variantPresets.default;
  const IconComponent = CustomIcon || preset.icon || PackageOpen;
  const effectiveTitle = title || preset.title;
  const effectiveDescription = description || preset.description;
  const effectiveActionLabel = actionLabel || preset.actionLabel;

  return (
    <div
      className={`flex flex-col items-center justify-center text-center p-8 sm:p-12 bg-surface rounded-2xl border border-border border-dashed my-6 ${className}`}
    >
      <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-2xl bg-surface-muted border border-border flex items-center justify-center text-text-muted mb-4 shadow-subtle">
        <IconComponent className="w-8 h-8 sm:w-10 sm:h-10 stroke-[1.5] text-accent" />
      </div>

      <h3 className="font-serif text-lg sm:text-xl font-bold text-text-main tracking-tight mb-2">
        {effectiveTitle}
      </h3>

      <p className="text-xs sm:text-sm text-text-muted max-w-md leading-relaxed mb-6">
        {effectiveDescription}
      </p>

      {(effectiveActionLabel || actionComponent || secondaryActionLabel) && (
        <div className="flex flex-wrap items-center justify-center gap-3">
          {actionComponent ? (
            actionComponent
          ) : effectiveActionLabel && onAction ? (
            <Button variant="primary" size="md" onClick={onAction}>
              {effectiveActionLabel}
            </Button>
          ) : null}

          {secondaryActionLabel && onSecondaryAction && (
            <Button variant="outline" size="md" onClick={onSecondaryAction}>
              {secondaryActionLabel}
            </Button>
          )}
        </div>
      )}
    </div>
  );
};

export default EmptyState;
