import { forwardRef, useId } from 'react';
import FormField from './FormField';

export const Textarea = forwardRef(({
  id: customId,
  name,
  label,
  value,
  defaultValue,
  onChange,
  placeholder,
  rows = 4,
  maxLength,
  showCharCount = false,
  error,
  helperText,
  required = false,
  disabled = false,
  readOnly = false,
  className = '',
  textareaClassName = '',
  ...props
}, ref) => {
  const generatedId = useId();
  const id = customId || generatedId;

  const currentLength = typeof value === 'string' ? value.length : 0;

  return (
    <FormField
      id={id}
      label={label}
      required={required}
      error={error}
      helperText={helperText}
      className={className}
    >
      <div className="relative">
        <textarea
          ref={ref}
          id={id}
          name={name}
          rows={rows}
          maxLength={maxLength}
          value={value}
          defaultValue={defaultValue}
          onChange={onChange}
          placeholder={placeholder}
          disabled={disabled}
          readOnly={readOnly}
          required={required}
          className={`w-full text-xs sm:text-sm bg-surface rounded-lg border transition-standard focus-ring disabled:bg-surface-muted disabled:text-text-muted disabled:cursor-not-allowed px-3.5 py-2.5 resize-y ${
            error
              ? 'border-error text-text-main focus-visible:border-error focus-visible:ring-error/20'
              : 'border-border text-text-main hover:border-border-dark'
          } ${textareaClassName}`}
          {...props}
        />

        {showCharCount && maxLength && (
          <div className="text-[10px] text-text-subtle text-right mt-1 font-mono">
            {currentLength} / {maxLength}
          </div>
        )}
      </div>
    </FormField>
  );
});

Textarea.displayName = 'Textarea';

export default Textarea;
