<template>
  <header class="border-border bg-surface/95 sticky top-0 z-50 border-b backdrop-blur-sm">
    <div class="container mx-auto px-4 py-4">
      <div class="flex flex-row items-center justify-between">
        <div class="flex flex-row items-center gap-3 text-xl">
          <AppIcon name="heroicons-outline:template" :size="2" class="text-primary" />
          <h1 class="text-text font-bold">{{ appName }}</h1>
        </div>
        <div class="flex items-center gap-3">
          <!-- Theme Toggle -->
          <div class="relative">
            <button
              @click="showThemeMenu = !showThemeMenu"
              class="bg-surface border-border text-text hover:bg-surface/80 flex items-center justify-center rounded-lg border p-2 transition-colors"
              aria-label="Toggle theme"
            >
              <AppIcon
                class="text-primary"
                :name="
                  theme === 'light'
                    ? 'icon-[fluent--weather-sunny-low-48-filled]'
                    : theme === 'dark'
                      ? 'icon-[solar--moon-bold]'
                      : 'icon-[si--monitor-duotone]'
                "
                :size="1.5"
              />
            </button>
            <div
              v-if="showThemeMenu"
              ref="themeMenuRef"
              class="bg-surface border-border absolute right-0 mt-2 min-w-[8rem] overflow-hidden rounded-lg border shadow-lg"
            >
              <button
                @click="setTheme('light')"
                class="hover:bg-primary/10 text-text flex w-full items-center gap-2 px-4 py-2 text-left"
                :class="{ 'bg-primary/20': theme === 'light' }"
              >
                <AppIcon name="icon-[fluent--weather-sunny-low-48-filled]" :size="2" />
                Light
              </button>
              <button
                @click="setTheme('dark')"
                class="hover:bg-primary/10 text-text flex w-full items-center gap-2 px-4 py-2 text-left"
                :class="{ 'bg-primary/20': theme === 'dark' }"
              >
                <AppIcon name="icon-[solar--moon-bold]" :size="2" />
                Dark
              </button>
              <button
                @click="setTheme('system')"
                class="hover:bg-primary/10 text-text flex w-full items-center gap-2 px-4 py-2 text-left"
                :class="{ 'bg-primary/20': mode === 'system' }"
              >
                <AppIcon name="icon-[si--monitor-duotone]" :size="2" />
                System
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  </header>
</template>

<script setup lang="ts">
  import { onClickOutside } from '@vueuse/core';
  import { ref } from 'vue';
  import { useAppConfig } from '../composables/useAppConfig';
  import { useTheme } from '../composables/useTheme';
  import AppIcon from './AppIcon.vue';

  const { appName } = useAppConfig();
  const { theme, mode, setTheme } = useTheme();
  const showThemeMenu = ref(false);
  const themeMenuRef = ref<HTMLElement | null>(null);

  onClickOutside(themeMenuRef, () => {
    showThemeMenu.value = false;
  });
</script>
