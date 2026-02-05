import { useEffect } from 'react';
import { supabase } from '@/lib/supabase/client';
import { ROUTES } from '@/config/routes';

function CallbackPage() {
  useEffect(() => {
    console.log('🔄 OAuth callback - URL:', window.location.href);

    // Get the code from URL
    const params = new URLSearchParams(window.location.search);
    const code = params.get('code');

    if (!code) {
      console.error('❌ No code found');
      window.location.href = ROUTES.LOGIN;
      return;
    }

    console.log('✅ Code found:', code.substring(0, 20) + '...');

    // Set up one-time listener for SIGNED_IN event
    const { data: { subscription } } = supabase.auth.onAuthStateChange((event, session) => {
      console.log('Auth event in callback:', event);

      if (event === 'SIGNED_IN' && session) {
        console.log('✅ SIGNED_IN event received, redirecting...');

        // Unsubscribe immediately
        subscription.unsubscribe();

        // Get redirect path
        const savedRedirect = localStorage.getItem('oauth_redirect');
        if (savedRedirect) {
          localStorage.removeItem('oauth_redirect');
          console.log('Redirecting to saved path:', savedRedirect);
          window.location.href = savedRedirect;
        } else {
          console.log('Redirecting to home');
          window.location.href = ROUTES.HOME;
        }
      }
    });

    // Trigger the exchange (don't await - it hangs in production)
    console.log('Triggering code exchange...');
    supabase.auth.exchangeCodeForSession(code).then(result => {
      console.log('Exchange completed:', result.error ? result.error.message : 'success');
    }).catch(error => {
      console.error('Exchange error:', error);
    });

    // Cleanup
    return () => {
      subscription.unsubscribe();
    };
  }, []);

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="text-center">
        <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-amber-600 mb-4"></div>
        <h2 className="text-xl font-semibold text-gray-900">Completing sign in...</h2>
        <p className="text-gray-600 mt-2">Processing authentication...</p>
      </div>
    </div>
  );
}

export default CallbackPage;
