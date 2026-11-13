export interface FormField {
  key: string;
  type?:
    | 'text'
    | 'select'
    | 'phone'
    | 'password'
    | 'textarea'
    | 'email'
    | 'number'
    | 'datetime-local'
    | 'date'
    | 'datetime'
    | 'radio'
    | 'slider'
    | 'otp'
    | 'tags';
  label?: string;
  placeholder?: string;
  /** Select and radio options; for `tags`, the suggestions. */
  items?: string[] | { label: string; value: string | number; description?: string; disabled?: boolean }[];
  customClass?: string;
  readonly?: boolean;
  rows?: number;
  min?: string;
  /** Date and slider upper bound; for `tags`, the most tags allowed. */
  max?: string;
  /** Slider step. */
  step?: number;
  /** Radio layout. */
  orientation?: 'vertical' | 'horizontal';
  searchable?: boolean;
  showCountryCode?: boolean;
  /** OTP: number of boxes (default 6). */
  length?: number;
  /** OTP: `numeric` (default) takes digits only; `text` takes letters and digits. */
  inputmode?: 'numeric' | 'text';
  /** Password: show the strength meter and the rules. */
  strength?: boolean;
  /** Help text below the field (OTP, tags). */
  description?: string;
}

export type FormFieldRow = FormField[];
