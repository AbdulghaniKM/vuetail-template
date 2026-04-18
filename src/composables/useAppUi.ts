import { ref, watch, type Ref } from 'vue';
import { theme as defaultTheme, type Brand, type Shape } from '@/theme';

const BRAND_KEY = 'app-brand';
const SHAPE_KEY = 'app-shape';

const BRANDS: readonly Brand[] = ['neutral', 'ocean', 'sunset', 'forest', 'mono'] as const;
const SHAPES: readonly Shape[] = ['square', 'rounded', 'pill'] as const;

const isBrand = (v: string | null): v is Brand =>
  v !== null && (BRANDS as readonly string[]).includes(v);
const isShape = (v: string | null): v is Shape =>
  v !== null && (SHAPES as readonly string[]).includes(v);

const readStored = <T extends string>(key: string, guard: (v: string | null) => v is T): T | null => {
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
  } catch { /* ignore */ }
};

const applyAttr = (attr: string, value: string | null): void => {
  if (typeof document === 'undefined') return;
  if (value === null) document.documentElement.removeAttribute(attr);
  else document.documentElement.setAttribute(attr, value);
};

const initialBrand: Brand = readStored(BRAND_KEY, isBrand) ?? defaultTheme.brand;
const initialShape: Shape = readStored(SHAPE_KEY, isShape) ?? defaultTheme.shape;

const brand: Ref<Brand> = ref(initialBrand);
const shape: Ref<Shape> = ref(initialShape);

// Keep DOM + storage in sync.
applyAttr('data-brand', brand.value);
applyAttr('data-shape', shape.value);

watch(brand, (v) => {
  applyAttr('data-brand', v);
  writeStored(BRAND_KEY, v);
});

watch(shape, (v) => {
  applyAttr('data-shape', v);
  writeStored(SHAPE_KEY, v);
});

export const useAppUi = () => {
  const setBrand = (value: Brand) => { brand.value = value; };
  const setShape = (value: Shape) => { shape.value = value; };

  const reset = () => {
    brand.value = defaultTheme.brand;
    shape.value = defaultTheme.shape;
    writeStored(BRAND_KEY, null);
    writeStored(SHAPE_KEY, null);
  };

  return {
    brand,
    shape,
    brands: BRANDS,
    shapes: SHAPES,
    setBrand,
    setShape,
    reset,
  };
};
