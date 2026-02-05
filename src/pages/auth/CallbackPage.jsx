import { useEffect, useState } from 'react';
import { supabase } from '@/lib/supabase/client';
import { storeSession, getUserProfile } from '@/lib/supabase/restClient';
import { useAuthStore } from '@/stores/authStore';
import { ROUTES } from '@/config/routes';

function CallbackPage() {
  const [status, setStatus] = useState('Processing authentication...');
  const [error, setError] = useState(null);
  const { setAuth, setProfile } = useAuthStore();

  useEffect(() => {
    let isMounted = true;
    let checkCount = 0;
    const maxChecks = 10;

    const checkSession = async () => {
      checkCount++;
      console.log(`🔄 Checking session (attempt ${checkCount}/${maxChecks})...`);

      try {
        const { data: { session }, error: sessionError } = await supabase.auth.getSession();

        if (sessionError) {
          console.warn('Session check error:', sessionError);
        }

        if (session) {
          console.log('✅ Session found!', session.user.email);

          if (!isMounted) return;

          setStatus('Sign in successful! Redirecting...');

          // Store session for REST API
          storeSession({
            access_token: session.access_token,
            refresh_token: session.refresh_token,
            expires_at: session.expires_at,
            user: session.user,
          });

          // Set auth state
          setAuth(session.user, session);

          // Fetch profile
          try {
            const { data: profile } = await getUserProfile(session.user.id);
            if (profile && isMounted) {
              setProfile(profile);
            }
          } catch (e) {
            console.warn('Profile fetch failed:', e);
          }

          // Redirect after a short delay
          setTimeout(() => {
            const savedRedirect = localStorage.getItem('oauth_redirect');
            if (savedRedirect) {
              localStorage.removeItem('oauth_redirect');
              window.location.href = savedRedirect;
            } else {
              window.location.href = ROUTES.HOME;
            }
          }, 500);

          return true;
        }

        return false;
      } catch (e) {
        console.warn('Session check exception:', e);
        return false;
      }
    };

    const handleCallback = async () => {
      console.log('🔄 OAuth callback page loaded');
      console.log('📍 URL:', window.location.href);

      // Check for error in URL
      const params = new URLSearchParams(window.location.search);
      const errorParam = params.get('error');
      const errorDescription = params.get('error_description');

      if (errorParam) {
        console.error('❌ OAuth error:', errorParam, errorDescription);
        setError(errorDescription || errorParam);
        setTimeout(() => {
          window.location.href = ROUTES.LOGIN;
        }, 3000);
        return;
      }

      // Let Supabase client handle the URL automatically
      // The detectSessionInUrl: true setting should process the code
      setStatus('Verifying authentication...');

      // Wait a moment for Supabase to process the URL
      await new Promise(resolve => setTimeout(resolve, 1000));

      // Check if session was created
      const found = await checkSession();

      if (!found) {
        // Keep checking for a bit
        setStatus('Completing sign in...');

        for (let i = 0; i < maxChecks - 1; i++) {
          await new Promise(resolve => setTimeout(resolve, 1500));
          if (!isMounted) return;

          const found = await checkSession();
          if (found) return;
        }

        // If still no session, show error
        if (isMounted) {
          setError('Authentication timed out. Please try signing in again.');
          setTimeout(() => {
            window.location.href = ROUTES.LOGIN;
          }, 3000);
        }
      }
    };

    handleCallback();

    return () => {
      isMounted = false;
    };
  }, [setAuth, setProfile]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="text-center max-w-md mx-auto px-4">
        {error ? (
          <>
            <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <svg className="w-8 h-8 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </div>
            <h2 className="text-xl font-semibold text-gray-900 mb-2">Authentication Failed</h2>
            <p className="text-gray-600 mb-4">{error}</p>
            <p className="text-sm text-gray-500">Redirecting to login...</p>
          </>
        ) : (
          <>
            <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-amber-600 mb-4"></div>
            <h2 className="text-xl font-semibold text-gray-900">Completing sign in...</h2>
            <p className="text-gray-600 mt-2">{status}</p>
          </>
        )}
      </div>
    </div>
  );
}

export default CallbackPage;
