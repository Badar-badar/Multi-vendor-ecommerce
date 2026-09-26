import mongoose from 'mongoose';
import { config } from '../config/env.js';

/**
 * Health Service
 * Encapsulates system health inspection and diagnostics.
 */
export const getHealthStatus = () => {
  const dbStates = {
    0: 'disconnected',
    1: 'connected',
    2: 'connecting',
    3: 'disconnecting',
  };

  const dbState = dbStates[mongoose.connection.readyState] || 'unknown';

  return {
    status: dbState === 'connected' ? 'ok' : 'degraded',
    environment: config.env,
    timestamp: new Date().toISOString(),
    uptimeSeconds: Math.floor(process.uptime()),
    database: {
      status: dbState,
      name: mongoose.connection.name || 'zareen_ecommerce',
    },
    version: '1.0.0',
  };
};

export default {
  getHealthStatus,
};
