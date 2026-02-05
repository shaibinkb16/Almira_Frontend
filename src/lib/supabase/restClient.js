/**
 * Direct Supabase REST API client
 * Bypasses the Supabase JS client to avoid AbortController issues
 */

const SUPABASE_URL = import.meta.env.VITE_SUPABASE_URL || 'https://nltzetpmvsbazhhkuqiq.supabase.co';
const SUPABASE_ANON_KEY = import.meta.env.VITE_SUPABASE_ANON_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im5sdHpldHBtdnNiYXpoaGt1cWlxIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzAyMDg2ODcsImV4cCI6MjA4NTc4NDY4N30.g00kuoKfzb1z4sPI5anoQTbjSTR6uSR5M_ovRxWcFcM';

const REST_URL = `${SUPABASE_URL}/rest/v1`;

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
