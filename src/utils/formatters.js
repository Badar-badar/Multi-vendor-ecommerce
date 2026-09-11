/**
 * Centralized Data Formatting Utilities
 * Provides predictable, locale-aware formatting across all customer,
 * seller, and admin interfaces.
 */

/**
 * Format a numeric amount into a localized currency string
 * @param {number|string} amount
 * @param {string} [currency='USD']
 * @param {string} [locale='en-US']
 * @returns {string}
 */
export const formatCurrency = (amount, currency = 'USD', locale = 'en-US') => {
  const numericAmount = Number(amount);
  if (isNaN(numericAmount)) return '$0.00';

  return new Intl.NumberFormat(locale, {
    style: 'currency',
    currency,
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(numericAmount);
};

/**
 * Format a date into a localized readable date string (e.g., "Oct 12, 2026")
 * @param {string|Date} dateInput
 * @param {Intl.DateTimeFormatOptions} [options]
 * @returns {string}
 */
export const formatDate = (dateInput, options = {}) => {
  if (!dateInput) return '—';
  const date = new Date(dateInput);
  if (isNaN(date.getTime())) return '—';

  const defaultOptions = {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  };

  return new Intl.DateTimeFormat('en-US', { ...defaultOptions, ...options }).format(date);
};

/**
 * Format a date and time into a localized string (e.g., "Oct 12, 2026, 04:30 PM")
 * @param {string|Date} dateInput
 * @returns {string}
 */
export const formatDateTime = (dateInput) => {
  if (!dateInput) return '—';
  const date = new Date(dateInput);
  if (isNaN(date.getTime())) return '—';

  return new Intl.DateTimeFormat('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
    hour12: true,
  }).format(date);
};

/**
 * Format a raw number with thousands separators
 * @param {number|string} num
 * @param {number} [decimals=0]
 * @returns {string}
 */
export const formatNumber = (num, decimals = 0) => {
  const parsed = Number(num);
  if (isNaN(parsed)) return '0';

  return new Intl.NumberFormat('en-US', {
    minimumFractionDigits: decimals,
    maximumFractionDigits: decimals,
  }).format(parsed);
};

/**
 * Format a decimal or percentage value (e.g. 0.15 -> "15%" or 15 -> "15%")
 * @param {number|string} val
 * @param {boolean} [isDecimal=false] - If true, treats 0.15 as 15%
 * @returns {string}
 */
export const formatPercent = (val, isDecimal = false) => {
  const parsed = Number(val);
  if (isNaN(parsed)) return '0%';

  const percentage = isDecimal ? parsed * 100 : parsed;
  return `${percentage.toFixed(0)}%`;
};

/**
 * Format file size in bytes to human readable format (KB, MB, GB)
 * @param {number} bytes
 * @returns {string}
 */
export const formatFileSize = (bytes) => {
  if (!bytes || bytes === 0) return '0 Bytes';
  const k = 1024;
  const sizes = ['Bytes', 'KB', 'MB', 'GB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return `${parseFloat((bytes / Math.pow(k, i)).toFixed(1))} ${sizes[i]}`;
};

/**
 * Truncate long text strings cleanly
 * @param {string} text
 * @param {number} [maxLength=50]
 * @returns {string}
 */
export const truncateText = (text, maxLength = 50) => {
  if (!text) return '';
  if (text.length <= maxLength) return text;
  return `${text.slice(0, maxLength)}...`;
};
