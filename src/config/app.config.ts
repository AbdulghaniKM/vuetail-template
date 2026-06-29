import type { AppConfig } from './types';
import { getApiUrl } from './env';

export const appConfig: AppConfig = {
  api: {
    baseUrl: getApiUrl(),
    timeout: 15000,
  },

  app: {
    name: 'Vue Template',
    title: 'Vue Template - Modern Vue 3 Application',
    description: 'A modern Vue 3 application built with TypeScript, Tailwind CSS, and Vite',
    version: '1.0.0',
    author: 'Your Name',
    url: 'https://example.com',
    language: 'en',
  },

  theme: {
    defaultTheme: 'system',
    light: {
      primary: '#3b82f6',
      secondary: '#8b5cf6',
      accent: '#f59e0b',
      background: '#ffffff',
      surface: '#f9fafb',
      text: '#111827',
      textSecondary: '#6b7280',
      border: '#e5e7eb',
      muted: '#f3f4f6',
      link: '#3b82f6',
      linkHover: '#2563eb',
      emphasis: '#1e40af',
      success: '#10b981',
      warning: '#f59e0b',
      error: '#ef4444',
      info: '#3b82f6',
    },
    dark: {
      primary: '#60a5fa',
      secondary: '#a78bfa',
      accent: '#fbbf24',
      background: '#111827',
      surface: '#1f2937',
      text: '#f9fafb',
      textSecondary: '#9ca3af',
      border: '#374151',
      muted: '#1f2937',
      link: '#60a5fa',
      linkHover: '#93bbfd',
      emphasis: '#60a5fa',
      success: '#34d399',
      warning: '#fbbf24',
      error: '#f87171',
      info: '#60a5fa',
    },
  },

  typography: {
    fonts: [
      {
        name: 'IBM Plex Sans',
        src: '/font/IBMPlexSansArabic-Regular.ttf',
        weight: 400,
        style: 'normal',
        display: 'swap',
        preload: true,
      },
    ],
    primary: {
      family: 'IBM Plex Sans',
      fallbacks: [
        'system-ui',
        '-apple-system',
        'BlinkMacSystemFont',
        'Segoe UI',
        'Roboto',
        'sans-serif',
      ],
      cssVariable: 'font-primary',
    },
    secondary: {
      family: 'Georgia',
      fallbacks: ['Times New Roman', 'serif'],
      cssVariable: 'font-secondary',
    },
    mono: {
      family: 'Fira Code',
      fallbacks: ['Courier New', 'Courier', 'monospace'],
      cssVariable: 'font-mono',
    },
  },

  icons: {
    favicon: '/vite.svg',
    sizes: ['192x192', '512x512'],
  },

  seo: {
    title: 'Vue Template - Modern Vue 3 Application',
    description: 'A modern Vue 3 application built with TypeScript, Tailwind CSS, and Vite',
    keywords: ['vue', 'vue3', 'typescript', 'tailwind', 'vite'],
    robots: 'index, follow',
    openGraph: {
      siteName: 'Vue Template',
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
