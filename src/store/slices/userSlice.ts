// src/store/slices/userSlice.ts
import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import { User, UserProfile } from "@/types";
import { userService } from "@/services/userService.ts";

interface UserState {
  profile: UserProfile | null;
  preferences: {
    notifications: boolean;
    locationSharing: boolean;
    showOnMap: boolean;
    privacyLevel: 1 | 2 | 3;
  };
  loading: boolean;
  error: string | null;
}

const initialState: UserState = {
  profile: null,
  preferences: {
    notifications: true,
    locationSharing: true,
    showOnMap: true,
    privacyLevel: 1,
  },
  loading: false,
  error: null,
};

// Async thunks
export const fetchUserProfile = createAsyncThunk(
  'user/fetchUserProfile',
  async (userId: string) => {
    const response = await userService.getProfile(userId);
    return response.data;
  }
);

export const updateUserProfile = createAsyncThunk(
  'user/updateUserProfile',
  async (profileData: Partial<UserProfile>) => {
    const response = await userService.updateProfile(profileData);
    return response.data;
  }
);

export const uploadProfileImage = createAsyncThunk(
  'user/uploadProfileImage',
  async (imageUri: string) => {
    const response = await userService.uploadProfileImage(imageUri);
    return response.data;
  }
);

export const updatePreferences = createAsyncThunk(
  'user/updatePreferences',
  async (preferences: Partial<UserState['preferences']>) => {
    const response = await userService.updatePreferences(preferences);
    return response.data;
  }
);

const userSlice = createSlice({
  name: 'user',
  initialState,
  reducers: {
    setProfile: (state, action: PayloadAction<UserProfile>) => {
      state.profile = action.payload;
      state.error = null;
    },
    updateProfileField: (state, action: PayloadAction<{field: keyof UserProfile; value: any}>) => {
      if (state.profile) {
        (state.profile as any)[action.payload.field] = action.payload.value;
      }
    },
    setPreferences: (state, action: PayloadAction<Partial<UserState['preferences']>>) => {
      state.preferences = { ...state.preferences, ...action.payload };
    },
    clearUserError: (state) => {
      state.error = null;
    },
    resetUserState: (state) => {
      state.profile = null;
      state.preferences = initialState.preferences;
      state.loading = false;
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      // Fetch user profile
      .addCase(fetchUserProfile.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchUserProfile.fulfilled, (state, action) => {
        state.loading = false;
        state.profile = action.payload;
      })
      .addCase(fetchUserProfile.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || 'Failed to fetch profile';
      })
      // Update user profile
      .addCase(updateUserProfile.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(updateUserProfile.fulfilled, (state, action) => {
        state.loading = false;
        state.profile = { ...state.profile, ...action.payload };
      })
      .addCase(updateUserProfile.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || 'Failed to update profile';
      })
      // Upload profile image
      .addCase(uploadProfileImage.pending, (state) => {
        state.loading = true;
      })
      .addCase(uploadProfileImage.fulfilled, (state, action) => {
        state.loading = false;
        if (state.profile) {
          // Assuming the response contains the image URL
          state.profile.profileImage = action.payload.imageUrl;
        }
      })
      .addCase(uploadProfileImage.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || 'Failed to upload image';
      })
      // Update preferences
      .addCase(updatePreferences.fulfilled, (state, action) => {
        state.preferences = { ...state.preferences, ...action.payload };
      })
      .addCase(updatePreferences.rejected, (state, action) => {
        state.error = action.error.message || 'Failed to update preferences';
      });
  },
});

export const {
  setProfile,
  updateProfileField,
  setPreferences,
  clearUserError,
  resetUserState,
} = userSlice.actions;

export default userSlice.reducer;
