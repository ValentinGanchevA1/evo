// src/hooks/useLocation.ts
import { useState, useEffect, useCallback } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import Geolocation from '@react-native-community/geolocation';
import { AppDispatch, RootState } from '../store/store';
import  updateLocation  from '../store/slices/locationSlice';
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

    if (!permission.granted) return;

    const watchId = Geolocation.watchPosition(
      (position) => {
        const location: Omit<UserLocation, 'id' | 'userId'> = {
          latitude: position.coords.latitude,
          longitude: position.coords.longitude,
          accuracy: position.coords.accuracy,
          timestamp: new Date(),
          isCurrent: true,
        };
        dispatch(updateLocation(location));
      },
      (error) => console.error('Location error:', error),
      {
        enableHighAccuracy: true,
        distanceFilter: 10,
        interval: 15000,
        fastestInterval: 10000,
      }
    );

    return () => Geolocation.clearWatch(watchId);
  }, [dispatch]);

  return {
    ...locationState,
    permissions,
    startTracking,
  };
};
