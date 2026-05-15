export interface FormField {
  key: string;
  type?: 'text' | 'select' | 'phone' | 'password' | 'textarea' | 'email' | 'number' | 'datetime-local' | 'date' | 'datetime';
  label?: string;
  placeholder?: string;
  items?: string[] | { label: string; value: string | number }[];
  customClass?: string;
  readonly?: boolean;
  rows?: number;
  min?: string;
  max?: string;
  searchable?: boolean;
  showCountryCode?: boolean;
}

export type FormFieldRow = FormField[];
