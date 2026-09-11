import { forwardRef, useId } from 'react';
import { ChevronDown } from 'lucide-react';
import FormField from './FormField';

export const Select = forwardRef(({
  id: customId,
  name,
  label,
  value,
  defaultValue,
  onChange,
  options = [],
  placeholder,
  error,
  helperText,
  required = false,
  disabled = false,
  icon: Icon,
  className = '',
  selectClassName = '',
  children,
  ...props
}, ref) => {
  const generatedId = useId();
  const id = customId || generatedId;

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

        <select
          ref={ref}
          id={id}
          name={name}
          value={value}
          defaultValue={defaultValue}
          onChange={onChange}
          disabled={disabled}
          required={required}
          className={`w-full appearance-none text-xs sm:text-sm bg-surface rounded-lg border transition-standard focus-ring disabled:bg-surface-muted disabled:text-text-muted disabled:cursor-not-allowed cursor-pointer ${
            Icon ? 'pl-9' : 'pl-3.5'
          } pr-10 py-2.5 ${
            error
              ? 'border-error text-text-main focus-visible:border-error focus-visible:ring-error/20'
              : 'border-border text-text-main hover:border-border-dark'
          } ${selectClassName}`}
          {...props}
        >
          {placeholder && (
            <option value="" disabled>
              {placeholder}
            </option>
          )}

          {options && options.length > 0
            ? options.map((opt) => (
                <option
                  key={typeof opt === 'object' ? opt.value : opt}
                  value={typeof opt === 'object' ? opt.value : opt}
                  disabled={typeof opt === 'object' ? opt.disabled : false}
                >
                  {typeof opt === 'object' ? opt.label : opt}
                </option>
              ))
            : children}
        </select>

        <div className="absolute right-3 text-text-muted pointer-events-none flex items-center justify-center">
          <ChevronDown className="w-4 h-4" />
        </div>
      </div>
    </FormField>
  );
});

Select.displayName = 'Select';

export default Select;
