<template>
  <span
    :class="[iconClass, sizeClass, colorClass, customClass]"
    :style="customStyle"
    v-bind="$attrs"
  />
</template>

<script setup lang="ts">
  import { computed } from 'vue';

  interface Props {
    name?: string;
    icon?: string;
    size?: 'xs' | 'sm' | 'md' | 'lg' | 'xl' | number | string;
    color?: string;
    class?: string;
    style?: Record<string, string>;
  }

  const props = withDefaults(defineProps<Props>(), {
    size: 'md',
  });

  const iconClass = computed(() => {
    // If name is provided, ensure it follows the Iconify format: icon-[collection--icon-name]
    if (props.name) {
      const name = props.name.trim();

      // If it's already in icon-[...] format, return as is
      if (name.startsWith('icon-[')) {
        return name;
      }

      // Convert colon separator to double dash
      // Example: "icon-park-solid:family" -> "icon-park-solid--family"
      const iconName = name.replace(/:/g, '--');

      return `icon-[${iconName}]`;
    }

    // If icon is provided, use it directly (raw class mode)
    if (props.icon) {
      return props.icon;
    }

    return '';
  });

  const sizeClass = computed(() => {
    if (typeof props.size === 'number') {
      return '';
    }
    if (typeof props.size === 'string' && /^\d/.test(props.size)) {
      return '';
    }
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

    // Handle numeric sizes as rem (e.g. size={2} -> 2rem)
    if (typeof props.size === 'number') {
      style.fontSize = `${props.size}rem`;
    }
    // Handle string sizes (e.g. "20px", "2rem", "2")
    else if (typeof props.size === 'string' && /^\d/.test(props.size)) {
      const hasUnit = props.size.match(/[a-z%]+$/i);
      style.fontSize = hasUnit ? props.size : `${props.size}rem`;
    }

    if (props.color) {
      style.color = props.color;
    }

    return Object.keys(style).length > 0 ? style : undefined;
  });

  const colorClass = computed(() => {
    // If color is a Tailwind class (starts with text-), use it as a class
    if (props.color && props.color.startsWith('text-')) {
      return props.color;
    }
    return '';
  });

  const customClass = computed(() => {
    return props.class || '';
  });
</script>
