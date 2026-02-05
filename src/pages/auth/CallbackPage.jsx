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
    const handleCallback = async () => {
      console.log('🔄 OAuth callback - URL:', window.location.href);

      // Get the code from URL
      const params = new URLSearchParams(window.location.search);
      const code = params.get('code');
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

      if (!code) {
        console.error('❌ No code found');
        setError('No authorization code received');
        setTimeout(() => {
          window.location.href = ROUTES.LOGIN;
        }, 3000);
        return;
      }

      console.log('✅ Code found:', code.substring(0, 20) + '...');
      setStatus('Exchanging authorization code...');

      // Log localStorage keys for debugging
      console.log('📦 localStorage keys:', Object.keys(localStorage));

      // Try Supabase client first - it knows where the code verifier is stored
      try {
        console.log('🔄 Trying Supabase client for code exchange...');

        const { data, error: exchangeError } = await supabase.auth.exchangeCodeForSession(code);

        if (exchangeError) {
          console.warn('⚠️ Supabase exchange error:', exchangeError.message);
          throw exchangeError;
        }

        if (data?.session) {
          console.log('✅ Session obtained via Supabase client');
          setStatus('Sign in successful! Redirecting...');

          // Store session for REST API usage
          storeSession({
            access_token: data.session.access_token,
            refresh_token: data.session.refresh_token,
            expires_at: data.session.expires_at,
            user: data.session.user,
          });

          // Set auth state
          setAuth(data.session.user, data.session);

          // Fetch and set profile
          try {
            const { data: profile } = await getUserProfile(data.session.user.id);
            if (profile) {
              setProfile(profile);
            }
          } catch (e) {
            console.warn('Profile fetch failed:', e);
          }

          // Redirect
          redirectToDestination();
          return;
        }
      } catch (supabaseError) {
        console.warn('⚠️ Supabase client failed:', supabaseError.message);

        // If it's an AbortError, check if session was actually created
        if (supabaseError.name === 'AbortError' || supabaseError.message?.includes('AbortError')) {
          console.log('🔄 AbortError - checking if session exists...');
          setStatus('Verifying session...');

          await new Promise(resolve => setTimeout(resolve, 2000));

          try {
            const { data: { session } } = await supabase.auth.getSession();
            if (session) {
              console.log('✅ Session found despite AbortError');
              setStatus('Sign in successful! Redirecting...');

              storeSession({
                access_token: session.access_token,
                refresh_token: session.refresh_token,
                expires_at: session.expires_at,
                user: session.user,
              });

              setAuth(session.user, session);
              redirectToDestination();
              return;
            }
          } catch (e) {
            console.warn('Session check failed:', e);
          }
        }

        // Show error but allow manual retry
        setError(supabaseError.message || 'Authentication failed. Please try again.');
        setTimeout(() => {
          window.location.href = ROUTES.LOGIN;
        }, 3000);
      }
    };

    const redirectToDestination = () => {
      const savedRedirect = localStorage.getItem('oauth_redirect');
      if (savedRedirect) {
        localStorage.removeItem('oauth_redirect');
        console.log('➡️ Redirecting to saved path:', savedRedirect);
        window.location.href = savedRedirect;
      } else {
        console.log('➡️ Redirecting to home');
        window.location.href = ROUTES.HOME;
      }
    };

    handleCallback();
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
