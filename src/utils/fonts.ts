import type { FontConfig } from '../config/types';

export interface FontFamilyConfig {
  name: string;
  fallbacks?: string[];
  cssVariable?: string;
}

const loadedFonts = new Set<string>();

export const loadFont = (config: FontConfig): Promise<void> => {
  return new Promise((resolve, reject) => {
    if (loadedFonts.has(config.name)) {
      resolve();
      return;
    }

    const fontFace = new FontFace(
      config.name,
      typeof config.src === 'string' ? `url(${config.src})` : config.src.map((s) => `url(${s})`).join(', '),
      {
        weight: config.weight?.toString(),
        style: config.style || 'normal',
        display: config.display || 'swap',
      }
    );

    fontFace
      .load()
      .then(() => {
        document.fonts.add(fontFace);
        loadedFonts.add(config.name);
        resolve();
      })
      .catch(reject);
  });
};

export const preloadFont = (src: string, as: string = 'font', type?: string): void => {
  const link = document.createElement('link');
  link.rel = 'preload';
  link.href = src;
  link.as = as;
  if (type) {
    link.type = type;
  }
  link.crossOrigin = 'anonymous';
  document.head.appendChild(link);
};

export const registerFontFamily = (config: FontFamilyConfig): void => {
  const fallbacks = config.fallbacks ? `, ${config.fallbacks.join(', ')}` : '';
  const fontFamily = `'${config.name}'${fallbacks}`;

  if (config.cssVariable) {
    // If the variable name already starts with font-, don't double prefix it
    const varName = config.cssVariable.startsWith('font-')
      ? `--${config.cssVariable}`
      : `--font-${config.cssVariable}`;
    document.documentElement.style.setProperty(varName, fontFamily);
  }

  // Also add to a global font registry for Tailwind
  const style = document.createElement('style');
  style.textContent = `
    :root {
      --font-${config.name.toLowerCase().replace(/\s+/g, '-')}: ${fontFamily};
    }
  `;
  document.head.appendChild(style);
};

export const applyFontFamily = (element: HTMLElement, fontName: string): void => {
  element.style.fontFamily = `'${fontName}', sans-serif`;
};

export const getFontVariable = (fontName: string): string => {
  return `var(--font-${fontName.toLowerCase().replace(/\s+/g, '-')})`;
};
