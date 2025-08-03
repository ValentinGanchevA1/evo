// =================================================================
// Core Data Models
// =================================================================

/**
 * Represents a user's profile settings, preferences, and bio.
 * This is separated for better data organization.
 */
export interface UserProfile {
  bio?: string;
  interests?: string[];
  lookingFor?: ('dating' | 'friendship' | 'trading' | 'events')[];
  // Search/matching preferences
  ageMin?: number;
  ageMax?: number;
  maxDistance?: number; // Should be a consistent unit, e.g., kilometers
}

/**
 * Represents the core user object in the application.
 * It contains identity, status, and privacy info, and can include a profile.
 */
export interface User {
  id: string;
  phoneNumber: string;
  displayName?: string;
  profileImage?: string;
  dateOfBirth?: Date;
  gender?: 'male' | 'female' | 'other';
  sexualOrientation?: 'straight' | 'gay' | 'lesbian' | 'bisexual' | 'other';
  isActive: boolean;
  // e.g., 1: Public, 2: Friends, 3: Private
  privacyLevel: 1 | 2 | 3;
  lastSeen: Date;
  profile?: UserProfile;
}

/**
 * Represents a user's geographic location at a point in time.
 */
export interface UserLocation {
  id: string;
  userId: string;
  latitude: number;
  longitude: number;
  accuracy: number;
  timestamp: Date;
  isCurrent: boolean;
}

// =================================================================
// API Payloads & Service Types
// =================================================================

/**
 * Credentials required for phone-based login, used by auth services.
 */
export interface LoginCredentials {
  phoneNumber: string;
  otp?: string; // Optional one-time password
}

/**
 * The shape of the data returned from the API upon successful authentication.
 */
export interface AuthResponseData {
  user: User;
  token: string;
}

/**
 * Represents the status of location permissions granted by the user.
 * (Merged from the redundant location.ts file).
 */
export interface LocationPermission {
  granted: boolean;
  type: 'whenInUse' | 'always' | 'denied';
}

// =================================================================
// Redux State Slice Definitions
// =================================================================

/**
 * The shape of the authentication state within the Redux store.
 */
export interface AuthState {
  isAuthenticated: boolean;
  user: User | null;
  token: string | null;
  loading: boolean;
  error: string | null;
}

/**
 * Represents a user found nearby, tailored for map display.
 */
export interface NearbyUser {
  id: string;
  displayName: string;
  latitude: number;
  longitude: number;
  distance: number;
  lastSeen: Date;
  profileImage?: string;
}

/**
 * The shape of the location-related state within the Redux store.
 */
export interface LocationState {
  currentLocation: Omit<UserLocation, 'id' | 'userId'> | null;
  nearbyUsers: NearbyUser[];
  isTracking: boolean;
  lastUpdate: Date | null;
  error: string | null;
}

export class SignupData {
}
