<template>
  <div class="flex flex-col">
    <AppHeader/>
    <div class="min-h-screen bg-yellow-50">
      <div class="container mx-auto">
        <slot/>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
  import AppHeader from '../components/AppHeader.vue';

</script>