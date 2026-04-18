<template>
  <button
    type="button"
    :aria-label="`Switch to ${nextMode} theme`"
    :title="`Theme: ${mode}`"
    class="inline-flex items-center justify-center size-10 rounded-lg text-text-secondary hover:bg-muted hover:text-text transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/40"
    @click="cycle"
  >
    <AppIcon :name="iconName" :size="1.125" />
  </button>
</template>

<script setup lang="ts">
import { computed } from 'vue';
import AppIcon from './AppIcon.vue';
import { useTheme } from '@/composables/useTheme';

type ThemeMode = 'light' | 'dark' | 'system';

const { mode, setTheme } = useTheme();

// Cycle: system → light → dark → system
const order: ThemeMode[] = ['system', 'light', 'dark'];

const nextMode = computed<ThemeMode>(() => {
  const idx = order.indexOf(mode.value as ThemeMode);
  return order[(idx + 1) % order.length];
});

const iconName = computed(() => {
  switch (mode.value) {
    case 'light': return 'icon-[solar--sun-linear]';
    case 'dark': return 'icon-[solar--moon-linear]';
    default: return 'icon-[solar--monitor-linear]';
  }
});

function cycle() {
  setTheme(nextMode.value);
}
</script>
