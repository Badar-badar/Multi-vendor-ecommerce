import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Explicitly load .env from backend root
dotenv.config({ path: path.resolve(__dirname, '../.env') });

/**
 * Validates essential environment variables and fails fast with a clear error message.
 */
const validateEnv = () => {
  const required = ['NODE_ENV', 'PORT', 'MONGO_URI', 'CLIENT_URL'];
  const missing = required.filter((key) => !process.env[key]);

  if (missing.length > 0) {
    throw new Error(
      `[Config Error] Missing required environment variables: ${missing.join(', ')}.\n` +
      `Please check your backend/.env file.`
    );
  }
};

validateEnv();

/**
 * Centralized, validated application configuration object.
 * Prevents process.env scattering across the codebase.
 */
export const config = Object.freeze({
  env: process.env.NODE_ENV || 'development',
  isProduction: process.env.NODE_ENV === 'production',
  isDevelopment: process.env.NODE_ENV === 'development',
  isTest: process.env.NODE_ENV === 'test',

  port: parseInt(process.env.PORT || '5000', 10),
  mongoUri: process.env.MONGO_URI,
  clientUrl: process.env.CLIENT_URL || 'http://localhost:5173',
  apiPrefix: '/api/v1',

  rateLimit: {
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: 1000, // General limit per IP for foundation
    standardHeaders: true,
    legacyHeaders: false,
  },

  // Future phase service configurations (safe defaults/placeholders)
  jwt: {
    secret: process.env.JWT_SECRET || 'dev-secret-key-placeholder',
    expiresIn: process.env.JWT_EXPIRES_IN || '7d',
    refreshSecret: process.env.JWT_REFRESH_SECRET || 'dev-refresh-secret-placeholder',
    refreshExpiresIn: process.env.JWT_REFRESH_EXPIRES_IN || '30d',
  },

  google: {
    clientId: process.env.GOOGLE_CLIENT_ID || '',
    clientSecret: process.env.GOOGLE_CLIENT_SECRET || '',
  },

  mail: {
    host: process.env.SMTP_HOST || '',
    port: parseInt(process.env.SMTP_PORT || '587', 10),
    user: process.env.SMTP_USER || '',
    password: process.env.SMTP_PASSWORD || '',
    from: process.env.MAIL_FROM || 'Zareen <noreply@zareen.com>',
  },

  stripe: {
    secretKey: process.env.STRIPE_SECRET_KEY || '',
    webhookSecret: process.env.STRIPE_WEBHOOK_SECRET || '',
    currency: (process.env.STRIPE_CURRENCY || 'pkr').toLowerCase(),
  },

  redis: {
    url: process.env.REDIS_URL || 'redis://localhost:6379',
  },

  cloudinary: {
    cloudName: process.env.CLOUDINARY_CLOUD_NAME || '',
    apiKey: process.env.CLOUDINARY_API_KEY || '',
    apiSecret: process.env.CLOUDINARY_API_SECRET || '',
  },
});

export default config;
