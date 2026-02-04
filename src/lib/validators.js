import { z } from 'zod';

// Sanitize string to prevent XSS
const sanitizedString = z.string().transform((val) =>
  val.replace(/<[^>]*>/g, '').trim()
);

// ==================== AUTH SCHEMAS ====================

export const emailSchema = z
  .string()
  .min(1, 'Email is required')
  .email('Invalid email address')
  .max(255, 'Email is too long');

// OWASP compliant password
export const passwordSchema = z
  .string()
  .min(8, 'Password must be at least 8 characters')
  .max(128, 'Password is too long')
  .regex(/[A-Z]/, 'Must contain at least one uppercase letter')
  .regex(/[a-z]/, 'Must contain at least one lowercase letter')
  .regex(/[0-9]/, 'Must contain at least one number')
  .regex(/[^A-Za-z0-9]/, 'Must contain at least one special character');

export const loginSchema = z.object({
  email: emailSchema,
  password: z.string().min(1, 'Password is required'),
});

export const registerSchema = z
  .object({
    email: emailSchema,
    password: passwordSchema,
    confirmPassword: z.string().min(1, 'Please confirm your password'),
    fullName: sanitizedString
      .pipe(z.string().min(2, 'Name must be at least 2 characters'))
      .pipe(z.string().max(100, 'Name is too long')),
    acceptTerms: z.literal(true, {
      errorMap: () => ({ message: 'You must accept the terms and conditions' }),
    }),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: 'Passwords do not match',
    path: ['confirmPassword'],
  });

export const forgotPasswordSchema = z.object({
  email: emailSchema,
});

export const resetPasswordSchema = z
  .object({
    password: passwordSchema,
    confirmPassword: z.string().min(1, 'Please confirm your password'),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: 'Passwords do not match',
    path: ['confirmPassword'],
  });

export const mfaCodeSchema = z.object({
  code: z
    .string()
    .length(6, 'Code must be 6 digits')
    .regex(/^\d{6}$/, 'Code must contain only numbers'),
});

// ==================== USER SCHEMAS ====================

export const phoneSchema = z
  .string()
  .regex(/^[6-9]\d{9}$/, 'Invalid Indian phone number (10 digits starting with 6-9)');

export const profileSchema = z.object({
  fullName: sanitizedString
    .pipe(z.string().min(2, 'Name must be at least 2 characters'))
    .pipe(z.string().max(100, 'Name is too long')),
  phone: phoneSchema.optional().or(z.literal('')),
});

export const addressSchema = z.object({
  label: z.enum(['Home', 'Work', 'Other'], {
    errorMap: () => ({ message: 'Please select an address type' }),
  }),
  fullName: sanitizedString
    .pipe(z.string().min(2, 'Name is required'))
    .pipe(z.string().max(100, 'Name is too long')),
  phone: phoneSchema,
  addressLine1: sanitizedString
    .pipe(z.string().min(5, 'Address is required'))
    .pipe(z.string().max(200, 'Address is too long')),
  addressLine2: sanitizedString
    .pipe(z.string().max(200, 'Address is too long'))
    .optional()
    .or(z.literal('')),
  city: sanitizedString
    .pipe(z.string().min(2, 'City is required'))
    .pipe(z.string().max(100, 'City name is too long')),
  state: sanitizedString
    .pipe(z.string().min(2, 'State is required'))
    .pipe(z.string().max(100, 'State name is too long')),
  postalCode: z
    .string()
    .regex(/^\d{6}$/, 'PIN code must be 6 digits'),
  country: z.string().default('India'),
  isDefault: z.boolean().optional(),
  isBillingDefault: z.boolean().optional(),
});

export const changePasswordSchema = z
  .object({
    currentPassword: z.string().min(1, 'Current password is required'),
    newPassword: passwordSchema,
    confirmPassword: z.string().min(1, 'Please confirm your password'),
  })
  .refine((data) => data.newPassword === data.confirmPassword, {
    message: 'Passwords do not match',
    path: ['confirmPassword'],
  })
  .refine((data) => data.currentPassword !== data.newPassword, {
    message: 'New password must be different from current password',
    path: ['newPassword'],
  });

// ==================== PRODUCT SCHEMAS (Admin) ====================

