// Route path constants
export const ROUTES = {
  // Public Routes
  HOME: '/',
  PRODUCTS: '/products',
  PRODUCT_DETAIL: '/products/:slug',
  CATEGORIES: '/categories',
  CATEGORY: '/categories/:slug',
  SEARCH: '/search',
  ABOUT: '/about',
  CONTACT: '/contact',

  // Auth Routes
  LOGIN: '/auth/login',
  REGISTER: '/auth/register',
  FORGOT_PASSWORD: '/auth/forgot-password',
  RESET_PASSWORD: '/auth/reset-password',
  VERIFY_EMAIL: '/auth/verify-email',
  AUTH_CALLBACK: '/auth/callback',
  MFA: '/auth/mfa',

  // User Routes (Protected)
  PROFILE: '/account/profile',
  ORDERS: '/account/orders',
  ORDER_DETAIL: '/account/orders/:id',
  WISHLIST: '/account/wishlist',
  ADDRESSES: '/account/addresses',
  SECURITY: '/account/security',

  // Cart & Checkout
  CART: '/cart',
  CHECKOUT: '/checkout',
  ORDER_SUCCESS: '/checkout/success',

  // Admin Routes
  ADMIN_DASHBOARD: '/admin',
  ADMIN_PRODUCTS: '/admin/products',
  ADMIN_PRODUCT_CREATE: '/admin/products/new',
  ADMIN_PRODUCT_EDIT: '/admin/products/:id/edit',
  ADMIN_CATEGORIES: '/admin/categories',
  ADMIN_CATEGORY_CREATE: '/admin/categories/new',
  ADMIN_CATEGORY_EDIT: '/admin/categories/:id/edit',
  ADMIN_ORDERS: '/admin/orders',
  ADMIN_ORDER_DETAIL: '/admin/orders/:id',
  ADMIN_USERS: '/admin/users',
  ADMIN_USER_DETAIL: '/admin/users/:id',
  ADMIN_REVIEWS: '/admin/reviews',
  ADMIN_COUPONS: '/admin/coupons',
  ADMIN_COUPON_CREATE: '/admin/coupons/new',
  ADMIN_COUPON_EDIT: '/admin/coupons/:id/edit',
  ADMIN_SETTINGS: '/admin/settings',

  // Error Pages
  NOT_FOUND: '/404',
  UNAUTHORIZED: '/unauthorized',
};

// Helper to generate dynamic routes
export const generateRoute = (route, params) => {
  let path = route;
  Object.entries(params).forEach(([key, value]) => {
    path = path.replace(`:${key}`, value);
  });
  return path;
};
