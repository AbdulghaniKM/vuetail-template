import type { FontConfig } from '../config/types';

const loadedFonts = new Set<string>();

export const loadFont = (config: FontConfig): Promise<void> => {
  return new Promise((resolve, reject) => {
    if (typeof document === 'undefined' || typeof FontFace === 'undefined') {
      resolve();
      return;
    }

    if (loadedFonts.has(config.name)) {
      resolve();
      return;
    }

    const fontFace = new FontFace(
      config.name,
      typeof config.src === 'string'
        ? `url(${config.src})`
        : config.src.map((s) => `url(${s})`).join(', '),
      {
        weight: config.weight?.toString(),
        style: config.style || 'normal',
        display: config.display || 'swap',
      },
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
  if (typeof document === 'undefined') return;
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
