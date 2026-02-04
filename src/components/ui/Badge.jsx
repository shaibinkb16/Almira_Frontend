import { cn } from '@/lib/utils';

const badgeVariants = {
  variant: {
    default: 'bg-gray-100 text-gray-800',
    primary: 'bg-amber-100 text-amber-800',
    secondary: 'bg-gray-100 text-gray-600',
    success: 'bg-green-100 text-green-800',
    warning: 'bg-yellow-100 text-yellow-800',
    danger: 'bg-red-100 text-red-800',
    info: 'bg-blue-100 text-blue-800',
    outline: 'bg-transparent border border-current',
  },
  size: {
    sm: 'text-xs px-2 py-0.5',
    md: 'text-xs px-2.5 py-1',
    lg: 'text-sm px-3 py-1',
  },
};

function Badge({
  className,
  variant = 'default',
  size = 'md',
  dot = false,
  children,
  ...props
}) {
  return (
    <span
      className={cn(
        'inline-flex items-center font-medium rounded-full',
        badgeVariants.variant[variant],
        badgeVariants.size[size],
        className
      )}
      {...props}
    >
      {dot && (
        <span
          className={cn(
            'w-1.5 h-1.5 rounded-full mr-1.5',
            variant === 'default' && 'bg-gray-500',
            variant === 'primary' && 'bg-amber-500',
            variant === 'secondary' && 'bg-gray-400',
            variant === 'success' && 'bg-green-500',
            variant === 'warning' && 'bg-yellow-500',
            variant === 'danger' && 'bg-red-500',
            variant === 'info' && 'bg-blue-500'
          )}
        />
      )}
      {children}
    </span>
  );
}

export { Badge, badgeVariants };
export default Badge;
