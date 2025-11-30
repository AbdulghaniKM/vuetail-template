<template>
  <div class="flex flex-col min-h-screen bg-background">
    <AppHeader />
    <main class="flex-1">
      <slot />
    </main>
  </div>
</template>

<script setup lang="ts">
import AppHeader from '../components/AppHeader.vue';
</script>
