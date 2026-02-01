<template>
  <div class="flex flex-col gap-2 w-full">
    <label v-if="label" :for="id" class="text-sm font-medium text-text">
      {{ label }}
    </label>
    <div class="flex gap-2">
      <select
        v-model="countryCode"
        :disabled="readonly"
        class="w-24 rounded-lg border border-border bg-surface px-2 py-2.5 text-text focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20 disabled:cursor-not-allowed disabled:opacity-50 transition-all"
        :class="{ 'border-red-500 focus:border-red-500 focus:ring-red-500/20': error }"
      >
        <option v-for="code in countryCodes" :key="code.code" :value="code.code">
          {{ code.flag }} {{ code.code }}
        </option>
      </select>
      <input
        :id="id"
        type="tel"
        :value="phoneNumber"
        :placeholder="placeholder"
        :readonly="readonly"
        :disabled="readonly"
        @input="handleInput"
        class="flex-1 rounded-lg border border-border bg-surface px-4 py-2.5 text-text placeholder:text-text/50 focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20 disabled:cursor-not-allowed disabled:opacity-50 transition-all"
        :class="[customClass, { 'border-red-500 focus:border-red-500 focus:ring-red-500/20': error }]"
      />
    </div>
    <span v-if="error" class="text-sm text-red-500">{{ error }}</span>
  </div>
</template>

<script setup lang="ts">
import { computed, ref, watch } from 'vue';

interface Props {
  modelValue: string;
  label?: string;
  placeholder?: string;
  readonly?: boolean;
  error?: string;
  customClass?: string;
}

const props = withDefaults(defineProps<Props>(), {
  placeholder: 'Enter phone number',
  readonly: false,
});

const emit = defineEmits<{
  'update:modelValue': [value: string];
}>();

const id = computed(() => `phone-${Math.random().toString(36).substr(2, 9)}`);

const countryCodes = [
  { code: '+1', flag: '🇺🇸' },
  { code: '+44', flag: '🇬🇧' },
  { code: '+91', flag: '🇮🇳' },
  { code: '+86', flag: '🇨🇳' },
  { code: '+81', flag: '🇯🇵' },
  { code: '+49', flag: '🇩🇪' },
  { code: '+33', flag: '🇫🇷' },
  { code: '+39', flag: '🇮🇹' },
  { code: '+34', flag: '🇪🇸' },
  { code: '+61', flag: '🇦🇺' },
  { code: '+971', flag: '🇦🇪' },
  { code: '+966', flag: '🇸🇦' },
];

const countryCode = ref('+1');
const phoneNumber = ref('');

// Parse initial value
const parsePhone = (value: string) => {
  if (!value) return;

  const matchingCode = countryCodes.find(c => value.startsWith(c.code));
  if (matchingCode) {
    countryCode.value = matchingCode.code;
    phoneNumber.value = value.slice(matchingCode.code.length).trim();
  } else {
    phoneNumber.value = value;
  }
};

parsePhone(props.modelValue);

watch(() => props.modelValue, (newVal) => {
  parsePhone(newVal);
});

const handleInput = (event: Event) => {
  const target = event.target as HTMLInputElement;
  phoneNumber.value = target.value;
  emit('update:modelValue', `${countryCode.value} ${phoneNumber.value}`.trim());
};

watch(countryCode, () => {
  emit('update:modelValue', `${countryCode.value} ${phoneNumber.value}`.trim());
});
</script>
