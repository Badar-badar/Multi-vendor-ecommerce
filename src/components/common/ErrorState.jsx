import React, { useState } from 'react';
import { AlertTriangle, RotateCcw, Home, Copy, Check, ChevronDown, ChevronUp } from 'lucide-react';
import { Link } from 'react-router-dom';
import Button from './Button';

export const ErrorState = ({
  title = 'Something went wrong',
  message = 'An unexpected error occurred while loading this section. Please try again.',
  error,
  onRetry,
  retryLabel = 'Try Again',
  showHomeButton = true,
  compact = false,
  className = '',
}) => {
  const [copied, setCopied] = useState(false);
  const [showDetails, setShowDetails] = useState(false);

  const rawErrorMessage = typeof error === 'string' ? error : error?.message || (error ? JSON.stringify(error) : null);

  const handleCopyError = () => {
    if (rawErrorMessage) {
      navigator.clipboard.writeText(rawErrorMessage);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  if (compact) {
    return (
      <div className={`p-4 bg-rose-50/70 border border-rose-200 rounded-xl flex items-center justify-between gap-3 ${className}`}>
        <div className="flex items-center gap-3 min-w-0">
          <AlertTriangle className="w-5 h-5 text-rose-600 shrink-0" />
          <p className="text-xs font-semibold text-rose-900 truncate">
            {message || title}
          </p>
        </div>
        {onRetry && (
          <button
            type="button"
            onClick={onRetry}
            className="text-xs font-bold text-rose-700 hover:text-rose-900 flex items-center gap-1 shrink-0 cursor-pointer"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span>{retryLabel}</span>
          </button>
        )}
      </div>
    );
  }

  return (
    <div
      className={`flex flex-col items-center justify-center text-center p-8 sm:p-12 bg-surface rounded-2xl border border-rose-200/80 shadow-subtle my-6 ${className}`}
    >
      <div className="w-16 h-16 rounded-2xl bg-rose-50 text-rose-600 flex items-center justify-center mb-4 border border-rose-200 shadow-xs">
        <AlertTriangle className="w-8 h-8 stroke-[1.5]" />
      </div>

      <h3 className="font-serif text-lg sm:text-xl font-bold text-text-main tracking-tight mb-2">
        {title}
      </h3>

      <p className="text-xs sm:text-sm text-text-muted max-w-md leading-relaxed mb-6">
        {message}
      </p>

      {rawErrorMessage && (
        <div className="w-full max-w-md bg-surface-muted p-3 rounded-xl border border-border text-left mb-6 overflow-hidden">
          <div className="flex items-center justify-between pb-1.5 border-b border-border/60 mb-2">
            <button
              type="button"
              onClick={() => setShowDetails(!showDetails)}
              className="text-[11px] font-semibold text-text-muted flex items-center gap-1 cursor-pointer"
            >
              <span>Technical Details</span>
              {showDetails ? <ChevronUp className="w-3 h-3" /> : <ChevronDown className="w-3 h-3" />}
            </button>
            <button
              type="button"
              onClick={handleCopyError}
              className="text-[11px] font-semibold text-accent hover:underline flex items-center gap-1 cursor-pointer"
            >
              {copied ? <Check className="w-3 h-3 text-emerald-600" /> : <Copy className="w-3 h-3" />}
              <span>{copied ? 'Copied' : 'Copy'}</span>
            </button>
          </div>
          <p className={`text-[11px] font-mono text-rose-600 break-all ${showDetails ? '' : 'line-clamp-2'}`}>
            {rawErrorMessage}
          </p>
        </div>
      )}

      <div className="flex flex-wrap items-center justify-center gap-3">
        {onRetry && (
          <Button
            variant="primary"
            size="md"
            onClick={onRetry}
            leftIcon={RotateCcw}
          >
            {retryLabel}
          </Button>
        )}

        {showHomeButton && (
          <Link to="/">
            <Button variant="outline" size="md" leftIcon={Home}>
              Back to Home
            </Button>
          </Link>
        )}
      </div>
    </div>
  );
};

export default ErrorState;
