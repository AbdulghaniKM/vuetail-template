<template>
  <form @submit.prevent="handleSubmit" :class="containerClass" novalidate>
    <!-- Render rows -->
    <div
      v-for="(row, rowIndex) in fields"
      :key="rowIndex"
      class="grid gap-4"
      :class="rowClass || getDefaultRowClass(row)"
    >
      <!-- Render fields in row -->
      <div
        v-for="(field, fieldIndex) in row"
        :key="fieldIndex"
        :class="field.customClass"
      >
        <!-- Input Field -->
        <InputField
          v-if="field.type === 'text' || field.type === 'password' || field.type === 'email' || field.type === 'number'"
          v-model="modelValue[field.key]"
          :label="field.label"
          :type="field.type"
          :placeholder="field.placeholder"
          :readonly="field.readonly"
          :error="errors[field.key]"
        />

        <!-- Textarea -->
        <Textarea
          v-else-if="field.type === 'textarea'"
          v-model="modelValue[field.key]"
          :label="field.label"
          :placeholder="field.placeholder"
          :readonly="field.readonly"
          :rows="field.rows"
          :error="errors[field.key]"
        />

        <!-- Select -->
        <Select
          v-else-if="field.type === 'select'"
          v-model="modelValue[field.key]"
          :label="field.label"
          :items="field.items || []"
          :placeholder="field.placeholder"
          :readonly="field.readonly"
          :error="errors[field.key]"
        />

        <!-- Phone Input -->
        <PhoneInput
          v-else-if="field.type === 'phone'"
          v-model="modelValue[field.key]"
          :label="field.label"
          :placeholder="field.placeholder"
          :readonly="field.readonly"
          :error="errors[field.key]"
        />
      </div>
    </div>

    <!-- Submit Button -->
    <div class="mt-6 flex justify-end gap-4">
      <slot name="actions">
        <button
          type="submit"
          :disabled="isSubmitting"
          class="rounded-lg bg-primary px-6 py-2.5 font-semibold text-white transition-all hover:bg-primary/90 disabled:cursor-not-allowed disabled:opacity-50"
        >
          {{ isSubmitting ? 'Submitting...' : 'Submit' }}
        </button>
      </slot>
    </div>
  </form>
</template>

<script setup lang="ts">
import { computed, ref, watch } from 'vue';
import { z, type ZodType } from 'zod';
import axios from 'axios';
import InputField from './InputField.vue';
import Textarea from './Textarea.vue';
import Select from './Select.vue';
import PhoneInput from './PhoneInput.vue';
import type { SelectItem } from './Select.vue';

export interface FormField {
  key: string;
  type?: 'text' | 'select' | 'phone' | 'password' | 'textarea' | 'email' | 'number';
  label?: string;
  placeholder?: string;
  items?: string[] | SelectItem[];
  customClass?: string;
  readonly?: boolean;
  rows?: number;
}

export type FormFieldRow = FormField[];

interface Props {
  modelValue: Record<string, any>;
  fields: FormFieldRow[];
  schema?: ZodType;
  endPoint?: string;
  method?: 'POST' | 'PUT';
  containerClass?: string;
  rowClass?: string;
  successMessage?: string;
}

const props = withDefaults(defineProps<Props>(), {
  method: 'POST',
  containerClass: 'space-y-4',
  successMessage: 'Form submitted successfully!',
});

const emit = defineEmits<{
  'update:modelValue': [value: Record<string, any>];
  submitted: [data: Record<string, any>];
  error: [error: any];
}>();

const errors = ref<Record<string, string>>({});
const isSubmitting = ref(false);

// Watch each field individually to clear its error when the user types
const fieldKeys = computed(() =>
  props.fields.flat().map((f) => f.key)
);

watch(
  () => fieldKeys.value.map((key: string) => props.modelValue[key]),
  (newVals: any[], oldVals: any[]) => {
    if (!oldVals) return;
    fieldKeys.value.forEach((key: string, i: number) => {
      if (newVals[i] !== oldVals[i] && errors.value[key]) {
        delete errors.value[key];
      }
    });
  },
  { flush: 'post' }
);

const getDefaultRowClass = (row: FormField[]) => {
  const fieldCount = row.length;
  if (fieldCount === 1) return 'grid-cols-1';
  if (fieldCount === 2) return 'grid-cols-1 md:grid-cols-2';
  if (fieldCount === 3) return 'grid-cols-1 md:grid-cols-3';
  return `grid-cols-1 md:grid-cols-${fieldCount}`;
};

const validate = (): boolean => {
  errors.value = {};

  if (!props.schema) return true;

  try {
    props.schema.parse(props.modelValue);
    return true;
  } catch (error) {
    if (error instanceof z.ZodError) {
      error.issues.forEach((err) => {
        const path = err.path.join('.');
        errors.value[path] = err.message;
      });
    }
    return false;
  }
};

const clearErrors = () => {
  errors.value = {};
};

const handleSubmit = async () => {
  if (!validate()) {
    return;
  }

  if (!props.endPoint) {
    emit('submitted', props.modelValue);
    return;
  }

  isSubmitting.value = true;

  try {
    const response = await axios({
      method: props.method,
      url: props.endPoint,
      data: props.modelValue,
    });

    emit('submitted', response.data);

    // Show success message if toast is available
    if (window && (window as any).showToast) {
      (window as any).showToast('success', props.successMessage);
    }
  } catch (error: any) {
    emit('error', error);

    // Show error message if toast is available
    if (window && (window as any).showToast) {
      (window as any).showToast('error', error.response?.data?.message || 'An error occurred');
    }
  } finally {
    isSubmitting.value = false;
  }
};

// Expose methods for template refs
defineExpose({
  submit: handleSubmit,
  validate,
  clearErrors,
});
</script>
