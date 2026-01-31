export type TextVariant = 'h1' | 'h2' | 'h3' | 'h4' | 'h5' | 'h6' | 'p' | 'span' | 'label' | 'caption' | 'overline';
export type TextSize = 'xs' | 'sm' | 'base' | 'lg' | 'xl' | '2xl' | '3xl' | '4xl';
export type TextWeight = 'light' | 'normal' | 'medium' | 'semibold' | 'bold';
export type TextColor = 'primary' | 'secondary' | 'accent' | 'text' | 'text-secondary' | 'success' | 'warning' | 'error' | 'info';
export type TextAlign = 'left' | 'center' | 'right' | 'justify';
export type TextTransform = 'uppercase' | 'lowercase' | 'capitalize' | 'normal-case';
export type TextDecoration = 'underline' | 'line-through' | 'no-underline';
export type TextDecorationStyle = 'solid' | 'double' | 'dotted' | 'dashed' | 'wavy';
export type TextFont = 'primary' | 'secondary' | 'mono';
export type TextTracking = 'tighter' | 'tight' | 'normal' | 'wide' | 'wider' | 'widest';
export type TextLeading = 'none' | 'tight' | 'snug' | 'normal' | 'relaxed' | 'loose';
export type TextWrap = 'wrap' | 'nowrap' | 'balance' | 'pretty';
export type TextWhitespace = 'normal' | 'nowrap' | 'pre' | 'pre-line' | 'pre-wrap' | 'break-spaces';
export type TextMaxWidth = 'xs' | 'sm' | 'md' | 'lg' | 'xl' | '2xl' | 'full';

export interface AppTextProps {
  // Core
  variant?: TextVariant;
  as?: string;
  size?: TextSize | string;
  weight?: TextWeight | number;
  color?: TextColor | string;

  // Typography
  align?: TextAlign;
  transform?: TextTransform;
  decoration?: TextDecoration;
  decorationStyle?: TextDecorationStyle;
  font?: TextFont;
  tracking?: TextTracking;
  leading?: TextLeading | string;

  // Truncation
  truncate?: boolean;
  lineClamp?: number;

  // Layout
  wrap?: TextWrap;
  whitespace?: TextWhitespace;
  maxWidth?: TextMaxWidth | string;

  // Advanced
  gradient?: boolean;
  gradientFrom?: string;
  gradientTo?: string;
  gradientVia?: string;
  responsiveSize?: Record<string, string>;

  // Accessibility
  ariaLabel?: string;
  screenReaderOnly?: boolean;

  // Styling
  class?: string;
  style?: Record<string, string>;
}

export interface VariantConfig {
  tag: string;
  size: TextSize;
  weight: TextWeight;
  leading: TextLeading;
  transform?: TextTransform;
  tracking?: TextTracking;
}

export const VARIANT_MAP: Record<TextVariant, VariantConfig> = {
  h1: { tag: 'h1', size: '4xl', weight: 'bold', leading: 'tight' },
  h2: { tag: 'h2', size: '3xl', weight: 'bold', leading: 'tight' },
  h3: { tag: 'h3', size: '2xl', weight: 'semibold', leading: 'snug' },
  h4: { tag: 'h4', size: 'xl', weight: 'semibold', leading: 'snug' },
  h5: { tag: 'h5', size: 'lg', weight: 'medium', leading: 'normal' },
  h6: { tag: 'h6', size: 'base', weight: 'medium', leading: 'normal' },
  p: { tag: 'p', size: 'base', weight: 'normal', leading: 'relaxed' },
  span: { tag: 'span', size: 'base', weight: 'normal', leading: 'normal' },
  label: { tag: 'label', size: 'sm', weight: 'medium', leading: 'normal' },
  caption: { tag: 'span', size: 'xs', weight: 'normal', leading: 'tight' },
  overline: { tag: 'span', size: 'xs', weight: 'semibold', leading: 'tight', transform: 'uppercase', tracking: 'wider' },
};
