// src/store/slices/locationSlice.ts
import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import { LocationState, UserLocation, NearbyUser } from "@/types";
import { locationService } from "@/services/locationService";
import { RootState } from '@/store/store';

const initialState: LocationState = {
  currentLocation: null,
  nearbyUsers: [],
  isTracking: false,
  lastUpdate: null,
  error: null,
};

/**
 * GEN: Standardized thunk configuration for consistent type safety.
 */
type LocationThunkConfig = {
  state: RootState;
  rejectValue: string;
};

// =================================================================
// Thunks
// =================================================================

// FIX: Corrected the service method call and return type.
export const updateLocationOnServer = createAsyncThunk<
  Omit<UserLocation, 'id' | 'userId'>,
  Omit<UserLocation, 'id' | 'userId'>,
  LocationThunkConfig
>(
  'location/updateLocationOnServer',
  async (location, { rejectWithValue }) => {
    try {
      await locationService.updateLocationOnServer(location);
      return location; // Pass location through for potential optimistic updates
    } catch (error: any) {
      return rejectWithValue(error.message || 'Failed to update location on server');
    }
  },
);

// FIX: Correctly handle the data returned from the service.
export const fetchNearbyUsers = createAsyncThunk<
  NearbyUser[],
  { latitude: number; longitude: number; radius: number },
  LocationThunkConfig
>(
  'location/fetchNearbyUsers',
  async (params, { rejectWithValue }) => {
    try {
      // The service now correctly returns the array directly.
      return await locationService.getNearbyUsers(params);
    } catch (error: any) {
      return rejectWithValue(error.message || 'Failed to fetch nearby users');
    }
  },
);

// REFACTOR: Clarified the purpose of this thunk is to initiate the watch process.
export const startLocationTracking = createAsyncThunk<void, void, { dispatch: Function }>(
  'location/startLocationTracking',
  async (_, { dispatch, rejectWithValue }) => {
    try {
      locationService.startTracking((location) => {
        // 1. Update local state immediately for a responsive UI.
        dispatch(updateCurrentLocation(location));
        // 2. Send update to the server in the background.
        dispatch(updateLocationOnServer(location));
      });
    } catch (error: any) {
      return rejectWithValue('Could not start location tracking.');
    }
  },
);

// GEN: Create a thunk to properly stop the location service watcher.
export const stopLocationTracking = createAsyncThunk<void, void, LocationThunkConfig>(
  'location/stopLocationTracking',
  async () => {
    locationService.stopTracking();
  },
);

const locationSlice = createSlice({
  name: 'location',
  initialState,
  reducers: {
    // REFACTOR: Renamed for clarity and simplified to match state shape.
    updateCurrentLocation: (
      state,
      action: PayloadAction<Omit<UserLocation, "id" | "userId">>
    ) => {
      state.currentLocation = action.payload;
      state.lastUpdate = new Date();
      state.error = null;
    },
    clearLocationError: (state) => {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      // Tracking Lifecycle
      .addCase(startLocationTracking.pending, (state) => {
        state.isTracking = true;
        state.error = null;
      })
      .addCase(startLocationTracking.rejected, (state, action) => {
        state.isTracking = false;
        // FIX: Use action.payload for errors from rejectWithValue.
        state.error = action.payload as string;
      })
      .addCase(stopLocationTracking.fulfilled, (state) => {
        state.isTracking = false;
        state.currentLocation = null;
      })
      // Nearby Users Lifecycle
      .addCase(fetchNearbyUsers.fulfilled, (state, action) => {
        state.nearbyUsers = action.payload;
      })
      .addCase(fetchNearbyUsers.rejected, (state, action) => {
        state.error = action.payload as string;
      })
      // Server Update Lifecycle (for background syncs)
      .addCase(updateLocationOnServer.rejected, (state, action) => {
        // Note: We might not want to show a blocking error for a background sync failure.
        console.warn('Background location sync failed:', action.payload);
        state.error = action.payload as string;
      });
  },
});

export const {
  updateCurrentLocation,
  clearLocationError,
} = locationSlice.actions;

export default locationSlice.reducer;
