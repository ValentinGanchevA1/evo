import React from 'react';
import { View, Text, StyleSheet, Button, SafeAreaView } from 'react-native';
import { useAppDispatch, useAppSelector } from '@/store/hooks.ts';
import { logout } from '@/store/slices/authSlice.ts';

/**
 * A placeholder screen for the user's profile.
 * It displays the user's name and provides a logout button.
 */
const ProfileScreen: React.FC = () => {
	const dispatch = useAppDispatch();
	const user = useAppSelector((state) => state.auth.user);

	const handleLogout = () => {
		dispatch(logout());
	};

	return (
		<SafeAreaView style={styles.safeArea}>
			<View style={styles.container}>
				<Text style={styles.title}>Profile</Text>
				<Text style={styles.emailText}>
					Logged in as: {user?.email ?? 'Unknown User'}
				</Text>
				<Button title="Logout" onPress={handleLogout} color="#d9534f" />
			</View>
		</SafeAreaView>
	);
};

const styles = StyleSheet.create({
	safeArea: { flex: 1, backgroundColor: '#f8f9fa' },
	container: {
		flex: 1,
		justifyContent: 'center',
		alignItems: 'center',
		padding: 20,
	},
	title: { fontSize: 28, fontWeight: 'bold', marginBottom: 20 },
	emailText: { fontSize: 16, color: '#6c757d', marginBottom: 40 },
});

export default ProfileScreen;
