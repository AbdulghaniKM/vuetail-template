<template>
  <button
    type="button"
    :aria-label="`Switch to ${nextMode} theme`"
    :title="`Theme: ${mode}`"
    class="text-text-secondary hover:bg-muted hover:text-text focus-visible:ring-primary/40 inline-flex size-10 items-center justify-center rounded-lg transition-colors focus-visible:ring-2 focus-visible:outline-none"
    @click="cycle"
  >
    <UiAppIcon :name="iconName" :size="1.125" />
  </button>
</template>

<script setup lang="ts">
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
