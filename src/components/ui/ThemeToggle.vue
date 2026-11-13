<template>
  <button
    type="button"
    :aria-label="`Switch to ${nextMode} theme`"
    :title="`Theme: ${mode}`"
    class="text-text-muted hover:bg-muted hover:text-text inline-flex size-10 items-center justify-center rounded-md transition-colors"
    @click="cycle"
  >
    <!-- Sun and moon cross-fade through a blur instead of snapping. -->
    <AppSwap :swap-key="iconName">
      <AppIcon :name="iconName" :size="1.125" />
    </AppSwap>
  </button>
</template>

<script setup lang="ts">
  import { computed } from 'vue';
  import AppIcon from './AppIcon.vue';
  import AppSwap from './AppSwap.vue';
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
        return 'icon-[heroicons--sun]';
      default:
        return 'icon-[heroicons--moon]';
    }
  });

  function cycle() {
    setTheme(nextMode.value);
  }
</script>
