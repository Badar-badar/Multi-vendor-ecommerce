import Redis from 'ioredis';
import { config } from './env.js';
import { logger } from '../utils/logger.js';

let redisClient = null;
let isRedisConnected = false;

/**
 * Initializes and exports the shared Redis client with graceful error handling
 */
export const getRedisClient = () => {
  if (redisClient) {
    return redisClient;
  }

  try {
    if (config.redis?.url) {
      redisClient = new Redis(config.redis.url, {
        maxRetriesPerRequest: 1,
        retryStrategy(times) {
          if (times > 3) {
            // Stop retry in dev when Redis is not running
            return null;
          }
          return Math.min(times * 200, 1000);
        },
        enableOfflineQueue: false,
        lazyConnect: true,
      });

      redisClient.on('connect', () => {
        isRedisConnected = true;
        logger.info('[Redis] Connected to Redis cache service successfully.');
      });

      redisClient.on('ready', () => {
        isRedisConnected = true;
      });

      redisClient.on('error', (err) => {
        isRedisConnected = false;
        // Keep logs clean when Redis is absent during local development
        if (config.isDevelopment) {
          logger.warn(`[Redis] Cache offline (graceful fallback active): ${err.message}`);
        } else {
          logger.error(`[Redis] Cache error: ${err.message}`);
        }
      });

      redisClient.on('close', () => {
        isRedisConnected = false;
      });

      // Attempt initial connection asynchronously
      redisClient.connect().catch((err) => {
        logger.warn(`[Redis] Initial connection attempt skipped: ${err.message}`);
      });
    }
  } catch (error) {
    logger.warn(`[Redis] Initialization skipped: ${error.message}`);
  }

  return redisClient;
};

/**
 * Checks if Redis is currently connected and operational
 */
export const isRedisReady = () => {
  return isRedisConnected && redisClient !== null && redisClient.status === 'ready';
};

/**
 * Gracefully disconnects the Redis client
 */
export const disconnectRedis = async () => {
  if (redisClient) {
    try {
      await redisClient.quit();
      logger.info('[Redis] Connection closed gracefully.');
    } catch (err) {
      logger.warn(`[Redis] Error during shutdown: ${err.message}`);
    } finally {
      redisClient = null;
      isRedisConnected = false;
    }
  }
};

export default {
  getRedisClient,
  isRedisReady,
  disconnectRedis,
};
