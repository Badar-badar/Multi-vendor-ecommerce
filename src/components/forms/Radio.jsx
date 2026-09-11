import { forwardRef, useId } from 'react';

export const Radio = forwardRef(({
  id: customId,
  name,
  label,
  description,
  value,
  checked,
  defaultChecked,
  onChange,
  disabled = false,
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
          type="radio"
          id={id}
          name={name}
          value={value}
          checked={checked}
          defaultChecked={defaultChecked}
          onChange={onChange}
          disabled={disabled}
          className="peer sr-only"
          {...props}
        />
        <label
          htmlFor={id}
          className={`w-4 h-4 rounded-full border transition-standard flex items-center justify-center cursor-pointer select-none peer-focus-visible:ring-2 peer-focus-visible:ring-primary peer-focus-visible:ring-offset-1 ${
            disabled ? 'opacity-50 cursor-not-allowed bg-surface-muted' : 'bg-surface'
          } border-border peer-checked:border-primary`}
        >
          <span className="w-2 h-2 rounded-full bg-primary opacity-0 peer-checked:opacity-100 transition-opacity" />
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
        </div>
      )}
    </div>
  );
});

Radio.displayName = 'Radio';

export default Radio;
