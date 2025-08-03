// src/store/slices/authSlice.ts
import {
  createSlice,
  createAsyncThunk,
  PayloadAction,
  isAnyOf,
} from '@reduxjs/toolkit';
import { AuthState, User, LoginCredentials, AuthResponseData } from '@/types';
import { authService } from '@/services/authService';
import { userService } from '@/services/userService';
// FIX: Use a named import for the thunk, not a default import.
import { uploadProfileImage } from '@/store/slices/userSlice';

interface ThunkActionConfig {
  rejectWithValue: (value: string) => any;
  state: { auth: AuthState };
}
const initialState: AuthState = {
  isAuthenticated: false,
  user: null,
  token: null,
  loading: false,
  error: null,
};

// =================================================================
// Thunks
// =============================t the import path accordingly

export const sendVerificationCode = createAsyncThunk<
  { phoneNumber: string },
  string,
  ThunkActionConfig
>(
  'auth/sendVerificationCode',
  async (phoneNumber: string, { rejectWithValue }) => {
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
  // pass the config
  { rejectWithValue, state: { auth: initialState } }
);


// REFACTOR: The login thunk is now correctly implemented.
// It accepts the verification code and calls the correct service method.
export const loginWithPhone = createAsyncThunk<
  AuthResponseData & { isNewUser?: boolean },
  LoginCredentials,
  { rejectWithValue: (value: string) => any }
>('auth/loginWithPhone', async (credentials, { rejectWithValue }) => {
  try {
    const response = await authService.loginWithPhone(credentials);
    return response.data;
  } catch (error: any) {
    return rejectWithValue(error.message || 'Login failed');
  }
});



export const updateCoreUser = createAsyncThunk(
  'auth/updateCoreUser',
  async (userData: Partial<User>, { rejectWithValue }) => {
    try {
      const response = await userService.updateUser(userData);
      return response.data;
    } catch (error: any) {
      return rejectWithValue(error.message || 'Failed to update user data');
    }
  },
);

export const logout = createAsyncThunk('auth/logout', async () => {
  await authService.logout();
});

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
      // Handle successful login
      .addCase(loginWithPhone.fulfilled, (state, action) => {
        state.isAuthenticated = true;
        state.user = action.payload.user;
        state.token = action.payload.token;
      })
      // Handle successful core user update
      .addCase(
        updateCoreUser.fulfilled,
        (state, action: PayloadAction<Partial<User>>) => {
          if (state.user) {
            state.user = { ...state.user, ...action.payload };
          }
        },
      )
      // Handle image upload from userSlice
      .addCase(uploadProfileImage.fulfilled, (state, action) => {
        if (state.user && action.payload) {
          state.user.profileImage = action.payload;
        }
      })
      // Handle logout
      .addCase(logout.fulfilled, (state) => {
        Object.assign(state, initialState, { isAuthenticated: false, loading: false });
      })
      // Use `addMatcher` to handle common cases for all auth thunks.
      .addMatcher(
        isAnyOf(
          sendVerificationCode.pending,
          loginWithPhone.pending,
          updateCoreUser.pending,
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
          updateCoreUser.rejected,
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
