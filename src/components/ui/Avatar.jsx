import { useState } from 'react';
import { cn } from '@/lib/utils';
import { getInitials } from '@/lib/utils';

const sizeClasses = {
  xs: 'h-6 w-6 text-xs',
  sm: 'h-8 w-8 text-sm',
  md: 'h-10 w-10 text-sm',
  lg: 'h-12 w-12 text-base',
  xl: 'h-16 w-16 text-lg',
  '2xl': 'h-24 w-24 text-2xl',
};

function Avatar({
  src,
  alt,
  name,
  size = 'md',
  className,
  fallbackClassName,
  ...props
}) {
  const [imageError, setImageError] = useState(false);
  const initials = getInitials(name || alt || '');

  // Show fallback if no src, image error, or no initials available
  if (!src || imageError) {
    return (
      <div
        className={cn(
          'rounded-full flex items-center justify-center font-medium',
          'bg-amber-100 text-amber-700',
          sizeClasses[size],
          fallbackClassName,
          className
        )}
        {...props}
      >
        {initials}
      </div>
    );
  }

  return (
    <img
      src={src}
      alt={alt || name || 'Avatar'}
      className={cn(
        'rounded-full object-cover bg-gray-100',
        sizeClasses[size],
        className
      )}
      onError={() => setImageError(true)}
      referrerPolicy="no-referrer"
      crossOrigin="anonymous"
      {...props}
    />
  );
}

// Avatar with status indicator
function AvatarWithStatus({
  src,
  alt,
  name,
  size = 'md',
  status, // 'online' | 'offline' | 'away' | 'busy'
  className,
  ...props
}) {
  const statusColors = {
    online: 'bg-green-500',
    offline: 'bg-gray-400',
    away: 'bg-yellow-500',
    busy: 'bg-red-500',
  };

  const statusSizes = {
    xs: 'h-1.5 w-1.5',
    sm: 'h-2 w-2',
    md: 'h-2.5 w-2.5',
    lg: 'h-3 w-3',
    xl: 'h-4 w-4',
    '2xl': 'h-5 w-5',
  };

  return (
    <div className={cn('relative inline-block', className)}>
      <Avatar src={src} alt={alt} name={name} size={size} {...props} />
      {status && (
        <span
          className={cn(
            'absolute bottom-0 right-0 rounded-full ring-2 ring-white',
            statusColors[status],
            statusSizes[size]
          )}
        />
      )}
    </div>
  );
}

// Avatar Group
function AvatarGroup({ avatars = [], max = 4, size = 'md', className }) {
  const displayAvatars = avatars.slice(0, max);
  const remaining = avatars.length - max;

  return (
    <div className={cn('flex -space-x-2', className)}>
      {displayAvatars.map((avatar, index) => (
        <Avatar
          key={index}
          src={avatar.src}
          alt={avatar.alt}
          name={avatar.name}
          size={size}
          className="ring-2 ring-white"
        />
      ))}
      {remaining > 0 && (
        <div
          className={cn(
            'rounded-full flex items-center justify-center font-medium',
            'bg-gray-200 text-gray-600 ring-2 ring-white',
            sizeClasses[size]
          )}
        >
          +{remaining}
        </div>
      )}
    </div>
  );
}

export { Avatar, AvatarWithStatus, AvatarGroup };
export default Avatar;
