<template>
  <UiAppEmptyState
    icon="icon-[heroicons--wifi]"
    title="You're offline"
    description="Check your connection and try again."
    variant="warning"
  >
    <button
      type="button"
      class="rounded-lg bg-accent px-4 py-2 text-sm font-medium text-accent-fg transition-colors hover:bg-accent-hover"
      @click="retry"
    >
      Retry
    </button>
  </UiAppEmptyState>
</template>

<script setup lang="ts">
  definePage({
    head: 'Offline',
  });

  const retry = () => {
    if (navigator.onLine) window.location.reload();
  };
</script>
