<template>
    <div class="flex flex-row gap-2 hover:bg-yellow-600/50 transition-all transition-discrete bg-yellow-500 rounded-xl p-2 items-center justify-center">
      <Icon :icon="icon"/>
      <p>
        {{ buttonText }}
      </p>
    </div>
</template>
<script setup lang="ts">
  import {Icon } from '@iconify/vue'
  defineProps({
    buttonText: {
      type: String,
      required: true,
    },
    icon: {
      type: String,
      required: true,
    }
  })
</script>
