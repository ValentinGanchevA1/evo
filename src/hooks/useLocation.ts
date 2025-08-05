// src/hooks/useLocation.ts - FIXED VERSION
import { useState, useEffect, useCallback } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { AppDispatch, RootState } from '../store/store';
import {
  updateCurrentLocation,
  startLocationTracking,
  stopLocationTracking,
  fetchNearbyUsers
} from '../store/slices/locationSlice';
import { UserLocation, LocationPermission } from "@/types";
import { requestLocationPermission } from '../utils/permissions';

export const useLocation = () => {
  const dispatch = useDispatch<AppDispatch>();
  const locationState = useSelector((state: RootState) => state.location);

  const [permissions, setPermissions] = useState<LocationPermission>({
    granted: false,
    type: 'denied'
  });

  const startTracking = useCallback(async () => {
    const permission = await requestLocationPermission();
    setPermissions(permission);

    if (!permission.granted) {
      console.warn('Location permission denied');
      return;
    }

    try {
      // Use the proper thunk from locationSlice
      await dispatch(startLocationTracking()).unwrap();
    } catch (error) {
      console.error('Failed to start location tracking:', error);
    }
  }, [dispatch]);

  const stopTracking = useCallback(() => {
    dispatch(stopLocationTracking());
  }, [dispatch]);

  const refreshNearbyUsers = useCallback(async (
    latitude: number,
    longitude: number,
    radius: number = 1000
  ) => {
    if (!permissions.granted) return;

    try {
      await dispatch(fetchNearbyUsers({ latitude, longitude, radius })).unwrap();
    } catch (error) {
      console.error('Failed to fetch nearby users:', error);
    }
  }, [dispatch, permissions.granted]);

  return {
    ...locationState,
    permissions,
    startTracking,
    stopTracking,
    refreshNearbyUsers,
  };
};
