import { computed, reactive, ref, type UnwrapNestedRefs } from 'vue';
import type { z } from 'zod';

/**
 * Form state for one form: fields, errors, touched, submitting.
 *
 * Errors are keyed by field path: `email`, `address.city`. A nested error also sets its
 * top-level key (`address`) so a flat form, or a field that edits a whole object, still finds it.
 * `errorFor(path)` only returns an error once the field was touched or a submit was tried, so a
 * fresh form is not covered in red before the user typed anything.
 */
export class FormModel<T extends Record<string, unknown>> {
  readonly fields: UnwrapNestedRefs<T>;
  readonly errors = ref<Record<string, string>>({});
  readonly touched = ref<Record<string, boolean>>({});
  /** True after the first submit attempt: from then on every error shows. */
  readonly submitted = ref(false);
  readonly isSubmitting = ref(false);

  private readonly serializedInitialFields: string;
  // Top-level keys set only because a nested field failed; skipped by firstErrorPath.
  private readonly aliases = new Set<string>();

  readonly isDirty = computed(() => JSON.stringify(this.fields) !== this.serializedInitialFields);

  /** The first field with an error, in schema (or server) order: focus it after a failed submit. */
  readonly firstErrorPath = computed(
    () =>
      Object.keys(this.errors.value).find(
        (path) => this.errors.value[path] && !this.aliases.has(path),
      ) ?? null,
  );

  constructor(
    initialFields: T,
    private readonly validationSchema: z.ZodType<T>,
  ) {
    this.fields = reactive({ ...initialFields }) as UnwrapNestedRefs<T>;
    this.serializedInitialFields = JSON.stringify(initialFields);
  }

  /** Path → first message, plus the top-level alias for nested paths. */
  private collect(
    issues: readonly { path: PropertyKey[]; message: string }[],
  ): Record<string, string> {
    const out: Record<string, string> = {};
    for (const issue of issues) {
      const path = issue.path.map(String).join('.');
      if (!path || out[path]) continue;
      out[path] = issue.message;
    }
    return out;
  }

  private assign(next: Record<string, string>): void {
    this.aliases.clear();
    const withAliases: Record<string, string> = {};
    for (const [path, message] of Object.entries(next)) {
      withAliases[path] = message;
      const top = path.split('.')[0];
      if (top !== path && !(top in next) && !withAliases[top]) {
        withAliases[top] = message;
        this.aliases.add(top);
      }
    }
    this.errors.value = withAliases;
  }

  private issues() {
    const outcome = this.validationSchema.safeParse(this.fields);
    return outcome.success ? [] : outcome.error.issues;
  }

  /** Check every field; true when the form is valid. */
  validate(): boolean {
    const issues = this.issues();
    this.assign(this.collect(issues));
    return issues.length === 0;
  }

  /** Check one field (and what is nested under it), leaving the other errors alone. */
  validateField(path: string): boolean {
    const mine = this.collect(this.issues());
    const kept = Object.fromEntries(
      Object.entries(this.errors.value).filter(
        ([p]) => !this.aliases.has(p) && p !== path && !p.startsWith(`${path}.`),
      ),
    );
    const found = Object.fromEntries(
      Object.entries(mine).filter(([p]) => p === path || p.startsWith(`${path}.`)),
    );
    this.assign({ ...kept, ...found });
    return Object.keys(found).length === 0;
  }

  /** Drop errors the user has since fixed; never adds new ones. Call it as the user types. */
  clearResolved(): void {
    const failing = this.collect(this.issues());
    const still = Object.fromEntries(
      Object.entries(this.errors.value).filter(
        ([p, message]) => !this.aliases.has(p) && message && p in failing,
      ),
    );
    for (const p of Object.keys(still)) still[p] = failing[p];
    this.assign(still);
  }

  /** Mark a field as visited (on blur), so its error may show. */
  touch(path: string): void {
    this.touched.value = { ...this.touched.value, [path]: true };
  }

  /** The error to show for `path`: only once it was touched or a submit was tried. */
  errorFor(path: string): string | undefined {
    const top = path.split('.')[0];
    if (!this.submitted.value && !this.touched.value[path] && !this.touched.value[top])
      return undefined;
    return this.errors.value[path] || undefined;
  }

  reset(): void {
    const restoredFields: T = JSON.parse(this.serializedInitialFields) as T;
    Object.assign(this.fields, restoredFields);
    this.errors.value = {};
    this.aliases.clear();
    this.touched.value = {};
    this.submitted.value = false;
  }

  setError(field: keyof T | string, message: string): void {
    this.setErrors({ ...this.errors.value, [field as string]: message });
  }

  /**
   * Errors from the server, by path: `{ email: 'Already registered' }`. Arrays (Laravel-style
   * `{ email: ['…'] }`) use their first message. They show at once, as after a submit.
   */
  setErrors(errors: Record<string, string | string[] | undefined>): void {
    const flat: Record<string, string> = {};
    for (const [path, value] of Object.entries(errors)) {
      if (this.aliases.has(path)) continue;
      const message = Array.isArray(value) ? value[0] : value;
      if (message) flat[path] = message;
    }
    this.submitted.value = true;
    this.assign(flat);
  }

  async submit(handleValidatedPayload: (payload: T) => Promise<void>): Promise<void> {
    this.submitted.value = true;
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
