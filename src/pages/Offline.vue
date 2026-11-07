<template>
  <AppEmptyState
    icon="icon-[solar--wi-fi-router-minimalistic-linear]"
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
  </AppEmptyState>
</template>

<script setup lang="ts">
  const retry = () => {
    if (navigator.onLine) window.location.reload();
  };
</script>
