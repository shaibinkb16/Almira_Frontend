import { useRef } from 'react';
import { motion, useScroll, useTransform, useSpring } from 'framer-motion';
import { cn } from '@/lib/utils';

// Fade In on Scroll
export function FadeInOnScroll({
  children,
  className,
  delay = 0,
  direction = 'up', // 'up' | 'down' | 'left' | 'right'
}) {
  const directionOffset = {
    up: { y: 40 },
    down: { y: -40 },
    left: { x: 40 },
    right: { x: -40 },
  };

  return (
    <motion.div
      initial={{ opacity: 0, ...directionOffset[direction] }}
      whileInView={{ opacity: 1, x: 0, y: 0 }}
      viewport={{ once: true, margin: '-100px' }}
      transition={{
        duration: 0.6,
        delay,
        ease: 'easeOut',
      }}
      className={className}
    >
      {children}
    </motion.div>
  );
}

// Stagger Children Animation
export function StaggerChildren({
  children,
  className,
  staggerDelay = 0.1,
}) {
  return (
    <motion.div
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, margin: '-100px' }}
      variants={{
        visible: {
          transition: {
            staggerChildren: staggerDelay,
          },
        },
      }}
      className={className}
    >
      {children}
    </motion.div>
  );
}

export function StaggerItem({ children, className }) {
  return (
    <motion.div
      variants={{
        hidden: { opacity: 0, y: 20 },
        visible: { opacity: 1, y: 0, transition: { duration: 0.5 } },
      }}
      className={className}
    >
      {children}
    </motion.div>
  );
}

// Parallax Section
export function ParallaxSection({
  children,
  className,
  speed = 0.5, // 0 to 1, higher = more parallax
  backgroundImage,
}) {
  const ref = useRef(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ['start end', 'end start'],
  });

  const y = useTransform(scrollYProgress, [0, 1], ['-20%', '20%']);
  const smoothY = useSpring(y, { stiffness: 100, damping: 30 });

  return (
    <div ref={ref} className={cn('relative overflow-hidden', className)}>
      {backgroundImage && (
        <motion.div
          className="absolute inset-0 w-full h-[120%] -top-[10%]"
          style={{ y: smoothY }}
        >
          <img
            src={backgroundImage}
            alt=""
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-black/40" />
        </motion.div>
      )}
      <div className="relative z-10">{children}</div>
    </div>
  );
}

// Scale on Scroll
export function ScaleOnScroll({ children, className }) {
  const ref = useRef(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ['start end', 'end start'],
  });

  const scale = useTransform(scrollYProgress, [0, 0.5, 1], [0.8, 1, 0.8]);
  const opacity = useTransform(scrollYProgress, [0, 0.3, 0.7, 1], [0, 1, 1, 0]);

  return (
    <motion.div
      ref={ref}
      style={{ scale, opacity }}
      className={className}
    >
      {children}
    </motion.div>
  );
}

// Reveal Text Animation
export function RevealText({ text, className }) {
  const words = text.split(' ');

  return (
    <motion.div
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true }}
      className={cn('flex flex-wrap gap-x-2', className)}
    >
      {words.map((word, index) => (
        <motion.span
          key={index}
          variants={{
            hidden: { opacity: 0, y: 20 },
            visible: {
              opacity: 1,
              y: 0,
              transition: {
                duration: 0.5,
                delay: index * 0.05,
              },
            },
          }}
        >
          {word}
        </motion.span>
      ))}
    </motion.div>
  );
}

// Count Up Animation
export function CountUp({
  end,
  duration = 2,
  prefix = '',
  suffix = '',
  className,
}) {
  return (
    <motion.span
      initial={{ opacity: 0 }}
      whileInView={{ opacity: 1 }}
      viewport={{ once: true }}
      className={className}
    >
      <motion.span
        initial={{ count: 0 }}
        whileInView={{ count: end }}
        viewport={{ once: true }}
        transition={{ duration, ease: 'easeOut' }}
      >
        {({ count }) => (
          <>
            {prefix}
            {Math.round(count).toLocaleString()}
            {suffix}
          </>
        )}
      </motion.span>
    </motion.span>
  );
}

export default FadeInOnScroll;
