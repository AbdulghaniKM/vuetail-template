<template>
  <div class="flex flex-col gap-2 w-full">
    <label v-if="label" :for="id" class="text-sm font-medium text-text">
      {{ label }}
    </label>
    <input
      :id="id"
      :type="type"
      :value="modelValue"
      :placeholder="placeholder"
      :readonly="readonly"
      :disabled="readonly"
      @input="handleInput"
      class="w-full rounded-lg border border-border bg-surface px-4 py-2.5 text-text placeholder:text-text/50 focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20 disabled:cursor-not-allowed disabled:opacity-50 transition-all"
      :class="[customClass, { 'border-red-500 focus:border-red-500 focus:ring-red-500/20': error }]"
    />
    <span v-if="error" class="text-sm text-red-500">{{ error }}</span>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue';

interface Props {
  modelValue: string | number;
  label?: string;
  type?: 'text' | 'password' | 'email' | 'number';
  placeholder?: string;
  readonly?: boolean;
  error?: string;
  customClass?: string;
}

const props = withDefaults(defineProps<Props>(), {
  type: 'text',
  placeholder: '',
  readonly: false,
});

const emit = defineEmits<{
  'update:modelValue': [value: string | number];
}>();

const id = computed(() => `input-${Math.random().toString(36).substr(2, 9)}`);

const handleInput = (event: Event) => {
  const target = event.target as HTMLInputElement;
  emit('update:modelValue', props.type === 'number' ? Number(target.value) : target.value);
};
</script>
