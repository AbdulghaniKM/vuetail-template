export interface ColorPalette {
  primary: string;
  secondary: string;
  accent: string;
  background: string;
  surface: string;
  text: string;
  textSecondary: string;
  border: string;
  success?: string;
  warning?: string;
  error?: string;
  info?: string;
}

export interface ThemeConfig {
  light: ColorPalette;
  dark: ColorPalette;
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
  fonts?: FontConfig[];
  primary: {
    family: string;
    fallbacks?: string[];
    cssVariable?: string;
  };
  secondary?: {
    family: string;
    fallbacks?: string[];
    cssVariable?: string;
  };
  mono?: {
    family: string;
    fallbacks?: string[];
    cssVariable?: string;
  };
  sizes?: {
    xs?: string;
    sm?: string;
    base?: string;
    lg?: string;
    xl?: string;
    '2xl'?: string;
    '3xl'?: string;
    '4xl'?: string;
  };
  weights?: {
    light?: number;
    normal?: number;
    medium?: number;
    semibold?: number;
    bold?: number;
  };
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
  spacing?: {
    xs?: string;
    sm?: string;
    md?: string;
    lg?: string;
    xl?: string;
    '2xl'?: string;
  };
}

export interface AppConfig {
  app: AppMetadata;
  theme: ThemeConfig;
  typography: TypographyConfig;
  icons: IconConfig;
  seo?: SeoDefaults;
  layout?: LayoutConfig;
}
