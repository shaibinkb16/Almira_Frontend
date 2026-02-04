import { forwardRef } from 'react';
import { cn } from '@/lib/utils';

const buttonVariants = {
  variant: {
    primary:
      'bg-amber-600 text-white hover:bg-amber-700 focus:ring-amber-500 shadow-sm',
    secondary:
      'bg-gray-100 text-gray-900 hover:bg-gray-200 focus:ring-gray-500',
    outline:
      'border-2 border-amber-600 text-amber-600 hover:bg-amber-50 focus:ring-amber-500',
    ghost: 'text-gray-700 hover:bg-gray-100 focus:ring-gray-500',
    danger: 'bg-red-600 text-white hover:bg-red-700 focus:ring-red-500 shadow-sm',
    success:
      'bg-green-600 text-white hover:bg-green-700 focus:ring-green-500 shadow-sm',
    link: 'text-amber-600 hover:text-amber-700 underline-offset-4 hover:underline p-0 h-auto',
  },
  size: {
    xs: 'h-7 px-2 text-xs rounded',
    sm: 'h-9 px-3 text-sm rounded-md',
    md: 'h-11 px-5 text-sm rounded-lg',
    lg: 'h-12 px-8 text-base rounded-lg',
    xl: 'h-14 px-10 text-lg rounded-xl',
    icon: 'h-10 w-10 rounded-lg',
    'icon-sm': 'h-8 w-8 rounded-md',
    'icon-lg': 'h-12 w-12 rounded-lg',
  },
};

const Button = forwardRef(
  (
    {
      className,
      variant = 'primary',
      size = 'md',
      isLoading = false,
      disabled = false,
      leftIcon,
      rightIcon,
      children,
      ...props
    },
    ref
  ) => {
    return (
      <button
        ref={ref}
        disabled={disabled || isLoading}
        className={cn(
          // Base styles
          'inline-flex items-center justify-center font-medium',
          'transition-all duration-200 ease-in-out',
          'focus:outline-none focus:ring-2 focus:ring-offset-2',
          'disabled:opacity-50 disabled:cursor-not-allowed disabled:pointer-events-none',
          // Active state
          'active:scale-[0.98]',
          // Variants
          buttonVariants.variant[variant],
          buttonVariants.size[size],
          className
        )}
        {...props}
      >
        {isLoading ? (
          <>
            <svg
              className="animate-spin -ml-1 mr-2 h-4 w-4"
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
            >
              <circle
                className="opacity-25"
                cx="12"
                cy="12"
                r="10"
                stroke="currentColor"
                strokeWidth="4"
              />
              <path
                className="opacity-75"
                fill="currentColor"
                d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
              />
            </svg>
            Loading...
          </>
        ) : (
          <>
            {leftIcon && <span className="mr-2 -ml-1">{leftIcon}</span>}
            {children}
            {rightIcon && <span className="ml-2 -mr-1">{rightIcon}</span>}
          </>
        )}
      </button>
    );
  }
);

Button.displayName = 'Button';

export { Button, buttonVariants };
export default Button;
