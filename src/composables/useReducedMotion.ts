import type { ComputedRef } from 'vue';
import { useMediaQuery } from '@vueuse/core';

const QUERY = '(prefers-reduced-motion: reduce)';

/**
 * True while the visitor has asked their OS for reduced motion.
 *
 * Animated components should read this and render one complete, legible frame
 * at rest instead of looping — content is never withheld pending an animation.
 * Reactive, so a preference changed mid-session takes effect without a reload.
 *
 * ```ts
 * const reduced = useReducedMotion();
 * // in a render loop: if (!reduced.value) raf = requestAnimationFrame(draw);
 * ```
 */
export const useReducedMotion = (): ComputedRef<boolean> => useMediaQuery(QUERY);
