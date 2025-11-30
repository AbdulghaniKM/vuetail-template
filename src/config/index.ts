import { appConfig } from './app.config';
import { applyTheme, setTheme, getCurrentTheme } from '../utils/theme';
import { useSeo } from '../utils/seo';
import { registerFontFamily, loadFont } from '../utils/fonts';
import type { AppConfig } from './types';

export { appConfig };
export type { AppConfig };

export const initializeConfig = (): void => {
  // Apply theme
  applyTheme(appConfig.theme);

  // Set initial theme
  const initialTheme = getCurrentTheme(appConfig.theme.defaultTheme);
  setTheme(initialTheme);

  // Apply SEO defaults
  if (appConfig.seo) {
    useSeo({
      title: appConfig.seo.title || appConfig.app.title,
      description: appConfig.seo.description || appConfig.app.description,
      icon: appConfig.icons.favicon,
      canonical: appConfig.app.url,
      keywords: appConfig.seo.keywords?.join(', '),
      robots: appConfig.seo.robots,
      openGraph: {
        title: appConfig.seo.title || appConfig.app.title,
        description: appConfig.seo.description || appConfig.app.description,
        url: appConfig.app.url,
        siteName: appConfig.seo.openGraph?.siteName || appConfig.app.name,
        type: appConfig.seo.openGraph?.type || 'website',
        locale: appConfig.seo.openGraph?.locale || 'en_US',
      },
      twitter: {
        card: appConfig.seo.twitter?.card || 'summary_large_image',
        site: appConfig.seo.twitter?.site,
        creator: appConfig.seo.twitter?.creator,
      },
    });
  } else {
    // Fallback to basic SEO
    useSeo({
      title: appConfig.app.title,
      description: appConfig.app.description,
      icon: appConfig.icons.favicon,
    });
  }

  // Register fonts
  if (appConfig.typography.fonts) {
    appConfig.typography.fonts.forEach((font) => {
      loadFont(font).catch((error) => {
        console.error(`Failed to load font: ${font.name}`, error);
      });
    });
  }

  if (appConfig.typography.primary) {
    registerFontFamily({
      name: appConfig.typography.primary.family,
      fallbacks: appConfig.typography.primary.fallbacks,
      cssVariable: appConfig.typography.primary.cssVariable,
    });
  }

  if (appConfig.typography.secondary) {
    registerFontFamily({
      name: appConfig.typography.secondary.family,
      fallbacks: appConfig.typography.secondary.fallbacks,
      cssVariable: appConfig.typography.secondary.cssVariable,
    });
  }

  if (appConfig.typography.mono) {
    registerFontFamily({
      name: appConfig.typography.mono.family,
      fallbacks: appConfig.typography.mono.fallbacks,
      cssVariable: appConfig.typography.mono.cssVariable,
    });
  }

  // Set document language
  if (appConfig.app.language) {
    document.documentElement.lang = appConfig.app.language;
  }
};
