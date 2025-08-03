// src/store/slices/locationSlice.ts
import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import { LocationState, UserLocation, NearbyUser } from "../../types";
import { locationService } from '../../services/locationService';

const initialState: LocationState = {
  currentLocation: null,
  nearbyUsers: [],
  isTracking: false,
  lastUpdate: null,
  error: null,
};

// Async thunks
export const updateLocationOnServer = createAsyncThunk(
  'location/updateLocationOnServer',
  async (location: Omit<UserLocation, 'id' | 'userId'>) => {
    const response = await locationService.updateLocation(location);
    return response.data;
  }
);

export const fetchNearbyUsers = createAsyncThunk(
  'location/fetchNearbyUsers',
  async (params: { latitude: number; longitude: number; radius: number }) => {
    const response = await locationService.getNearbyUsers(params);
    return response.data;
  }
);

export const startLocationTracking = createAsyncThunk(
  'location/startLocationTracking',
  async (_, { dispatch }) => {
    await locationService.startTracking((location) => {
      dispatch(updateLocation(location));
      dispatch(updateLocationOnServer(location));
    });
    return true;
  }
);

const locationSlice = createSlice({
  name: 'location',
  initialState,
  reducers: {
    updateLocation: (state, action: PayloadAction<Omit<UserLocation, 'id' | 'userId'>>) => {
      state.currentLocation = {
        id: Date.now().toString(),
        userId: '', // Will be set by middleware
        ...action.payload,
      };
      state.lastUpdate = new Date();
      state.error = null;
    },
    setTracking: (state, action: PayloadAction<boolean>) => {
      state.isTracking = action.payload;
    },
    setNearbyUsers: (state, action: PayloadAction<NearbyUser[]>) => {
      state.nearbyUsers = action.payload;
    },
    clearLocationError: (state) => {
      state.error = null;
    },
    stopTracking: (state) => {
      state.isTracking = false;
      state.currentLocation = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(updateLocationOnServer.pending, (state) => {
        state.error = null;
      })
      .addCase(updateLocationOnServer.fulfilled, (state) => {
        // Location updated successfully
      })
      .addCase(updateLocationOnServer.rejected, (state, action) => {
        state.error = action.error.message || 'Failed to update location';
      })
      .addCase(fetchNearbyUsers.fulfilled, (state, action) => {
        state.nearbyUsers = action.payload;
      })
      .addCase(fetchNearbyUsers.rejected, (state, action) => {
        state.error = action.error.message || 'Failed to fetch nearby users';
      })
      .addCase(startLocationTracking.fulfilled, (state) => {
        state.isTracking = true;
      })
      .addCase(startLocationTracking.rejected, (state, action) => {
        state.error = action.error.message || 'Failed to start location tracking';
        state.isTracking = false;
      });
  },
});

export const {
  updateLocation,
  setTracking,
  setNearbyUsers,
  clearLocationError,
  stopTracking,
} = locationSlice.actions;

export default locationSlice.reducer;
