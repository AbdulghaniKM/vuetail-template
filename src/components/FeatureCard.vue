<template>
  <div
    class="bg-surface border-border hover:border-primary cursor-pointer rounded-lg border p-6 transition-all hover:shadow-lg"
    @click="$emit('click')"
  >
    <div class="flex items-start gap-4">
      <div
        class="flex flex-shrink-0 items-center justify-center rounded-lg p-2"
        :class="{
          'bg-primary/20 text-primary': color === 'primary',
          'bg-secondary/20 text-secondary': color === 'secondary',
          'bg-accent/20 text-accent': color === 'accent',
        }"
      >
        <AppIcon :name="icon" :size="1.5" />
      </div>
      <div class="flex-1">
        <h3 class="text-text mb-2 text-xl font-semibold">{{ title }}</h3>
        <p class="text-text-secondary">{{ description }}</p>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
  import AppIcon from './AppIcon.vue';

  defineProps<{
    title: string;
    description: string;
    icon: string;
    color?: 'primary' | 'secondary' | 'accent';
  }>();

  defineEmits<{
    click: [];
  }>();
</script>
