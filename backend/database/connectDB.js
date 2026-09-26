import mongoose from 'mongoose';
import { config } from '../config/env.js';
import { logger } from '../utils/logger.js';

/**
 * Global Mongoose configuration
 */
mongoose.set('strictQuery', true);

/**
 * Establishes connection to MongoDB.
 * Fails fast and throws error if connection cannot be established.
 */
export const connectDB = async () => {
  try {
    const conn = await mongoose.connect(config.mongoUri, {
      autoIndex: config.isDevelopment, // Build indexes automatically in development only
      serverSelectionTimeoutMS: 5000,
    });

    logger.info(`[Database] MongoDB Connected successfully: ${conn.connection.host}/${conn.connection.name}`);

    // Connection event listeners
    mongoose.connection.on('error', (err) => {
      logger.error(`[Database] MongoDB runtime connection error: ${err.message}`);
    });

    mongoose.connection.on('disconnected', () => {
      logger.warn('[Database] MongoDB disconnected');
    });

    return conn;
  } catch (error) {
    logger.error(`[Database] Failed to connect to MongoDB: ${error.message}`);
    throw error;
  }
};

/**
 * Closes the MongoDB connection gracefully.
 */
export const disconnectDB = async () => {
  try {
    if (mongoose.connection.readyState !== 0) {
      await mongoose.connection.close();
      logger.info('[Database] MongoDB connection closed cleanly');
    }
  } catch (error) {
    logger.error(`[Database] Error during MongoDB disconnection: ${error.message}`);
    throw error;
  }
};

export default connectDB;
