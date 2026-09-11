import { forwardRef } from 'react';

export const Card = forwardRef(({
  children,
  className = '',
  variant = 'default',
  hover = false,
  padding = 'none',
  onClick,
  ...props
}, ref) => {
  const baseStyles = 'bg-surface rounded-xl transition-standard';

  const variants = {
    default: 'border border-border shadow-subtle',
    bordered: 'border border-border',
    flat: 'bg-surface-muted/60 border border-border-subtle',
    elevated: 'border border-border/80 shadow-card',
    interactive: 'border border-border shadow-subtle hover:border-border-dark hover:shadow-card cursor-pointer',
  };

  const hoverStyle = hover && variant !== 'interactive' ? 'hover:shadow-card hover:border-border-dark' : '';

  const paddings = {
    none: '',
    sm: 'p-3 sm:p-4',
    md: 'p-4 sm:p-6',
    lg: 'p-6 sm:p-8',
  };

  return (
    <div
      ref={ref}
      className={`${baseStyles} ${variants[variant] || variants.default} ${hoverStyle} ${
        paddings[padding] || ''
      } ${className}`}
      onClick={onClick}
      {...props}
    >
      {children}
    </div>
  );
});

Card.displayName = 'Card';

export const CardHeader = ({ children, className = '', ...props }) => (
  <div className={`p-4 sm:p-6 pb-2 sm:pb-3 flex flex-col gap-1.5 ${className}`} {...props}>
    {children}
  </div>
);

export const CardTitle = ({ children, as: Component = 'h3', className = '', ...props }) => (
  <Component
    className={`font-serif text-lg sm:text-xl font-bold tracking-tight text-text-main ${className}`}
    {...props}
  >
    {children}
  </Component>
);

export const CardDescription = ({ children, className = '', ...props }) => (
  <p className={`text-xs sm:text-sm text-text-muted leading-relaxed ${className}`} {...props}>
    {children}
  </p>
);

export const CardContent = ({ children, className = '', ...props }) => (
  <div className={`p-4 sm:p-6 pt-0 ${className}`} {...props}>
    {children}
  </div>
);

export const CardFooter = ({ children, className = '', ...props }) => (
  <div
    className={`p-4 sm:p-6 pt-3 sm:pt-4 border-t border-border/60 flex items-center justify-between gap-4 ${className}`}
    {...props}
  >
    {children}
  </div>
);

export default Card;
