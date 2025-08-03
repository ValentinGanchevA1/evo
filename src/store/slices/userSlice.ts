// src/store/slices/userSlice.ts
import {
  createSlice,
  createAsyncThunk,
  PayloadAction,
  isAnyOf,
} from '@reduxjs/toolkit';
import { UserProfile } from '@/types';
import { userService } from '@/services/userService';
import { RootState } from '@/store/store';

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

// =================================================================
// Thunks
// =================================================================

export const fetchUserProfile = createAsyncThunk<
  UserProfile,
  void,
  { state: RootState }
>('user/fetchUserProfile', async (_, { getState, rejectWithValue }) => {
  const userId = getState().auth.user?.id;
  if (!userId) {
    return rejectWithValue('User not authenticated');
  }
  try {
    const response = await userService.getProfile(userId);
    return response.data;
  } catch (error: any) {
    return rejectWithValue(error.message || 'Failed to fetch profile');
  }
});

export const updateUserProfile = createAsyncThunk(
  'user/updateUserProfile',
  async (profileData: Partial<UserProfile>, { rejectWithValue }) => {
    try {
      const response = await userService.updateProfile(profileData);
      return response.data;
    } catch (error: any) {
      return rejectWithValue(error.message || 'Failed to update profile');
    }
  },
);

export const updatePreferences = createAsyncThunk(
  'user/updatePreferences',
  async (
    preferences: Partial<UserState['preferences']>,
    { rejectWithValue },
  ) => {
    try {
      const response = await userService.updatePreferences(preferences);
      return response.data;
    } catch (error: any) {
      return rejectWithValue(error.message || 'Failed to update preferences');
    }
  },
);

// GEN: Add a dedicated thunk for uploading the profile image.
// This encapsulates the API call and provides clear pending/fulfilled/rejected states.
export const uploadProfileImage = createAsyncThunk(
  'user/uploadProfileImage',
  async (imageUri: string, { rejectWithValue }) => {
    try {
      const response = await userService.uploadProfileImage(imageUri);
      // The returned URL will be the action payload.
      return response.data.imageUrl;
    } catch (error: any) {
      return rejectWithValue(error.message || 'Failed to upload image');
    }
  },
);


// =================================================================
// Slice
// =================================================================

const userSlice = createSlice({
  name: 'user',
  initialState,
  reducers: {
    updateLocalProfile: (state, action: PayloadAction<Partial<UserProfile>>) => {
      if (state.profile) {
        state.profile = { ...state.profile, ...action.payload };
      } else {
        state.profile = action.payload as UserProfile;
      }
    },
    setPreferences: (
      state,
      action: PayloadAction<Partial<UserState['preferences']>>,
    ) => {
      state.preferences = { ...state.preferences, ...action.payload };
    },
    clearUserError: (state) => {
      state.error = null;
    },
    resetUserState: () => initialState,
  },
  extraReducers: (builder) => {
    builder
      .addCase(
        fetchUserProfile.fulfilled,
        (state, action: PayloadAction<UserProfile>) => {
          state.profile = action.payload;
        },
      )
      .addCase(
        updateUserProfile.fulfilled,
        (state, action: PayloadAction<Partial<UserProfile>>) => {
          state.profile = { ...(state.profile || {}), ...action.payload } as UserProfile;
        },
      )
      .addCase(updatePreferences.fulfilled, (state, action) => {
        state.preferences = { ...state.preferences, ...action.payload };
      })
      .addMatcher(
        isAnyOf(fetchUserProfile.pending, updateUserProfile.pending, uploadProfileImage.pending),
        (state) => {
          state.loading = true;
          state.error = null;
        },
      )
      .addMatcher(
        isAnyOf(
          fetchUserProfile.rejected,
          updateUserProfile.rejected,
          updatePreferences.rejected,
          uploadProfileImage.rejected,
        ),
        (state, action) => {
          state.loading = false;
          state.error = action.payload as string;
        },
      )
      .addMatcher(
        isAnyOf(
          fetchUserProfile.fulfilled,
          updateUserProfile.fulfilled,
          updatePreferences.fulfilled,
          uploadProfileImage.fulfilled,
        ),
        (state) => {
          state.loading = false;
        },
      );
  },
});

export const {
  updateLocalProfile,
  setPreferences,
  clearUserError,
  resetUserState,
} = userSlice.actions;

export default userSlice.reducer;

// FIX: Removed invalid and erroneous class export.
// export class updateUser { ... }
