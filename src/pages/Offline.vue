<template>
  <AppEmptyState
    icon="icon-[solar--wi-fi-router-minimalistic-linear]"
    title="You're offline"
    description="Check your connection and try again."
    variant="warning"
  >
    <button
      type="button"
      class="bg-primary rounded-lg px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-primary/90"
      @click="retry"
    >
      Retry
    </button>
  </AppEmptyState>
</template>

<script setup lang="ts">
import AppEmptyState from '@/components/ui/AppEmptyState.vue';

const retry = () => {
  if (navigator.onLine) window.location.reload();
};
</script>
