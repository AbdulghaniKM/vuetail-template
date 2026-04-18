<template>
  <span
    :class="['inline-flex shrink-0 items-center justify-center leading-none', iconClass, sizeClass, colorClass]"
    :style="customStyle"
    v-bind="$attrs"
  />
</template>

<script setup lang="ts">
  import { computed } from 'vue';

  interface Props {
    /** Iconify name. Pass `collection:name` (converted to the Iconify-Tailwind class form for you). */
    name?: string;
    size?: 'xs' | 'sm' | 'md' | 'lg' | 'xl' | number | string;
    color?: string;
    style?: Record<string, string>;
  }

  const props = withDefaults(defineProps<Props>(), {
    size: 'md',
  });

  // Vue auto-merges incoming `class` bindings — do NOT declare `class` as a prop.

  const iconClass = computed(() => {
    if (!props.name) return '';
    const name = props.name.trim();
    if (name.startsWith('icon-[')) return name;
    // Convert `collection:name` → `collection--name` (Iconify-Tailwind form).
    return `icon-[${name.replace(/:/g, '--')}]`;
  });

  const sizeClass = computed(() => {
    if (typeof props.size === 'number') return '';
    if (typeof props.size === 'string' && /^\d/.test(props.size)) return '';
    const sizeMap: Record<string, string> = {
      xs: 'text-xs',
      sm: 'text-sm',
      md: 'text-base',
      lg: 'text-lg',
      xl: 'text-xl',
    };
    return sizeMap[props.size] || sizeMap.md;
  });

  const customStyle = computed(() => {
    const style: Record<string, string> = { ...props.style };
    if (typeof props.size === 'number') {
      style.fontSize = `${props.size}rem`;
    } else if (typeof props.size === 'string' && /^\d/.test(props.size)) {
      const hasUnit = props.size.match(/[a-z%]+$/i);
      style.fontSize = hasUnit ? props.size : `${props.size}rem`;
    }
    if (props.color && !props.color.startsWith('text-')) {
      style.color = props.color;
    }
    return Object.keys(style).length > 0 ? style : undefined;
  });

  const colorClass = computed(() => {
    if (props.color && props.color.startsWith('text-')) return props.color;
    return '';
  });
</script>
