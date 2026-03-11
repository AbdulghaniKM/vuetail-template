<template>
  <div class="flex min-w-0 flex-col gap-1.5 w-full">
    <span v-if="label" class="text-sm font-medium text-text">
      {{ label }}
    </span>
    <div
      class="relative flex min-w-0 items-stretch rounded-lg border bg-surface transition-all"
      :class="[
        isFocused && !error
          ? 'border-primary ring-2 ring-primary/20'
          : error
            ? 'border-error ring-2 ring-error/20'
            : 'border-border',
        readonly ? 'opacity-50 cursor-not-allowed' : '',
      ]"
    >
      <input
        :id="id"
        ref="inputRef"
        type="tel"
        :value="phoneNumber"
        :placeholder="placeholder"
        :readonly="readonly"
        :disabled="readonly"
        dir="ltr"
        class="min-w-0 flex-1 bg-transparent px-3 py-2.5 text-text placeholder:text-text/40 focus:outline-none disabled:cursor-not-allowed text-sm overflow-x-auto"
        :class="customClass"
        @input="handleInput"
        @focus="isFocused = true"
        @blur="isFocused = false"
      />

      <template v-if="showCountryCode">
        <button
          type="button"
          :disabled="readonly"
          class="flex items-center gap-1.5 ps-2 pe-3 text-sm text-text transition-colors hover:bg-muted/50 rounded-e-lg border-s border-border shrink-0 disabled:cursor-not-allowed disabled:hover:bg-transparent"
          @click="toggleDropdown"
        >
          <svg
            class="size-3.5 text-text/40 transition-transform duration-200"
            :class="{ 'rotate-180': isOpen }"
            viewBox="0 0 20 20"
            fill="currentColor"
          >
            <path fill-rule="evenodd" d="M5.23 7.21a.75.75 0 011.06.02L10 11.168l3.71-3.938a.75.75 0 111.08 1.04l-4.25 4.5a.75.75 0 01-1.08 0l-4.25-4.5a.75.75 0 01.02-1.06z" clip-rule="evenodd" />
          </svg>
          <span class="font-medium" dir="ltr">{{ selectedCountry.code }}</span>
        </button>

        <Transition
          enter-active-class="transition duration-150 ease-out"
          enter-from-class="opacity-0 -translate-y-1 scale-95"
          enter-to-class="opacity-100 translate-y-0 scale-100"
          leave-active-class="transition duration-100 ease-in"
          leave-from-class="opacity-100 translate-y-0 scale-100"
          leave-to-class="opacity-0 -translate-y-1 scale-95"
        >
          <div
            v-if="isOpen"
            ref="dropdownRef"
            class="absolute end-0 top-full z-50 mt-1.5 w-full min-w-48 overflow-hidden rounded-lg border border-border bg-surface shadow-lg shadow-text/10"
          >
            <div class="max-h-52 overflow-y-auto py-1">
              <button
                v-for="country in countryCodes"
                :key="country.code"
                type="button"
                class="flex w-full items-center gap-2.5 px-3 py-2 text-sm transition-colors hover:bg-muted/60"
                :class="country.code === countryCode ? 'bg-primary/10 text-primary font-medium' : 'text-text'"
                @click="selectCountry(country)"
              >
                <span class="text-lg leading-none">{{ country.flag }}</span>
                <span dir="ltr">{{ country.code }}</span>
                <span class="text-text/50 text-xs">{{ country.name }}</span>
                <svg
                  v-if="country.code === countryCode"
                  class="ms-auto size-4 text-primary"
                  viewBox="0 0 20 20"
                  fill="currentColor"
                >
                  <path fill-rule="evenodd" d="M16.704 4.153a.75.75 0 01.143 1.052l-8 10.5a.75.75 0 01-1.127.075l-4.5-4.5a.75.75 0 011.06-1.06l3.894 3.893 7.48-9.817a.75.75 0 011.05-.143z" clip-rule="evenodd" />
                </svg>
              </button>
            </div>
          </div>
        </Transition>
      </template>
    </div>
    <span class="block min-h-[1.25rem] text-sm text-error" :class="{ invisible: !error }">{{ error }}</span>
  </div>
