import { useRef, useEffect } from 'react';
import {
  motion,
  useScroll,
  useSpring,
  useTransform,
  useVelocity,
  useAnimationFrame,
  useMotionValue,
} from 'framer-motion';
import { cn } from '@/lib/utils';

function wrap(min, max, v) {
  const rangeSize = max - min;
  return ((((v - min) % rangeSize) + rangeSize) % rangeSize) + min;
}

// Text Marquee with scroll velocity
export function TextMarquee({
  children,
  baseVelocity = -3,
  className,
  scrollDependent = true,
  delay = 0,
}) {
  const baseX = useMotionValue(0);
  const { scrollY } = useScroll();
  const scrollVelocity = useVelocity(scrollY);
  const smoothVelocity = useSpring(scrollVelocity, {
    damping: 50,
    stiffness: 400,
  });
  const velocityFactor = useTransform(smoothVelocity, [0, 1000], [0, 2], {
    clamp: false,
  });

  const x = useTransform(baseX, (v) => `${wrap(-20, -45, v)}%`);

  const directionFactor = useRef(1);
  const hasStarted = useRef(false);

  useEffect(() => {
    const timer = setTimeout(() => {
      hasStarted.current = true;
    }, delay);

    return () => clearTimeout(timer);
  }, [delay]);

  useAnimationFrame((t, delta) => {
    if (!hasStarted.current) return;

    let moveBy = directionFactor.current * baseVelocity * (delta / 1000);

    if (scrollDependent) {
      if (velocityFactor.get() < 0) {
        directionFactor.current = -1;
      } else if (velocityFactor.get() > 0) {
        directionFactor.current = 1;
      }
      moveBy += directionFactor.current * moveBy * velocityFactor.get();
    }

    baseX.set(baseX.get() + moveBy);
  });

  return (
    <div className="overflow-hidden whitespace-nowrap flex flex-nowrap">
      <motion.div
        className="flex whitespace-nowrap gap-10 flex-nowrap"
        style={{ x }}
      >
        {[1, 2, 3, 4].map((i) => (
          <span
            key={i}
            className={cn('block text-[8vw] font-bold tracking-[-0.07em]', className)}
          >
            {children}
          </span>
        ))}
      </motion.div>
    </div>
  );
}

// Logo/Brand Marquee
export function BrandMarquee({
  brands = [],
  speed = 30,
  pauseOnHover = true,
  direction = 'left',
  className,
}) {
  return (
    <div className={cn('relative overflow-hidden', className)}>
      {/* Gradient overlays */}
      <div className="absolute left-0 top-0 bottom-0 w-20 bg-gradient-to-r from-white to-transparent z-10" />
      <div className="absolute right-0 top-0 bottom-0 w-20 bg-gradient-to-l from-white to-transparent z-10" />

      <motion.div
        className={cn(
          'flex whitespace-nowrap gap-12 items-center',
          pauseOnHover && 'hover:[animation-play-state:paused]'
        )}
        animate={{
          x: direction === 'left' ? ['0%', '-50%'] : ['-50%', '0%'],
        }}
        transition={{
          repeat: Infinity,
          ease: 'linear',
          duration: speed,
        }}
      >
        {/* Duplicate brands for seamless loop */}
        {[...brands, ...brands].map((brand, index) => (
          <div
            key={index}
            className="flex items-center justify-center px-8 py-4 grayscale hover:grayscale-0 transition-all duration-300"
          >
            {typeof brand === 'string' ? (
              <span className="text-2xl font-semibold text-gray-400 hover:text-gray-900">
                {brand}
              </span>
            ) : (
              brand
            )}
          </div>
        ))}
      </motion.div>
    </div>
  );
}

// Product Marquee
export function ProductMarquee({
  products = [],
  speed = 40,
  direction = 'left',
  className,
}) {
  return (
    <div className={cn('relative overflow-hidden py-8', className)}>
      <motion.div
        className="flex whitespace-nowrap gap-6"
        animate={{
          x: direction === 'left' ? ['0%', '-50%'] : ['-50%', '0%'],
        }}
        transition={{
          repeat: Infinity,
          ease: 'linear',
          duration: speed,
        }}
      >
        {[...products, ...products].map((product, index) => (
          <div
            key={index}
            className="flex-shrink-0 w-64 group cursor-pointer"
          >
            <div className="aspect-square rounded-2xl overflow-hidden bg-gray-100">
              <img
                src={product.image}
                alt={product.name}
                className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
              />
            </div>
            <h3 className="mt-3 text-sm font-medium text-gray-900 truncate">
              {product.name}
            </h3>
            <p className="text-sm text-amber-600 font-semibold">{product.price}</p>
          </div>
        ))}
      </motion.div>
    </div>
  );
}

export default TextMarquee;
