import { useEffect } from 'react';
import { supabase } from '@/lib/supabase/client';
import { ROUTES } from '@/config/routes';

function CallbackPage() {
  useEffect(() => {
    const handleCallback = async () => {
      console.log('🔄 OAuth callback - URL:', window.location.href);

      try {
        // Get the code from URL
        const params = new URLSearchParams(window.location.search);
        const code = params.get('code');

        if (!code) {
          console.error('❌ No code found');
          window.location.href = ROUTES.LOGIN;
          return;
        }

        console.log('✅ Code found, exchanging...');

        // Exchange code for session
        const result = await supabase.auth.exchangeCodeForSession(code);

        console.log('Exchange result:', result);

        if (result.error) {
          console.error('❌ Exchange error:', result.error);
          window.location.href = ROUTES.LOGIN;
          return;
        }

        console.log('✅ Session created, redirecting...');

        // Get redirect path
        const savedRedirect = localStorage.getItem('oauth_redirect');
        if (savedRedirect) {
          localStorage.removeItem('oauth_redirect');
          console.log('Redirecting to:', savedRedirect);
          window.location.href = savedRedirect;
        } else {
          console.log('Redirecting to home');
          window.location.href = ROUTES.HOME;
        }

      } catch (error) {
        console.error('❌ Callback error:', error);
        window.location.href = ROUTES.LOGIN;
      }
    };

    handleCallback();
  }, []);

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="text-center">
        <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-amber-600 mb-4"></div>
        <h2 className="text-xl font-semibold text-gray-900">Completing sign in...</h2>
        <p className="text-gray-600 mt-2">Please wait a moment</p>
      </div>
    </div>
  );
}

export default CallbackPage;
