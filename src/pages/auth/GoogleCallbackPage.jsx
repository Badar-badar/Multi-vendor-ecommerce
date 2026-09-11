import React, { useEffect, useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { Sparkles, ShieldCheck, AlertCircle } from 'lucide-react';
import toast from 'react-hot-toast';
import { setMockUser } from '../../features/auth/authSlice';
import Button from '../../components/common/Button';

export const GoogleCallbackPage = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [searchParams] = useSearchParams();
  const [status, setStatus] = useState('processing'); // 'processing' | 'error' | 'success'
  const [errorMessage, setErrorMessage] = useState('');

  useEffect(() => {
    const processCallback = async () => {
      try {
        const error = searchParams.get('error');
        if (error) {
          throw new Error('Google authorization request was cancelled or declined.');
        }

        // Simulate backend token exchange
        await new Promise((res) => setTimeout(res, 800));

        const mockGoogleUser = {
          id: 'google-usr-901',
          name: 'Julian Sterling',
          email: 'julian.sterling@gmail.com',
          role: 'customer',
          avatar:
            'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?q=80&w=200&auto=format&fit=crop',
          isEmailVerified: true,
        };

        dispatch(setMockUser(mockGoogleUser));
        setStatus('success');
        toast.success('Google authentication verified successfully.');

        const redirect = searchParams.get('state') || '/';
        setTimeout(() => {
          navigate(redirect, { replace: true });
        }, 500);
      } catch (err) {
        setStatus('error');
        setErrorMessage(err.message || 'Failed to complete Google OAuth handshake.');
      }
    };

    processCallback();
  }, [dispatch, navigate, searchParams]);

  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-6">
      <div className="max-w-md w-full bg-surface rounded-3xl border border-border p-8 text-center space-y-6 shadow-subtle animate-in fade-in duration-300">
        {status === 'processing' && (
          <div className="space-y-5">
            <div className="relative w-16 h-16 mx-auto flex items-center justify-center">
              <div className="absolute inset-0 rounded-full border-2 border-accent/20 animate-ping" />
              <div className="w-12 h-12 rounded-full border-2 border-accent border-t-transparent animate-spin flex items-center justify-center">
                <Sparkles className="w-5 h-5 text-accent" />
              </div>
            </div>

            <div className="space-y-2">
              <h2 className="font-serif text-2xl font-bold text-text-main">
                Authenticating Sovereign Identity
              </h2>
              <p className="text-xs text-text-muted leading-relaxed">
                Verifying Google OAuth credentials with Zareen Zero-Knowledge Protocol...
              </p>
            </div>

            <div className="flex items-center justify-center gap-1.5 text-[11px] text-text-subtle">
              <ShieldCheck className="w-3.5 h-3.5 text-accent" />
              <span>TLS 1.3 End-to-End Cryptographic Handshake</span>
            </div>
          </div>
        )}

        {status === 'success' && (
          <div className="space-y-4">
            <div className="w-14 h-14 rounded-2xl bg-emerald-50 text-emerald-600 border border-emerald-200 flex items-center justify-center mx-auto shadow-xs">
              <ShieldCheck className="w-8 h-8" />
            </div>
            <h2 className="font-serif text-2xl font-bold text-text-main">
              Authenticated
            </h2>
            <p className="text-xs text-text-muted">
              Redirecting to your sovereign portfolio...
            </p>
          </div>
        )}

        {status === 'error' && (
          <div className="space-y-5">
            <div className="w-14 h-14 rounded-2xl bg-rose-50 text-rose-600 border border-rose-200 flex items-center justify-center mx-auto shadow-xs">
              <AlertCircle className="w-8 h-8" />
            </div>

            <div className="space-y-2">
              <h2 className="font-serif text-2xl font-bold text-text-main">
                Authentication Interrupted
              </h2>
              <p className="text-xs text-rose-600">{errorMessage}</p>
            </div>

            <Button
              variant="primary"
              size="md"
              fullWidth
              onClick={() => navigate('/login', { replace: true })}
            >
              Return to Sign In
            </Button>
          </div>
        )}
      </div>
    </div>
  );
};

export default GoogleCallbackPage;
