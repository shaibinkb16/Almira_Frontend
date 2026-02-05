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
        console.log('🔄 Starting OAuth callback...', window.location.href);

        // Check if we have a code or access token in the URL
        const hashParams = new URLSearchParams(window.location.hash.substring(1));
        const queryParams = new URLSearchParams(window.location.search);
        const hasCode = queryParams.get('code') || hashParams.get('code');
        const hasAccessToken = hashParams.get('access_token');

        console.log('URL params:', { hasCode: !!hasCode, hasAccessToken: !!hasAccessToken });

        // Wait for auth to process the callback
        // Increased timeout for production latency
        await new Promise(resolve => setTimeout(resolve, 1500));

        // Get the session
        const { data: { session }, error: sessionError } = await supabase.auth.getSession();

        console.log('Session result:', {
          hasSession: !!session,
          email: session?.user?.email,
          error: sessionError?.message
        });

        if (sessionError) {
          console.error('❌ Session error:', sessionError);
          navigate(ROUTES.LOGIN, {
            state: { error: 'Authentication failed. Please try again.' }
          });
          return;
        }

        if (!session) {
          console.error('❌ No session after OAuth');
          navigate(ROUTES.LOGIN, {
            state: { error: 'No session created. Please try again.' }
          });
          return;
        }

        console.log('✅ Session obtained:', session.user.email);
        setAuth(session.user, session);

        // Fetch or create profile with better error handling
        let profile = null;
        let attempts = 0;
        const maxAttempts = 10;

        while (attempts < maxAttempts && !profile) {
          console.log(`Attempt ${attempts + 1}/${maxAttempts}: Fetching profile...`);

          const { data, error: profileError } = await supabase
            .from('profiles')
            .select('*')
            .eq('id', session.user.id)
            .single();

          console.log('Profile query result:', {
            hasData: !!data,
            error: profileError?.message,
            code: profileError?.code
          });

          if (data) {
            profile = data;
            setProfile(profile);
            console.log('✅ Profile loaded:', profile.email);
            break;
          }

          // Create profile if not found (PGRST116 = not found)
          if (attempts === 3 && (!profileError || profileError.code === 'PGRST116')) {
            console.log('⚠️ Profile not found, creating...');

            const { data: newProfile, error: insertError } = await supabase
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

            console.log('Profile creation result:', {
              hasData: !!newProfile,
              error: insertError?.message
            });

            if (newProfile) {
              profile = newProfile;
              setProfile(profile);
              console.log('✅ Profile created:', profile.email);
              break;
            }
          }

          await new Promise(resolve => setTimeout(resolve, 300));
          attempts++;
        }

        if (!profile) {
          console.warn('⚠️ Could not load profile, continuing anyway...');
        }

        // Determine redirect destination
        const oauthRedirect = localStorage.getItem('oauth_redirect');
        let redirectTo = ROUTES.HOME;

        if (oauthRedirect) {
          localStorage.removeItem('oauth_redirect');
          redirectTo = oauthRedirect;
          console.log('📍 Using saved redirect:', redirectTo);
        } else if (profile?.role === 'admin' || profile?.role === 'manager') {
          redirectTo = ROUTES.ADMIN_DASHBOARD;
          console.log('📍 Admin user, redirecting to dashboard');
        } else {
          console.log('📍 Regular user, redirecting to home');
        }

        console.log('🔀 Navigating to:', redirectTo);

        // Small delay before navigation to ensure state is saved
        await new Promise(resolve => setTimeout(resolve, 100));

        window.location.href = redirectTo;
      } catch (error) {
        console.error('❌ Callback error:', error);
        console.error('Error stack:', error.stack);

        navigate(ROUTES.LOGIN, {
          state: { error: `Authentication error: ${error.message}` }
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
