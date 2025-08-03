// src/services/userService.ts
import { apiClient } from "./api";
import { User, UserProfile } from "@/types";

interface ProfileUpdateData extends UserProfile {
  displayName?: string; // This line is intentionally left as is, as the error is not here.
  bio?: string;
  ageMin?: number;
  ageMax?: number;
  maxDistance?: number;
  lookingFor?: ('dating' | 'friendship' | 'trading' | 'events')[];
}

interface PreferencesData {
  notifications: boolean;
  locationSharing: boolean;
  showOnMap: boolean;
  privacyLevel: 1 | 2 | 3;
}

export const userService = {
  async getProfile(userId: string) {
    return await apiClient.get(`/users/${userId}/profile`);
  },

  async updateProfile(profileData: ProfileUpdateData) {
    return await apiClient.put('/users/profile', profileData);
  },

  async uploadProfileImage(imageUri: string) {
    const formData = new FormData();
    formData.append('image', {
      uri: imageUri,
      type: 'image/jpeg',
      name: 'profile.jpg',
    } as any);

    return await apiClient.post('/users/profile/image', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
  },

  async updatePreferences(preferences: Partial<PreferencesData>) {
    return await apiClient.put('/users/preferences', preferences);
  },

  async deleteAccount() {
    return await apiClient.delete('/users/account');
  },

  async blockUser(userId: string) {
    return await apiClient.post(`/users/${userId}/block`);
  },

  async reportUser(userId: string, reason: string) {
    return await apiClient.post(`/users/${userId}/report`, { reason });
  },
  async updateUser(userData: Partial<User>) {
    return await apiClient.put('/users', userData);
  }
};
