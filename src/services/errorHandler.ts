// src/services/errorHandler.ts - CENTRALIZED ERROR HANDLING
import { Alert } from 'react-native';

export interface AppError {
  code: string;
  message: string;
  stack?: string;
  context?: Record<string, any>;
}

export enum ErrorCodes {
  NETWORK_ERROR = 'NETWORK_ERROR',
  AUTH_ERROR = 'AUTH_ERROR',
  LOCATION_ERROR = 'LOCATION_ERROR',
  VALIDATION_ERROR = 'VALIDATION_ERROR',
  UNKNOWN_ERROR = 'UNKNOWN_ERROR',
}

class ErrorHandler {
  private static instance: ErrorHandler;

  static getInstance(): ErrorHandler {
    if (!ErrorHandler.instance) {
      ErrorHandler.instance = new ErrorHandler();
    }
    return ErrorHandler.instance;
  }

  /**
   * Handle and log errors consistently across the app
   */
  handleError(error: any, context?: string): AppError {
    const appError: AppError = this.normalizeError(error, context);

    // Log error (replace with your preferred logging service)
    console.error(`[${appError.code}] ${appError.message}`, {
      context: appError.context,
      stack: appError.stack,
    });

    // Report to crash analytics in production (e.g., Crashlytics)
    if (!__DEV__) {
      // TODO: Add crash reporting service
      // crashlytics().recordError(new Error(appError.message));
    }

    return appError;
  }

  /**
   * Show user-friendly error messages
   */
  showUserError(error: any, title: string = 'Error'): void {
    const appError = this.handleError(error);
    const userMessage = this.getUserFriendlyMessage(appError);

    Alert.alert(title, userMessage);
  }

  /**
   * Normalize different error types into consistent format
   */
  private normalizeError(error: any, context?: string): AppError {
    // Handle axios/network errors
    if (error.response) {
      return {
        code: ErrorCodes.NETWORK_ERROR,
        message: error.response.data?.message || error.message || 'Network error occurred',
        context: {
          status: error.response.status,
          url: error.config?.url,
          context
        },
        stack: error.stack,
      };
    }

    // Handle Auth errors
    if (error.message?.includes('auth') || error.code === 'auth/') {
      return {
        code: ErrorCodes.AUTH_ERROR,
        message: error.message || 'Authentication error',
        context: { context },
        stack: error.stack,
      };
    }

    // Handle location errors
    if (error.code >= 1 && error.code <= 5) { // Geolocation error codes
      return {
        code: ErrorCodes.LOCATION_ERROR,
        message: this.getLocationErrorMessage(error.code),
        context: { code: error.code, context },
        stack: error.stack,
      };
    }

    // Handle validation errors
    if (error.name === 'ValidationError') {
      return {
        code: ErrorCodes.VALIDATION_ERROR,
        message: error.message || 'Validation failed',
        context: { context },
        stack: error.stack,
      };
    }

    // Default error
    return {
      code: ErrorCodes.UNKNOWN_ERROR,
      message: error.message || 'An unexpected error occurred',
      context: { context },
      stack: error.stack,
    };
  }

  /**
   * Convert technical errors to user-friendly messages
   */
  private getUserFriendlyMessage(error: AppError): string {
    switch (error.code) {
      case ErrorCodes.NETWORK_ERROR:
        return 'Please check your internet connection and try again.';

      case ErrorCodes.AUTH_ERROR:
        return 'Please log in again to continue.';

      case ErrorCodes.LOCATION_ERROR:
        return 'Unable to access your location. Please check your location settings.';

      case ErrorCodes.VALIDATION_ERROR:
        return error.message; // Validation messages are usually user-friendly

      default:
        return 'Something went wrong. Please try again.';
    }
  }

  /**
   * Get specific location error messages
   */
  private getLocationErrorMessage(code: number): string {
    switch (code) {
      case 1: return 'Location access denied';
      case 2: return 'Location position unavailable';
      case 3: return 'Location request timeout';
      default: return 'Location error occurred';
    }
  }
}

export const errorHandler = ErrorHandler.getInstance();
