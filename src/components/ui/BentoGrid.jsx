import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowRight } from 'lucide-react';
import { cn } from '@/lib/utils';

export function BentoGrid({ children, className }) {
  return (
    <div
      className={cn(
        'grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4',
        className
      )}
    >
      {children}
    </div>
  );
}

export function BentoCard({
  title,
  description,
  image,
  href,
  className,
  size = 'default', // 'default' | 'large' | 'wide' | 'tall'
  index = 0,
}) {
  const sizeClasses = {
    default: '',
    large: 'md:col-span-2 md:row-span-2',
    wide: 'md:col-span-2',
    tall: 'md:row-span-2',
  };

  const aspectClasses = {
    default: 'aspect-square',
    large: 'aspect-square md:aspect-[2/1.5]',
    wide: 'aspect-[2/1]',
    tall: 'aspect-[1/1.5]',
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.5, delay: index * 0.1 }}
      className={cn(sizeClasses[size], className)}
    >
      <Link
        to={href}
        className={cn(
          'group block relative overflow-hidden rounded-2xl bg-gray-100',
          aspectClasses[size]
        )}
      >
        {/* Background Image */}
        <motion.img
          src={image}
          alt={title}
          className="absolute inset-0 w-full h-full object-cover"
          whileHover={{ scale: 1.1 }}
          transition={{ duration: 0.6 }}
        />

        {/* Gradient Overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent" />

        {/* Content */}
        <div className="absolute inset-0 flex flex-col justify-end p-6">
          <motion.div
            initial={{ y: 10, opacity: 0 }}
            whileInView={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.2 + index * 0.1 }}
          >
            <h3 className="text-xl md:text-2xl font-bold text-white mb-1">
              {title}
            </h3>
            {description && (
              <p className="text-sm text-gray-200 mb-3 line-clamp-2">
                {description}
              </p>
            )}
            <span className="inline-flex items-center gap-1 text-amber-400 text-sm font-medium group-hover:gap-2 transition-all">
              Shop Now
              <ArrowRight className="h-4 w-4" />
            </span>
          </motion.div>
        </div>

        {/* Hover Shine Effect */}
        <motion.div
          className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent opacity-0 group-hover:opacity-100"
          initial={{ x: '-100%' }}
          whileHover={{ x: '100%' }}
          transition={{ duration: 0.6 }}
        />
      </Link>
    </motion.div>
  );
}

// Category Bento specifically for e-commerce
export function CategoryBento({ categories = [] }) {
  return (
    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6">
      {categories.map((category, index) => (
        <BentoCard
          key={category.id || index}
          title={category.name}
          description={category.description}
          image={category.image}
          href={category.href || `/categories/${category.slug}`}
          size={index === 0 ? 'large' : 'default'}
          index={index}
        />
      ))}
    </div>
  );
}

// Feature Bento for showcasing store features
export function FeatureBento({ features = [] }) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
      {features.map((feature, index) => (
        <motion.div
          key={index}
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, delay: index * 0.1 }}
          className={cn(
            'group relative overflow-hidden rounded-2xl p-6 md:p-8',
            'bg-gradient-to-br',
            feature.gradient || 'from-amber-50 to-amber-100'
          )}
        >
          {/* Icon */}
          <div
            className={cn(
              'w-12 h-12 rounded-xl flex items-center justify-center mb-4',
              feature.iconBg || 'bg-amber-500'
            )}
          >
            {feature.icon}
          </div>

          {/* Content */}
          <h3 className="text-xl font-bold text-gray-900 mb-2">
            {feature.title}
          </h3>
          <p className="text-gray-600">{feature.description}</p>

          {/* Decorative Element */}
          <div className="absolute -right-4 -bottom-4 w-24 h-24 rounded-full bg-white/20 group-hover:scale-150 transition-transform duration-500" />
        </motion.div>
      ))}
    </div>
  );
}

export default BentoGrid;
