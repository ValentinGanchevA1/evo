// src/services/authService.ts - FIXED VERSION
import { apiClient } from './api';
import { LoginCredentials, SignupData, AuthResponse } from '@/types';

export const authService = {
  async sendVerificationCode(phoneNumber: string): Promise<{ success: boolean }> {
    const response = await apiClient.post('/auth/send-code', { phoneNumber });
    return response.data;
  },

  // FIXED: Return consistent AuthResponse interface
  async loginWithPhone(credentials: LoginCredentials): Promise<{ data: AuthResponse }> {
    const response = await apiClient.post<AuthResponse>('/auth/login', credentials);
    return { data: response.data };
  },

  // FIXED: Return consistent AuthResponse interface
  async signup(userData: SignupData): Promise<{ data: AuthResponse }> {
    const response = await apiClient.post<AuthResponse>('/auth/signup', userData);
    return { data: response.data };
  },

  async logout(): Promise<void> {
    await apiClient.post('/auth/logout');
  },

  async refreshToken(): Promise<{ token: string }> {
    const response = await apiClient.post('/auth/refresh');
    return response.data;
  },
};
