import { io } from 'socket.io-client';

class SocketService {
  constructor() {
    this.socket = null;
    this.listeners = new Map();
    this.isConnected = false;
  }

  /**
   * Connect to the backend WebSocket server
   * @param {string} [url] - Socket server URL
   * @param {object} [options] - Connection options
   */
  connect(url = import.meta.env.VITE_SOCKET_URL || 'http://localhost:5000', options = {}) {
    if (this.socket || typeof window === 'undefined') {
      return;
    }

    try {
      this.socket = io(url, {
        withCredentials: true,
        autoConnect: true,
        transports: ['websocket', 'polling'],
        ...options,
      });

      this.socket.on('connect', () => {
        this.isConnected = true;
      });

      this.socket.on('disconnect', () => {
        this.isConnected = false;
      });

      this.socket.on('connect_error', () => {
        this.isConnected = false;
      });

      // Rebind all existing registered listeners
      this.listeners.forEach((callbacks, event) => {
        callbacks.forEach((cb) => {
          this.socket.on(event, cb);
        });
      });
    } catch (err) {
      console.warn('[SocketService] Real-time connection error:', err.message);
    }
  }

  /**
   * Disconnect the active socket session
   */
  disconnect() {
    if (this.socket) {
      try {
        this.socket.disconnect();
      } catch (err) {
        // Safe no-op
      }
      this.socket = null;
      this.isConnected = false;
    }
  }

  /**
   * Subscribe to a real-time event
   * Supported events:
   * - 'notification:new'
   * - 'order:updated'
   * - 'payment:updated'
   * - 'seller:application-updated'
   * - 'inventory:updated'
   *
   * @param {string} event - Event name
   * @param {Function} callback - Event handler
   * @returns {Function} Unsubscribe function
   */
  on(event, callback) {
    if (!this.listeners.has(event)) {
      this.listeners.set(event, new Set());
    }
    this.listeners.get(event).add(callback);

    if (this.socket) {
      this.socket.on(event, callback);
    }

    // Return cleanup function for useEffect hooks
    return () => this.off(event, callback);
  }

  /**
   * Unsubscribe from an event
   * @param {string} event
   * @param {Function} callback
   */
  off(event, callback) {
    if (this.listeners.has(event)) {
      this.listeners.get(event).delete(callback);
    }

    if (this.socket) {
      this.socket.off(event, callback);
    }
  }

  /**
   * Emit an event to the server
   * @param {string} event
   * @param {any} data
   */
  emit(event, data) {
    if (this.socket && this.isConnected) {
      this.socket.emit(event, data);
    }
  }

  /**
   * Simulate or dispatch an internal event (useful for local dev/testing)
   * @param {string} event
   * @param {any} payload
   */
  dispatchLocal(event, payload) {
    const handlers = this.listeners.get(event);
    if (handlers) {
      handlers.forEach((fn) => {
        try {
          fn(payload);
        } catch (e) {
          console.error(`[SocketService] Error in handler for event "${event}":`, e);
        }
      });
    }
  }
}

export const socketService = new SocketService();
export default socketService;
