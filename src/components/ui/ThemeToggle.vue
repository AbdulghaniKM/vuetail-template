<template>
  <button
    type="button"
    :aria-label="`Switch to ${nextMode} theme`"
    :title="`Theme: ${mode}`"
    class="inline-flex size-10 items-center justify-center rounded-lg text-text-muted transition-colors hover:bg-muted hover:text-text focus-visible:ring-2 focus-visible:ring-ring focus-visible:outline-none"
    @click="cycle"
  >
    <AppIcon :name="iconName" :size="1.125" />
  </button>
</template>

<script setup lang="ts">
  import { computed } from 'vue';
  import AppIcon from './AppIcon.vue';
  import { useTheme } from '@/composables/useTheme';

  type ThemeMode = 'light' | 'dark';

  const { mode, setTheme } = useTheme();
  const order: ThemeMode[] = ['light', 'dark'];

  const nextMode = computed<ThemeMode>(() => {
    const idx = order.indexOf(mode.value as ThemeMode);
    return order[(idx + 1) % order.length];
  });

  const iconName = computed(() => {
    switch (mode.value) {
      case 'light':
        return 'icon-[solar--sun-linear]';
      default:
        return 'icon-[solar--moon-linear]';
    }
  });

  function cycle() {
    setTheme(nextMode.value);
  }
</script>
