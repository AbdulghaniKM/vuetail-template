<template>
  <div class="bg-background flex min-h-screen">
    <aside
      class="bg-surface border-border sticky top-0 hidden h-screen shrink-0 border-e transition-[width] duration-200 md:block"
      :class="collapsed ? 'w-16' : 'w-64'"
    >
      <div class="border-border flex h-14 items-center gap-2 border-b px-3">
        <span v-if="!collapsed" class="text-text truncate text-sm font-semibold">
          {{ appName }}
        </span>
        <button
          type="button"
          class="text-text-secondary hover:bg-muted hover:text-text ms-auto flex size-8 items-center justify-center rounded-lg transition-colors"
          :aria-label="collapsed ? 'Expand sidebar' : 'Collapse sidebar'"
          @click="toggle"
        >
          <AppIcon
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
        class="bg-surface/70 border-border/50 sticky top-0 z-30 flex h-14 items-center gap-2 border-b px-4 backdrop-blur-xl"
      >
        <slot name="header-start" />
        <div class="ms-auto flex items-center gap-2">
          <slot name="header-end" />
          <ThemeToggle />
        </div>
      </header>
      <a
        href="#main"
        class="focus:bg-primary sr-only focus:not-sr-only focus:fixed focus:start-2 focus:top-2 focus:z-50 focus:rounded-lg focus:px-4 focus:py-2 focus:text-white"
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
  import AppIcon from '@/components/ui/AppIcon.vue';
  import ThemeToggle from '@/components/ui/ThemeToggle.vue';
  import { useAppConfig } from '@/composables/useAppConfig';
  import { useSidebar } from '@/composables/useSidebar';
  const { appName } = useAppConfig();
  const { collapsed, toggle } = useSidebar();
</script>
