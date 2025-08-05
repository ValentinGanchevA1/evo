// src/store/slices/authSlice.ts
import {
  createSlice,
  createAsyncThunk,
  PayloadAction,
  isAnyOf,
} from '@reduxjs/toolkit';
import { AuthState, User, LoginCredentials, AuthResponse, RegistrationData } from "@/types";
import { authService } from '@/services/authService';
import { userService} from '@/services/userService';
import { uploadProfileImage } from '@/store/slices/userSlice';
import { RootState } from '@/store/store'; // GEN: Import RootState for thunk typing

// FIX: The initialState object was referenced but not defined.
const initialState: AuthState = {
  isAuthenticated: false,
  user: null,
  token: null,
  loading: false,
  error: null,
};

// =================================================================
// Types
// =================================================================

/**
 * REFACTOR: Standardized thunk configuration for consistent type safety.
 * This defines the shape of the `thunkAPI` object for all thunks in this slice.
 */
type AuthThunkConfig = {
  state: RootState;
  rejectValue: string;
};

// =================================================================
// Thunks
// =================================================================

export const sendVerificationCode = createAsyncThunk<
  { phoneNumber: string }, // Return type
  string, // Argument type
  AuthThunkConfig // Thunk config type
>(
  'auth/sendVerificationCode',
  async (phoneNumber, { rejectWithValue }) => {
    try {
      const response = await authService.sendVerificationCode(phoneNumber);
      if (response.success) {
        return { phoneNumber };
      }
      return rejectWithValue('Failed to send verification code.');
    } catch (error: any) {
      return rejectWithValue(error.message || 'An unknown error occurred.');
    }
  },
);

export const loginWithPhone = createAsyncThunk<
  AuthResponse, // REFACTOR: The AuthResponse type already includes isNewUser.
  LoginCredentials,
  AuthThunkConfig
>('auth/loginWithPhone', async (credentials, { rejectWithValue }) => {
  try {
    const response = await authService.loginWithPhone(credentials);
    return response.data;
  } catch (error: any) {
    return rejectWithValue(error.message || 'Login failed');
  }
});

export const registerUser = createAsyncThunk<
  AuthResponse,
  RegistrationData,
  AuthThunkConfig
>('auth/registerUser', async (credentials, { rejectWithValue }) => {
  try {
    const response = await authService.register(credentials);
    return response.data;
  } catch (error: any) {
    return rejectWithValue(error.message || 'Registration failed');
  }
});

export const updateCoreUser = createAsyncThunk<
  Partial<User>,
  Partial<User>,
  AuthThunkConfig
>('auth/updateCoreUser', async (userData, { rejectWithValue }) => {
  try {
    const response = await userService.updateUser(userData);
    return response.data;
  } catch (error: any) {
    return rejectWithValue(error.message || 'Failed to update user data');
  }
});

export const logout = createAsyncThunk<void, void, AuthThunkConfig>(
  'auth/logout',
  async (_, { rejectWithValue }) => {
    try {
      await authService.logout(); // Perform the API call
      return; // Explicitly return void on success
    } catch (error: any) {
      // Log the error but don't reject the thunk, as client-side state should still clear.
      console.error('Logout failed on server:', error);
      // We don't reject here because the client-side logout should always succeed.
    }
  },
);

// =================================================================
// Slice
// =================================================================

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    clearError: (state) => {
      state.error = null;
    },
    setUser: (state, action: PayloadAction<User>) => {
      state.user = action.payload;
    },
    setUserField: (state, action: PayloadAction<Partial<User>>) => {
      if (state.user) {
        state.user = { ...state.user, ...action.payload };
      }
    },
  },
  extraReducers: (builder) => {
    builder
      // Handle specific fulfilled cases
      .addCase(registerUser.fulfilled, (state, action) => {
        state.isAuthenticated = true;
        state.user = action.payload.user;
        state.token = action.payload.token;
      })
      .addCase(loginWithPhone.fulfilled, (state, action) => {
        state.isAuthenticated = true;
        state.user = action.payload.user;
        state.token = action.payload.token;
      })
      .addCase(updateCoreUser.fulfilled, (state, action) => {
        if (state.user) {
          state.user = { ...state.user, ...action.payload };
        }
      })
      .addCase(uploadProfileImage.fulfilled, (state, action) => {
        if (state.user && action.payload) {
          state.user.profileImage = action.payload;
        }
      })
      // REFACTOR: On logout, returning initialState is the most robust way to reset.
      .addCase(logout.fulfilled, () => initialState)

      // REFACTOR: Use `addMatcher` to handle common states for all thunks concisely.
      .addMatcher(
        isAnyOf(
          sendVerificationCode.pending,
          loginWithPhone.pending,
          registerUser.pending,
          updateCoreUser.pending,
          logout.pending, // GEN: Added logout to pending matcher
        ),
        (state) => {
          state.loading = true;
          state.error = null;
        },
      )
      .addMatcher(
        isAnyOf(
          sendVerificationCode.fulfilled,
          loginWithPhone.fulfilled,
          registerUser.fulfilled,
          updateCoreUser.fulfilled,
        ),
        (state) => {
          state.loading = false;
        },
      )
      .addMatcher(
        isAnyOf(
          sendVerificationCode.rejected,
          loginWithPhone.rejected,
          registerUser.rejected,
          updateCoreUser.rejected,
          logout.rejected, // GEN: Added logout to rejected matcher
        ),
        (state, action) => {
          state.loading = false;
          state.error = action.payload as string;
        },
      );
  },
});

export const { clearError, setUser, setUserField } = authSlice.actions;
export default authSlice.reducer;
