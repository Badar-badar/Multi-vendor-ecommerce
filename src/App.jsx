import React, { useEffect } from 'react';
import { BrowserRouter } from 'react-router-dom';
import { Provider } from 'react-redux';
import { Toaster } from 'react-hot-toast';
import store from './app/store';
import AppRoutes from './routes/AppRoutes';
import useAuth from './hooks/useAuth';

const AuthInitializer = ({ children }) => {
  const { loadUser, markInitialized } = useAuth();

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
