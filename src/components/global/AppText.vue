<template>
  <component
    :is="componentTag"
    :class="computedClasses"
    :style="computedStyles"
    :aria-label="ariaLabel"
    v-bind="$attrs"
  >
    <slot />
  </component>
</template>

<script setup lang="ts">
import { computed } from 'vue';

type Variant = 'h1' | 'h2' | 'h3' | 'h4' | 'h5' | 'h6' | 'p' | 'span' | 'label' | 'caption' | 'overline';
type Size = 'xs' | 'sm' | 'base' | 'lg' | 'xl' | '2xl' | '3xl' | '4xl';
type Weight = 'light' | 'normal' | 'medium' | 'semibold' | 'bold';
type Color = 'primary' | 'secondary' | 'accent' | 'text' | 'text-secondary' | 'success' | 'warning' | 'error' | 'info';
type Align = 'left' | 'center' | 'right' | 'justify';
type Transform = 'uppercase' | 'lowercase' | 'capitalize' | 'normal-case';
type Decoration = 'underline' | 'line-through' | 'no-underline';
type DecorationStyle = 'solid' | 'double' | 'dotted' | 'dashed' | 'wavy';
type Font = 'primary' | 'secondary' | 'mono';
type Tracking = 'tighter' | 'tight' | 'normal' | 'wide' | 'wider' | 'widest';
type Leading = 'none' | 'tight' | 'snug' | 'normal' | 'relaxed' | 'loose';
type Wrap = 'wrap' | 'nowrap' | 'balance' | 'pretty';
type Whitespace = 'normal' | 'nowrap' | 'pre' | 'pre-line' | 'pre-wrap' | 'break-spaces';
type MaxWidth = 'xs' | 'sm' | 'md' | 'lg' | 'xl' | '2xl' | 'full';

interface Props {
  // Core
  variant?: Variant;
  as?: string;
  size?: Size | string;
  weight?: Weight | number;
  color?: Color | string;

  // Typography
  align?: Align;
  transform?: Transform;
  decoration?: Decoration;
  decorationStyle?: DecorationStyle;
  font?: Font;
  tracking?: Tracking;
  leading?: Leading | string;

  // Truncation
  truncate?: boolean;
  lineClamp?: number;

