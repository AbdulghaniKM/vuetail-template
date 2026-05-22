<template>
  <AppEmptyState
    icon="icon-[solar--shield-warning-linear]"
    title="Something went wrong"
    description="An unexpected error occurred on our end. Please try again in a moment."
    variant="danger"
  >
    <button
      type="button"
      class="bg-primary hover:bg-primary/90 rounded-lg px-4 py-2 text-sm font-medium text-white transition-colors"
      @click="reload"
    >
      Reload page
    </button>
  </AppEmptyState>
</template>

<script setup lang="ts">
  const reload = () => window.location.reload();
</script>
