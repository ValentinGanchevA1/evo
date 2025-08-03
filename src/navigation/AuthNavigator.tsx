import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { PhoneLoginScreen } from '@/screens/auth/PhoneLoginScreen';
import { ProfileSetupScreen } from '@/screens/auth/ProfileSetupScreen';
import { AuthStackParamList } from '@/types/navigation';

const Stack = createNativeStackNavigator<AuthStackParamList>();

/**
 * A stack navigator for the authentication flow.
 * It includes screens for logging in and setting up a new profile.
 */
const AuthNavigator: React.FC = () => {
	return (
		<Stack.Navigator
			screenOptions={{
				headerShown: false, // Headers are typically not needed on auth screens
			}}
		>
			<Stack.Screen name="Login" component={PhoneLoginScreen} />
			{/* REFACTOR: Renamed 'Signup' to 'ProfileSetup' for clarity */}
			<Stack.Screen name="ProfileSetup" component={ProfileSetupScreen} />
		</Stack.Navigator>
	);
};

export default AuthNavigator;
