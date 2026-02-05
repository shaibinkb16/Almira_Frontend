import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '@/lib/supabase/client';
import { ROUTES } from '@/config/routes';

function CallbackPage() {
  const navigate = useNavigate();
  const [status, setStatus] = useState('Processing...');

  useEffect(() => {
    let isMounted = true;

    const handleCallback = async () => {
      try {
        console.log('🔄 OAuth callback - URL:', window.location.href);
        setStatus('Exchanging authorization code...');

        // Get the code from URL
        const params = new URLSearchParams(window.location.search);
        const code = params.get('code');

        if (!code) {
          console.error('❌ No authorization code found');
          navigate(ROUTES.LOGIN, {
            state: { error: 'No authorization code found' }
          });
          return;
        }

        console.log('✅ Authorization code found, exchanging for session...');

        // Explicitly exchange code for session
        const { data, error } = await supabase.auth.exchangeCodeForSession(code);

        if (error) {
          console.error('❌ Error exchanging code:', error.message, error);
          if (isMounted) {
            navigate(ROUTES.LOGIN, {
              state: { error: `Failed to complete authentication: ${error.message}` }
            });
          }
          return;
        }

        console.log('✅ Session created:', data.session?.user?.email);
        setStatus('Authentication successful! Redirecting...');

        if (!isMounted) return;

        // Determine redirect destination
        const oauthRedirect = localStorage.getItem('oauth_redirect');
        let redirectTo = ROUTES.HOME;

        if (oauthRedirect) {
          localStorage.removeItem('oauth_redirect');
          redirectTo = oauthRedirect;
          console.log('📍 Redirecting to saved path:', redirectTo);
        } else {
          console.log('📍 Redirecting to home');
        }

        // Small delay to ensure state is saved
        setTimeout(() => {
          console.log('🔀 Navigating to:', redirectTo);
          window.location.href = redirectTo;
        }, 500);

      } catch (error) {
        console.error('❌ Callback error:', error);
        if (isMounted) {
          navigate(ROUTES.LOGIN, {
            state: { error: 'Authentication failed. Please try again.' }
          });
        }
      }
    };

    handleCallback();

    return () => {
      isMounted = false;
    };
  }, [navigate]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="text-center">
        <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-amber-600 mb-4"></div>
        <h2 className="text-xl font-semibold text-gray-900">Signing you in...</h2>
        <p className="text-gray-600 mt-2">{status}</p>
      </div>
    </div>
  );
}

export default CallbackPage;
