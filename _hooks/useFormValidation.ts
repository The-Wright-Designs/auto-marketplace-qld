import { useState, useCallback } from "react";
import { validateField } from "@/_lib/validation/sell-my-car-schema";

export interface ValidationState {
  [key: string]: {
    isValid: boolean;
    error?: string;
    touched: boolean;
  };
}

export function useFormValidation() {
  const [validationState, setValidationState] = useState<ValidationState>({});
  const [isFormValid, setIsFormValid] = useState(false);

  const validateSingleField = useCallback((name: string, value: any) => {
    const result = validateField(name, value);

    setValidationState((prev) => ({
      ...prev,
      [name]: {
        isValid: result.isValid,
        touched: true,
        error: result.error,
      },
    }));

    return result.isValid;
  }, []);

  const validateAllFields = useCallback((formData: Record<string, any>) => {
    const newValidationState: ValidationState = {};
    let allValid = true;

    for (const [name, value] of Object.entries(formData)) {
      const result = validateField(name, value);
      newValidationState[name] = {
        isValid: result.isValid,
        touched: true,
        error: result.error,
      };

      if (!result.isValid) {
        allValid = false;
      }
    }

    setValidationState(newValidationState);
    setIsFormValid(allValid);

    return allValid;
  }, []);

  const getFieldValidation = useCallback(
    (name: string) => {
      return validationState[name] || { isValid: true, touched: false };
    },
    [validationState]
  );

  const clearValidation = useCallback(() => {
    setValidationState({});
    setIsFormValid(false);
  }, []);

  const markFieldAsTouched = useCallback((name: string) => {
    setValidationState((prev) => ({
      ...prev,
      [name]: {
        ...prev[name],
        touched: true,
      },
    }));
  }, []);

  return {
    validateSingleField,
    validateAllFields,
    getFieldValidation,
    clearValidation,
    markFieldAsTouched,
    isFormValid,
    validationState,
  };
}