  // Layout
  wrap?: Wrap;
  whitespace?: Whitespace;
  maxWidth?: MaxWidth | string;

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

const props = withDefaults(defineProps<Props>(), {
  variant: 'span',
});

// Variant configuration mapping
const variantMap: Record<Variant, { tag: string; size: Size; weight: Weight; leading: Leading; transform?: Transform; tracking?: Tracking }> = {
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

// Component tag
const componentTag = computed(() => {
  return props.as || variantMap[props.variant].tag;
});

// Size classes
const sizeClass = computed(() => {
  const variantDefaults = variantMap[props.variant];
  const effectiveSize = props.size || variantDefaults.size;

  // If it's a custom size (not in predefined list), handle via style
  if (!['xs', 'sm', 'base', 'lg', 'xl', '2xl', '3xl', '4xl'].includes(effectiveSize)) {
    return '';
  }

  const sizeMap: Record<string, string> = {
    xs: 'text-xs',
    sm: 'text-sm',
    base: 'text-base',
    lg: 'text-lg',
    xl: 'text-xl',
    '2xl': 'text-2xl',
    '3xl': 'text-3xl',
    '4xl': 'text-4xl',
  };

  return sizeMap[effectiveSize] || '';
});

// Weight classes
const weightClass = computed(() => {
  const variantDefaults = variantMap[props.variant];
  const effectiveWeight = props.weight || variantDefaults.weight;

  if (typeof effectiveWeight === 'number') {
    return '';
  }

  const weightMap: Record<string, string> = {
    light: 'font-light',
    normal: 'font-normal',
    medium: 'font-medium',
    semibold: 'font-semibold',
    bold: 'font-bold',
  };

  return weightMap[effectiveWeight] || '';
});

// Color classes
const colorClass = computed(() => {
  if (!props.color) return '';

  const colorMap: Record<string, string> = {
    primary: 'text-primary',
    secondary: 'text-secondary',
    accent: 'text-accent',
    text: 'text-text',
    'text-secondary': 'text-text-secondary',
    success: 'text-success',
    warning: 'text-warning',
    error: 'text-error',
    info: 'text-info',
  };

  return colorMap[props.color] || '';
});

// Alignment classes
const alignClass = computed(() => {
  if (!props.align) return '';

  const alignMap: Record<string, string> = {
    left: 'text-left',
    center: 'text-center',
    right: 'text-right',
    justify: 'text-justify',
  };

  return alignMap[props.align] || '';
});

// Transform classes
const transformClass = computed(() => {
  const variantDefaults = variantMap[props.variant];
  const effectiveTransform = props.transform || variantDefaults.transform;

  if (!effectiveTransform) return '';

  const transformMap: Record<string, string> = {
    uppercase: 'uppercase',
    lowercase: 'lowercase',
    capitalize: 'capitalize',
    'normal-case': 'normal-case',
  };

  return transformMap[effectiveTransform] || '';
});

// Decoration classes
const decorationClass = computed(() => {
  if (!props.decoration) return '';

  const decorationMap: Record<string, string> = {
    underline: 'underline',
    'line-through': 'line-through',
    'no-underline': 'no-underline',
  };

  let classes = decorationMap[props.decoration] || '';

  if (props.decorationStyle && props.decoration !== 'no-underline') {
    const styleMap: Record<string, string> = {
      solid: 'decoration-solid',
      double: 'decoration-double',
      dotted: 'decoration-dotted',
      dashed: 'decoration-dashed',
      wavy: 'decoration-wavy',
    };
    classes += ` ${styleMap[props.decorationStyle] || ''}`;
  }

  return classes.trim();
});

// Font family classes
const fontClass = computed(() => {
  if (!props.font) return '';

  const fontMap: Record<string, string> = {
    primary: 'font-[var(--font-primary)]',
    secondary: 'font-[var(--font-secondary)]',
    mono: 'font-[var(--font-mono)]',
  };

  return fontMap[props.font] || '';
});

// Tracking classes
const trackingClass = computed(() => {
  const variantDefaults = variantMap[props.variant];
  const effectiveTracking = props.tracking || variantDefaults.tracking;

  if (!effectiveTracking) return '';

  const trackingMap: Record<string, string> = {
    tighter: 'tracking-tighter',
    tight: 'tracking-tight',
    normal: 'tracking-normal',
    wide: 'tracking-wide',
    wider: 'tracking-wider',
    widest: 'tracking-widest',
  };

  return trackingMap[effectiveTracking] || '';
});

// Leading classes
const leadingClass = computed(() => {
  const variantDefaults = variantMap[props.variant];
  const effectiveLeading = props.leading || variantDefaults.leading;

  if (!effectiveLeading) return '';

  // If it's a custom value (not in predefined list), handle via style
  if (!['none', 'tight', 'snug', 'normal', 'relaxed', 'loose'].includes(effectiveLeading)) {
    return '';
  }

  const leadingMap: Record<string, string> = {
    none: 'leading-none',
    tight: 'leading-tight',
    snug: 'leading-snug',
    normal: 'leading-normal',
    relaxed: 'leading-relaxed',
    loose: 'leading-loose',
  };

  return leadingMap[effectiveLeading] || '';
});

// Truncation classes
const truncationClass = computed(() => {
  if (props.truncate) {
    return 'truncate';
  }

  if (props.lineClamp && props.lineClamp >= 1 && props.lineClamp <= 6) {
    return `line-clamp-${props.lineClamp}`;
  }

  return '';
});

// Wrap classes
const wrapClass = computed(() => {
  if (!props.wrap) return '';

  const wrapMap: Record<string, string> = {
    wrap: 'text-wrap',
    nowrap: 'text-nowrap',
    balance: 'text-balance',
    pretty: 'text-pretty',
  };

  return wrapMap[props.wrap] || '';
});

// Whitespace classes
const whitespaceClass = computed(() => {
  if (!props.whitespace) return '';

  const whitespaceMap: Record<string, string> = {
    normal: 'whitespace-normal',
    nowrap: 'whitespace-nowrap',
    pre: 'whitespace-pre',
    'pre-line': 'whitespace-pre-line',
    'pre-wrap': 'whitespace-pre-wrap',
    'break-spaces': 'whitespace-break-spaces',
  };

  return whitespaceMap[props.whitespace] || '';
});

// Max width classes
const maxWidthClass = computed(() => {
  if (!props.maxWidth) return '';

  // If it's a custom value, handle via style
  if (!['xs', 'sm', 'md', 'lg', 'xl', '2xl', 'full'].includes(props.maxWidth)) {
    return '';
  }

  const maxWidthMap: Record<string, string> = {
    xs: 'max-w-xs',
    sm: 'max-w-sm',
    md: 'max-w-md',
    lg: 'max-w-lg',
    xl: 'max-w-xl',
    '2xl': 'max-w-2xl',
    full: 'max-w-full',
  };

  return maxWidthMap[props.maxWidth] || '';
});

// Gradient classes
const gradientClass = computed(() => {
  if (!props.gradient) return '';

  return 'bg-gradient-to-r bg-clip-text text-transparent';
});

// Responsive size classes
const responsiveSizeClass = computed(() => {
  if (!props.responsiveSize) return '';

  const classes: string[] = [];
  const breakpoints = ['sm', 'md', 'lg', 'xl', '2xl'];

  for (const [breakpoint, size] of Object.entries(props.responsiveSize)) {
    if (breakpoints.includes(breakpoint)) {
      const sizeMap: Record<string, string> = {
        xs: 'text-xs',
        sm: 'text-sm',
        base: 'text-base',
        lg: 'text-lg',
        xl: 'text-xl',
        '2xl': 'text-2xl',
        '3xl': 'text-3xl',
        '4xl': 'text-4xl',
      };

      if (sizeMap[size]) {
        classes.push(`${breakpoint}:${sizeMap[size]}`);
      }
    }
  }

  return classes.join(' ');
});

// Screen reader only classes
const screenReaderClass = computed(() => {
  return props.screenReaderOnly ? 'sr-only' : '';
});

// Computed classes
const computedClasses = computed(() => {
  const classes = [
    sizeClass.value,
    weightClass.value,
    colorClass.value,
    alignClass.value,
    transformClass.value,
    decorationClass.value,
    fontClass.value,
    trackingClass.value,
    leadingClass.value,
    truncationClass.value,
    wrapClass.value,
    whitespaceClass.value,
    maxWidthClass.value,
    gradientClass.value,
    responsiveSizeClass.value,
    screenReaderClass.value,
    props.class,
  ].filter(Boolean);

  return classes.join(' ');
});

// Computed styles
const computedStyles = computed(() => {
  const styles: Record<string, string> = { ...props.style };

  // Custom size handling
  const variantDefaults = variantMap[props.variant];
  const effectiveSize = props.size || variantDefaults.size;
  if (effectiveSize && !['xs', 'sm', 'base', 'lg', 'xl', '2xl', '3xl', '4xl'].includes(effectiveSize)) {
    const hasUnit = /[a-z%]+$/i.test(effectiveSize);
    styles.fontSize = hasUnit ? effectiveSize : `${effectiveSize}rem`;
  }

  // Custom weight handling
  if (typeof props.weight === 'number') {
    styles.fontWeight = props.weight.toString();
  }

  // Custom color handling (non-theme colors)
  if (props.color && !['primary', 'secondary', 'accent', 'text', 'text-secondary', 'success', 'warning', 'error', 'info'].includes(props.color)) {
    styles.color = props.color;
  }

  // Custom leading handling
  const effectiveLeading = props.leading || variantDefaults.leading;
  if (effectiveLeading && !['none', 'tight', 'snug', 'normal', 'relaxed', 'loose'].includes(effectiveLeading)) {
    const hasUnit = /[a-z%]+$/i.test(effectiveLeading);
    styles.lineHeight = hasUnit ? effectiveLeading : `${effectiveLeading}rem`;
  }

  // Custom max width handling
  if (props.maxWidth && !['xs', 'sm', 'md', 'lg', 'xl', '2xl', 'full'].includes(props.maxWidth)) {
    const hasUnit = /[a-z%]+$/i.test(props.maxWidth);
    styles.maxWidth = hasUnit ? props.maxWidth : `${props.maxWidth}rem`;
  }

  // Gradient colors
  if (props.gradient) {
    const gradientParts: string[] = [];

    if (props.gradientFrom) {
      const fromColor = getGradientColor(props.gradientFrom);
      gradientParts.push(fromColor);
    }

    if (props.gradientVia) {
      const viaColor = getGradientColor(props.gradientVia);
      gradientParts.push(viaColor);
    }

    if (props.gradientTo) {
      const toColor = getGradientColor(props.gradientTo);
      gradientParts.push(toColor);
    }

    if (gradientParts.length > 0) {
      styles.backgroundImage = `linear-gradient(to right, ${gradientParts.join(', ')})`;
    }
  }

  return Object.keys(styles).length > 0 ? styles : undefined;
});

// Helper function to get gradient colors
const getGradientColor = (color: string): string => {
  const colorMap: Record<string, string> = {
    primary: 'var(--color-primary)',
    secondary: 'var(--color-secondary)',
    accent: 'var(--color-accent)',
    success: 'var(--color-success)',
    warning: 'var(--color-warning)',
    error: 'var(--color-error)',
    info: 'var(--color-info)',
  };

  return colorMap[color] || color;
};
</script>
