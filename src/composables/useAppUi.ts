import { ref, watch, type Ref } from 'vue';
import { theme as defaultTheme, type Shape } from '@/theme';

const SHAPE_KEY = 'app-shape';

const SHAPES: readonly Shape[] = ['square', 'rounded', 'pill'] as const;

const isShape = (v: string | null): v is Shape =>
  v !== null && (SHAPES as readonly string[]).includes(v);

const readStored = <T extends string>(
  key: string,
  guard: (v: string | null) => v is T,
): T | null => {
  if (typeof localStorage === 'undefined') return null;
  try {
    const raw = localStorage.getItem(key);
    return guard(raw) ? raw : null;
  } catch {
    return null;
  }
};

const writeStored = (key: string, value: string | null): void => {
  if (typeof localStorage === 'undefined') return;
  try {
    if (value === null) localStorage.removeItem(key);
    else localStorage.setItem(key, value);
  } catch {
    /* ignore */
  }
};

const applyAttr = (attr: string, value: string | null): void => {
  if (typeof document === 'undefined') return;
  if (value === null) document.documentElement.removeAttribute(attr);
  else document.documentElement.setAttribute(attr, value);
};

const initialShape: Shape = readStored(SHAPE_KEY, isShape) ?? defaultTheme.shape;

const shape: Ref<Shape> = ref(initialShape);

applyAttr('data-shape', shape.value === 'rounded' ? null : shape.value);

watch(shape, (v) => {
  applyAttr('data-shape', v === 'rounded' ? null : v);
  writeStored(SHAPE_KEY, v === 'rounded' ? null : v);
});

export const useAppUi = () => {
  const setShape = (value: Shape) => {
    shape.value = value;
  };

  const reset = () => {
    shape.value = defaultTheme.shape;
    writeStored(SHAPE_KEY, null);
  };

  return {
    shape,
    shapes: SHAPES,
    setShape,
    reset,
  };
};
