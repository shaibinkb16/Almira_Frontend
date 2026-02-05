import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { ROUTES } from '@/config/routes';

function CallbackPage() {
  const navigate = useNavigate();

  useEffect(() => {
    console.log('🔄 OAuth callback - URL:', window.location.href);

    // Supabase client has detectSessionInUrl: true
    // It will automatically process the OAuth code and fire SIGNED_IN event
    // The authStore listener will handle the session and profile
    // We just need to redirect to home and let the app handle the rest

    const handleCallback = () => {
      try {
        // Check where to redirect
        const oauthRedirect = localStorage.getItem('oauth_redirect');
        let redirectTo = ROUTES.HOME;

        if (oauthRedirect) {
          localStorage.removeItem('oauth_redirect');
          redirectTo = oauthRedirect;
          console.log('📍 Redirecting to saved path:', redirectTo);
        } else {
          console.log('📍 Redirecting to home');
        }

        // Small delay to let Supabase process the URL
        // Then redirect - the auth state will be ready by then
        setTimeout(() => {
          console.log('🔀 Navigating to:', redirectTo);
          window.location.href = redirectTo;
        }, 2000);

      } catch (error) {
        console.error('❌ Callback error:', error);
        navigate(ROUTES.LOGIN, {
          state: { error: 'Authentication failed. Please try again.' }
        });
      }
    };

    handleCallback();
  }, [navigate]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="text-center">
        <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-amber-600 mb-4"></div>
        <h2 className="text-xl font-semibold text-gray-900">Signing you in...</h2>
        <p className="text-gray-600 mt-2">Please wait while we complete your authentication.</p>
      </div>
    </div>
  );
}

export default CallbackPage;
