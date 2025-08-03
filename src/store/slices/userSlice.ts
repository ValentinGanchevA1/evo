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

// =================================================================
// Slice
// =================================================================

const userSlice = createSlice({
  name: 'user',
  initialState,
  reducers: {
    // REFACTOR: Replaced `updateProfileField` with a more type-safe reducer.
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
      // Fulfilled states
      .addCase(
        fetchUserProfile.fulfilled,
        (state, action: PayloadAction<UserProfile>) => {
          state.profile = action.payload;
        },
      )
      .addCase(
        updateUserProfile.fulfilled,
        (state, action: PayloadAction<Partial<UserProfile>>) => {
          // FIX: Safely handles merging into a potentially null profile state.
          state.profile = { ...(state.profile || {}), ...action.payload } as UserProfile;
        },
      )
      .addCase(updatePreferences.fulfilled, (state, action) => {
        state.preferences = { ...state.preferences, ...action.payload };
      })

      // REFACTOR: Use `addMatcher` to handle common pending/rejected states concisely.
      .addMatcher(
        isAnyOf(fetchUserProfile.pending, updateUserProfile.pending),
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
        ),
        (state, action) => {
          state.loading = false;
          state.error = action.payload as string;
        },
      )
      // A final matcher to turn off loading for any fulfilled action.
      .addMatcher(
        isAnyOf(
          fetchUserProfile.fulfilled,
          updateUserProfile.fulfilled,
          updatePreferences.fulfilled,
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
