import { forwardRef } from 'react';
import { Loader2 } from 'lucide-react';

export const Button = forwardRef(({
  children,
  type = 'button',
  variant = 'primary',
  size = 'md',
  disabled = false,
  loading = false,
  leftIcon: LeftIcon,
  rightIcon: RightIcon,
  fullWidth = false,
  className = '',
  onClick,
  ...props
}, ref) => {
  const baseStyles =
    'inline-flex items-center justify-center font-medium rounded-lg transition-standard focus-ring disabled:opacity-50 disabled:cursor-not-allowed select-none cursor-pointer';

  const variants = {
    primary:
      'bg-primary text-white font-semibold hover:bg-primary-hover active:scale-[0.98] shadow-subtle',
    secondary:
      'bg-surface text-text-main hover:bg-surface-hover border border-border shadow-xs active:scale-[0.98]',
    accent:
      'bg-accent text-white font-semibold hover:bg-accent-hover active:scale-[0.98] shadow-subtle',
    outline:
      'bg-transparent border border-border text-text-main hover:border-primary hover:bg-surface-muted active:scale-[0.98]',
    ghost:
      'bg-transparent text-text-main hover:bg-surface-muted hover:text-text-main active:scale-[0.98]',
    danger:
      'bg-error text-white hover:bg-error-dark active:scale-[0.98] shadow-subtle',
    link:
      'bg-transparent text-accent hover:text-accent-hover hover:underline p-0 h-auto font-medium',
  };

  const sizes = {
    sm: 'text-xs px-3 py-1.5 gap-1.5 min-h-[32px]',
    md: 'text-sm px-4 py-2.5 gap-2 min-h-[40px]',
    lg: 'text-base px-6 py-3 gap-2.5 min-h-[48px]',
    icon: 'p-2 min-h-[36px] min-w-[36px] aspect-square',
    'icon-sm': 'p-1.5 min-h-[28px] min-w-[28px] aspect-square text-xs',
  };

  const widthStyle = fullWidth ? 'w-full' : '';

  return (
    <button
      ref={ref}
      type={type}
      disabled={disabled || loading}
      className={`${baseStyles} ${variants[variant] || variants.primary} ${
        sizes[size] || sizes.md
      } ${widthStyle} ${className}`}
      onClick={onClick}
      {...props}
    >
      {loading ? (
        <span className="inline-flex items-center gap-2">
          <Loader2 className="w-4 h-4 animate-spin text-current" />
          {children && <span>{children}</span>}
        </span>
      ) : (
        <>
          {LeftIcon && <LeftIcon className="w-4 h-4 shrink-0" />}
          {children}
          {RightIcon && <RightIcon className="w-4 h-4 shrink-0" />}
        </>
      )}
    </button>
  );
});

Button.displayName = 'Button';

export default Button;
