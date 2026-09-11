import { forwardRef, useId } from 'react';
import { Check } from 'lucide-react';

export const Checkbox = forwardRef(({
  id: customId,
  name,
  label,
  description,
  checked,
  defaultChecked,
  onChange,
  disabled = false,
  error,
  className = '',
  ...props
}, ref) => {
  const generatedId = useId();
  const id = customId || generatedId;

  return (
    <div className={`flex items-start gap-2.5 ${className}`}>
      <div className="relative flex items-center justify-center mt-0.5">
        <input
          ref={ref}
          type="checkbox"
          id={id}
          name={name}
          checked={checked}
          defaultChecked={defaultChecked}
          onChange={onChange}
          disabled={disabled}
          className="peer sr-only"
          {...props}
        />
        <label
          htmlFor={id}
          className={`w-4 h-4 rounded border transition-standard flex items-center justify-center cursor-pointer select-none peer-focus-visible:ring-2 peer-focus-visible:ring-primary peer-focus-visible:ring-offset-1 ${
            disabled ? 'opacity-50 cursor-not-allowed bg-surface-muted' : 'bg-surface'
          } ${
            error
              ? 'border-error'
              : 'border-border peer-checked:bg-primary peer-checked:border-primary'
          }`}
        >
          <Check className="w-3 h-3 text-white stroke-[3] opacity-0 peer-checked:opacity-100 transition-opacity" />
        </label>
      </div>

      {(label || description) && (
        <div className="flex flex-col">
          {label && (
            <label
              htmlFor={id}
              className={`text-xs font-medium cursor-pointer select-none ${
                disabled ? 'text-text-muted cursor-not-allowed' : 'text-text-main'
              }`}
            >
              {label}
            </label>
          )}
          {description && (
            <p className="text-[11px] text-text-muted leading-tight mt-0.5">
              {description}
            </p>
          )}
          {error && (
            <p className="text-[11px] text-error mt-0.5">{error}</p>
          )}
        </div>
      )}
    </div>
  );
});

Checkbox.displayName = 'Checkbox';

export default Checkbox;
