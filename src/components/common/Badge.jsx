import { X } from 'lucide-react';

export const Badge = ({
  children,
  variant = 'default',
  size = 'sm',
  dot = false,
  removable = false,
  onRemove,
  className = '',
  ...props
}) => {
  const baseStyles = 'inline-flex items-center font-medium transition-colors select-none';

  const variants = {
    default: 'bg-surface-muted text-text-muted border border-border',
    primary: 'bg-primary text-text-inverse border border-primary shadow-xs font-semibold',
    accent: 'bg-accent-light text-accent-hover border border-accent/20 font-semibold',
    secondary: 'bg-secondary-light text-secondary border border-secondary/20 font-semibold',
    success: 'bg-success-light text-success-dark border border-success/20 font-semibold',
    warning: 'bg-warning-light text-warning-dark border border-warning/20 font-semibold',
    error: 'bg-error-light text-error-dark border border-error/20 font-semibold',
    info: 'bg-info-light text-info-dark border border-info/20 font-semibold',
    outline: 'border border-border text-text-muted bg-transparent',
    ghost: 'text-text-muted bg-surface-muted/60',
  };

  const sizes = {
    xs: 'text-[10px] px-2 py-0.5 rounded gap-1 tracking-wider uppercase font-semibold',
    sm: 'text-xs px-2.5 py-0.5 rounded-full gap-1.5',
    md: 'text-sm px-3 py-1 rounded-full gap-1.5',
  };

  const dotColors = {
    default: 'bg-text-subtle',
    primary: 'bg-white',
    accent: 'bg-accent',
    secondary: 'bg-secondary',
    success: 'bg-success',
    warning: 'bg-warning',
    error: 'bg-error',
    info: 'bg-info',
    outline: 'bg-text-muted',
    ghost: 'bg-text-subtle',
  };

  return (
    <span
      className={`${baseStyles} ${variants[variant] || variants.default} ${
        sizes[size] || sizes.sm
      } ${className}`}
      {...props}
    >
      {dot && (
        <span
          className={`w-1.5 h-1.5 rounded-full shrink-0 ${
            dotColors[variant] || 'bg-current'
          }`}
        />
      )}
      {children}
      {removable && onRemove && (
        <button
          type="button"
          onClick={(e) => {
            e.stopPropagation();
            onRemove();
          }}
          className="hover:opacity-75 focus:outline-none ml-0.5 p-0.5 rounded-full hover:bg-black/5 cursor-pointer"
          aria-label="Remove"
        >
          <X className="w-3 h-3" />
        </button>
      )}
    </span>
  );
};

export default Badge;
