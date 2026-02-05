import { createClient } from '@supabase/supabase-js';

// Use environment variables with hardcoded fallbacks for production
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || 'https://nltzetpmvsbazhhkuqiq.supabase.co';
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im5sdHpldHBtdnNiYXpoaGt1cWlxIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzAyMDg2ODcsImV4cCI6MjA4NTc4NDY4N30.g00kuoKfzb1z4sPI5anoQTbjSTR6uSR5M_ovRxWcFcM';

// Debug logging
console.log('🔧 Supabase initialized:', {
  url: supabaseUrl.substring(0, 30) + '...',
  hasKey: !!supabaseAnonKey,
});

// Custom fetch that handles AbortError with retry
const customFetch = async (url, options = {}) => {
  const maxRetries = 3;
  let lastError;

  for (let attempt = 0; attempt < maxRetries; attempt++) {
    try {
      // Create a new AbortController for each attempt
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 30000); // 30s timeout

      const response = await fetch(url, {
        ...options,
        signal: controller.signal,
      });

      clearTimeout(timeoutId);
      return response;
    } catch (error) {
      lastError = error;

      // If it's an AbortError, wait and retry
      if (error.name === 'AbortError') {
        console.warn(`⚠️ Request aborted (attempt ${attempt + 1}/${maxRetries}):`, url.substring(0, 50));
        if (attempt < maxRetries - 1) {
          await new Promise(resolve => setTimeout(resolve, 1000 * (attempt + 1)));
          continue;
        }
      }

      throw error;
    }
  }

  throw lastError;
};

export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    autoRefreshToken: true,
    persistSession: true,
    detectSessionInUrl: true,
    flowType: 'pkce',
    storage: typeof window !== 'undefined' ? window.localStorage : undefined,
  },
  global: {
    fetch: customFetch,
  },
});

// Helper to retry any async function on AbortError
export const withRetry = async (fn, maxRetries = 3) => {
  let lastError;

  for (let attempt = 0; attempt < maxRetries; attempt++) {
    try {
      return await fn();
    } catch (error) {
      lastError = error;

      if (error.name === 'AbortError' || error.message?.includes('AbortError')) {
        console.warn(`⚠️ Operation aborted (attempt ${attempt + 1}/${maxRetries})`);
        if (attempt < maxRetries - 1) {
          await new Promise(resolve => setTimeout(resolve, 1000 * (attempt + 1)));
          continue;
        }
      }

      throw error;
    }
  }

  throw lastError;
};

// Auth helper functions with retry logic
export const auth = {
  // Get current session with retry
  getSession: async () => {
    return withRetry(async () => {
      const { data: { session }, error } = await supabase.auth.getSession();
      if (error) throw error;
      return session;
    });
  },

  // Get current user with retry
  getUser: async () => {
    return withRetry(async () => {
      const { data: { user }, error } = await supabase.auth.getUser();
      if (error) throw error;
      return user;
    });
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

  // Listen to auth changes
  onAuthStateChange: (callback) => {
    return supabase.auth.onAuthStateChange(callback);
  },
};

export default supabase;
