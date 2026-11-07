import { ThemePersistence } from '@/lib/ThemePersistence';
import { loadFont } from '../utils/fonts';
import { useSeo } from '../utils/seo';
import { appConfig } from './app.config';
import type { AppConfig } from './types';

export { appConfig };
export type { AppConfig };

export const initializeConfig = (): void => {
  if (typeof document === 'undefined') return;

  ThemePersistence.synchronizeDocumentWithApplicationConfig();

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
    useSeo({
      title: appConfig.app.title,
      description: appConfig.app.description,
      icon: appConfig.icons.favicon,
    });
  }

  // Fonts come from the VueTail tokens (--font-sans, --font-display, --font-mono), per preset.
  // Registering them here would write inline variables on <html> and override every preset.
  appConfig.typography.fonts?.forEach((font) => {
    loadFont(font).catch((error) => console.error(`Failed to load font: ${font.name}`, error));
  });

  if (appConfig.app.language) {
    document.documentElement.lang = appConfig.app.language;
  }
};

export const readStoredTheme = ThemePersistence.readPersistedLightOrDark;
