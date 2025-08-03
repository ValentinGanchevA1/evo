// src/screens/main/ProfileScreen.tsx - FIXED VERSION
import React from 'react';
import { View, Text, StyleSheet, SafeAreaView } from 'react-native';
import { useAppDispatch, useAppSelector } from '@/store/hooks';
import { logout } from '@/store/slices/authSlice';
import { Button } from '@/components/common/Button';

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

				{/* FIXED: Use displayName and phoneNumber instead of non-existent email */}
				<View style={styles.userInfo}>
					<Text style={styles.displayName}>
						{user?.displayName || 'Anonymous User'}
					</Text>
					<Text style={styles.phoneText}>
						{user?.phoneNumber || 'No phone number'}
					</Text>
					{user?.profile?.bio && (
						<Text style={styles.bioText}>{user.profile.bio}</Text>
					)}
				</View>

				<Button
					title="Logout"
					onPress={handleLogout}
					variant="outline"
					style={styles.logoutButton}
				/>
			</View>
		</SafeAreaView>
	);
};

const styles = StyleSheet.create({
	safeArea: {
		flex: 1,
		backgroundColor: '#f8f9fa'
	},
	container: {
		flex: 1,
		justifyContent: 'center',
		alignItems: 'center',
		padding: 20,
	},
	title: {
		fontSize: 28,
		fontWeight: 'bold',
		marginBottom: 30,
		color: '#333'
	},
	userInfo: {
		alignItems: 'center',
		marginBottom: 40,
		paddingHorizontal: 20,
	},
	displayName: {
		fontSize: 20,
		fontWeight: '600',
		color: '#333',
		marginBottom: 8,
	},
	phoneText: {
		fontSize: 16,
		color: '#6c757d',
		marginBottom: 12
	},
	bioText: {
		fontSize: 14,
		color: '#6c757d',
		textAlign: 'center',
		fontStyle: 'italic',
	},
	logoutButton: {
		width: '80%',
	},
});

export default ProfileScreen;
