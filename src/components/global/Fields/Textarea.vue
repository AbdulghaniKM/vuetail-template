<template>
  <div class="flex flex-col gap-1.5 w-full">
    <span v-if="label" class="text-sm font-medium text-text">
      {{ label }}
    </span>
    <textarea
      :id="id"
      :value="modelValue"
      :placeholder="placeholder"
      :readonly="readonly"
      :disabled="readonly"
      :rows="rows"
      @input="handleInput"
      class="w-full rounded-lg border border-border bg-surface px-4 py-2.5 text-text placeholder:text-text/50 focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20 disabled:cursor-not-allowed disabled:opacity-50 transition-all resize-y"
      :class="[customClass, { 'border-error focus:border-error focus:ring-error/20': error }]"
    />
    <span class="block min-h-[1.25rem] text-sm text-error" :class="{ invisible: !error }">{{ error }}</span>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue';

interface Props {
  modelValue: string;
  label?: string;
  placeholder?: string;
  readonly?: boolean;
  error?: string;
  customClass?: string;
  rows?: number;
}

const props = withDefaults(defineProps<Props>(), {
  placeholder: '',
  readonly: false,
  rows: 4,
});

const emit = defineEmits<{
  'update:modelValue': [value: string];
}>();

const id = computed(() => `textarea-${Math.random().toString(36).substr(2, 9)}`);

const handleInput = (event: Event) => {
  const target = event.target as HTMLTextAreaElement;
  emit('update:modelValue', target.value);
};
</script>
