<template>
  <div class="bg-background flex min-h-screen flex-col">
    <header class="border-border/50 bg-surface/70 sticky top-0 z-30 border-b backdrop-blur-xl">
      <div class="mx-auto flex h-14 max-w-6xl items-center justify-between px-4">
        <RouterLink to="/" class="text-text text-base font-semibold">
          {{ appName }}
        </RouterLink>
        <nav class="flex items-center gap-2">
          <slot name="nav" />
          <UiThemeToggle />
        </nav>
      </div>
    </header>
    <a
      href="#main"
      class="focus:bg-primary sr-only focus:not-sr-only focus:fixed focus:start-2 focus:top-2 focus:z-50 focus:rounded-lg focus:px-4 focus:py-2 focus:text-white"
    >
      Skip to content
    </a>
    <main id="main" class="flex-1">
      <slot />
    </main>
  </div>
</template>

<script setup lang="ts">
  const { appName } = useAppConfig();
</script>
