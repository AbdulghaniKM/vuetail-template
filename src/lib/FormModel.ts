import { computed, reactive, ref, type UnwrapNestedRefs } from 'vue';
import type { z } from 'zod';

export class FormModel<T extends Record<string, unknown>> {
  readonly fields: UnwrapNestedRefs<T>;
  readonly errors = ref<Partial<Record<keyof T, string>>>({});
  readonly isSubmitting = ref(false);

  private readonly serializedInitialFields: string;

  readonly isDirty = computed(
    () => JSON.stringify(this.fields) !== this.serializedInitialFields,
  );

  constructor(
    initialFields: T,
    private readonly validationSchema: z.ZodType<T>,
  ) {
    this.fields = reactive({ ...initialFields }) as UnwrapNestedRefs<T>;
    this.serializedInitialFields = JSON.stringify(initialFields);
  }

  validate(): boolean {
    const validationOutcome = this.validationSchema.safeParse(this.fields);
    this.errors.value = {};
    if (validationOutcome.success) return true;
    for (const issue of validationOutcome.error.issues) {
      const fieldKey = issue.path[0] as keyof T | undefined;
      if (fieldKey !== undefined && !this.errors.value[fieldKey]) {
        this.errors.value[fieldKey] = issue.message;
      }
    }
    return false;
  }

  reset(): void {
    const restoredFields: T = JSON.parse(this.serializedInitialFields) as T;
    Object.assign(this.fields, restoredFields);
    this.errors.value = {};
  }

  setError(field: keyof T, message: string): void {
    this.errors.value = { ...this.errors.value, [field]: message };
  }

  async submit(handleValidatedPayload: (payload: T) => Promise<void>): Promise<void> {
    if (!this.validate()) return;
    this.isSubmitting.value = true;
    try {
      const validatedPayload = this.validationSchema.parse(this.fields);
      await handleValidatedPayload(validatedPayload);
    } finally {
      this.isSubmitting.value = false;
    }
  }
}
