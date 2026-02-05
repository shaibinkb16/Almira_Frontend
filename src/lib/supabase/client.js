import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

// Debug logging
console.log('🔧 Supabase Config:', {
  url: supabaseUrl ? supabaseUrl.substring(0, 30) + '...' : 'MISSING',
  hasKey: !!supabaseAnonKey,
  keyPreview: supabaseAnonKey ? supabaseAnonKey.substring(0, 20) + '...' : 'MISSING',
});

if (!supabaseUrl || !supabaseAnonKey) {
  console.error('❌ Supabase credentials missing! Check environment variables.');
}

// Custom fetch with retry logic to handle AbortError
const fetchWithRetry = async (url, options = {}) => {
  const maxRetries = 3;
  let lastError;

  for (let i = 0; i < maxRetries; i++) {
    try {
      // Remove any abort signal that might cause issues
      const { signal, ...fetchOptions } = options;

      const response = await fetch(url, {
        ...fetchOptions,
        // Add a longer timeout
        signal: AbortSignal.timeout(30000), // 30 second timeout
      });

      return response;
    } catch (error) {
      lastError = error;
      console.warn(`Fetch attempt ${i + 1} failed:`, error.name, error.message);

      // If it's an AbortError, retry
      if (error.name === 'AbortError' && i < maxRetries - 1) {
        await new Promise(resolve => setTimeout(resolve, 1000 * (i + 1))); // Exponential backoff
        continue;
      }

      throw error;
    }
  }

  throw lastError;
};

export const supabase = createClient(
  supabaseUrl || 'https://nltzetpmvsbazhhkuqiq.supabase.co',
  supabaseAnonKey || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im5sdHpldHBtdnNiYXpoaGt1cWlxIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzAyMDg2ODcsImV4cCI6MjA4NTc4NDY4N30.g00kuoKfzb1z4sPI5anoQTbjSTR6uSR5M_ovRxWcFcM',
  {
    auth: {
      autoRefreshToken: true,
      persistSession: true,
      detectSessionInUrl: false,
      flowType: 'pkce',
      storage: typeof window !== 'undefined' ? window.localStorage : undefined,
    },
    global: {
      headers: {
        'x-application-name': 'almira-store',
      },
      fetch: fetchWithRetry,
    },
    db: {
      schema: 'public',
    },
    realtime: {
      params: {
        eventsPerSecond: 10,
      },
    },
  }
);

// Auth helper functions
export const auth = {
  // Get current session
  getSession: async () => {
    const { data: { session }, error } = await supabase.auth.getSession();
    if (error) throw error;
    return session;
  },

  // Get current user
  getUser: async () => {
    const { data: { user }, error } = await supabase.auth.getUser();
    if (error) throw error;
    return user;
  },

  // Sign up with email
  signUp: async ({ email, password, fullName }) => {
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: { full_name: fullName },
        emailRedirectTo: `${window.location.origin}/auth/verify-email`,
      },
    });
    if (error) throw error;
    return data;
  },

  // Sign in with email
  signIn: async ({ email, password }) => {
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });
    if (error) throw error;
    return data;
  },

  // Sign in with OAuth
  signInWithOAuth: async (provider) => {
    const { data, error } = await supabase.auth.signInWithOAuth({
      provider,
      options: {
        redirectTo: `${window.location.origin}/auth/callback`,
      },
    });
    if (error) throw error;
    return data;
  },

  // Sign out
  signOut: async () => {
    const { error } = await supabase.auth.signOut();
    if (error) throw error;
  },

  // Reset password
  resetPassword: async (email) => {
    const { data, error } = await supabase.auth.resetPasswordForEmail(email, {
      redirectTo: `${window.location.origin}/auth/reset-password`,
    });
    if (error) throw error;
    return data;
  },

  // Update password
  updatePassword: async (newPassword) => {
    const { data, error } = await supabase.auth.updateUser({
      password: newPassword,
    });
    if (error) throw error;
    return data;
  },

  // MFA enrollment
  enrollMFA: async () => {
    const { data, error } = await supabase.auth.mfa.enroll({
      factorType: 'totp',
    });
    if (error) throw error;
    return data;
  },

  // MFA challenge
  challengeMFA: async (factorId) => {
    const { data, error } = await supabase.auth.mfa.challenge({
      factorId,
    });
    if (error) throw error;
    return data;
  },

  // MFA verify
  verifyMFA: async (factorId, challengeId, code) => {
    const { data, error } = await supabase.auth.mfa.verify({
      factorId,
      challengeId,
      code,
    });
    if (error) throw error;
    return data;
  },

  // Listen to auth changes
  onAuthStateChange: (callback) => {
    return supabase.auth.onAuthStateChange(callback);
  },
};

export default supabase;
