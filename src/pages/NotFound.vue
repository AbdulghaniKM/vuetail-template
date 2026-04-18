<template>
  <AppEmptyState
    icon="icon-[solar--compass-square-linear]"
    title="Page not found"
    description="We couldn't find the page you're looking for. It may have been moved, renamed, or never existed."
    variant="neutral"
  >
    <RouterLink
      to="/"
      class="bg-primary rounded-lg px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-primary/90"
    >
      Go home
    </RouterLink>
  </AppEmptyState>
</template>

<script setup lang="ts">
import AppEmptyState from '@/components/ui/AppEmptyState.vue';
</script>
