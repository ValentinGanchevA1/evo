// src/types/index.ts - CLEANED AND CONSOLIDATED VERSION
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
// API & Auth Types
// =================================================================

export interface LoginCredentials {
  phoneNumber: string;
  verificationCode: string;
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

export interface AuthResponse {
  user: User;
  token: string;
  isNewUser: boolean;
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

// FIXED: Consistent naming with User type
export interface NearbyUser {
  id: string;
  displayName: string; // Changed from username
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
// Component Props Types
// =================================================================

export interface ButtonProps {
  title: string;
  onPress: () => void;
  loading?: boolean;
  disabled?: boolean;
  variant?: 'primary' | 'secondary' | 'outline';
}

export interface InputProps {
  label?: string;
  placeholder?: string;
  value: string;
  onChangeText: (text: string) => void;
  error?: string;
  required?: boolean;
}

// =================================================================
// Navigation Types - Re-export from navigation file
// =================================================================
export * from './navigation';
