import { Server } from 'socket.io';
import jwt from 'jsonwebtoken';
import { config } from '../config/env.js';
import { logger } from './logger.js';
import { User } from '../models/User.js';
import { Seller } from '../models/Seller.js';
import { ROLES } from '../config/permissions.js';

let ioInstance = null;

/**
 * Parses cookies from handshake headers
 */
const parseCookies = (cookieHeader) => {
  if (!cookieHeader) return {};
  return cookieHeader.split(';').reduce((cookies, item) => {
    const [name, val] = item.trim().split('=');
    if (name && val) {
      cookies[name] = decodeURIComponent(val);
    }
    return cookies;
  }, {});
};

/**
 * Initializes Socket.IO with HTTP Server
 */
export const initSocket = (httpServer) => {
  ioInstance = new Server(httpServer, {
    cors: {
      origin: config.clientUrl,
      credentials: true,
      methods: ['GET', 'POST'],
    },
    transports: ['websocket', 'polling'],
  });

  // Authentication Middleware for incoming Socket connections
  ioInstance.use(async (socket, next) => {
    try {
      let token = null;

      // 1. Try extracting token from HTTP-only Cookie
      const cookies = parseCookies(socket.request?.headers?.cookie);
      if (cookies.token) {
        token = cookies.token;
      }

      // 2. Fallback to handshake auth object if provided
      if (!token && socket.handshake?.auth?.token) {
        token = socket.handshake.auth.token;
      }

      // 3. Fallback to Authorization Header
      if (!token && socket.handshake?.headers?.authorization) {
        const parts = socket.handshake.headers.authorization.split(' ');
        if (parts.length === 2 && parts[0] === 'Bearer') {
          token = parts[1];
        }
      }

      if (!token) {
        return next(new Error('Authentication error: Missing authentication token.'));
      }

      // Verify JWT
      const decoded = jwt.verify(token, config.jwt.secret);
      if (!decoded || !decoded.id) {
        return next(new Error('Authentication error: Invalid token signature.'));
      }

      // Fetch user from DB to ensure active status
      const user = await User.findById(decoded.id).select('_id role isSuspended isEmailVerified').lean();
      if (!user) {
        return next(new Error('Authentication error: User no longer exists.'));
      }

      if (user.isSuspended) {
        return next(new Error('Authentication error: User account is suspended.'));
      }

      // Attach authenticated user identity to socket
      socket.user = user;

      // If user is a seller, find their seller profile ID
      if (user.role === ROLES.SELLER) {
        const sellerProfile = await Seller.findOne({ user: user._id }).select('_id status').lean();
        if (sellerProfile) {
          socket.sellerId = sellerProfile._id.toString();
        }
      }

      next();
    } catch (error) {
      logger.warn(`[Socket.IO] Authentication rejected: ${error.message}`);
      return next(new Error(`Authentication error: ${error.message}`));
    }
  });

  // Socket Connection and Room Joining
  ioInstance.on('connection', (socket) => {
    const userId = socket.user._id.toString();
    logger.info(`[Socket.IO] User connected: ${userId} (${socket.user.role}) - Socket ID: ${socket.id}`);

    // 1. Join Personal User Room
    const userRoom = `user:${userId}`;
    socket.join(userRoom);

    // 2. If Seller, join Seller Room
    if (socket.sellerId) {
      const sellerRoom = `seller:${socket.sellerId}`;
      socket.join(sellerRoom);
      logger.info(`[Socket.IO] Socket ${socket.id} joined ${sellerRoom}`);
    }

    // 3. If Admin, join Admin Room
    if (socket.user.role === ROLES.ADMIN) {
      socket.join('admin');
      logger.info(`[Socket.IO] Socket ${socket.id} joined admin room`);
    }

    socket.on('disconnect', (reason) => {
      logger.info(`[Socket.IO] User disconnected: ${userId} - Reason: ${reason}`);
    });
  });

  logger.info('[Socket.IO] Real-time engine initialized successfully.');
  return ioInstance;
};

/**
 * Returns active Socket.IO server instance
 */
export const getIO = () => {
  return ioInstance;
};

/**
 * Emits real-time event safely to a specific user
 */
export const emitToUser = (userId, event, data) => {
  if (!ioInstance) return;
  const targetId = userId?.toString();
  ioInstance.to(`user:${targetId}`).emit(event, data);
};

/**
 * Emits real-time event safely to a specific seller
 */
export const emitToSeller = (sellerId, event, data) => {
  if (!ioInstance) return;
  const targetId = sellerId?.toString();
  ioInstance.to(`seller:${targetId}`).emit(event, data);
};

/**
 * Emits real-time event safely to all admins
 */
export const emitToAdmins = (event, data) => {
  if (!ioInstance) return;
  ioInstance.to('admin').emit(event, data);
};

/**
 * Emits broadcast event to all connected sockets
 */
export const emitToAll = (event, data) => {
  if (!ioInstance) return;
  ioInstance.emit(event, data);
};
