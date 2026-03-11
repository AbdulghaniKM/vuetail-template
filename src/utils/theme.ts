import type { ThemeConfig, ColorPalette } from '../config/types';

export type { ColorPalette };

export const generateTailwindTheme = (theme: ThemeConfig): string => {
  const colorMap: Record<string, string> = {
    primary: 'primary',
    secondary: 'secondary',
    accent: 'accent',
    background: 'background',
    surface: 'surface',
    text: 'text',
    textSecondary: 'text-secondary',
    border: 'border',
    muted: 'muted',
    link: 'link',
    linkHover: 'link-hover',
    emphasis: 'emphasis',
    success: 'success',
    warning: 'warning',
    error: 'error',
    info: 'info',
  };

  const themeVars = Object.entries(colorMap)
    .map(([configKey, tailwindName]) => {
      const hasColor =
        configKey === 'textSecondary'
          ? theme.light.textSecondary !== undefined
          : theme.light[configKey as keyof ColorPalette] !== undefined;

      if (hasColor) {
        return `  --color-${tailwindName}: var(--color-${tailwindName});`;
      }
      return null;
    })
    .filter((line): line is string => line !== null)
    .join('\n');

  return `@theme {\n${themeVars}\n}`;
};

export const generateCSSVariables = (theme: ThemeConfig): string => {
  const lightVars = generateColorVariables(theme.light);
  const darkVars = generateColorVariables(theme.dark);

  return `
    :root {
      ${lightVars}
    }

    [data-theme="dark"] {
      ${darkVars}
    }

    @media (prefers-color-scheme: dark) {
      :root:not([data-theme="light"]) {
        ${darkVars}
      }
    }
  `;
};

const camelToKebab = (str: string): string =>
  str.replace(/([a-z])([A-Z])/g, '$1-$2').toLowerCase();

const generateColorVariables = (palette: ColorPalette): string => {
  return Object.entries(palette)
    .filter(([, value]) => value)
    .map(([key, value]) => `  --color-${camelToKebab(key)}: ${value};`)
    .join('\n');
};

export const applyTheme = (theme: ThemeConfig): void => {
  const styleId = 'app-theme-variables';
  let styleElement = document.getElementById(styleId) as HTMLStyleElement;

  if (!styleElement) {
    styleElement = document.createElement('style');
    styleElement.id = styleId;
    document.head.appendChild(styleElement);
  }

  styleElement.textContent = generateCSSVariables(theme);
};

export const getThemeFromStorage = (): 'light' | 'dark' | null => {
  if (typeof window === 'undefined') return null;
  const stored = localStorage.getItem('app-theme');
  return stored === 'light' || stored === 'dark' ? stored : null;
};

export const saveThemeToStorage = (theme: 'light' | 'dark'): void => {
  if (typeof window === 'undefined') return;
  localStorage.setItem('app-theme', theme);
};

export const getSystemTheme = (): 'light' | 'dark' => {
  if (typeof window === 'undefined') return 'light';
  return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
};

export const getCurrentTheme = (defaultTheme: 'light' | 'dark' | 'system' = 'system'): 'light' | 'dark' => {
  const stored = getThemeFromStorage();
  if (stored) return stored;

  if (defaultTheme === 'system') {
    return getSystemTheme();
  }

  return defaultTheme;
};

export const setTheme = (theme: 'light' | 'dark' | 'system'): void => {
  if (theme === 'system') {
    document.documentElement.removeAttribute('data-theme');
    localStorage.removeItem('app-theme');
  } else {
    document.documentElement.setAttribute('data-theme', theme);
    saveThemeToStorage(theme);
  }
};

export const getColorValue = (colorKey: keyof ColorPalette, theme: 'light' | 'dark'): string => {
  return `var(--color-${colorKey})`;
};