</template>

<script setup lang="ts">
import { computed, onBeforeUnmount, onMounted, ref, watch } from 'vue';

interface CountryCode {
  code: string;
  flag: string;
  name: string;
}

interface Props {
  modelValue: string;
  label?: string;
  placeholder?: string;
  readonly?: boolean;
  error?: string;
  customClass?: string;
  showCountryCode?: boolean;
}

const props = withDefaults(defineProps<Props>(), {
  label: '',
  placeholder: 'Enter phone number',
  readonly: false,
  error: '',
  customClass: '',
  showCountryCode: true,
});

const emit = defineEmits<{
  'update:modelValue': [value: string];
}>();

const id = computed(() => `phone-${Math.random().toString(36).substr(2, 9)}`);

const countryCodes: CountryCode[] = [
  { code: '+1', flag: '\u{1F1FA}\u{1F1F8}', name: 'United States' },
  { code: '+44', flag: '\u{1F1EC}\u{1F1E7}', name: 'United Kingdom' },
  { code: '+91', flag: '\u{1F1EE}\u{1F1F3}', name: 'India' },
  { code: '+86', flag: '\u{1F1E8}\u{1F1F3}', name: 'China' },
  { code: '+81', flag: '\u{1F1EF}\u{1F1F5}', name: 'Japan' },
  { code: '+49', flag: '\u{1F1E9}\u{1F1EA}', name: 'Germany' },
  { code: '+33', flag: '\u{1F1EB}\u{1F1F7}', name: 'France' },
  { code: '+39', flag: '\u{1F1EE}\u{1F1F9}', name: 'Italy' },
  { code: '+34', flag: '\u{1F1EA}\u{1F1F8}', name: 'Spain' },
  { code: '+61', flag: '\u{1F1E6}\u{1F1FA}', name: 'Australia' },
  { code: '+971', flag: '\u{1F1E6}\u{1F1EA}', name: 'UAE' },
  { code: '+966', flag: '\u{1F1F8}\u{1F1E6}', name: 'Saudi Arabia' },
];

const countryCode = ref('+1');
const phoneNumber = ref('');
const isOpen = ref(false);
const isFocused = ref(false);
const dropdownRef = ref<HTMLElement | null>(null);
const inputRef = ref<HTMLInputElement | null>(null);

const selectedCountry = computed(
  () => countryCodes.find(c => c.code === countryCode.value) ?? countryCodes[0],
);

const toggleDropdown = () => {
  if (props.readonly) return;
  isOpen.value = !isOpen.value;
};

const selectCountry = (country: CountryCode) => {
  countryCode.value = country.code;
  isOpen.value = false;
  inputRef.value?.focus();
};

const handleClickOutside = (e: MouseEvent) => {
  if (dropdownRef.value && !dropdownRef.value.contains(e.target as Node)) {
    isOpen.value = false;
  }
};

onMounted(() => document.addEventListener('click', handleClickOutside, true));
onBeforeUnmount(() => document.removeEventListener('click', handleClickOutside, true));

const parsePhone = (value: string) => {
  if (!value) {
    phoneNumber.value = '';
    return;
  }
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

function emitValue() {
  if (props.showCountryCode) {
    emit('update:modelValue', `${countryCode.value} ${phoneNumber.value}`.trim());
  } else {
    emit('update:modelValue', phoneNumber.value);
  }
}

const handleInput = (event: Event) => {
  const target = event.target as HTMLInputElement;
  const digitsOnly = target.value.replace(/\D/g, '').slice(0, 15);
  target.value = digitsOnly;
  phoneNumber.value = digitsOnly;
  emitValue();
};

watch(countryCode, () => {
  emitValue();
});
</script>
