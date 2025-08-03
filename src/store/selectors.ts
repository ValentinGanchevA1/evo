// src/store/selectors.ts - CREATE THIS FILE
import { createSelector } from '@reduxjs/toolkit';
import { RootState } from './store';

// Memoized selectors to prevent unnecessary re-renders
export const selectAuth = (state: RootState) => state.auth;
export const selectUser = (state: RootState) => state.auth.user;
export const selectIsAuthenticated = (state: RootState) => state.auth.isAuthenticated;

export const selectNearbyUsers = createSelector(
  [(state: RootState) => state.location.nearbyUsers],
  (nearbyUsers) => nearbyUsers
);
