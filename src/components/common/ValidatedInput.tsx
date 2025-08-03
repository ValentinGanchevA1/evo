// Enhanced Input component with validation
// src/components/common/ValidatedInput.tsx
import React, { useState, useCallback } from 'react';
import { Input } from './Input';
import { ValidationUtils } from '@/utils/validation';
import { SecurityUtils } from '@/utils/security';

interface ValidatedInputProps {
  label?: string;
  placeholder?: string;
  value: string;
  onChangeText: (text: string) => void;
  validationType?: 'phone' | 'displayName' | 'code' | 'bio';
  required?: boolean;
  [key: string]: any;
}

export const ValidatedInput: React.FC<ValidatedInputProps> = ({
                                                                label,
                                                                placeholder,
                                                                value,
                                                                onChangeText,
                                                                validationType,
                                                                required = false,
                                                                ...props
                                                              }) => {
  const [error, setError] = useState<string | undefined>();

  const handleTextChange = useCallback((text: string) => {
    // Sanitize input
    const sanitized = SecurityUtils.sanitizeInput(text);

    // Validate based on type
    let validation = { isValid: true, message: undefined };

    if (required && !sanitized.trim()) {
      validation = { isValid: false, message: `${label || 'Field'} is required` };
    } else if (sanitized && validationType) {
      switch (validationType) {
        case 'phone':
          validation = ValidationUtils.validatePhoneNumber(sanitized);
          break;
        case 'displayName':
          validation = ValidationUtils.validateDisplayName(sanitized);
          break;
        case 'code':
          validation = ValidationUtils.validateVerificationCode(sanitized);
          break;
        case 'bio':
          validation = ValidationUtils.validateBio(sanitized);
          break;
      }
    }

    setError(validation.isValid ? undefined : validation.message);
    onChangeText(sanitized);
  }, [label, onChangeText, required, validationType]);

  return (
    <Input
      label={label}
      placeholder={placeholder}
      value={value}
      onChangeText={handleTextChange}
      error={error}
      {...props}
    />
  );
};
