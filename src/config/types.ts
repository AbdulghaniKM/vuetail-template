/** Light and dark only. Colours, radius and fonts live in styles/tokens.css; the preset in src/theme.ts. */
export interface ThemeConfig {
  defaultTheme?: 'light' | 'dark' | 'system';
}

export interface FontConfig {
  name: string;
  src: string | string[];
  weight?: string | number | (string | number)[];
  style?: 'normal' | 'italic' | 'oblique';
  display?: 'auto' | 'block' | 'swap' | 'fallback' | 'optional';
  preload?: boolean;
}

export interface TypographyConfig {
  /** Extra faces to load at boot. The preset fonts come from the tokens and src/theme.ts. */
  fonts?: FontConfig[];
}

export interface AppMetadata {
  name: string;
  title: string;
  description: string;
  version?: string;
  author?: string;
  url?: string;
  language?: string;
}

export interface IconConfig {
  favicon?: string;
  appleTouchIcon?: string;
  manifestIcon?: string;
  sizes?: string[];
}

export interface SeoDefaults {
  title?: string;
  description?: string;
  keywords?: string[];
  robots?: string;
  openGraph?: {
    siteName?: string;
    type?: string;
    locale?: string;
  };
  twitter?: {
    site?: string;
    creator?: string;
    card?: 'summary' | 'summary_large_image' | 'app' | 'player';
  };
}

export interface LayoutConfig {
  containerMaxWidth?: string;
}

export interface ApiConfig {
  baseUrl: string;
  timeout?: number;
}

export interface AppConfig {
  app: AppMetadata;
  theme: ThemeConfig;
  typography: TypographyConfig;
  icons: IconConfig;
  seo?: SeoDefaults;
  layout?: LayoutConfig;
  api?: ApiConfig;
}
