<template>
  <div class="flex min-h-screen flex-col bg-background">
    <div class="flex flex-1 items-center justify-center px-4 py-10">
      <div class="w-full max-w-md">
        <div class="mb-8 text-center">
          <RouterLink to="/" class="text-xl font-semibold text-text">{{ appName }}</RouterLink>
          <p v-if="$slots.tagline" class="mt-1 text-sm text-text-secondary">
            <slot name="tagline" />
          </p>
        </div>
        <div class="rounded-2xl border border-border bg-surface p-6 shadow-sm">
          <slot />
        </div>
        <div class="mt-6 flex items-center justify-center">
          <UiThemeToggle />
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
  const { appName } = useAppConfig();
</script>
