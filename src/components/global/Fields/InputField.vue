<template>
  <div class="flex flex-col gap-1.5 w-full">
    <span v-if="label" class="text-sm font-medium text-text">
      {{ label }}
    </span>
    <div class="relative w-full">
      <input
        :id="id"
        :type="type === 'password' ? (showPassword ? 'text' : 'password') : type"
        :value="type === 'datetime-local' && modelValue ? datetimeLocalValue : modelValue"
        :placeholder="placeholder"
        :readonly="readonly"
        :disabled="readonly"
        @input="handleInput"
        class="w-full rounded-lg border border-border bg-surface py-2.5 text-text placeholder:text-text/50 focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20 disabled:cursor-not-allowed disabled:opacity-50 transition-all"
        :class="[customClass, type === 'password' ? 'ps-4 pe-10' : 'px-4', { 'border-error focus:border-error focus:ring-error/20': error }]"
      />
      <button
        v-if="type === 'password'"
        type="button"
        tabindex="-1"
        class="absolute end-0 top-1/2 -translate-y-1/2 flex items-center justify-center px-3 text-text/40 hover:text-text/70 transition-colors"
        @click="showPassword = !showPassword"
      >
        <AppIcon
          :name="showPassword ? 'icon-[solar--eye-closed-linear]' : 'icon-[solar--eye-linear]'"
          :size="1.125"
        />
      </button>
    </div>
    <span class="block min-h-[1.25rem] text-sm text-error" :class="{ invisible: !error }">{{ error }}</span>
  </div>
</template>

<script setup lang="ts">
import { computed, ref } from 'vue';
import AppIcon from '../AppIcon.vue';

interface Props {
  modelValue: string | number;
  label?: string;
  type?: 'text' | 'password' | 'email' | 'number' | 'datetime-local';
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
const showPassword = ref(false);

const pad = (n: number) => String(n).padStart(2, '0');
const datetimeLocalValue = computed(() => {
  if (props.type !== 'datetime-local' || !props.modelValue) return '';
  const d = new Date(String(props.modelValue));
  return isNaN(d.getTime()) ? '' : `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}T${pad(d.getHours())}:${pad(d.getMinutes())}`;
});

const handleInput = (event: Event) => {
  const target = event.target as HTMLInputElement;
  if (props.type === 'number') {
    emit('update:modelValue', Number(target.value));
  } else if (props.type === 'datetime-local') {
    const val = target.value;
    emit('update:modelValue', val ? new Date(val).toISOString() : '');
  } else {
    emit('update:modelValue', target.value);
  }
};
</script>
