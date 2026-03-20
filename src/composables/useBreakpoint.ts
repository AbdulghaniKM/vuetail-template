import { computed } from 'vue';
import { useMediaQuery } from '@vueuse/core';

const BREAKPOINTS = {
  sm: 640,
  md: 768,
  lg: 1024,
  xl: 1280,
  '2xl': 1536,
} as const;

type Breakpoint = keyof typeof BREAKPOINTS;

export const useBreakpoint = () => {
  const sm = useMediaQuery(`(min-width: ${BREAKPOINTS.sm}px)`);
  const md = useMediaQuery(`(min-width: ${BREAKPOINTS.md}px)`);
  const lg = useMediaQuery(`(min-width: ${BREAKPOINTS.lg}px)`);
  const xl = useMediaQuery(`(min-width: ${BREAKPOINTS.xl}px)`);
  const xxl = useMediaQuery(`(min-width: ${BREAKPOINTS['2xl']}px)`);

  const current = computed<Breakpoint | 'xs'>(() => {
    if (xxl.value) return '2xl';
    if (xl.value) return 'xl';
    if (lg.value) return 'lg';
    if (md.value) return 'md';
    if (sm.value) return 'sm';
    return 'xs';
  });

  const isMobile = computed(() => !md.value);
  const isTablet = computed(() => md.value && !lg.value);
  const isDesktop = computed(() => lg.value);

  const greaterThan = (bp: Breakpoint) => {
    const map = { sm, md, lg, xl, '2xl': xxl };
    return map[bp];
  };

  const smallerThan = (bp: Breakpoint) => {
    return computed(() => !greaterThan(bp).value);
  };

  return {
    current,
    isMobile,
    isTablet,
    isDesktop,
    greaterThan,
    smallerThan,
    breakpoints: BREAKPOINTS,
  };
};
