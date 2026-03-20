<template>
  <header class="border-border bg-surface/80 sticky top-0 z-50 border-b backdrop-blur-md">
    <div class="container mx-auto px-4">
      <div class="flex h-16 items-center justify-between">
        <!-- Logo -->
        <a href="/" class="flex items-center gap-2.5">
          <div class="bg-primary/10 flex size-8 items-center justify-center rounded-lg">
            <AppIcon name="heroicons-outline:template" :size="1.25" class="text-primary" />
          </div>
          <span class="text-text text-lg font-bold tracking-tight">{{ appName }}</span>
        </a>

        <!-- Desktop Nav -->
        <nav class="hidden items-center gap-1 md:flex">
          <a
            v-for="link in navLinks"
            :key="link.href"
            :href="link.href"
            class="text-text-secondary hover:text-text hover:bg-muted rounded-lg px-3 py-2 text-sm font-medium transition-colors"
            @click.prevent="scrollTo(link.href)"
          >
            {{ link.label }}
          </a>
        </nav>

        <!-- Right Actions -->
        <div class="flex items-center gap-2">
          <!-- GitHub Link -->
          <a
            href="https://github.com"
            target="_blank"
            rel="noopener noreferrer"
            class="text-text-secondary hover:text-text hover:bg-muted flex size-9 items-center justify-center rounded-lg transition-colors"
            aria-label="GitHub"
          >
            <AppIcon name="icon-[mdi--github]" :size="1.25" />
          </a>

          <!-- Theme Toggle -->
          <div class="relative">
            <button
              @click="showThemeMenu = !showThemeMenu"
              class="text-text-secondary hover:text-text hover:bg-muted flex size-9 items-center justify-center rounded-lg transition-colors"
              aria-label="Toggle theme"
            >
              <AppIcon
                :name="themeIcon"
                :size="1.25"
              />
            </button>
            <Transition
              enter-active-class="transition duration-150 ease-out"
              enter-from-class="opacity-0 scale-95 -translate-y-1"
              enter-to-class="opacity-100 scale-100 translate-y-0"
              leave-active-class="transition duration-100 ease-in"
              leave-from-class="opacity-100 scale-100 translate-y-0"
              leave-to-class="opacity-0 scale-95 -translate-y-1"
            >
              <div
                v-if="showThemeMenu"
                ref="themeMenuRef"
                class="bg-surface border-border absolute right-0 mt-2 min-w-[9rem] overflow-hidden rounded-xl border p-1 shadow-lg"
              >
                <button
                  v-for="opt in themeOptions"
                  :key="opt.value"
                  @click="selectTheme(opt.value)"
                  class="hover:bg-muted text-text flex w-full items-center gap-2.5 rounded-lg px-3 py-2 text-left text-sm transition-colors"
                  :class="{ 'bg-primary/10 text-primary font-medium': isActiveTheme(opt.value) }"
                >
                  <AppIcon :name="opt.icon" :size="1.125" />
                  {{ opt.label }}
                </button>
              </div>
            </Transition>
          </div>

          <!-- Mobile Menu Button -->
          <button
            class="text-text-secondary hover:text-text hover:bg-muted flex size-9 items-center justify-center rounded-lg transition-colors md:hidden"
            @click="mobileMenuOpen = !mobileMenuOpen"
            aria-label="Toggle menu"
          >
            <AppIcon
              :name="mobileMenuOpen ? 'icon-[heroicons-outline--x-mark]' : 'icon-[heroicons-outline--bars-3]'"
              :size="1.25"
            />
          </button>
        </div>
      </div>

      <!-- Mobile Nav -->
      <Transition
        enter-active-class="transition duration-200 ease-out"
        enter-from-class="opacity-0 -translate-y-2"
        enter-to-class="opacity-100 translate-y-0"
        leave-active-class="transition duration-150 ease-in"
        leave-from-class="opacity-100 translate-y-0"
        leave-to-class="opacity-0 -translate-y-2"
      >
        <nav v-if="mobileMenuOpen" class="border-border border-t pb-4 pt-2 md:hidden">
          <a
            v-for="link in navLinks"
            :key="link.href"
            :href="link.href"
            class="text-text-secondary hover:text-text hover:bg-muted block rounded-lg px-3 py-2.5 text-sm font-medium transition-colors"
            @click.prevent="scrollTo(link.href); mobileMenuOpen = false"
          >
            {{ link.label }}
          </a>
        </nav>
      </Transition>
    </div>
  </header>
</template>

<script setup lang="ts">
  import { onClickOutside } from '@vueuse/core';
  import { computed, ref } from 'vue';
  import { useAppConfig } from '../composables/useAppConfig';
  import { useTheme } from '../composables/useTheme';
  import AppIcon from './global/AppIcon.vue';

  const { appName } = useAppConfig();
  const { theme, mode, setTheme } = useTheme();

  const showThemeMenu = ref(false);
  const mobileMenuOpen = ref(false);
  const themeMenuRef = ref<HTMLElement | null>(null);

  onClickOutside(themeMenuRef, () => {
    showThemeMenu.value = false;
  });

  const navLinks = [
    { label: 'Features', href: '#features' },
    { label: 'Components', href: '#components' },
    { label: 'Theme', href: '#theme' },
    { label: 'Quick Start', href: '#getting-started' },
  ];

  const themeOptions = [
    { value: 'light' as const, label: 'Light', icon: 'icon-[heroicons-outline--sun]' },
    { value: 'dark' as const, label: 'Dark', icon: 'icon-[heroicons-outline--moon]' },
    { value: 'system' as const, label: 'System', icon: 'icon-[heroicons-outline--computer-desktop]' },
  ];

  const themeIcon = computed(() => {
    if (mode.value === 'system') return 'icon-[heroicons-outline--computer-desktop]';
    return theme.value === 'dark' ? 'icon-[heroicons-outline--moon]' : 'icon-[heroicons-outline--sun]';
  });

  function isActiveTheme(value: 'light' | 'dark' | 'system') {
    if (value === 'system') return mode.value === 'system';
    return mode.value !== 'system' && theme.value === value;
  }

  function selectTheme(value: 'light' | 'dark' | 'system') {
    setTheme(value);
    showThemeMenu.value = false;
  }

  function scrollTo(href: string) {
    const id = href.replace('#', '');
    document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' });
  }
</script>
