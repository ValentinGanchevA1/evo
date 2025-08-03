// src/types/auth.ts - CLEANED VERSION (Remove duplicates, keep only navigation-specific types)
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RouteProp } from '@react-navigation/native';

// Re-export main types from index (avoid duplication)
export type {
  User,
  AuthState,
  LoginCredentials,
  SignupData,
  AuthResponse,
  UserProfile
} from './index';

// Keep only auth-specific navigation types here
export type RootStackParamList = {
  Auth: undefined;
  Main: undefined;
};

export type AuthStackParamList = {
  Login: undefined;
  Verification: { phoneNumber: string };
  ProfileSetup: undefined;
};

export type MainTabParamList = {
  Map: undefined;
  Profile: undefined;
  Matches: undefined;
  Chat: undefined;
  Settings: undefined;
  Notifications: undefined;
  Search: undefined;
};

// Navigation prop types
export type AuthStackNavigationProp<T extends keyof AuthStackParamList> =
  NativeStackNavigationProp<AuthStackParamList, T>;

export type AuthStackRouteProp<T extends keyof AuthStackParamList> =
  RouteProp<AuthStackParamList, T>;

export type MainTabNavigationProp<T extends keyof MainTabParamList> =
  NativeStackNavigationProp<MainTabParamList, T>;

export type MainTabRouteProp<T extends keyof MainTabParamList> =
  RouteProp<MainTabParamList, T>;

export type RootStackNavigationProp<T extends keyof RootStackParamList> =
  NativeStackNavigationProp<RootStackParamList, T>;

export type RootStackRouteProp<T extends keyof RootStackParamList> =
  RouteProp<RootStackParamList, T>;
