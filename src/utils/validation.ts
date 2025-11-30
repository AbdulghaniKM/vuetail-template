export type ValidationRule = (value: any) => boolean | string;

export interface ValidationResult {
  valid: boolean;
  errors: string[];
}

export interface FieldValidation {
  value: any;
  rules: ValidationRule[];
  required?: boolean;
}

export const required = (message: string = 'This field is required'): ValidationRule => {
  return (value: any) => {
    if (value === null || value === undefined || value === '') {
      return message;
    }
    if (Array.isArray(value) && value.length === 0) {
      return message;
    }
    return true;
  };
};

export const minLength = (min: number, message?: string): ValidationRule => {
  return (value: any) => {
    const str = String(value);
    if (str.length < min) {
      return message || `Must be at least ${min} characters`;
    }
    return true;
  };
};

export const maxLength = (max: number, message?: string): ValidationRule => {
  return (value: any) => {
    const str = String(value);
    if (str.length > max) {
      return message || `Must be no more than ${max} characters`;
    }
    return true;
  };
};

export const email = (message: string = 'Invalid email address'): ValidationRule => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return (value: any) => {
    if (!value) return true; // Use required() for required checks
    return emailRegex.test(String(value)) || message;
  };
};

export const url = (message: string = 'Invalid URL'): ValidationRule => {
  return (value: any) => {
    if (!value) return true;
    try {
      new URL(String(value));
      return true;
    } catch {
      return message;
    }
  };
};

export const number = (message: string = 'Must be a number'): ValidationRule => {
  return (value: any) => {
    if (!value) return true;
    return !isNaN(Number(value)) || message;
  };
};

export const min = (minValue: number, message?: string): ValidationRule => {
  return (value: any) => {
    if (!value) return true;
    const num = Number(value);
    return !isNaN(num) && num >= minValue || message || `Must be at least ${minValue}`;
  };
};

export const max = (maxValue: number, message?: string): ValidationRule => {
  return (value: any) => {
    if (!value) return true;
    const num = Number(value);
    return !isNaN(num) && num <= maxValue || message || `Must be no more than ${maxValue}`;
  };
};

export const pattern = (regex: RegExp, message: string = 'Invalid format'): ValidationRule => {
  return (value: any) => {
    if (!value) return true;
    return regex.test(String(value)) || message;
  };
};

export const validateField = (field: FieldValidation): ValidationResult => {
  const errors: string[] = [];

  // Check required
  if (field.required) {
    const requiredRule = required();
    const requiredResult = requiredRule(field.value);
    if (requiredResult !== true) {
      errors.push(String(requiredResult));
      return { valid: false, errors };
    }
  }

  // Check rules
  for (const rule of field.rules) {
    const result = rule(field.value);
    if (result !== true) {
      errors.push(String(result));
    }
  }

  return {
    valid: errors.length === 0,
    errors,
  };
};

export const validateForm = (fields: Record<string, FieldValidation>): ValidationResult => {
  const errors: string[] = [];
  let isValid = true;

  for (const [key, field] of Object.entries(fields)) {
    const result = validateField(field);
    if (!result.valid) {
      isValid = false;
      errors.push(...result.errors.map((err) => `${key}: ${err}`));
    }
  }

  return {
    valid: isValid,
    errors,
  };
};
