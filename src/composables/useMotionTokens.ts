/**
 * Motion values for motion-v, read from the VueTail tokens so presets and reduced motion
 * reach JS-driven animation the same way they reach CSS transitions.
 */
const EASE: [number, number, number, number] = [0.2, 0, 0, 1];

/**
 * A CSS time in seconds. Minifiers rewrite `200ms` as `.2s`, so both units have to parse;
 * a bare number is taken as milliseconds.
 */
export const parseCssTime = (raw: string, fallbackMs: number): number => {
  const match = raw.trim().match(/^(-?[\d.]+)(ms|s)?$/);
  if (!match) return fallbackMs / 1000;
  const value = Number.parseFloat(match[1]);
  if (!Number.isFinite(value)) return fallbackMs / 1000;
  return match[2] === 's' ? value : value / 1000;
};

const seconds = (name: string, fallbackMs: number): number => {
  if (typeof document === 'undefined') return fallbackMs / 1000;
  return parseCssTime(
    getComputedStyle(document.documentElement).getPropertyValue(name),
    fallbackMs,
  );
};

export const useMotionTokens = () => ({
  enter: () => ({ duration: seconds('--vt-duration-enter', 200), ease: EASE }),
  exit: () => ({ duration: seconds('--vt-duration-exit', 130), ease: EASE }),
});
