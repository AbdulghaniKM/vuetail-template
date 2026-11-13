import { computed, onBeforeUnmount, onMounted, ref, type ComputedRef, type Ref } from 'vue';
import { parseCssTime } from '@/composables/useMotionTokens';
import { useReducedMotion } from '@/composables/useReducedMotion';

/**
 * The blob's numbers, read from the tokens: the corner radius, the goo blur that follows it, and
 * the spring the shapes move on. Every caller shares one MutationObserver on `<html>`, so a
 * preset or theme switch reaches every blob on the page and ten blobs cost one observer.
 */

const EASE: [number, number, number, number] = [0.2, 0, 0, 1];

// One observer for every blob on the page, counted so the last one out disconnects it.
const tick = ref(0);
let observer: MutationObserver | null = null;
let subscribers = 0;

const subscribe = () => {
  subscribers++;
  if (observer || typeof MutationObserver === 'undefined' || typeof document === 'undefined') return;
  observer = new MutationObserver(() => tick.value++);
  observer.observe(document.documentElement, { attributes: true, attributeFilter: ['data-vt-preset', 'data-theme', 'class', 'style'] });
};
const unsubscribe = () => {
  subscribers = Math.max(0, subscribers - 1);
  if (subscribers === 0) {
    observer?.disconnect();
    observer = null;
  }
};

/** For tests: how many observers are live (0 or 1) and how many blobs share it. */
export const blobObserverState = () => ({ observers: observer ? 1 : 0, subscribers });

const readToken = (name: string) =>
  typeof document === 'undefined' ? '' : getComputedStyle(document.documentElement).getPropertyValue(name).trim();

const px = (raw: string) => {
  const value = Number.parseFloat(raw);
  return Number.isFinite(value) ? value : Number.NaN;
};

export interface UseBlobOptions {
  /** The token (or a px number) the corners take. Default `--radius-2xl`. */
  radius?: string | number;
  /** Largest corner allowed, usually half the shape's height. */
  cap?: number;
  /** The blur never goes under this, so Ink's small corners still fuse. Default 4. */
  minBlur?: number;
}

export interface BlobSpring {
  type?: 'spring';
  duration: number;
  bounce?: number;
  ease?: [number, number, number, number];
}

export interface UseBlob {
  /** Corner radius in px. */
  roundness: ComputedRef<number>;
  /** The goo's `stdDeviation`: radius × 0.5, at least `minBlur`. */
  blur: ComputedRef<number>;
  /** The morph spring (`--vt-morph-duration`, `--vt-morph-bounce`); bounces only while opening. */
  spring: (opening?: boolean) => BlobSpring;
  /** A short tween (`--vt-duration`) for moves that follow the pointer, so the blob never trails it. */
  quick: () => BlobSpring;
  reduced: Ref<boolean>;
  /** Bumps when a preset, theme or inline style on `<html>` changes. */
  tick: Ref<number>;
}

export function useBlob(options: UseBlobOptions = {}): UseBlob {
  const { radius = '--radius-2xl', cap, minBlur = 4 } = options;
  const reduced = useReducedMotion();

  onMounted(subscribe);
  onBeforeUnmount(unsubscribe);

  const roundness = computed(() => {
    void tick.value;
    const value = typeof radius === 'number' ? radius : px(readToken(radius));
    const r = Number.isFinite(value) ? value : 16;
    return cap === undefined ? r : Math.min(r, cap);
  });
  const blur = computed(() => Math.max(minBlur, roundness.value * 0.5));

  const spring = (opening = true): BlobSpring => {
    if (reduced.value) return { duration: 0 };
    const duration = parseCssTime(readToken('--vt-morph-duration'), 500);
    if (duration === 0) return { duration: 0 };
    const bounce = px(readToken('--vt-morph-bounce'));
    return { type: 'spring', duration, bounce: opening && Number.isFinite(bounce) ? bounce : 0 };
  };

  const quick = (): BlobSpring =>
    reduced.value ? { duration: 0 } : { duration: parseCssTime(readToken('--vt-duration'), 160), ease: EASE };

  return { roundness, blur, spring, quick, reduced, tick };
}
