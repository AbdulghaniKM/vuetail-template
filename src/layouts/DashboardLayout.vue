<template>
  <div class="flex min-h-screen bg-background">
    <aside
      class="sticky top-0 hidden h-screen shrink-0 border-e border-border bg-surface transition-[width] duration-200 md:block"
      :class="collapsed ? 'w-16' : 'w-64'"
    >
      <div class="flex h-14 items-center gap-2 border-b border-border px-3">
        <span v-if="!collapsed" class="truncate text-sm font-semibold text-text">
          {{ appName }}
        </span>
        <button
          type="button"
          class="ms-auto flex size-8 items-center justify-center rounded-lg text-text-secondary transition-colors hover:bg-muted hover:text-text"
          :aria-label="collapsed ? 'Expand sidebar' : 'Collapse sidebar'"
          @click="toggle"
        >
          <UiAppIcon
            :name="
              collapsed
                ? 'icon-[solar--alt-arrow-right-linear]'
                : 'icon-[solar--alt-arrow-left-linear]'
            "
            :size="1"
          />
        </button>
      </div>
      <nav class="flex flex-col gap-0.5 p-2">
        <slot name="nav" :collapsed="collapsed" />
      </nav>
    </aside>
    <div class="flex min-w-0 flex-1 flex-col">
      <header
        class="sticky top-0 z-30 flex h-14 items-center gap-2 border-b border-border/50 bg-surface/70 px-4 backdrop-blur-xl"
      >
        <slot name="header-start" />
        <div class="ms-auto flex items-center gap-2">
          <slot name="header-end" />
          <UiThemeToggle />
        </div>
      </header>
      <a
        href="#main"
        class="sr-only focus:not-sr-only focus:fixed focus:start-2 focus:top-2 focus:z-50 focus:rounded-lg focus:bg-primary focus:px-4 focus:py-2 focus:text-white"
      >
        Skip to content
      </a>
      <main id="main" class="min-h-0 flex-1 p-4 md:p-6">
        <slot />
      </main>
    </div>
  </div>
</template>
<script setup lang="ts">
  const { collapsed, toggle } = useSidebar();
  const { appName } = useAppConfig();
</script>
