// src/hooks/useLocationManager.ts
import { useState, useEffect, useCallback } from 'react';
import { Region } from 'react-native-maps';
import { User } from '@/types';
import { AppDispatch } from '@/store/store';
import { requestLocationPermission } from '@/utils/permissions';
import { locationService } from '@/services/locationService';

interface LocationManagerState {
  region: Region | null;
  isInitializing: boolean;
  locationError: Error | null;
}

export const useLocationManager = (user: User | null, dispatch: AppDispatch) => {
  const [state, setState] = useState<LocationManagerState>({
    region: null,
    isInitializing: true,
    locationError: null,
  });

  const setRegion = useCallback((newRegion: Region) => {
    setState(prev => ({ ...prev, region: newRegion }));
  }, []);

  // Initialize location on mount
  useEffect(() => {
    const initializeLocation = async () => {
      if (!user) {
        setState(prev => ({
          ...prev,
          isInitializing: false,
          locationError: new Error('User not authenticated')
        }));
        return;
      }

      try {
        // Request location permission
        const permission = await requestLocationPermission();

        if (!permission.granted) {
          throw new Error('Location permission denied');
        }

        // Get current location
        const location = await locationService.getCurrentLocation();

        const initialRegion: Region = {
          latitude: location.latitude,
          longitude: location.longitude,
          latitudeDelta: 0.01,
          longitudeDelta: 0.01,
        };

        setState({
          region: initialRegion,
          isInitializing: false,
          locationError: null,
        });

      } catch (error) {
        setState({
          region: null,
          isInitializing: false,
          locationError: error as Error,
        });
      }
    };

    initializeLocation();
  }, [user]);

  return {
    ...state,
    setRegion,
  };
};
