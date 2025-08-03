import React from 'react';
import { useAppSelector } from '@/store/hooks';
import MainTabNavigator from './MainTabNavigator';
import AuthNavigator from './AuthNavigator';

/**
 * The root navigator that switches between the authentication flow and the
 * main application based on the user's authentication status.
 */
const RootNavigator: React.FC = () => {
	const isAuthenticated = useAppSelector((state) => state.auth.isAuthenticated);

	// If the user is authenticated, show the main app.
	// Otherwise, show the authentication screens.
	return isAuthenticated ? <MainTabNavigator /> : <AuthNavigator />;
};

export default RootNavigator;
