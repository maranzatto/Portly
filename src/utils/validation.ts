export interface ValidationRule {
  required?: boolean;
  minLength?: number;
  maxLength?: number;
  pattern?: RegExp;
  custom?: (value: any) => string | null;
}

export interface ValidationSchema {
  [key: string]: ValidationRule;
}

export interface ValidationError {
  field: string;
  message: string;
}

export class FormValidator {
  static validate(data: any, schema: ValidationSchema): ValidationError[] {
    const errors: ValidationError[] = [];

    Object.keys(schema).forEach(field => {
      const rules = schema[field];
      const value = data[field];

      if (rules.required && (!value || value.toString().trim() === '')) {
        errors.push({ field, message: `${field} é obrigatório` });
        return;
      }

      if (value && rules.minLength && value.length < rules.minLength) {
        errors.push({ 
          field, 
          message: `${field} deve ter pelo menos ${rules.minLength} caracteres` 
        });
      }

      if (value && rules.maxLength && value.length > rules.maxLength) {
        errors.push({ 
          field, 
          message: `${field} deve ter no máximo ${rules.maxLength} caracteres` 
        });
      }

      if (value && rules.pattern && !rules.pattern.test(value)) {
        errors.push({ 
          field, 
          message: `${field} tem formato inválido` 
        });
      }

      if (rules.custom) {
        const customError = rules.custom(value);
        if (customError) {
          errors.push({ field, message: customError });
        }
      }
    });

    return errors;
  }
}

export const VisitorValidationSchema: ValidationSchema = {
  fullName: {
    required: true,
    minLength: 3,
    maxLength: 100,
  },
  document: {
    required: true,
    pattern: /^\d{11}|\d{14}$/,
  },
  phone: {
    required: true,
    pattern: /^\d{10,11}$/,
  },
  email: {
    required: true,
    pattern: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
  },
};
