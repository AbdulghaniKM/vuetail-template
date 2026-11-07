import type { AppConfig } from './types';
import { getApiUrl } from './env';
import { appIdentity } from './identity';

export const appConfig: AppConfig = {
  api: {
    baseUrl: getApiUrl(),
    timeout: 15000,
  },

  app: {
    name: appIdentity.name,
    title: appIdentity.title,
    description: appIdentity.description,
    version: '1.0.0',
    author: 'Your Name',
    url: appIdentity.url,
    language: 'en',
  },

  // Colours, radius and fonts come from styles/tokens.css; pick the preset in src/theme.ts.
  theme: {
    defaultTheme: 'system',
  },

  typography: {
    // Extra faces to load at boot, e.g. { name: 'Brand', src: '/fonts/brand.woff2' }.
    fonts: [],
  },

  icons: {
    favicon: '/vite.svg',
    sizes: ['192x192', '512x512'],
  },

  seo: {
    title: appIdentity.title,
    description: appIdentity.description,
    keywords: ['vue', 'vue3', 'typescript', 'tailwind', 'vite'],
    robots: 'index, follow',
    openGraph: {
      siteName: appIdentity.name,
      type: 'website',
      locale: 'en_US',
    },
    twitter: {
      card: 'summary_large_image',
    },
  },

  layout: {
    containerMaxWidth: '1280px',
  },
};
