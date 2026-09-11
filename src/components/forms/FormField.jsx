import { AlertCircle } from 'lucide-react';

export const FormField = ({
  id,
  label,
  required = false,
  error,
  helperText,
  children,
  className = '',
}) => {
  return (
    <div className={`flex flex-col gap-1.5 ${className}`}>
      {label && (
        <div className="flex items-center justify-between">
          <label
            htmlFor={id}
            className="text-xs font-semibold text-text-main flex items-center gap-1 select-none"
          >
            {label}
            {required && <span className="text-error" title="Required">*</span>}
          </label>
        </div>
      )}

      {children}

      {error ? (
        <p className="flex items-center gap-1 text-[11px] font-medium text-error mt-0.5 animate-in fade-in duration-150" role="alert">
          <AlertCircle className="w-3.5 h-3.5 shrink-0" />
          <span>{error}</span>
        </p>
      ) : helperText ? (
        <p className="text-[11px] text-text-muted mt-0.5 leading-normal">
          {helperText}
        </p>
      ) : null}
    </div>
  );
};

export default FormField;
