<template>
  <div class="flex min-h-screen flex-col bg-background">
    <header class="border-border/50 bg-surface/70 sticky top-0 z-30 border-b backdrop-blur-xl">
      <div class="mx-auto flex h-14 max-w-6xl items-center justify-between px-4">
        <RouterLink to="/" class="text-text text-base font-semibold">
          {{ appName }}
        </RouterLink>
        <nav class="flex items-center gap-2">
          <slot name="nav" />
          <ThemeToggle />
        </nav>
      </div>
    </header>
    <a href="#main" class="sr-only focus:not-sr-only focus:fixed focus:top-2 focus:start-2 focus:z-50 focus:rounded-lg focus:bg-primary focus:px-4 focus:py-2 focus:text-white">
      Skip to content
    </a>
    <main id="main" class="flex-1">
      <slot />
    </main>
  </div>
</template>

<script setup lang="ts">
import { useAppConfig } from '@/composables/useAppConfig';
import ThemeToggle from '@/components/ui/ThemeToggle.vue';

const { appName } = useAppConfig();
</script>
