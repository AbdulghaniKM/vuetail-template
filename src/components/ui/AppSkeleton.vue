<template>
  <!-- Multi-line text skeleton -->
  <div v-if="variant === 'text' && lines > 1" class="flex flex-col gap-2" :class="containerClass">
    <span
      v-for="n in lines"
      :key="n"
      class="app-skeleton block h-3 rounded bg-muted"
      :class="n === lines ? 'w-2/3' : 'w-full'"
    />
  </div>

  <!-- Single line / circle / rect -->
  <span
    v-else
    class="app-skeleton block bg-muted"
    :class="[shapeClass, containerClass]"
    :style="sizeStyle"
  />
</template>

<script setup lang="ts">
import { computed } from 'vue';

interface Props {
  variant?: 'text' | 'circle' | 'rect';
  lines?: number;
  width?: string | number;
  height?: string | number;
  containerClass?: string;
}

const props = withDefaults(defineProps<Props>(), {
  variant: 'text',
  lines: 1,
  containerClass: '',
});

const shapeClass = computed(() => {
  if (props.variant === 'circle') return 'rounded-full';
  if (props.variant === 'rect') return 'rounded-lg';
  return 'h-3 rounded';
});

const toSize = (v: string | number | undefined) => {
  if (v == null) return undefined;
  return typeof v === 'number' ? `${v}rem` : v;
};

const sizeStyle = computed(() => {
  const style: Record<string, string> = {};
  const w = toSize(props.width);
  const h = toSize(props.height);
  if (w) style.width = w;
  if (h) style.height = h;
  return Object.keys(style).length > 0 ? style : undefined;
});
</script>

<style scoped>
.app-skeleton {
  animation: skeleton-pulse 1.5s ease-in-out infinite;
}

@keyframes skeleton-pulse {
  0%, 100% { opacity: 1; }
  50% { opacity: 0.5; }
}

@media (prefers-reduced-motion: reduce) {
  .app-skeleton {
    animation: none;
    opacity: 0.7;
  }
}
</style>