export const productSchema = z.object({
  name: sanitizedString
    .pipe(z.string().min(3, 'Product name must be at least 3 characters'))
    .pipe(z.string().max(200, 'Product name is too long')),
  sku: z
    .string()
    .min(3, 'SKU must be at least 3 characters')
    .max(50, 'SKU is too long')
    .regex(/^[A-Z0-9-]+$/i, 'SKU can only contain letters, numbers, and hyphens'),
  description: sanitizedString
    .pipe(z.string().max(5000, 'Description is too long'))
    .optional()
    .or(z.literal('')),
  shortDescription: sanitizedString
    .pipe(z.string().max(500, 'Short description is too long'))
    .optional()
    .or(z.literal('')),
  categoryId: z.string().uuid('Please select a category'),
  basePrice: z
    .number({ invalid_type_error: 'Price must be a number' })
    .positive('Price must be greater than 0')
    .max(10000000, 'Price is too high'),
  salePrice: z
    .number()
    .positive('Sale price must be greater than 0')
    .max(10000000, 'Sale price is too high')
    .optional()
    .nullable(),
  costPrice: z
    .number()
    .positive('Cost price must be greater than 0')
    .max(10000000, 'Cost price is too high')
    .optional()
    .nullable(),
  stockQuantity: z
    .number({ invalid_type_error: 'Stock must be a number' })
    .int('Stock must be a whole number')
    .min(0, 'Stock cannot be negative')
    .max(100000, 'Stock is too high'),
  lowStockThreshold: z
    .number()
    .int()
    .min(0)
    .max(1000)
    .optional()
    .default(10),
  material: sanitizedString
    .pipe(z.string().max(100))
    .optional()
    .or(z.literal('')),
  purity: sanitizedString
    .pipe(z.string().max(50))
    .optional()
    .or(z.literal('')),
  weight: z.number().positive().optional().nullable(),
  brand: sanitizedString
    .pipe(z.string().max(100))
    .optional()
    .or(z.literal('')),
  gender: z
    .enum(['men', 'women', 'unisex', 'kids'])
    .optional()
    .nullable(),
  status: z.enum(['draft', 'active', 'archived']),
  isFeatured: z.boolean().default(false),
  isNewArrival: z.boolean().default(false),
  tags: z
    .array(sanitizedString.pipe(z.string().max(50)))
    .max(20, 'Maximum 20 tags allowed')
    .optional()
    .default([]),
  metaTitle: sanitizedString
    .pipe(z.string().max(70))
    .optional()
    .or(z.literal('')),
  metaDescription: sanitizedString
    .pipe(z.string().max(160))
    .optional()
    .or(z.literal('')),
});

