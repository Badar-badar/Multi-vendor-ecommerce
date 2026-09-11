import React, { forwardRef } from 'react';

export const Input = forwardRef(
  (
    {
      label,
      error,
      helperText,
      leftIcon: LeftIcon,
      rightIcon: RightIcon,
      onRightIconClick,
      size = 'md',
      fullWidth = true,
      className = '',
      type = 'text',
      disabled = false,
      required = false,
      ...props
    },
    ref
  ) => {
    const sizeClasses = {
      sm: 'px-3 py-1.5 text-xs rounded-xl',
      md: 'px-3.5 py-2.5 text-sm rounded-xl',
      lg: 'px-4 py-3 text-base rounded-2xl',
    };

    const iconSizes = {
      sm: 'w-3.5 h-3.5',
      md: 'w-4 h-4',
      lg: 'w-5 h-5',
    };

    const leftPadding = LeftIcon
      ? size === 'sm'
        ? 'pl-8'
        : size === 'lg'
        ? 'pl-11'
        : 'pl-10'
      : '';

    const rightPadding = RightIcon
      ? size === 'sm'
        ? 'pr-8'
        : size === 'lg'
        ? 'pr-11'
        : 'pr-10'
      : '';

    return (
      <div className={`${fullWidth ? 'w-full' : ''} space-y-1`}>
        {label && (
          <label className="block text-xs font-bold text-slate-700">
            {label}
            {required && <span className="text-rose-500 ml-0.5">*</span>}
          </label>
        )}

        <div className="relative flex items-center">
          {LeftIcon && (
            <div className="absolute left-3 flex items-center pointer-events-none text-slate-400">
              <LeftIcon className={iconSizes[size] || 'w-4 h-4'} />
            </div>
          )}

          <input
            ref={ref}
            type={type}
            disabled={disabled}
            required={required}
            className={`
              w-full bg-slate-50/70 border border-slate-200 text-slate-900 
              placeholder:text-slate-400 font-medium
              transition-all duration-150
              focus:bg-white focus:outline-none focus:ring-1 focus:ring-slate-900 focus:border-slate-900
              disabled:opacity-50 disabled:cursor-not-allowed
              ${error ? 'border-rose-500 focus:ring-rose-500 focus:border-rose-500 bg-rose-50/10' : ''}
              ${sizeClasses[size] || sizeClasses.md}
              ${leftPadding}
              ${rightPadding}
              ${className}
            `}
            {...props}
          />

          {RightIcon && (
            <button
              type="button"
              onClick={onRightIconClick}
              tabIndex={onRightIconClick ? 0 : -1}
              className={`absolute right-3 flex items-center text-slate-400 ${
                onRightIconClick ? 'hover:text-slate-700 cursor-pointer' : 'pointer-events-none'
              }`}
            >
              <RightIcon className={iconSizes[size] || 'w-4 h-4'} />
            </button>
          )}
        </div>

        {error && <p className="text-[11px] text-rose-500 font-semibold">{error}</p>}
        {!error && helperText && <p className="text-[11px] text-slate-500">{helperText}</p>}
      </div>
    );
  }
);

Input.displayName = 'Input';

export default Input;
