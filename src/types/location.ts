// src/types/location.ts
import { UserLocation } from "./index.ts";

export interface LocationState {
  currentLocation: userLocation | null;
  nearbyUsers: NearbyUser[];
  isTracking: boolean;
  lastUpdate: Date | null;
  error: string | null;
}

export interface NearbyUser {
  id: string;
  displayName: string;
  latitude: number;
  longitude: number;
  distance: number;
  lastSeen: Date;
  profileImage?: string;
}

export interface LocationPermission {
  granted: boolean;
  type: 'whenInUse' | 'always' | 'denied';
}
