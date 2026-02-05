/**
 * Direct Supabase REST API client
 * Bypasses the Supabase JS client to avoid AbortController issues
 */

const SUPABASE_URL = import.meta.env.VITE_SUPABASE_URL || 'https://nltzetpmvsbazhhkuqiq.supabase.co';
const SUPABASE_ANON_KEY = import.meta.env.VITE_SUPABASE_ANON_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im5sdHpldHBtdnNiYXpoaGt1cWlxIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzAyMDg2ODcsImV4cCI6MjA4NTc4NDY4N30.g00kuoKfzb1z4sPI5anoQTbjSTR6uSR5M_ovRxWcFcM';

const REST_URL = `${SUPABASE_URL}/rest/v1`;
const AUTH_URL = `${SUPABASE_URL}/auth/v1`;

// Storage key for auth token
const STORAGE_KEY = `sb-nltzetpmvsbazhhkuqiq-auth-token`;

/**
 * Get stored session from localStorage
 */
export function getStoredSession() {
  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored) {
      const session = JSON.parse(stored);
      // Check if token is expired
      if (session.expires_at && session.expires_at * 1000 > Date.now()) {
        return session;
      }
    }
  } catch (e) {
    console.warn('Failed to get stored session:', e);
  }
  return null;
}

/**
 * Store session in localStorage
 */
export function storeSession(session) {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(session));
  } catch (e) {
    console.warn('Failed to store session:', e);
  }
}

/**
 * Clear stored session
 */
export function clearStoredSession() {
  try {
    localStorage.removeItem(STORAGE_KEY);
  } catch (e) {
    console.warn('Failed to clear session:', e);
  }
}

/**
 * Sign in with email/password using REST API
 */
export async function signInWithPassword(email, password) {
  try {
    const response = await fetch(`${AUTH_URL}/token?grant_type=password`, {
      method: 'POST',
      headers: {
        'apikey': SUPABASE_ANON_KEY,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ email, password }),
    });

    const data = await response.json();

    if (!response.ok) {
      return { data: null, error: { message: data.error_description || data.msg || 'Sign in failed' } };
    }

    // Store the session
    storeSession(data);

    return { data: { session: data, user: data.user }, error: null };
  } catch (error) {
    console.error('Sign in error:', error);
    return { data: null, error: { message: error.message } };
  }
}

/**
 * Sign up with email/password using REST API
 */
export async function signUpWithPassword(email, password, fullName) {
  try {
    const response = await fetch(`${AUTH_URL}/signup`, {
      method: 'POST',
      headers: {
        'apikey': SUPABASE_ANON_KEY,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        email,
        password,
        data: { full_name: fullName },
      }),
    });

    const data = await response.json();

    if (!response.ok) {
      return { data: null, error: { message: data.error_description || data.msg || 'Sign up failed' } };
    }

    return { data: { user: data.user || data }, error: null };
  } catch (error) {
    console.error('Sign up error:', error);
    return { data: null, error: { message: error.message } };
  }
}

/**
 * Sign out using REST API
 */
export async function signOut() {
  const session = getStoredSession();

  if (session?.access_token) {
    try {
      await fetch(`${AUTH_URL}/logout`, {
        method: 'POST',
        headers: {
          'apikey': SUPABASE_ANON_KEY,
          'Authorization': `Bearer ${session.access_token}`,
        },
      });
    } catch (e) {
      console.warn('Logout request failed:', e);
    }
  }

  clearStoredSession();
  return { error: null };
}

/**
 * Get current session from REST API
 */
export async function getSession() {
  const stored = getStoredSession();
  if (!stored) {
    return { data: { session: null }, error: null };
  }

  // Check if we need to refresh
  if (stored.expires_at && stored.expires_at * 1000 < Date.now() + 60000) {
    // Token expires in less than 1 minute, try to refresh
    if (stored.refresh_token) {
      const refreshed = await refreshSession(stored.refresh_token);
      if (refreshed.data?.session) {
        return refreshed;
      }
    }
    // Refresh failed, return null
    clearStoredSession();
    return { data: { session: null }, error: null };
  }

  return { data: { session: stored }, error: null };
}

/**
 * Refresh session using REST API
 */
export async function refreshSession(refreshToken) {
  try {
    const response = await fetch(`${AUTH_URL}/token?grant_type=refresh_token`, {
      method: 'POST',
      headers: {
        'apikey': SUPABASE_ANON_KEY,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ refresh_token: refreshToken }),
    });

    const data = await response.json();

    if (!response.ok) {
      return { data: null, error: { message: data.error_description || 'Refresh failed' } };
    }

    storeSession(data);
    return { data: { session: data, user: data.user }, error: null };
  } catch (error) {
    console.error('Refresh error:', error);
    return { data: null, error: { message: error.message } };
  }
}

/**
 * Get user profile from database
 */
export async function getUserProfile(userId) {
  // Don't use single: true to avoid 406 error when profile doesn't exist
  const result = await supabaseRest('profiles', {
    select: '*',
    filters: [{ column: 'id', operator: 'eq', value: userId }],
    single: false,
  });

  // Return first item if found, null otherwise
  if (result.data && Array.isArray(result.data) && result.data.length > 0) {
    return { data: result.data[0], error: null };
  }

  return { data: null, error: null };
}

