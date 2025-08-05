// src/config/app.ts - ENVIRONMENT CONFIGURATION
interface AppConfig {
  API_BASE_URL: string;
  SOCKET_URL: string;
  APP_NAME: string;
  VERSION: string;
  FEATURES: {
    LOCATION_TRACKING: boolean;
    PUSH_NOTIFICATIONS: boolean;
    ANALYTICS: boolean;
  };
  LOCATION: {
    DEFAULT_RADIUS: number; // meters
    UPDATE_INTERVAL: number; // milliseconds
    HIGH_ACCURACY: boolean;
    TIMEOUT: number; // milliseconds
  };
}

const isDevelopment = __DEV__;

const developmentConfig: AppConfig = {
  API_BASE_URL: 'http://localhost:3000/api',
  SOCKET_URL: 'http://localhost:3000',
  APP_NAME: 'LocationApp Dev',
  VERSION: '1.0.0-dev',
  FEATURES: {
    LOCATION_TRACKING: true,
    PUSH_NOTIFICATIONS: false,
    ANALYTICS: false,
  },
  LOCATION: {
    DEFAULT_RADIUS: 1000,
    UPDATE_INTERVAL: 15000,
    HIGH_ACCURACY: true,
    TIMEOUT: 20000,
  },
};

const productionConfig: AppConfig = {
  API_BASE_URL: 'https://your-prod-api.com/api',
  SOCKET_URL: 'https://your-prod-api.com',
  APP_NAME: 'LocationApp',
  VERSION: '1.0.0',
  FEATURES: {
    LOCATION_TRACKING: true,
    PUSH_NOTIFICATIONS: true,
    ANALYTICS: true,
  },
  LOCATION: {
    DEFAULT_RADIUS: 1000,
    UPDATE_INTERVAL: 30000,
    HIGH_ACCURACY: true,
    TIMEOUT: 15000,
  },
};

export const AppConfig = isDevelopment ? developmentConfig : productionConfig;

// Constants
export const COLORS = {
  PRIMARY: '#007AFF',
  SECONDARY: '#6C7B7F',
  SUCCESS: '#28A745',
  DANGER: '#DC3545',
  WARNING: '#FFC107',
  INFO: '#17A2B8',
  LIGHT: '#F8F9FA',
  DARK: '#343A40',
  WHITE: '#FFFFFF',
  BLACK: '#000000',
  GRAY: '#6C757D',
} as const;

export const SPACING = {
  XS: 4,
  SM: 8,
  MD: 16,
  LG: 24,
  XL: 32,
  XXL: 48,
} as const;

export const TYPOGRAPHY = {
  SIZES: {
    XS: 12,
    SM: 14,
    MD: 16,
    LG: 18,
    XL: 20,
    XXL: 24,
    XXXL: 32,
  },
  WEIGHTS: {
    LIGHT: '300' as const,
    REGULAR: '400' as const,
    MEDIUM: '500' as const,
    SEMIBOLD: '600' as const,
    BOLD: '700' as const,
  },
} as const;
