<template>
  <div class="flex flex-col gap-2 w-full">
    <label v-if="label" :for="id" class="text-sm font-medium text-text">
      {{ label }}
    </label>
    <select
      :id="id"
      :value="modelValue"
      :disabled="readonly"
      @change="handleChange"
      class="w-full rounded-lg border border-border bg-surface px-4 py-2.5 text-text focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20 disabled:cursor-not-allowed disabled:opacity-50 transition-all"
      :class="[customClass, { 'border-red-500 focus:border-red-500 focus:ring-red-500/20': error }]"
    >
      <option value="" disabled>{{ placeholder || 'Select an option' }}</option>
      <option
        v-for="(item, index) in normalizedItems"
        :key="index"
        :value="item.value"
      >
        {{ item.label }}
      </option>
    </select>
    <span v-if="error" class="text-sm text-red-500">{{ error }}</span>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue';

export interface SelectItem {
  label: string;
  value: string | number;
}

interface Props {
  modelValue: string | number;
  label?: string;
  items: string[] | SelectItem[];
  placeholder?: string;
  readonly?: boolean;
  error?: string;
  customClass?: string;
}

const props = withDefaults(defineProps<Props>(), {
  placeholder: '',
  readonly: false,
});

const emit = defineEmits<{
  'update:modelValue': [value: string | number];
}>();

const id = computed(() => `select-${Math.random().toString(36).substr(2, 9)}`);

const normalizedItems = computed(() => {
  return props.items.map((item) => {
    if (typeof item === 'string') {
      return { label: item, value: item };
    }
    return item;
  });
});

const handleChange = (event: Event) => {
  const target = event.target as HTMLSelectElement;
  emit('update:modelValue', target.value);
};
</script>
