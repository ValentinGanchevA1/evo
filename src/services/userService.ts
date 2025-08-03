import { User, UserProfile } from '@/types';

// REFACTOR: The service is now defined as a constant object, which is a more
// standard and correct pattern for a service module. This fixes syntax errors.
export const userService = {
  /**
   * Mock: Fetches a user's detailed profile information.
   * @param userId The ID of the user whose profile is being fetched.
   * @returns A promise that resolves with the user's profile data.
   */
  async getProfile(userId: string): Promise<{ data: UserProfile }> {
    console.log(`Fetching profile for user: ${userId}`);
    // Simulate API call
    return new Promise((resolve) => {
      setTimeout(() => {
        // FIX: The returned data now correctly matches the UserProfile type.
        resolve({
          data: {
            bio: 'This is a test user profile. I enjoy hiking and coding.',
            interests: ['React Native', 'TypeScript', 'Node.js'],
            lookingFor: ['friendship', 'trading'],
            ageMin: 25,
            ageMax: 35,
            maxDistance: 50,
          },
        });
      }, 500);
    });
  },

  /**
   * Mock: Updates a user's profile information.
   * @param profileData The partial profile data to update.
   * @returns A promise that resolves with the updated profile data.
   */
  async updateProfile(
    profileData: Partial<UserProfile>,
  ): Promise<{ data: Partial<UserProfile> }> {
    console.log('Updating profile with:', profileData);
    // Simulate API call
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve({ data: profileData });
      }, 500);
    });
  },

  /**
   * Mock: Updates a user's preferences.
   * @param preferences The partial preferences data to update.
   * @returns A promise that resolves with the updated preferences.
   */
  async updatePreferences(
    preferences: Partial<{
      notifications: boolean;
      locationSharing: boolean;
      showOnMap: boolean;
      privacyLevel: 1 | 2 | 3;
    }>,
  ): Promise<{ data: typeof preferences }> {
    console.log('Updating preferences with:', preferences);
    // Simulate API call
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve({ data: preferences });
      }, 500);
    });
  },

  /**
   * Mock: Updates top-level fields on the core User object.
   * This would be used by a thunk in authSlice to update fields like displayName.
   * @param userData The partial user data to update.
   * @returns A promise that resolves with the updated user data.
   */
  async updateUser(userData: Partial<User>): Promise<{ data: Partial<User> }> {
    console.log('Updating user with:', userData);
    // Simulate API call
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve({ data: userData });
      }, 500);
    });
  },

  /**
   * Mock: Uploads a user's profile image.
   * @param imageUri The local URI of the image to upload.
   * @returns A promise that resolves with the new public URL of the image.
   */
  async uploadProfileImage(
    imageUri: string,
  ): Promise<{ data: { imageUrl: string } }> {
    console.log('Uploading image from:', imageUri);
    // In a real app, this would involve FormData and a multipart request.
    return new Promise((resolve) => {
      setTimeout(() => {
        // Return a new placeholder URL.
        resolve({ data: { imageUrl: 'https://via.placeholder.com/150/new' } });
      }, 1000);
    });
  },
};
