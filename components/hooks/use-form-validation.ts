/**
 * Custom hook for form validation with performance optimizations
 * Following best practices: debouncing, memoization, early validation
 */

import { useState, useMemo, useCallback } from 'react';
import { debounce } from '../utils/error-handling';

interface ValidationRule<T> {
  readonly validator: (value: T) => boolean;
  readonly message: string;
}

interface UseFormValidationProps<T> {
  readonly initialValues: T;
  readonly validationRules: Partial<Record<keyof T, ValidationRule<T[keyof T]>[]>>;
  readonly validateOnChange?: boolean;
  readonly debounceMs?: number;
}

interface FormValidationState<T> {
  readonly values: T;
  readonly errors: Partial<Record<keyof T, string>>;
  readonly isValid: boolean;
  readonly hasBeenModified: boolean;
}

export function useFormValidation<T extends Record<string, any>>({
  initialValues,
  validationRules,
  validateOnChange = true,
  debounceMs = 300,
}: UseFormValidationProps<T>) {
  const [state, setState] = useState<FormValidationState<T>>({
    values: initialValues,
    errors: {
    // Empty block
  },
    isValid: true,
    hasBeenModified: false,
  });

  // Validate a single field
  const validateField = useCallback(
    (field: keyof T, value: T[keyof T]): string | undefined => {
      const rules = validationRules[field];
      if (!rules) return undefined;

      for (const rule of rules) {
        if (!rule.validator(value)) {
          return rule.message;
        }
      }
      return undefined;
    },
    [validationRules]
  );

  // Validate all fields
  const validateAllFields = useCallback(
    (values: T): Partial<Record<keyof T, string>> => {
      const errors: Partial<Record<keyof T, string>> = {
    // Empty block
  };

      Object.keys(validationRules).forEach((fieldKey) => {
        const field = fieldKey as keyof T;
        const error = validateField(field, values[field]);
        if (error) {
          errors[field] = error;
        }
      });

      return errors;
    },
    [validationRules, validateField]
  );

  // Debounced validation for performance
  const debouncedValidation = useMemo(
    () =>
      debounce((field: keyof T, value: T[keyof T]) => {
        if (!validateOnChange) return;

        const error = validateField(field, value);
        setState((prev) => ({
          ...prev,
          errors: {
            ...prev.errors,
            [field]: error,
          },
          isValid: !error && Object.keys(prev.errors).length <= 1,
        }));
      }, debounceMs),
    [validateField, validateOnChange, debounceMs]
  );

  // Update field value
  const updateField = useCallback(
    (field: keyof T, value: T[keyof T]) => {
      setState((prev) => ({
        ...prev,
        values: {
          ...prev.values,
          [field]: value,
        },
        hasBeenModified: true,
      }));

      // Trigger debounced validation
      debouncedValidation(field, value);
    },
    [debouncedValidation]
  );

  // Validate entire form (for submission)
  const validateForm = useCallback((): boolean => {
    const errors = validateAllFields(state.values);
    const isValid = Object.keys(errors).length === 0;

    setState((prev) => ({
      ...prev,
      errors,
      isValid,
    }));

    return isValid;
  }, [state.values, validateAllFields]);

  // Reset form to initial state
  const resetForm = useCallback(() => {
    setState({
      values: initialValues,
      errors: {
    // Empty block
  },
      isValid: true,
      hasBeenModified: false,
    });
  }, [initialValues]);

  // Get error for a specific field
  const getFieldError = useCallback(
    (field: keyof T): string | undefined => {
      return state.errors[field];
    },
    [state.errors]
  );

  // Check if a specific field has an error
  const hasFieldError = useCallback(
    (field: keyof T): boolean => {
      return Boolean(state.errors[field]);
    },
    [state.errors]
  );

  return {
    values: state.values,
    errors: state.errors,
    isValid: state.isValid,
    hasBeenModified: state.hasBeenModified,
    updateField,
    validateForm,
    resetForm,
    getFieldError,
    hasFieldError,
  };
}
