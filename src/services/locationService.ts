// src/services/locationService.ts
import Geolocation from '@react-native-community/geolocation';
import { apiClient } from './api';
import { socketService } from './socketService';
import { UserLocation, NearbyUser } from "@/types";

interface LocationUpdateCallback {
  (location: Omit<UserLocation, 'id' | 'userId'>): void;
}

interface LocationServiceConfig {
  enableHighAccuracy: boolean;
  distanceFilter: number;
  interval: number;
  fastestInterval: number;
}

class LocationService {
  private watchId: number | null = null;
  private isTracking = false;
  private config: LocationServiceConfig = {
    enableHighAccuracy: true,
    distanceFilter: 10, // meters
    interval: 15000, // 15 seconds
    fastestInterval: 10000, // 10 seconds
  };

  // Start location tracking
  async startTracking(callback: LocationUpdateCallback): Promise<void> {
    if (this.isTracking) {
      return;
    }

    return new Promise((resolve, reject) => {
      this.watchId = Geolocation.watchPosition(
        (position) => {
          const location: Omit<UserLocation, 'id' | 'userId'> = {
            latitude: position.coords.latitude,
            longitude: position.coords.longitude,
            accuracy: position.coords.accuracy,
            timestamp: new Date(),
            isCurrent: true,
          };

          callback(location);
          this.isTracking = true;
          resolve();
        },
        (error) => {
          console.error('Location tracking error:', error);
          this.isTracking = false;
          reject(new Error(`Location error: ${error.message}`));
        },
        {
          enableHighAccuracy: this.config.enableHighAccuracy,
          distanceFilter: this.config.distanceFilter,
          interval: this.config.interval,
          fastestInterval: this.config.fastestInterval,
          timeout: 20000,
          maximumAge: 10000,
        }
      );
    });
  }

  // Stop location tracking
  stopTracking(): void {
    if (this.watchId !== null) {
      Geolocation.clearWatch(this.watchId);
      this.watchId = null;
    }
    this.isTracking = false;
  }

  // Get current location once
  async getCurrentLocation(): Promise<Omit<UserLocation, 'id' | 'userId'>> {
    return new Promise((resolve, reject) => {
      Geolocation.getCurrentPosition(
        (position) => {
          resolve({
            latitude: position.coords.latitude,
            longitude: position.coords.longitude,
            accuracy: position.coords.accuracy,
            timestamp: new Date(),
            isCurrent: true,
          });
        },
        (error) => {
          reject(new Error(`Location error: ${error.message}`));
        },
        {
          enableHighAccuracy: true,
          timeout: 15000,
          maximumAge: 10000,
        }
      );
    });
  }

  // API Methods
  async updateLocation(location: Omit<UserLocation, 'id' | 'userId'>) {
    try {
      const response = await apiClient.post('/location/update', location);

      // Emit real-time location update
      socketService.emit('location-update', location);

      return response;
    } catch (error) {
      console.error('Failed to update location:', error);
      throw error;
    }
  }

  async getNearbyUsers(params: {
    latitude: number;
    longitude: number;
    radius: number;
  }) {
    try {
      const response = await apiClient.get('/location/nearby', { params });
      return response;
    } catch (error) {
      console.error('Failed to fetch nearby users:', error);
      throw error;
    }
  }

  async getUserLocationHistory(userId: string, limit = 50) {
    try {
      const response = await apiClient.get(`/location/history/${userId}`, {
        params: { limit }
      });
      return response;
    } catch (error) {
      console.error('Failed to fetch location history:', error);
      throw error;
    }
  }

  // Real-time location updates
  subscribeToLocationUpdates(callback: (data: any) => void) {
    socketService.on('nearby-user-update', callback);
    socketService.on('user-location-changed', callback);
  }

  unsubscribeFromLocationUpdates() {
    socketService.off('nearby-user-update');
    socketService.off('user-location-changed');
  }

  // Utility methods
  calculateDistance(
    lat1: number,
    lon1: number,
    lat2: number,
    lon2: number
  ): number {
    const R = 6371e3; // Earth's radius in meters
    const φ1 = (lat1 * Math.PI) / 180;
    const φ2 = (lat2 * Math.PI) / 180;
    const Δφ = ((lat2 - lat1) * Math.PI) / 180;
    const Δλ = ((lon2 - lon1) * Math.PI) / 180;

    const a =
      Math.sin(Δφ / 2) * Math.sin(Δφ / 2) +
      Math.cos(φ1) * Math.cos(φ2) * Math.sin(Δλ / 2) * Math.sin(Δλ / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));

    return R * c; // Distance in meters
  }

  isWithinRadius(
    userLat: number,
    userLon: number,
    targetLat: number,
    targetLon: number,
    radiusMeters: number
  ): boolean {
    const distance = this.calculateDistance(userLat, userLon, targetLat, targetLon);
    return distance <= radiusMeters;
  }

  // Background location handling
  async enableBackgroundLocation(): Promise<boolean> {
    // Implementation depends on platform-specific background location setup
    // This would involve configuring background tasks
    try {
      // Configure background location updates
      // Platform-specific implementation needed
      return true;
    } catch (error) {
      console.error('Failed to enable background location:', error);
      return false;
    }
  }

  // Location privacy and filtering
  async updateLocationPrivacy(settings: {
    showOnMap: boolean;
    maxDistance: number;
    allowedUsers?: string[];
  }) {
    try {
      const response = await apiClient.post('/location/privacy', settings);
      return response;
    } catch (error) {
      console.error('Failed to update location privacy:', error);
      throw error;
    }
  }

  // Geofencing
  async createGeofence(params: {
    latitude: number;
    longitude: number;
    radius: number;
    name: string;
  }) {
    try {
      const response = await apiClient.post('/location/geofence', params);
      return response;
    } catch (error) {
      console.error('Failed to create geofence:', error);
      throw error;
    }
  }

  // Configuration
  updateConfig(newConfig: Partial<LocationServiceConfig>): void {
    this.config = { ...this.config, ...newConfig };

    // Restart tracking with new config if currently tracking
    if (this.isTracking) {
      this.stopTracking();
      // Note: You'd need to restart with the stored callback
    }
  }

  getConfig(): LocationServiceConfig {
    return { ...this.config };
  }

  // Status methods
  isCurrentlyTracking(): boolean {
    return this.isTracking;
  }

  getWatchId(): number | null {
    return this.watchId;
  }
}

export const locationService = new LocationService();
