import { config } from '../config/env.js';

const SENSITIVE_KEYS = [
  'password',
  'token',
  'refreshtoken',
  'authorization',
  'cookie',
  'secret',
  'creditcard',
  'cvv',
];

/**
 * Recursively sanitizes objects to ensure sensitive data is never logged.
 */
const sanitizeData = (data) => {
  if (!data || typeof data !== 'object') return data;
  if (Array.isArray(data)) return data.map(sanitizeData);

  const sanitized = {};
  for (const [key, value] of Object.entries(data)) {
    const isSensitive = SENSITIVE_KEYS.some((s) => key.toLowerCase().includes(s));
    if (isSensitive) {
      sanitized[key] = '[REDACTED]';
    } else if (value && typeof value === 'object') {
      sanitized[key] = sanitizeData(value);
    } else {
      sanitized[key] = value;
    }
  }
  return sanitized;
};

const formatMessage = (level, message, meta = null) => {
  const timestamp = new Date().toISOString();
  let logStr = `[${timestamp}] [${level.toUpperCase()}]: ${message}`;
  if (meta && Object.keys(meta).length > 0) {
    const safeMeta = sanitizeData(meta);
    logStr += ` ${JSON.stringify(safeMeta)}`;
  }
  return logStr;
};

export const logger = {
  info: (message, meta = null) => {
    console.log(formatMessage('info', message, meta));
  },
  warn: (message, meta = null) => {
    console.warn(formatMessage('warn', message, meta));
  },
  error: (message, meta = null) => {
    console.error(formatMessage('error', message, meta));
  },
  debug: (message, meta = null) => {
    if (config.isDevelopment) {
      console.debug(formatMessage('debug', message, meta));
    }
  },
};

export default logger;
