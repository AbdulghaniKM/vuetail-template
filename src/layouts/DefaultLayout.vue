<template>
  <div class="flex min-h-screen flex-col bg-background">
    <header class="sticky top-0 z-30 border-b border-border/50 bg-surface/70 backdrop-blur-xl">
      <div class="mx-auto flex h-14 max-w-6xl items-center justify-between px-4">
        <RouterLink to="/" class="text-base font-semibold text-text">
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
      class="sr-only focus:not-sr-only focus:fixed focus:start-2 focus:top-2 focus:z-50 focus:rounded-lg focus:bg-primary focus:px-4 focus:py-2 focus:text-white"
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
