import { getRedisClient, isRedisReady } from '../config/redis.js';
import { logger } from '../utils/logger.js';

// Fast In-Memory Fallback Cache for local development without active Redis instance
const memoryCache = new Map();

/**
 * Retrieves cached value by key
 */
export const get = async (key) => {
  try {
    const client = getRedisClient();
    if (isRedisReady() && client) {
      const data = await client.get(key);
      return data ? JSON.parse(data) : null;
    }

    // Memory fallback
    const item = memoryCache.get(key);
    if (item) {
      if (Date.now() > item.expiresAt) {
        memoryCache.delete(key);
        return null;
      }
      return item.value;
    }
    return null;
  } catch (error) {
    logger.warn(`[CacheService] Error reading cache key '${key}': ${error.message}`);
    return null;
  }
};

/**
 * Sets a value in the cache with a Time-To-Live (in seconds)
 */
export const set = async (key, value, ttlSeconds = 300) => {
  try {
    const client = getRedisClient();
    if (isRedisReady() && client) {
      const serialized = JSON.stringify(value);
      await client.set(key, serialized, 'EX', ttlSeconds);
      return true;
    }

    // Memory fallback
    memoryCache.set(key, {
      value,
      expiresAt: Date.now() + ttlSeconds * 1000,
    });
    return true;
  } catch (error) {
    logger.warn(`[CacheService] Error setting cache key '${key}': ${error.message}`);
    return false;
  }
};

/**
 * Deletes a specific cache key
 */
export const del = async (key) => {
  try {
    const client = getRedisClient();
    if (isRedisReady() && client) {
      await client.del(key);
    }
    memoryCache.delete(key);
    return true;
  } catch (error) {
    logger.warn(`[CacheService] Error deleting cache key '${key}': ${error.message}`);
    return false;
  }
};

/**
 * Deletes keys matching a wildcard pattern (e.g. 'products:*', 'categories:*')
 */
export const deleteByPattern = async (pattern) => {
  try {
    const client = getRedisClient();
    if (isRedisReady() && client) {
      const keys = await client.keys(pattern);
      if (keys.length > 0) {
        await client.del(...keys);
      }
    }

    // Memory fallback pattern deletion
    const regexPattern = new RegExp('^' + pattern.replace(/\*/g, '.*') + '$');
    for (const key of memoryCache.keys()) {
      if (regexPattern.test(key)) {
        memoryCache.delete(key);
      }
    }
    return true;
  } catch (error) {
    logger.warn(`[CacheService] Error deleting pattern '${pattern}': ${error.message}`);
    return false;
  }
};

/**
 * Clears entire cache
 */
export const clearAll = async () => {
  try {
    const client = getRedisClient();
    if (isRedisReady() && client) {
      await client.flushdb();
    }
    memoryCache.clear();
    return true;
  } catch (error) {
    logger.warn(`[CacheService] Error clearing cache: ${error.message}`);
    return false;
  }
};

export const cacheService = {
  get,
  set,
  del,
  deleteByPattern,
  clearAll,
};

export default cacheService;
