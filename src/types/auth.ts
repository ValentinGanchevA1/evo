// src/types/auth.ts
import { User } from './index';

export interface AuthState {
  isAuthenticated: boolean;
  user: User | null;
  token: string | null;
  loading: boolean;
  error: string | null;
}

export interface LoginCredentials {
  phoneNumber: string;
  verificationCode: string;
}

export interface SignupData {
  phoneNumber: string;
  displayName: string;
  dateOfBirth: Date;
}
