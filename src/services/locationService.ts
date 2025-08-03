// src/services/locationService.ts
import Geolocation, {
  GeolocationResponse,
  GeolocationError,
} from '@react-native-community/geolocation';
import { apiClient } from './api';
import { SocketService }  from './socketService';
import { UserLocation, NearbyUser } from '@/types';

// =================================================================
// Types and Interfaces
// =================================================================

/** Callback function signature for location updates. */
type LocationUpdateCallback = (
  location: Omit<UserLocation, 'id' | 'userId'>,
) => void;

/** Configuration options for the location service. */
interface LocationServiceConfig {
  enableHighAccuracy: boolean;
  distanceFilter: number; // meters
  interval: number; // milliseconds
  fastestInterval: number; // milliseconds
  timeout: number; // milliseconds
  maximumAge: number; // milliseconds
}

// =================================================================
// Location Service Implementation
// =================================================================

class LocationService {
  private watchId: number | null = null;
  private isTracking = false;
  private onLocationUpdate: LocationUpdateCallback | null = null;

  private config: LocationServiceConfig = {
    enableHighAccuracy: true,
    distanceFilter: 10,
    interval: 15000,
    fastestInterval: 10000,
    timeout: 20000,
    maximumAge: 10000,
  };

  // =================================================================
  // Geolocation Tracking
  // =================================================================

  /**
   * Starts continuously tracking the user's location.
   * @param callback The function to call with each new location update.
   */
  public startTracking(callback: LocationUpdateCallback): void {
    if (this.isTracking) {
      console.warn('Location tracking is already active.');
      return;
    }

    // Store the callback for potential restarts (e.g., after config update)
    this.onLocationUpdate = callback;

    this.watchId = Geolocation.watchPosition(
      this.handlePositionSuccess,
      this.handlePositionError,
      this.config,
    );

    this.isTracking = true;
    console.log('Location tracking started.');
  }

  /**
   * Stops tracking the user's location.
   */
  public stopTracking(): void {
    if (this.watchId !== null) {
      Geolocation.clearWatch(this.watchId);
      this.watchId = null;
    }
    this.isTracking = false;
    this.onLocationUpdate = null; // Clear the stored callback
    console.log('Location tracking stopped.');
  }

  /**
   * Fetches the user's current location a single time.
   * @returns A promise that resolves with the current location data.
   */
  public async getCurrentLocation(): Promise<
    Omit<UserLocation, 'id' | 'userId'>
  > {
    return new Promise((resolve, reject) => {
      Geolocation.getCurrentPosition(
        (position) => {
          resolve({
            latitude: position.coords.latitude,
            longitude: position.coords.longitude,
            accuracy: position.coords.accuracy,
            timestamp: new Date(position.timestamp),
            isCurrent: true,
          });
        },
        (error) => {
          reject(new Error(`Could not get current location: ${error.message}`));
        },
        { enableHighAccuracy: true, timeout: 15000, maximumAge: 10000 },
      );
    });
  }

  // =================================================================
  // API Communication
  // =================================================================

  /**
   * Sends the user's location to the backend API and emits it via WebSocket.
   * @param location The location data to update.
   */
  public async updateLocationOnServer(
    location: Omit<UserLocation, 'id' | 'userId'>,
  ): Promise<void> {
    try {
      await apiClient.post('/location/update', location);
      SocketService.emit('location-update', location);
    } catch (error) {
      console.error('Failed to update location on server:', error);
      // Re-throw to allow the caller to handle it
      throw error;
    }
  }

  /**
   * Fetches a list of nearby users from the API.
   * @returns A promise that resolves with an array of nearby users.
   */
  public async getNearbyUsers(params: {
    latitude: number;
    longitude: number;
    radius: number; // in meters
  }): Promise<NearbyUser[]> {
    try {
      const response = await apiClient.get<{ data: NearbyUser[] }>(
        '/location/nearby',
        { params },
      );
      return response.data.data; // FIX: Return the typed data payload directly
    } catch (error) {
      console.error('Failed to fetch nearby users:', error);
      throw error;
    }
  }

  // =================================================================
  // Configuration & State
  // =================================================================

  /**
   * Updates the service configuration and restarts tracking if active.
   * @param newConfig A partial configuration object to merge with the existing one.
   */
  public updateConfig(newConfig: Partial<LocationServiceConfig>): void {
    this.config = { ...this.config, ...newConfig };

    // GEN: If tracking is active, restart it with the new configuration.
    if (this.isTracking && this.onLocationUpdate) {
      console.log('Restarting location tracking with new configuration.');
      this.stopTracking();
      this.startTracking(this.onLocationUpdate);
    }
  }

  public getConfig = (): LocationServiceConfig => ({ ...this.config });
  public isCurrentlyTracking = (): boolean => this.isTracking;

  // =================================================================
  // Private Handlers
  // =================================================================

  // REFACTOR: Extracted success handler for clarity and proper `this` binding.
  private handlePositionSuccess = (position: GeolocationResponse): void => {
    const location: Omit<UserLocation, 'id' | 'userId'> = {
      latitude: position.coords.latitude,
      longitude: position.coords.longitude,
      accuracy: position.coords.accuracy,
      timestamp: new Date(position.timestamp),
      isCurrent: true,
    };

    // Execute the callback provided by the consumer of the service
    if (this.onLocationUpdate) {
      this.onLocationUpdate(location);
    }
  };

  // REFACTOR: Extracted error handler for clarity.
  private handlePositionError = (error: GeolocationError): void => {
    console.error('Location tracking error:', error.code, error.message);
    this.stopTracking();
    // Optionally, you could have an error callback to notify the UI
  };
}

export const locationService = new LocationService();
