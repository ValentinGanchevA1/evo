// src/store/slices/mapSlice.ts - FIXED VERSION
import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import { Region } from 'react-native-maps';
import { NearbyUser } from '@/types'; // Import from types
import { RootState } from '@/store/store';

// Types for map-specific data
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

// Thunk configuration for type safety
type MapThunkConfig = {
  state: RootState;
  rejectValue: string;
};

// FIXED: Enhanced thunk with proper error handling and type safety
export const fetchNearbyData = createAsyncThunk<
  { users: NearbyUser[]; products: NearbyProduct[] },
  { latitude: number; longitude: number; radius: number },
  MapThunkConfig
>(
  'map/fetchNearbyData',
  async (params, { rejectWithValue }) => {
    try {
      // TODO: Replace with actual API calls
      // const [usersResponse, productsResponse] = await Promise.all([
      //   apiClient.get('/map/nearby-users', { params }),
      //   apiClient.get('/map/nearby-products', { params })
      // ]);

      // Mock data for development
      const mockUsers: NearbyUser[] = [
        {
          id: '1',
          displayName: 'John Doe',
          latitude: params.latitude + 0.001,
          longitude: params.longitude + 0.001,
          distance: 100,
          lastSeen: new Date(),
          profileImage: undefined
        }
      ];

      const mockProducts: NearbyProduct[] = [
        {
          id: '1',
          name: 'Sample Product',
          price: 29.99,
          latitude: params.latitude - 0.001,
          longitude: params.longitude - 0.001,
          distance: 150,
          imageUrl: undefined
        }
      ];

      return {
        users: mockUsers,
        products: mockProducts
      };
    } catch (error: any) {
      return rejectWithValue(error.message || 'Failed to fetch nearby data');
    }
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
    // ADDED: Action to manually set nearby users (for real-time updates)
    updateNearbyUsers: (state, action: PayloadAction<NearbyUser[]>) => {
      state.nearbyUsers = action.payload;
    },
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
        state.error = action.payload || 'Unknown error occurred';
      });
  },
});

export const {
  setMapRegion,
  clearMapError,
  resetMapState,
  updateNearbyUsers
} = mapSlice.actions;

export default mapSlice.reducer;
