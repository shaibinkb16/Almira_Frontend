import { forwardRef } from 'react';
import { cn } from '@/lib/utils';

const Input = forwardRef(
  (
    {
      className,
      type = 'text',
      label,
      error,
      hint,
      leftIcon,
      rightIcon,
      fullWidth = true,
      ...props
    },
    ref
  ) => {
    const inputId = props.id || props.name;

    return (
      <div className={cn('space-y-1.5', fullWidth && 'w-full')}>
        {label && (
          <label
            htmlFor={inputId}
            className="block text-sm font-medium text-gray-700"
          >
            {label}
            {props.required && <span className="text-red-500 ml-1">*</span>}
          </label>
        )}

        <div className="relative">
          {leftIcon && (
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-gray-400">
              {leftIcon}
            </div>
          )}

          <input
            ref={ref}
            id={inputId}
            type={type}
            className={cn(
              // Base styles
              'block w-full rounded-lg border bg-white px-4 py-3',
              'text-gray-900 placeholder:text-gray-400',
              'transition-colors duration-200',
              // Focus styles
              'focus:outline-none focus:ring-2 focus:ring-offset-0',
              // Error state
              error
                ? 'border-red-300 focus:border-red-500 focus:ring-red-500/20'
                : 'border-gray-300 focus:border-amber-500 focus:ring-amber-500/20',
              // Disabled state
              'disabled:bg-gray-50 disabled:text-gray-500 disabled:cursor-not-allowed',
              // Icon padding
              leftIcon && 'pl-10',
              rightIcon && 'pr-10',
              className
            )}
            aria-invalid={error ? 'true' : 'false'}
            aria-describedby={
              error ? `${inputId}-error` : hint ? `${inputId}-hint` : undefined
            }
            {...props}
          />

          {rightIcon && (
            <div className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-400">
              {rightIcon}
            </div>
          )}
        </div>

        {error && (
          <p id={`${inputId}-error`} className="text-sm text-red-600">
            {error}
          </p>
        )}

        {hint && !error && (
          <p id={`${inputId}-hint`} className="text-sm text-gray-500">
            {hint}
          </p>
        )}
      </div>
    );
  }
);

Input.displayName = 'Input';

// Textarea component
const Textarea = forwardRef(
  ({ className, label, error, hint, fullWidth = true, rows = 4, ...props }, ref) => {
    const inputId = props.id || props.name;

    return (
      <div className={cn('space-y-1.5', fullWidth && 'w-full')}>
        {label && (
          <label
            htmlFor={inputId}
            className="block text-sm font-medium text-gray-700"
          >
            {label}
            {props.required && <span className="text-red-500 ml-1">*</span>}
          </label>
        )}

        <textarea
          ref={ref}
          id={inputId}
          rows={rows}
          className={cn(
            // Base styles
            'block w-full rounded-lg border bg-white px-4 py-3',
            'text-gray-900 placeholder:text-gray-400',
            'transition-colors duration-200 resize-none',
            // Focus styles
            'focus:outline-none focus:ring-2 focus:ring-offset-0',
            // Error state
            error
              ? 'border-red-300 focus:border-red-500 focus:ring-red-500/20'
              : 'border-gray-300 focus:border-amber-500 focus:ring-amber-500/20',
            // Disabled state
            'disabled:bg-gray-50 disabled:text-gray-500 disabled:cursor-not-allowed',
            className
          )}
          aria-invalid={error ? 'true' : 'false'}
          {...props}
        />

        {error && (
          <p id={`${inputId}-error`} className="text-sm text-red-600">
            {error}
          </p>
        )}

        {hint && !error && (
          <p id={`${inputId}-hint`} className="text-sm text-gray-500">
            {hint}
          </p>
        )}
      </div>
    );
  }
);

Textarea.displayName = 'Textarea';

export { Input, Textarea };
export default Input;
