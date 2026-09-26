import http from 'http';
import { app } from './app.js';
import { config } from './config/env.js';
import { connectDB, disconnectDB } from './database/connectDB.js';
import { logger } from './utils/logger.js';
import { initSocket } from './utils/socket.js';
import './workers/reportWorker.js';

import './workers/emailWorker.js';

import { disconnectRedis } from './config/redis.js';

let server;

/**
 * Graceful shutdown lifecycle handler
 */
const handleGracefulShutdown = async (signal) => {
  logger.warn(`[Server] Received ${signal}. Commencing graceful shutdown...`);

  if (server) {
    server.close(async () => {
      logger.info('[Server] HTTP server closed cleanly. Terminating services...');
      try {
        await disconnectRedis();
        await disconnectDB();
        logger.info('[Server] Graceful shutdown process complete. Exiting.');
        process.exit(0);
      } catch (err) {
        logger.error(`[Server] Error during services shutdown: ${err.message}`);
        process.exit(1);
      }
    });

    // Force terminate after 10 seconds if shutdown stalls
    setTimeout(() => {
      logger.error('[Server] Graceful shutdown timed out after 10s. Forcing exit.');
      process.exit(1);
    }, 10000);
  } else {
    process.exit(0);
  }
};

/**
 * Starts the application
 */
const startServer = async () => {
  try {
    // 1. Connect to Database first
    await connectDB();

    // 2. Create HTTP Server & Initialize Real-Time WebSockets
    const httpServer = http.createServer(app);
    initSocket(httpServer);

    // 3. Start HTTP Server
    server = httpServer.listen(config.port, () => {
      logger.info(
        `[Server] Zareen Backend running in '${config.env}' mode on port ${config.port}`
      );
      logger.info(`[Server] API Health Check: http://localhost:${config.port}${config.apiPrefix}/health`);
      logger.info(`[Server] Allowed CORS Origin: ${config.clientUrl}`);
    });
  } catch (error) {
    logger.error(`[Server] Fatal error during startup: ${error.message}`);
    process.exit(1);
  }
};

// Listen for process termination signals
process.on('SIGTERM', () => handleGracefulShutdown('SIGTERM'));
process.on('SIGINT', () => handleGracefulShutdown('SIGINT'));

// Uncaught Exceptions & Unhandled Rejections
process.on('uncaughtException', (err) => {
  logger.error(`[Server] UNCAUGHT EXCEPTION: ${err.message}`, { stack: err.stack });
  handleGracefulShutdown('UNCAUGHT_EXCEPTION');
});

process.on('unhandledRejection', (reason, promise) => {
  logger.error(`[Server] UNHANDLED PROMISE REJECTION: ${reason}`);
  handleGracefulShutdown('UNHANDLED_REJECTION');
});

// Launch server
startServer();
