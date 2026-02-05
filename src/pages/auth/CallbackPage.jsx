import { useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '@/lib/supabase/client';
import { useAuthStore } from '@/stores/authStore';
import { useCartStore } from '@/stores/cartStore';
import { ROUTES } from '@/config/routes';

function CallbackPage() {
  const navigate = useNavigate();
  const { setAuth, setProfile } = useAuthStore();
  const { mergeWithServer } = useCartStore();
  const hasRun = useRef(false);

  useEffect(() => {
    if (hasRun.current) return; // Prevent double execution
    hasRun.current = true;

    // Timeout after 10 seconds
    const timeout = setTimeout(() => {
      console.error('⏱️ Authentication timeout');
      navigate(ROUTES.LOGIN, {
        state: { error: 'Authentication timeout. Please try again.' }
      });
    }, 10000);

    const handleCallback = async () => {
      try {
        console.log('🔄 Starting OAuth callback...');

        // Wait a bit for the auth listener to process the SIGNED_IN event
        await new Promise(resolve => setTimeout(resolve, 500));

        // Get the session (authStore already handled SIGNED_IN event)
        const { data: { session }, error } = await supabase.auth.getSession();

        console.log('Session result:', { session: !!session, error });

        if (error) {
          console.error('❌ OAuth callback error:', error);
          navigate(ROUTES.LOGIN, {
            state: { error: 'Authentication failed. Please try again.' }
          });
          return;
        }

        if (session) {
          console.log('✅ Session obtained:', session.user.email);

          // Wait for profile to be fetched by authStore
          let attempts = 0;
          let profile = null;

          while (attempts < 10 && !profile) {
            const { data } = await supabase
              .from('profiles')
              .select('*')
              .eq('id', session.user.id)
              .single();

            if (data) {
              profile = data;
              setProfile(profile);
              break;
            }

            // If profile doesn't exist after a few attempts, create it
            if (attempts === 3) {
              console.log('⚠️ Profile not found, creating...');
              const { data: newProfile } = await supabase
                .from('profiles')
                .insert({
                  id: session.user.id,
                  email: session.user.email,
                  full_name: session.user.user_metadata?.full_name ||
                             session.user.user_metadata?.name ||
                             session.user.email?.split('@')[0],
                  avatar_url: session.user.user_metadata?.avatar_url ||
                             session.user.user_metadata?.picture,
                  role: 'customer',
                })
                .select()
                .single();

              if (newProfile) {
                profile = newProfile;
                setProfile(profile);
                break;
              }
            }

            await new Promise(resolve => setTimeout(resolve, 200));
            attempts++;
          }

          console.log('Profile ready:', profile?.email);

          // Determine redirect destination
          const oauthRedirect = localStorage.getItem('oauth_redirect');
          let redirectTo = ROUTES.HOME;

          if (oauthRedirect) {
            localStorage.removeItem('oauth_redirect');
            redirectTo = oauthRedirect;
          } else if (profile?.role === 'admin' || profile?.role === 'manager') {
            redirectTo = ROUTES.ADMIN_DASHBOARD;
          }

          console.log('🔀 Navigating to:', redirectTo);
          window.location.href = redirectTo; // Force full page navigation
        } else {
          console.log('❌ No session found');
          navigate(ROUTES.LOGIN);
        }
      } catch (error) {
        console.error('❌ Callback error:', error);
        alert('Authentication error: ' + error.message);
        navigate(ROUTES.LOGIN, {
          state: { error: 'Authentication failed. Please try again.' }
        });
      } finally {
        clearTimeout(timeout);
      }
    };

    handleCallback();

    return () => clearTimeout(timeout);
  }, [navigate, setAuth, setProfile, mergeWithServer]);

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
