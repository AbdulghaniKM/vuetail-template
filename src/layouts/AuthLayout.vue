<template>
  <div class="flex min-h-screen flex-col bg-background">
    <div class="flex flex-1 items-center justify-center px-4 py-10">
      <div class="w-full max-w-md">
        <div class="mb-8 text-center">
          <RouterLink to="/" class="text-text text-xl font-semibold">{{ appName }}</RouterLink>
          <p v-if="$slots.tagline" class="text-text-secondary mt-1 text-sm">
            <slot name="tagline" />
          </p>
        </div>
        <div class="bg-surface border-border rounded-2xl border p-6 shadow-sm">
          <slot />
        </div>
        <div class="mt-6 flex items-center justify-center">
          <ThemeToggle />
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { useAppConfig } from '@/composables/useAppConfig';
import ThemeToggle from '@/components/ui/ThemeToggle.vue';

const { appName } = useAppConfig();
</script>
