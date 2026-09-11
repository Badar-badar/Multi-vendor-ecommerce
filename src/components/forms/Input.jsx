import { forwardRef, useState, useId } from 'react';
import { Eye, EyeOff, XCircle } from 'lucide-react';
import FormField from './FormField';

export const Input = forwardRef(({
  id: customId,
  name,
  label,
  type = 'text',
  placeholder,
  value,
  defaultValue,
  onChange,
  onClear,
  error,
  helperText,
  required = false,
  disabled = false,
  readOnly = false,
  icon: Icon,
  endIcon: EndIcon,
  className = '',
  inputClassName = '',
  ...props
}, ref) => {
  const generatedId = useId();
  const id = customId || generatedId;
  const [showPassword, setShowPassword] = useState(false);

  const isPassword = type === 'password';
  const effectiveType = isPassword ? (showPassword ? 'text' : 'password') : type;

  return (
    <FormField
      id={id}
      label={label}
      required={required}
      error={error}
      helperText={helperText}
      className={className}
    >
      <div className="relative flex items-center">
        {Icon && (
          <div className="absolute left-3 text-text-muted pointer-events-none flex items-center justify-center">
            <Icon className="w-4 h-4" />
          </div>
        )}

        <input
          ref={ref}
          id={id}
          name={name}
          type={effectiveType}
          placeholder={placeholder}
          value={value}
          defaultValue={defaultValue}
          onChange={onChange}
          disabled={disabled}
          readOnly={readOnly}
          required={required}
          className={`w-full text-xs sm:text-sm bg-surface rounded-lg border transition-standard focus-ring disabled:bg-surface-muted disabled:text-text-muted disabled:cursor-not-allowed ${
            Icon ? 'pl-9' : 'pl-3.5'
          } ${
            isPassword || EndIcon || onClear ? 'pr-10' : 'pr-3.5'
          } py-2.5 ${
            error
              ? 'border-error text-text-main focus-visible:border-error focus-visible:ring-error/20'
              : 'border-border text-text-main hover:border-border-dark'
          } ${inputClassName}`}
          {...props}
        />

        {/* Right Action: Password reveal or custom EndIcon or Clear */}
        {isPassword ? (
          <button
            type="button"
            onClick={() => setShowPassword(!showPassword)}
            className="absolute right-3 text-text-muted hover:text-text-main transition-colors p-0.5 rounded focus:outline-none cursor-pointer"
            aria-label={showPassword ? 'Hide password' : 'Show password'}
            tabIndex={-1}
          >
            {showPassword ? (
              <EyeOff className="w-4 h-4" />
            ) : (
              <Eye className="w-4 h-4" />
            )}
          </button>
        ) : onClear && value ? (
          <button
            type="button"
            onClick={onClear}
            className="absolute right-3 text-text-muted hover:text-text-main transition-colors p-0.5 rounded focus:outline-none cursor-pointer"
            aria-label="Clear input"
            tabIndex={-1}
          >
            <XCircle className="w-4 h-4" />
          </button>
        ) : EndIcon ? (
          <div className="absolute right-3 text-text-muted pointer-events-none flex items-center justify-center">
            <EndIcon className="w-4 h-4" />
          </div>
        ) : null}
      </div>
    </FormField>
  );
});

Input.displayName = 'Input';

export default Input;
