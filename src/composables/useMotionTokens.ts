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
  return parseCssTime(getComputedStyle(document.documentElement).getPropertyValue(name), fallbackMs);
};

/**
 * Each call reads the live token, so a preset switch or `prefers-reduced-motion` (which shortens
 * every duration in tokens.css) reaches the next animation. Under reduced motion, drop movement
 * (y, scale) and keep the fade; the duration is already short.
 */
export const useMotionTokens = () => ({
  /** Something moving between two states: a pill sliding, a panel resizing. `--vt-duration`. */
  state: () => ({ duration: seconds('--vt-duration', 160), ease: EASE }),
  /** Something appearing. `--vt-duration-enter`. */
  enter: () => ({ duration: seconds('--vt-duration-enter', 200), ease: EASE }),
  /** Something leaving, shorter than its entrance. `--vt-duration-exit`. */
  exit: () => ({ duration: seconds('--vt-duration-exit', 130), ease: EASE }),
});
