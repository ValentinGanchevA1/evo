// src/types/index.ts - FIXED VERSION
// =================================================================
// Core Data Models
// =================================================================

export interface UserProfile {
  bio?: string;
  interests?: string[];
  lookingFor?: ('dating' | 'friendship' | 'trading' | 'events')[];
  ageMin?: number;
  ageMax?: number;
  maxDistance?: number;
}

export interface User {
  id: string;
  phoneNumber: string;
  displayName?: string;
  profileImage?: string;
  dateOfBirth?: Date;
  gender?: 'male' | 'female' | 'other';
  sexualOrientation?: 'straight' | 'gay' | 'lesbian' | 'bisexual' | 'other';
  isActive: boolean;
  privacyLevel: 1 | 2 | 3;
  lastSeen: Date;
  profile?: UserProfile;
}

export interface UserLocation {
  id: string;
  userId: string;
  latitude: number;
  longitude: number;
  accuracy: number;
  timestamp: Date;
  isCurrent: boolean;
}

export interface LocationPermission {
  granted: boolean;
  type: 'whenInUse' | 'always' | 'denied';
}

// =================================================================
// API & Auth Types - CONSOLIDATED
// =================================================================

export interface LoginCredentials {
  phoneNumber: string;
  verificationCode: string; // Made required for consistency
}

export interface SignupData {
  phoneNumber: string;
  displayName: string;
  dateOfBirth: Date;
}
// src/types/index.ts - FIXED VERSION
// =================================================================
// Core Data Models
// =================================================================

export interface LocationPermission {
  granted: boolean;
  type: 'whenInUse' | 'always' | 'denied';
}

// =================================================================
// API & Auth Types - CONSOLIDATED
// =================================================================

export interface LoginCredentials {
  phoneNumber: string;
  verificationCode: string; // Made required for consistency
}

export interface SignupData {
  phoneNumber: string;
  displayName: string;
  dateOfBirth: Date;
}

export interface RegistrationData {
  username: string;
  email: string;
  password: string;
}

// FIXED: Single consistent auth response interface
export interface AuthResponse {
  user: User;
  token: string;
  isNewUser: boolean; // Added missing property
}

// =================================================================
// Redux State Types
// =================================================================

export interface AuthState {
  isAuthenticated: boolean;
  user: User | null;
  token: string | null;
  loading: boolean;
  error: string | null;
}

export interface NearbyUser {
  id: string;
  displayName: string; // Changed from username for consistency
  latitude: number;
  longitude: number;
  distance: number;
  lastSeen: Date;
  profileImage?: string;
}

export interface LocationState {
  currentLocation: Omit<UserLocation, 'id' | 'userId'> | null;
  nearbyUsers: NearbyUser[];
  isTracking: boolean;
  lastUpdate: Date | null;
  error: string | null;
}

// =================================================================
// Navigation Types - Import from separate file
// =================================================================
export * from './navigation';
