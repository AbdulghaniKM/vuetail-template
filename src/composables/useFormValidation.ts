import { watch, type Ref } from 'vue';
import type { ZodType } from 'zod';

/**
 * Watches form fields and clears error messages when a field becomes valid.
 * Only clears existing errors—does not set new ones (use validate on submit for that).
 */
export function useFormValidation(
  form: Record<string, unknown>,
  schema: ZodType | undefined,
  errors: Ref<Record<string, string>>,
) {
  watch(
    form,
    (val) => {
      if (!schema) return;
      const result = schema.safeParse(val);
      const errs = errors.value;
      if (result.success) {
        for (const key of Object.keys(errs)) {
          errs[key] = '';
        }
        return;
      }
      const failedPaths = new Set(result.error.issues.map((i) => String(i.path[0])));
      for (const key of Object.keys(errs)) {
        if (!failedPaths.has(key)) {
          errs[key] = '';
        }
      }
    },
    { deep: true },
  );
}
