import express from 'express';
import helmet from 'helmet';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import compression from 'compression';
import morgan from 'morgan';
import { config } from './config/env.js';
import { generalRateLimiter } from './middleware/rateLimiter.js';
import { notFoundMiddleware } from './middleware/notFoundMiddleware.js';
import { errorMiddleware } from './middleware/errorMiddleware.js';
import { sendSuccess } from './utils/apiResponse.js';
import apiV1Routes from './routes/index.js';
import healthRoutes from './routes/healthRoutes.js';

// Initialize Express Application
export const app = express();

// 1. Security Headers (Helmet)
app.use(
  helmet({
    contentSecurityPolicy: false, // Set according to API requirements
    crossOriginEmbedderPolicy: false,
  })
);

// 2. Strict CORS Configuration (Tailored for React Frontend with Cookies)
app.use(
  cors({
    origin: (origin, callback) => {
      // Allow requests with no origin (like mobile apps, curl, server-to-server) or matching frontend
      if (!origin || origin === config.clientUrl) {
        callback(null, true);
      } else {
        callback(new Error(`CORS blocked request from origin: ${origin}`));
      }
    },
    credentials: true, // Required for secure HTTP-only cookies
    methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
    allowedHeaders: [
      'Content-Type',
      'Authorization',
      'X-Requested-With',
      'Accept',
      'Origin',
    ],
    exposedHeaders: ['Set-Cookie'],
  })
);

// 3. Body Parsers (With raw body capture for webhook signature verification)
app.use(
  express.json({
    limit: '10mb',
    verify: (req, res, buf) => {
      req.rawBody = buf;
    },
  })
);
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// 4. Cookie Parser
app.use(cookieParser());

// 5. Response Compression
app.use(compression());

// 6. Request Logging
if (config.isDevelopment) {
  app.use(morgan('dev'));
} else {
  app.use(morgan('combined'));
}

// 7. General Rate Limiter
app.use('/api', generalRateLimiter);

// 8. Root Welcome Endpoint
app.get('/', (req, res) => {
  return sendSuccess(res, {
    statusCode: 200,
    message: 'Welcome to Zareen Luxury E-Commerce REST API Engine',
    data: {
      name: 'Zareen API',
      version: '1.0.0',
      documentation: `${config.apiPrefix}/docs (Future Phase)`,
      healthCheck: `${config.apiPrefix}/health`,
    },
  });
});

// 9. Health Check Route Aliases (Direct /api/health for compatibility and /api/v1/health)
app.use('/api/health', healthRoutes);

// 10. Primary Versioned API Routes (/api/v1)
app.use(config.apiPrefix, apiV1Routes);

// 11. 404 Undefined Route Handler
app.use(notFoundMiddleware);

// 12. Centralized Global Error Handler
app.use(errorMiddleware);

export default app;
