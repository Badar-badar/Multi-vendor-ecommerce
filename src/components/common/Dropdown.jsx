import React, { useState, useRef, useEffect, createContext, useContext } from 'react';

const DropdownContext = createContext(null);

export const Dropdown = ({ children, align = 'right', className = '' }) => {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };

    const handleKeyDown = (event) => {
      if (event.key === 'Escape') {
        setIsOpen(false);
      }
    };

    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
      document.addEventListener('keydown', handleKeyDown);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, [isOpen]);

  const toggle = () => setIsOpen((prev) => !prev);
  const close = () => setIsOpen(false);

  return (
    <DropdownContext.Provider value={{ isOpen, toggle, close, align }}>
      <div ref={dropdownRef} className={`relative inline-block text-left ${className}`}>
        {children}
      </div>
    </DropdownContext.Provider>
  );
};

export const DropdownTrigger = ({ children, asChild = false }) => {
  const { toggle, isOpen } = useContext(DropdownContext);

  if (asChild && React.isValidElement(children)) {
    return React.cloneElement(children, {
      onClick: (e) => {
        children.props.onClick?.(e);
        toggle();
      },
      'aria-expanded': isOpen,
      'aria-haspopup': true,
    });
  }

  return (
    <button
      type="button"
      onClick={toggle}
      aria-expanded={isOpen}
      aria-haspopup="true"
      className="inline-flex items-center gap-1.5 focus-ring rounded-lg cursor-pointer"
    >
      {children}
    </button>
  );
};

export const DropdownMenu = ({ children, width = 'w-56', className = '' }) => {
  const { isOpen, align } = useContext(DropdownContext);

  if (!isOpen) return null;

  const alignments = {
    right: 'right-0 origin-top-right',
    left: 'left-0 origin-top-left',
    center: 'left-1/2 -translate-x-1/2 origin-top',
  };

  return (
    <div
      role="menu"
      className={`absolute ${alignments[align] || alignments.right} mt-2 ${width} bg-surface rounded-xl border border-border shadow-lg py-1.5 z-50 animate-in fade-in zoom-in-95 duration-150 ${className}`}
    >
      {children}
    </div>
  );
};

export const DropdownItem = ({
  children,
  onClick,
  icon: Icon,
  variant = 'default',
  disabled = false,
  className = '',
  ...props
}) => {
  const { close } = useContext(DropdownContext);

  const handleClick = (e) => {
    if (disabled) return;
    onClick?.(e);
    close();
  };

  const variants = {
    default: 'text-text-main hover:bg-surface-muted hover:text-text-main',
    danger: 'text-error hover:bg-error-light hover:text-error-dark',
    accent: 'text-accent hover:bg-accent-light',
  };

  return (
    <button
      type="button"
      role="menuitem"
      disabled={disabled}
      onClick={handleClick}
      className={`w-full flex items-center gap-2.5 px-3.5 py-2 text-xs font-medium text-left transition-colors disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer ${
        variants[variant] || variants.default
      } ${className}`}
      {...props}
    >
      {Icon && <Icon className="w-4 h-4 shrink-0 text-current opacity-80" />}
      <span className="flex-1 truncate">{children}</span>
    </button>
  );
};

export const DropdownHeader = ({ title, subtitle, className = '' }) => (
  <div className={`px-3.5 py-2 border-b border-border/80 ${className}`}>
    {title && <p className="text-xs font-semibold text-text-main truncate">{title}</p>}
    {subtitle && <p className="text-[11px] text-text-muted truncate mt-0.5">{subtitle}</p>}
  </div>
);

export const DropdownDivider = ({ className = '' }) => (
  <div className={`my-1 border-t border-border/80 ${className}`} role="separator" />
);

export default Dropdown;
