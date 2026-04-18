/**
 * VueTail brand / shape config.
 *
 * Change `theme.brand` or `theme.shape` here to restyle the whole app.
 * Consumers can also override at runtime via `useAppUi()`.
 *
 * This is intentionally short — one file you touch to make your project
 * look different from every other project built on this template.
 */

export type Brand = 'neutral' | 'ocean' | 'sunset' | 'forest' | 'mono';
export type Shape = 'square' | 'rounded' | 'pill';

export interface ThemeConfig {
  brand: Brand;
  shape: Shape;
}

export const theme: ThemeConfig = {
  brand: 'neutral',
  shape: 'rounded',
};

/**
 * Brand presets — each one is a full palette bundle (light + dark).
 * Keys map 1:1 to `--color-*` CSS variables.
 */
export interface BrandPalette {
  primary: string;
  secondary: string;
  accent: string;
  link: string;
  linkHover: string;
  emphasis: string;
}

export const brandPresets: Record<Brand, { light: BrandPalette; dark: BrandPalette }> = {
  neutral: {
    light: {
      primary: '#3b82f6', secondary: '#8b5cf6', accent: '#f59e0b',
      link: '#3b82f6', linkHover: '#2563eb', emphasis: '#1e40af',
    },
    dark: {
      primary: '#60a5fa', secondary: '#a78bfa', accent: '#fbbf24',
      link: '#60a5fa', linkHover: '#93bbfd', emphasis: '#60a5fa',
    },
  },
  ocean: {
    light: {
      primary: '#0ea5e9', secondary: '#6366f1', accent: '#22d3ee',
      link: '#0284c7', linkHover: '#0369a1', emphasis: '#075985',
    },
    dark: {
      primary: '#38bdf8', secondary: '#818cf8', accent: '#67e8f9',
      link: '#38bdf8', linkHover: '#7dd3fc', emphasis: '#38bdf8',
    },
  },
  sunset: {
    light: {
      primary: '#f97316', secondary: '#a855f7', accent: '#ec4899',
      link: '#ea580c', linkHover: '#c2410c', emphasis: '#9a3412',
    },
    dark: {
      primary: '#fb923c', secondary: '#c084fc', accent: '#f472b6',
      link: '#fb923c', linkHover: '#fdba74', emphasis: '#fb923c',
    },
  },
  forest: {
    light: {
      primary: '#10b981', secondary: '#14b8a6', accent: '#84cc16',
      link: '#059669', linkHover: '#047857', emphasis: '#065f46',
    },
    dark: {
      primary: '#34d399', secondary: '#2dd4bf', accent: '#a3e635',
      link: '#34d399', linkHover: '#6ee7b7', emphasis: '#34d399',
    },
  },
  mono: {
    light: {
      primary: '#374151', secondary: '#6b7280', accent: '#9ca3af',
      link: '#374151', linkHover: '#111827', emphasis: '#111827',
    },
    dark: {
      primary: '#e5e7eb', secondary: '#9ca3af', accent: '#d1d5db',
      link: '#e5e7eb', linkHover: '#f9fafb', emphasis: '#f9fafb',
    },
  },
};
