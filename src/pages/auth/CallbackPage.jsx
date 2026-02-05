import { useEffect, useState } from 'react';
import { supabase } from '@/lib/supabase/client';
import { exchangeCodeForSession } from '@/lib/supabase/restClient';
import { ROUTES } from '@/config/routes';

function CallbackPage() {
  const [status, setStatus] = useState('Processing authentication...');
  const [error, setError] = useState(null);

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

      // Try direct REST API first
      try {
        console.log('Trying REST API for token exchange...');
        const { data, error: restError } = await exchangeCodeForSession(code);

        if (restError) {
          console.warn('REST API exchange failed:', restError.message);
          throw restError;
        }

        if (data && data.access_token) {
          console.log('✅ REST API exchange successful');
          setStatus('Sign in successful! Redirecting...');

          // Set the session in Supabase client
          await supabase.auth.setSession({
            access_token: data.access_token,
            refresh_token: data.refresh_token,
          });

          // Redirect
          const savedRedirect = localStorage.getItem('oauth_redirect');
          if (savedRedirect) {
            localStorage.removeItem('oauth_redirect');
            console.log('Redirecting to saved path:', savedRedirect);
            window.location.href = savedRedirect;
          } else {
            console.log('Redirecting to home');
            window.location.href = ROUTES.HOME;
          }
          return;
        }
      } catch (restError) {
        console.warn('REST API failed, trying Supabase client...', restError);
      }

      // Fallback to Supabase client
      try {
        console.log('Trying Supabase client for token exchange...');
        setStatus('Completing authentication...');

        const { data, error: supabaseError } = await supabase.auth.exchangeCodeForSession(code);

        if (supabaseError) {
          throw supabaseError;
        }

        if (data.session) {
          console.log('✅ Supabase client exchange successful');
          setStatus('Sign in successful! Redirecting...');

          // Redirect
          const savedRedirect = localStorage.getItem('oauth_redirect');
          if (savedRedirect) {
            localStorage.removeItem('oauth_redirect');
            window.location.href = savedRedirect;
          } else {
            window.location.href = ROUTES.HOME;
          }
          return;
        }
      } catch (supabaseError) {
        console.error('Supabase client exchange failed:', supabaseError);

        // Check if it's an AbortError - might still have worked
        if (supabaseError.name === 'AbortError' || supabaseError.message?.includes('AbortError')) {
          console.log('AbortError occurred, checking session...');
          setStatus('Verifying session...');

          // Wait a bit and check if session exists
          await new Promise(resolve => setTimeout(resolve, 2000));

          const { data: { session } } = await supabase.auth.getSession();
          if (session) {
            console.log('✅ Session found despite AbortError');
            setStatus('Sign in successful! Redirecting...');

            const savedRedirect = localStorage.getItem('oauth_redirect');
            if (savedRedirect) {
              localStorage.removeItem('oauth_redirect');
              window.location.href = savedRedirect;
            } else {
              window.location.href = ROUTES.HOME;
            }
            return;
          }
        }

        setError(supabaseError.message || 'Authentication failed');
        setTimeout(() => {
          window.location.href = ROUTES.LOGIN;
        }, 3000);
      }
    };

    handleCallback();
  }, []);

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