export const productVariantSchema = z.object({
  skuSuffix: z
    .string()
    .min(1, 'SKU suffix is required')
    .max(20, 'SKU suffix is too long')
    .regex(/^[A-Z0-9-]+$/i, 'SKU suffix can only contain letters, numbers, and hyphens'),
  name: sanitizedString
    .pipe(z.string().min(1, 'Variant name is required'))
    .pipe(z.string().max(100)),
  size: sanitizedString.pipe(z.string().max(20)).optional().or(z.literal('')),
  color: sanitizedString.pipe(z.string().max(50)).optional().or(z.literal('')),
  colorHex: z
    .string()
    .regex(/^#[0-9A-Fa-f]{6}$/, 'Invalid color code')
    .optional()
    .or(z.literal('')),
  priceAdjustment: z.number().default(0),
  stockQuantity: z
    .number()
    .int()
    .min(0, 'Stock cannot be negative')
    .max(100000),
  imageUrl: z.string().url().optional().or(z.literal('')),
  isActive: z.boolean().default(true),
});

// ==================== CATEGORY SCHEMA (Admin) ====================

export const categorySchema = z.object({
  name: sanitizedString
    .pipe(z.string().min(2, 'Category name must be at least 2 characters'))
    .pipe(z.string().max(100, 'Category name is too long')),
  description: sanitizedString
    .pipe(z.string().max(500))
    .optional()
    .or(z.literal('')),
  parentId: z.string().uuid().optional().nullable(),
  type: z.enum(['fashion', 'ornament', 'accessory']),
  displayOrder: z.number().int().min(0).default(0),
  isActive: z.boolean().default(true),
  metaTitle: sanitizedString.pipe(z.string().max(70)).optional().or(z.literal('')),
  metaDescription: sanitizedString.pipe(z.string().max(160)).optional().or(z.literal('')),
});

// ==================== REVIEW SCHEMA ====================

export const reviewSchema = z.object({
  rating: z
    .number()
    .int('Rating must be a whole number')
    .min(1, 'Please select a rating')
    .max(5, 'Rating cannot exceed 5'),
  title: sanitizedString
    .pipe(z.string().max(200, 'Title is too long'))
    .optional()
    .or(z.literal('')),
  comment: sanitizedString
    .pipe(z.string().max(2000, 'Review is too long'))
    .optional()
    .or(z.literal('')),
});

// ==================== COUPON SCHEMA (Admin) ====================

export const couponSchema = z.object({
  code: z
    .string()
    .min(3, 'Coupon code must be at least 3 characters')
    .max(20, 'Coupon code is too long')
    .regex(/^[A-Z0-9]+$/i, 'Code can only contain letters and numbers')
    .transform((val) => val.toUpperCase()),
  description: sanitizedString
    .pipe(z.string().max(500))
    .optional()
    .or(z.literal('')),
  discountType: z.enum(['percentage', 'fixed']),
  discountValue: z
    .number()
    .positive('Discount must be greater than 0'),
  minOrderAmount: z.number().min(0).default(0),
  maxDiscountAmount: z.number().positive().optional().nullable(),
  usageLimit: z.number().int().positive().optional().nullable(),
  usagePerUser: z.number().int().positive().default(1),
  startsAt: z.string().datetime().optional(),
  expiresAt: z.string().datetime().optional().nullable(),
  isActive: z.boolean().default(true),
});

// ==================== CHECKOUT SCHEMA ====================

export const checkoutSchema = z.object({
  shippingAddressId: z.string().uuid('Please select a shipping address'),
  billingAddressId: z.string().uuid().optional(),
  billingSameAsShipping: z.boolean().default(true),
  paymentMethod: z.enum(['razorpay', 'upi', 'cod', 'card']).optional(),
  customerNotes: sanitizedString
    .pipe(z.string().max(500))
    .optional()
    .or(z.literal('')),
  couponCode: z.string().max(20).optional().or(z.literal('')),
});

// ==================== SEARCH & FILTER SCHEMAS ====================

export const searchSchema = z.object({
  query: z.string().max(200).optional(),
  category: z.string().uuid().optional(),
  minPrice: z.number().min(0).optional(),
  maxPrice: z.number().min(0).optional(),
  material: z.string().max(100).optional(),
  gender: z.enum(['men', 'women', 'unisex', 'kids']).optional(),
  sortBy: z.enum(['newest', 'price_asc', 'price_desc', 'popular', 'rating']).optional(),
  page: z.number().int().min(1).default(1),
  limit: z.number().int().min(1).max(100).default(12),
});

// ==================== CONTACT FORM SCHEMA ====================

export const contactSchema = z.object({
  name: sanitizedString
    .pipe(z.string().min(2, 'Name is required'))
    .pipe(z.string().max(100)),
  email: emailSchema,
  phone: phoneSchema.optional().or(z.literal('')),
  subject: sanitizedString
    .pipe(z.string().min(3, 'Subject is required'))
    .pipe(z.string().max(200)),
  message: sanitizedString
    .pipe(z.string().min(10, 'Message must be at least 10 characters'))
    .pipe(z.string().max(2000, 'Message is too long')),
});

// ==================== HELPER FUNCTIONS ====================

/**
 * Parse and validate data with a schema
 */
export function validateData(schema, data) {
  try {
    return { success: true, data: schema.parse(data), errors: null };
  } catch (error) {
    if (error instanceof z.ZodError) {
      const errors = {};
      error.errors.forEach((err) => {
        const path = err.path.join('.');
        errors[path] = err.message;
      });
      return { success: false, data: null, errors };
    }
    throw error;
  }
}

/**
 * Get field error from validation result
 */
export function getFieldError(errors, field) {
  return errors?.[field] || null;
}
