<template>
  <AppEmptyState
    icon="icon-[heroicons--shield-exclamation]"
    title="Something went wrong"
    description="An unexpected error occurred on our end. Please try again in a moment."
    variant="danger"
  >
    <button
      type="button"
      class="rounded-lg bg-accent px-4 py-2 text-sm font-medium text-accent-fg transition-colors hover:bg-accent-hover"
      @click="reload"
    >
      Reload page
    </button>
  </AppEmptyState>
</template>

<script setup lang="ts">
  definePage({
    route: '500',
    head: 'Something went wrong',
  });

  const reload = () => window.location.reload();
</script>
