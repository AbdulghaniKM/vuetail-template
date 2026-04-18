<template>
  <div class="flex flex-col items-center justify-center text-center py-12 px-4">
    <slot name="icon">
      <div
        v-if="icon"
        class="mb-4 flex size-16 items-center justify-center rounded-2xl"
        :class="iconContainerClass"
      >
        <AppIcon :name="icon" :size="2" :class="iconColorClass" />
      </div>
    </slot>

    <h2 v-if="title" class="text-text text-lg font-semibold mb-1">{{ title }}</h2>
    <p v-if="description" class="text-text-secondary text-sm max-w-md mb-6">{{ description }}</p>

    <div v-if="$slots.default" class="flex items-center gap-2">
      <slot />
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue';
import AppIcon from './AppIcon.vue';

interface Props {
  icon?: string;
  title?: string;
  description?: string;
  variant?: 'neutral' | 'primary' | 'danger' | 'warning' | 'success' | 'info';
}

const props = withDefaults(defineProps<Props>(), {
  variant: 'neutral',
});

const iconContainerClass = computed(() => ({
  neutral: 'bg-muted',
  primary: 'bg-primary/10',
  danger: 'bg-error/10',
  warning: 'bg-warning/10',
  success: 'bg-success/10',
  info: 'bg-info/10',
})[props.variant]);

const iconColorClass = computed(() => ({
  neutral: 'text-text-secondary',
  primary: 'text-primary',
  danger: 'text-error',
  warning: 'text-warning',
  success: 'text-success',
  info: 'text-info',
})[props.variant]);
</script>
