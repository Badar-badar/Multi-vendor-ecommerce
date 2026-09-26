import React, { useEffect } from 'react';
import { BrowserRouter } from 'react-router-dom';
import { Provider } from 'react-redux';
import { Toaster } from 'react-hot-toast';
import store from './app/store';
import AppRoutes from './routes/AppRoutes';
import useAuth from './hooks/useAuth';

import { useDispatch } from 'react-redux';
import toast from 'react-hot-toast';
import socketService from './services/socketService';
import { addNotification } from './features/notifications/notificationSlice';
import { fetchUnreadNotificationCount } from './features/notifications/notificationThunk';
import { fetchCart } from './features/cart/cartThunk';
import { fetchWishlist } from './features/wishlist/wishlistThunk';

const AuthInitializer = ({ children }) => {
  const { user, isAuthenticated, loadUser, markInitialized } = useAuth();
  const dispatch = useDispatch();

  useEffect(() => {
    let isMounted = true;

    const initAuth = async () => {
      try {
        // Attempt session restore via HTTP-only cookies
        await loadUser();
      } catch {
        // Unauthenticated or backend placeholder; safe fallback
      } finally {
        if (isMounted) {
          markInitialized(true);
        }
      }
    };

    initAuth();

    return () => {
      isMounted = false;
    };
  }, [loadUser, markInitialized]);

  // Handle real-time WebSockets & initial user data when authenticated
  useEffect(() => {
    if (isAuthenticated && user) {
      socketService.connect();

      // Fetch initial user state
      dispatch(fetchCart());
      dispatch(fetchWishlist());
      dispatch(fetchUnreadNotificationCount());

      // Subscribe to real-time events
      const unsubscribeNotif = socketService.on('notification:new', (payload) => {
        dispatch(addNotification(payload));
        toast(payload.title || 'New Notification', {
          icon: '🔔',
          style: {
            borderRadius: '8px',
            background: '#0F172A',
            color: '#fff',
            border: '1px solid #C5A880',
          },
        });
      });

      const unsubscribePayment = socketService.on('order:payment_updated', (payload) => {
        toast.success(`Payment status updated for order #${payload.orderNumber || payload.orderId}`);
      });

      const unsubscribePaymentFailed = socketService.on('order:payment_failed', (payload) => {
        toast.error(
          `Payment failed for order #${payload.orderNumber || payload.orderId}: ${
            payload.reason || 'Please try again.'
          }`
        );
      });

      const unsubscribeRefund = socketService.on('order:refund_completed', (payload) => {
        toast.success(
          `Refund completed for order #${payload.orderNumber || payload.orderId}.`
        );
      });

      const unsubscribeSellerOrder = socketService.on('seller:order_paid', (payload) => {
        toast.success(`New order received! Order #${payload.orderNumber || payload.orderId}`, {
          icon: '💎',
        });
      });

      return () => {
        unsubscribeNotif?.();
        unsubscribePayment?.();
        unsubscribePaymentFailed?.();
        unsubscribeRefund?.();
        unsubscribeSellerOrder?.();
        socketService.disconnect();
      };
    } else {
      socketService.disconnect();
    }
  }, [isAuthenticated, user, dispatch]);

  return children;
};

export function App() {
  return (
    <Provider store={store}>
      <BrowserRouter>
        <AuthInitializer>
          <AppRoutes />
        </AuthInitializer>
        <Toaster
          position="top-right"
          toastOptions={{
            duration: 4000,
            style: {
              background: '#0F172A',
              color: '#FFFFFF',
              fontSize: '13px',
              fontFamily: "'Plus Jakarta Sans', system-ui, sans-serif",
              borderRadius: '10px',
              padding: '12px 16px',
              border: '1px solid #1E293B',
              boxShadow: '0 10px 25px -5px rgba(15, 23, 42, 0.25)',
            },
            success: {
              iconTheme: {
                primary: '#10B981',
                secondary: '#FFFFFF',
              },
            },
            error: {
              iconTheme: {
                primary: '#EF4444',
                secondary: '#FFFFFF',
              },
            },
          }}
        />
      </BrowserRouter>
    </Provider>
  );
}

export default App;