/**
 * Make a REST API request to Supabase
 */
export async function supabaseRest(table, options = {}) {
  const {
    select = '*',
    filters = [],
    single = false,
    limit,
    order,
  } = options;

  // Build URL with query params
  let url = `${REST_URL}/${table}?select=${encodeURIComponent(select)}`;

  // Add filters
  filters.forEach(({ column, operator, value }) => {
    if (operator === 'eq') {
      url += `&${column}=eq.${encodeURIComponent(value)}`;
    } else if (operator === 'neq') {
      url += `&${column}=neq.${encodeURIComponent(value)}`;
    } else if (operator === 'in') {
      url += `&${column}=in.(${value.map(v => encodeURIComponent(v)).join(',')})`;
    } else if (operator === 'is') {
      url += `&${column}=is.${value}`;
    } else if (operator === 'not.is') {
      url += `&${column}=not.is.${value}`;
    } else if (operator === 'ilike') {
      url += `&${column}=ilike.${encodeURIComponent(value)}`;
    } else if (operator === 'or') {
      url += `&or=(${encodeURIComponent(value)})`;
    } else if (operator === 'gte') {
      url += `&${column}=gte.${encodeURIComponent(value)}`;
    }
  });

  // Add limit
  if (limit) {
    url += `&limit=${limit}`;
  }

  // Add order
  if (order) {
    url += `&order=${order.column}.${order.ascending ? 'asc' : 'desc'}`;
  }

  const headers = {
    'apikey': SUPABASE_ANON_KEY,
    'Authorization': `Bearer ${SUPABASE_ANON_KEY}`,
    'Content-Type': 'application/json',
    'Prefer': single ? 'return=representation' : '',
  };

  if (single) {
    headers['Accept'] = 'application/vnd.pgrst.object+json';
  }

  try {
    const response = await fetch(url, {
      method: 'GET',
      headers,
    });

    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(`Supabase REST error: ${response.status} - ${errorText}`);
    }

    const data = await response.json();
    return { data, error: null };
  } catch (error) {
    console.error('Supabase REST error:', error);
    return { data: null, error };
  }
}

/**
 * Fetch categories from Supabase REST API
 */
export async function fetchCategories() {
  return supabaseRest('categories', {
    select: 'id, name, slug, parent_id, image_url',
    filters: [
      { column: 'is_active', operator: 'eq', value: true }
    ],
    order: { column: 'display_order', ascending: true }
  });
}

/**
 * Fetch products from Supabase REST API
 */
export async function fetchProducts(options = {}) {
  const filters = [
    { column: 'status', operator: 'eq', value: 'active' }
  ];

  if (options.featured) {
    filters.push({ column: 'is_featured', operator: 'eq', value: true });
  }

  if (options.categoryId) {
    filters.push({ column: 'category_id', operator: 'eq', value: options.categoryId });
  }

  if (options.categoryIds) {
    filters.push({ column: 'category_id', operator: 'in', value: options.categoryIds });
  }

  if (options.onSale) {
    filters.push({ column: 'sale_price', operator: 'not.is', value: 'null' });
  }

  return supabaseRest('products', {
    select: '*',
    filters,
    limit: options.limit || 50,
  });
}

/**
 * Fetch single product by slug
 */
export async function fetchProductBySlug(slug) {
  return supabaseRest('products', {
    select: '*',
    filters: [
      { column: 'slug', operator: 'eq', value: slug },
      { column: 'status', operator: 'eq', value: 'active' }
    ],
    single: true,
  });
}

/**
 * Exchange OAuth code for session using direct REST API
 * This bypasses the Supabase JS client's AbortController issues
 */
export async function exchangeCodeForSession(code) {
  const AUTH_URL = `${SUPABASE_URL}/auth/v1/token?grant_type=pkce`;

  // Get the code verifier from localStorage (set by Supabase during OAuth init)
  const codeVerifier = localStorage.getItem('supabase.auth.code_verifier') ||
                       localStorage.getItem(`sb-${SUPABASE_URL.split('//')[1].split('.')[0]}-auth-token-code-verifier`);

  // Try multiple possible localStorage keys for code verifier
  let verifier = codeVerifier;
  if (!verifier) {
    // Try to find it in localStorage
    for (let i = 0; i < localStorage.length; i++) {
      const key = localStorage.key(i);
      if (key && key.includes('code-verifier')) {
        verifier = localStorage.getItem(key);
        break;
      }
    }
  }

  console.log('🔑 Code verifier found:', !!verifier);

  try {
    const response = await fetch(AUTH_URL, {
      method: 'POST',
      headers: {
        'apikey': SUPABASE_ANON_KEY,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        auth_code: code,
        code_verifier: verifier,
      }),
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.error_description || errorData.error || 'Token exchange failed');
    }

    const data = await response.json();

    // Store the session in localStorage (same format as Supabase client)
    const storageKey = `sb-${SUPABASE_URL.split('//')[1].split('.')[0]}-auth-token`;
    localStorage.setItem(storageKey, JSON.stringify(data));

    return { data, error: null };
  } catch (error) {
    console.error('Token exchange error:', error);
    return { data: null, error };
  }
}

export default {
  supabaseRest,
  fetchCategories,
  fetchProducts,
  fetchProductBySlug,
  exchangeCodeForSession,
};
