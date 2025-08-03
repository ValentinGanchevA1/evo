// src/types/navigation.ts
import { RouteProp } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';

/**
 * Defines the root stack parameters, allowing type-safe navigation
 * between the authentication flow and the main application.
 */
export type RootStackParamList = {
  Auth: undefined;
  Main: undefined;
};

/**
 * Defines the screen parameters for the authentication stack navigator.
 * REFACTOR: Removed unused 'PhoneLogin' and 'Signup' routes to match AuthNavigator.
 */
export type AuthStackParamList = {
  Login: undefined;
  Verification: { phoneNumber: string };
  ProfileSetup: undefined;
};

/**
 * Defines the screen parameters for the main bottom tab navigator.
 */
export type MainTabParamList = {
  Map: undefined;
  Profile: undefined;
  Matches: undefined;
  Chat: undefined;  
  Settings: undefined;
  Notifications: undefined;
  Search: undefined;
};

// This provides full type-safety and intellisense with React Navigation hooks.
export type AuthStackNavigationProp<T extends keyof AuthStackParamList> =
  NativeStackNavigationProp<AuthStackParamList, T>;

export type AuthStackRouteProp<T extends keyof AuthStackParamList> = RouteProp<
  AuthStackParamList,
  T
>;
