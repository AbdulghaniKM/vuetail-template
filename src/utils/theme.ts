import type { ThemeConfig, ColorPalette } from '../config/types';

export const generateTailwindTheme = (theme: ThemeConfig): string => {
  // Generate Tailwind v4 @theme block that references CSS variables
  // This allows using bg-primary, text-primary, etc. directly
  const colorMap: Record<string, string> = {
    primary: 'primary',
    secondary: 'secondary',
    accent: 'accent',
    background: 'background',
    surface: 'surface',
    text: 'text',
    textSecondary: 'text-secondary',
    border: 'border',
    success: 'success',
    warning: 'warning',
    error: 'error',
    info: 'info',
  };

  const themeVars = Object.entries(colorMap)
    .map(([configKey, tailwindName]) => {
      // Check if color exists in palette (some are optional)
      const hasColor =
        configKey === 'textSecondary'
          ? theme.light.textSecondary !== undefined
          : theme.light[configKey as keyof ColorPalette] !== undefined;

      if (hasColor) {
        return `  --color-${tailwindName}: var(--color-${configKey});`;
      }
      return null;
    })
    .filter((line): line is string => line !== null)
    .join('\n');

  // Return the @theme block - Tailwind v4 will process this
  return `@theme {\n${themeVars}\n}`;
};

export const generateCSSVariables = (theme: ThemeConfig): string => {
  const lightVars = generateColorVariables(theme.light, 'light');
  const darkVars = generateColorVariables(theme.dark, 'dark');

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

const generateColorVariables = (palette: ColorPalette, theme: string): string => {
  const vars: string[] = [];

  Object.entries(palette).forEach(([key, value]) => {
    if (value) {
      const varName = `--color-${key}`;
      vars.push(`  ${varName}: ${value};`);
    }
  });

  // Generate semantic color aliases
  vars.push(`  --color-primary: ${palette.primary};`);
  vars.push(`  --color-secondary: ${palette.secondary};`);
  vars.push(`  --color-accent: ${palette.accent};`);
  vars.push(`  --color-background: ${palette.background};`);
  vars.push(`  --color-surface: ${palette.surface};`);
  vars.push(`  --color-text: ${palette.text};`);
  vars.push(`  --color-text-secondary: ${palette.textSecondary};`);
  vars.push(`  --color-border: ${palette.border};`);

  if (palette.success) vars.push(`  --color-success: ${palette.success};`);
  if (palette.warning) vars.push(`  --color-warning: ${palette.warning};`);
  if (palette.error) vars.push(`  --color-error: ${palette.error};`);
  if (palette.info) vars.push(`  --color-info: ${palette.info};`);

  return vars.join('\n');
};

export const applyTheme = (theme: ThemeConfig): void => {
  // Apply CSS variables - these update the :root and [data-theme] selectors
  // Tailwind classes will use these CSS variables via the @theme block
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
  // This will be used with the composable to get reactive color values
  return `var(--color-${colorKey})`;
};
