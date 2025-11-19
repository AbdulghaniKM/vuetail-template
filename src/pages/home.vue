<template>
  <div class="flex flex-col items-center justify-center">
    <div class="mt-20 flex flex-col items-center justify-center gap-6 text-2xl">
      <h1>Count : {{ context.count }}</h1>
      <div class="flex flex-row items-center justify-center gap-4">
        <AppButton
          icon="icon-[bitcoin-icons--minus-filled]"
          button-text="Decrement"
          @click="context.decrement()"
        />
        <AppButton icon="icon-[ri--reset-left-line]" button-text="Reset" @click="context.reset()" />
        <AppButton icon="icon-[jam--plus]" button-text="Increment" @click="context.increment()" />
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
  import AppButton from '../components/AppButton.vue';
  import { useCounterStore } from '../stores/counter';
  const context = useCounterStore();
</script>
