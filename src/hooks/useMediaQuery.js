import { useState, useEffect } from 'react';
import { BREAKPOINTS } from '@/config/constants';

/**
 * Check if a media query matches
 * @param {string} query - CSS media query string
 * @returns {boolean} - Whether the query matches
 */
export function useMediaQuery(query) {
  const [matches, setMatches] = useState(false);

  useEffect(() => {
    const mediaQuery = window.matchMedia(query);
    setMatches(mediaQuery.matches);

    const handler = (event) => setMatches(event.matches);
    mediaQuery.addEventListener('change', handler);

    return () => mediaQuery.removeEventListener('change', handler);
  }, [query]);

  return matches;
}

/**
 * Hook for responsive breakpoints
 * @returns {object} - Breakpoint boolean values
 */
export function useBreakpoint() {
  const isMobile = useMediaQuery(`(max-width: ${BREAKPOINTS.sm - 1}px)`);
  const isTablet = useMediaQuery(
    `(min-width: ${BREAKPOINTS.sm}px) and (max-width: ${BREAKPOINTS.lg - 1}px)`
  );
  const isDesktop = useMediaQuery(`(min-width: ${BREAKPOINTS.lg}px)`);
  const isLargeDesktop = useMediaQuery(`(min-width: ${BREAKPOINTS.xl}px)`);

  // Minimum breakpoint checks
  const isSm = useMediaQuery(`(min-width: ${BREAKPOINTS.sm}px)`);
  const isMd = useMediaQuery(`(min-width: ${BREAKPOINTS.md}px)`);
  const isLg = useMediaQuery(`(min-width: ${BREAKPOINTS.lg}px)`);
  const isXl = useMediaQuery(`(min-width: ${BREAKPOINTS.xl}px)`);
  const is2xl = useMediaQuery(`(min-width: ${BREAKPOINTS['2xl']}px)`);

  return {
    isMobile,
    isTablet,
    isDesktop,
    isLargeDesktop,
    // Min-width checks
    isSm,
    isMd,
    isLg,
    isXl,
    is2xl,
  };
}

export default useMediaQuery;
