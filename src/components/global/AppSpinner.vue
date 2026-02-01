<template>
  <div
    class="inline-block animate-spin rounded-full border-2 border-current border-t-transparent"
    :class="sizeClass"
    :style="customStyle"
    role="status"
    aria-label="Loading"
  >
    <span class="sr-only">Loading...</span>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue';

interface Props {
  size?: 'xs' | 'sm' | 'md' | 'lg' | 'xl' | number | string;
  color?: string;
  class?: string;
}

const props = withDefaults(defineProps<Props>(), {
  size: 'md',
  color: 'currentColor',
});

const sizeClass = computed(() => {
  if (typeof props.size === 'number') {
    return '';
  }
  if (typeof props.size === 'string' && /^\d/.test(props.size)) {
    return '';
  }
  const sizeMap: Record<string, string> = {
    xs: 'w-3 h-3',
    sm: 'w-4 h-4',
    md: 'w-6 h-6',
    lg: 'w-8 h-8',
    xl: 'w-12 h-12',
  };
  return sizeMap[props.size] || sizeMap.md;
});

const customStyle = computed(() => {
  const style: Record<string, string> = {};

  if (typeof props.size === 'number') {
    style.width = `${props.size}rem`;
    style.height = `${props.size}rem`;
  } else if (typeof props.size === 'string' && /^\d/.test(props.size)) {
    const size = props.size.includes('rem') || props.size.includes('px') || props.size.includes('%')
      ? props.size
      : `${props.size}rem`;
    style.width = size;
    style.height = size;
  }

  if (props.color && !props.color.startsWith('text-')) {
    style.borderColor = props.color;
  }

  return Object.keys(style).length > 0 ? style : undefined;
});
</script>
