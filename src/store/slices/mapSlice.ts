// src/store/slices/mapSlice.ts
import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import { Region } from 'react-native-maps';

// Types for map-specific data
interface NearbyUser {
  id: string;
  username: string;
  latitude: number;
  longitude: number;
  distance: number;
  profileImage?: string;
}

interface NearbyProduct {
  id: string;
  name: string;
  price: number;
  latitude: number;
  longitude: number;
  distance: number;
  imageUrl?: string;
}

interface MapState {
  region: Region | null;
  nearbyUsers: NearbyUser[];
  nearbyProducts: NearbyProduct[];
  isLoading: boolean;
  error: string | null;
}

const initialState: MapState = {
  region: null,
  nearbyUsers: [],
  nearbyProducts: [],
  isLoading: false,
  error: null,
};

// Async thunk for fetching nearby data
export const fetchNearbyData = createAsyncThunk(
  'map/fetchNearbyData',
  async (params: { latitude: number; longitude: number; radius: number }) => {
    // This would typically call your API
    // For now, return mock data
    return {
      users: [],
      products: []
    };
  }
);

const mapSlice = createSlice({
  name: 'map',
  initialState,
  reducers: {
    setMapRegion: (state, action: PayloadAction<Region>) => {
      state.region = action.payload;
    },
    clearMapError: (state) => {
      state.error = null;
    },
    resetMapState: () => initialState,
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchNearbyData.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(fetchNearbyData.fulfilled, (state, action) => {
        state.isLoading = false;
        state.nearbyUsers = action.payload.users;
        state.nearbyProducts = action.payload.products;
      })
      .addCase(fetchNearbyData.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.error.message || 'Failed to fetch nearby data';
      });
  },
});

export const { setMapRegion, clearMapError, resetMapState } = mapSlice.actions;
export default mapSlice.reducer;
