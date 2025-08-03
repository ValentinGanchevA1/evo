// src/utils/validation.ts - CREATE THIS FILE
export class ValidationUtils {
  static validatePhoneNumber(phone: string): { isValid: boolean; message?: string } {
    const cleaned = phone.replace(/\s+/g, '');

    // Check if it starts with +
    if (!cleaned.startsWith('+')) {
      return { isValid: false, message: 'Phone number must include country code (+)' };
    }

    // Check length (7-15 digits after country code)
    const numbers = cleaned.slice(1);
    if (!/^\d{7,15}$/.test(numbers)) {
      return { isValid: false, message: 'Invalid phone number format' };
    }

    return { isValid: true };
  }

  static validateDisplayName(name: string): { isValid: boolean; message?: string } {
    if (!name.trim()) {
      return { isValid: false, message: 'Display name is required' };
    }

    if (name.length < 2) {
      return { isValid: false, message: 'Display name must be at least 2 characters' };
    }

    if (name.length > 50) {
      return { isValid: false, message: 'Display name must be less than 50 characters' };
    }

    // Allow letters, numbers, spaces, and common symbols
    if (!/^[a-zA-Z0-9\s\-_.]+$/.test(name)) {
      return { isValid: false, message: 'Display name contains invalid characters' };
    }

    return { isValid: true };
  }

  static validateVerificationCode(code: string): { isValid: boolean; message?: string } {
    if (!/^\d{6}$/.test(code)) {
      return { isValid: false, message: 'Verification code must be 6 digits' };
    }

    return { isValid: true };
  }

  static validateBio(bio: string): { isValid: boolean; message?: string } {
    if (bio.length > 200) {
      return { isValid: false, message: 'Bio must be less than 200 characters' };
    }

    return { isValid: true };
  }
}
