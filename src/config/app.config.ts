import type { AppConfig } from './types';

export const appConfig: AppConfig = {
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
      primary: '#3b82f6', // blue-500
      secondary: '#8b5cf6', // violet-500
      accent: '#f59e0b', // amber-500
      background: '#ffffff',
      surface: '#f9fafb', // gray-50
      text: '#111827', // gray-900
      textSecondary: '#6b7280', // gray-500
      border: '#e5e7eb', // gray-200
      success: '#10b981', // emerald-500
      warning: '#f59e0b', // amber-500
      error: '#ef4444', // red-500
      info: '#3b82f6', // blue-500
    },
    dark: {
      primary: '#60a5fa', // blue-400
      secondary: '#a78bfa', // violet-400
      accent: '#fbbf24', // amber-400
      background: '#111827', // gray-900
      surface: '#1f2937', // gray-800
      text: '#f9fafb', // gray-50
      textSecondary: '#9ca3af', // gray-400
      border: '#374151', // gray-700
      success: '#34d399', // emerald-400
      warning: '#fbbf24', // amber-400
      error: '#f87171', // red-400
      info: '#60a5fa', // blue-400
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
    sizes: {
      xs: '0.75rem',
      sm: '0.875rem',
      base: '1rem',
      lg: '1.125rem',
      xl: '1.25rem',
      '2xl': '1.5rem',
      '3xl': '1.875rem',
      '4xl': '2.25rem',
    },
    weights: {
      light: 300,
      normal: 400,
      medium: 500,
      semibold: 600,
      bold: 700,
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
    spacing: {
      xs: '0.5rem',
      sm: '1rem',
      md: '1.5rem',
      lg: '2rem',
      xl: '3rem',
      '2xl': '4rem',
    },
  },
};
