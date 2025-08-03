// src/types/navigation.ts

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
 */
export type AuthStackParamList = {
  Login: undefined;
  ProfileSetup: undefined;
};

/**
 * Defines the screen parameters for the main bottom tab navigator.
 */
export type MainTabParamList = {
  Map: undefined;
  Profile: undefined;
};
