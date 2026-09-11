import { Loader2 } from 'lucide-react';

export const Spinner = ({
  size = 'md',
  color = 'primary',
  className = '',
  ...props
}) => {
  const sizes = {
    xs: 'w-3 h-3',
    sm: 'w-4 h-4',
    md: 'w-6 h-6',
    lg: 'w-8 h-8',
    xl: 'w-12 h-12',
  };

  const colors = {
    primary: 'text-primary',
    accent: 'text-accent',
    white: 'text-white',
    muted: 'text-text-muted',
    current: 'text-current',
  };

  return (
    <Loader2
      className={`animate-spin ${sizes[size] || sizes.md} ${
        colors[color] || colors.primary
      } ${className}`}
      {...props}
    />
  );
};

export const Skeleton = ({
  className = '',
  rounded = 'rounded-md',
  width,
  height,
  style,
  ...props
}) => {
  return (
    <div
      className={`animate-shimmer ${rounded} ${className}`}
      style={{
        width,
        height,
        ...style,
      }}
      {...props}
    />
  );
};

export const PageLoader = ({
  message = 'Curating Zareen marketplace...',
  className = '',
}) => {
  return (
    <div className={`min-h-[50vh] flex flex-col items-center justify-center p-8 gap-4 ${className}`}>
      <div className="relative flex items-center justify-center">
        <div className="w-14 h-14 rounded-2xl bg-primary flex items-center justify-center text-white font-serif font-bold text-2xl shadow-md animate-pulse">
          Z
        </div>
        <Spinner size="xl" color="accent" className="absolute -inset-2 opacity-80" />
      </div>
      <p className="font-serif text-sm font-medium text-text-muted tracking-wide animate-pulse">
        {message}
      </p>
    </div>
  );
};

export const ProductCardSkeleton = () => {
  return (
    <div className="bg-surface rounded-xl border border-border overflow-hidden flex flex-col justify-between">
      <Skeleton className="aspect-square w-full rounded-none" />
      <div className="p-4 space-y-3">
        <div className="flex items-center justify-between">
          <Skeleton className="h-3 w-20" />
          <Skeleton className="h-3 w-10" />
        </div>
        <Skeleton className="h-4 w-3/4" />
        <Skeleton className="h-3 w-1/2" />
        <div className="pt-2 border-t border-border/60 flex items-center justify-between">
          <Skeleton className="h-5 w-16" />
          <Skeleton className="h-8 w-8 rounded-lg" />
        </div>
      </div>
    </div>
  );
};

export const ProductListSkeleton = ({ count = 8 }) => {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 sm:gap-6">
      {Array.from({ length: count }).map((_, i) => (
        <ProductCardSkeleton key={i} />
      ))}
    </div>
  );
};

export const StatCardSkeleton = () => {
  return (
    <div className="bg-surface p-5 rounded-2xl border border-border shadow-subtle flex items-start justify-between">
      <div className="space-y-2 flex-1">
        <Skeleton className="h-3 w-24" />
        <Skeleton className="h-6 w-32" />
        <Skeleton className="h-3 w-20" />
      </div>
      <Skeleton className="w-10 h-10 rounded-xl" />
    </div>
  );
};

export const TableSkeleton = ({ rows = 5, cols = 5 }) => {
  return (
    <div className="w-full bg-surface rounded-2xl border border-border overflow-hidden shadow-subtle">
      {/* Table Header Skeleton */}
      <div className="p-4 bg-surface-muted/50 border-b border-border flex items-center justify-between gap-4">
        {Array.from({ length: cols }).map((_, idx) => (
          <Skeleton key={`th-${idx}`} className="h-4 flex-1 max-w-[120px]" />
        ))}
      </div>
      {/* Rows */}
      <div className="divide-y divide-border/60">
        {Array.from({ length: rows }).map((_, rIdx) => (
          <div key={`tr-${rIdx}`} className="p-4 flex items-center justify-between gap-4">
            {Array.from({ length: cols }).map((_, cIdx) => (
              <Skeleton
                key={`td-${rIdx}-${cIdx}`}
                className={`h-4 flex-1 ${cIdx === 0 ? 'max-w-[160px]' : 'max-w-[100px]'}`}
              />
            ))}
          </div>
        ))}
      </div>
    </div>
  );
};

export const ProductDetailSkeleton = () => {
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12">
        {/* Gallery */}
        <div className="space-y-4">
          <Skeleton className="aspect-square w-full rounded-2xl" />
          <div className="grid grid-cols-4 gap-3">
            {Array.from({ length: 4 }).map((_, i) => (
              <Skeleton key={i} className="aspect-square rounded-xl" />
            ))}
          </div>
        </div>
        {/* Info */}
        <div className="space-y-6">
          <div className="space-y-2">
            <Skeleton className="h-4 w-28" />
            <Skeleton className="h-8 w-4/5" />
            <Skeleton className="h-4 w-40" />
          </div>
          <Skeleton className="h-10 w-36" />
          <Skeleton className="h-20 w-full rounded-xl" />
          <div className="space-y-3 pt-4 border-t border-border">
            <Skeleton className="h-4 w-32" />
            <div className="flex gap-2">
              <Skeleton className="h-10 w-16 rounded-lg" />
              <Skeleton className="h-10 w-16 rounded-lg" />
              <Skeleton className="h-10 w-16 rounded-lg" />
            </div>
          </div>
          <div className="flex gap-4 pt-4">
            <Skeleton className="h-12 flex-1 rounded-xl" />
            <Skeleton className="h-12 w-12 rounded-xl" />
          </div>
        </div>
      </div>
    </div>
  );
};

export const OrderDetailSkeleton = () => {
  return (
    <div className="space-y-6">
      <div className="bg-surface p-6 rounded-2xl border border-border shadow-subtle space-y-4">
        <div className="flex justify-between items-center">
          <Skeleton className="h-6 w-48" />
          <Skeleton className="h-6 w-24 rounded-full" />
        </div>
        <Skeleton className="h-4 w-64" />
      </div>
      <div className="bg-surface p-6 rounded-2xl border border-border shadow-subtle space-y-4">
        <Skeleton className="h-5 w-36" />
        {Array.from({ length: 2 }).map((_, i) => (
          <div key={i} className="flex gap-4 items-center">
            <Skeleton className="w-16 h-16 rounded-xl" />
            <div className="flex-1 space-y-2">
              <Skeleton className="h-4 w-3/4" />
              <Skeleton className="h-3 w-1/4" />
            </div>
            <Skeleton className="h-5 w-20" />
          </div>
        ))}
      </div>
    </div>
  );
};

export const ReviewSkeleton = ({ count = 3 }) => {
  return (
    <div className="space-y-4">
      {Array.from({ length: count }).map((_, i) => (
        <div key={i} className="bg-surface p-4 rounded-xl border border-border space-y-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2.5">
              <Skeleton className="w-8 h-8 rounded-full" />
              <Skeleton className="h-4 w-28" />
            </div>
            <Skeleton className="h-3 w-16" />
          </div>
          <Skeleton className="h-3 w-full" />
          <Skeleton className="h-3 w-4/5" />
        </div>
      ))}
    </div>
  );
};

export default Spinner;
