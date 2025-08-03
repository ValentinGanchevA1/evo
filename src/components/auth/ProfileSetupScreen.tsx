// src/screens/auth/ProfileSetupScreen.tsx
import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  Alert,
  SafeAreaView,
} from 'react-native';
import { useAppDispatch, useAppSelector } from '@/store/hooks';
import { updateCoreUser } from '@/store/slices/authSlice';
import { updateUserProfile, uploadProfileImage } from '@/store/slices/userSlice';
import { Input } from '@/components/common/Input';
import { Button } from '@/components/common/Button';
import { ImagePicker } from '@/components/common/ImagePicker';

// Custom hook for unified loading state
const useLoadingState = () => {
  const { loading: authLoading } = useAppSelector((state) => state.auth);
  const { loading: userLoading } = useAppSelector((state) => state.user);
  return authLoading || userLoading;
};

export const ProfileSetupScreen: React.FC = () => {
  const [displayName, setDisplayName] = useState('');
  const [bio, setBio] = useState('');
  const [profileImageUri, setProfileImageUri] = useState<string | null>(null);
  const dispatch = useAppDispatch();
  const isLoading = useLoadingState();

  // Handles profile save logic: upload image if needed, update user data
  const handleSaveProfile = async () => {
    if (!displayName.trim()) {
      Alert.alert('Display Name Required', 'Please enter how you want to be seen.');
      return;
    }
    try {
      const profileUpdatePromises: Promise<any>[] = [];

      // Upload profile image if selected
      if (profileImageUri) {
        profileUpdatePromises.push(dispatch(uploadProfileImage(profileImageUri)));
      }
      // Update core user data
      profileUpdatePromises.push(dispatch(updateCoreUser({ displayName })));
      // Update profile-specific data
      if (bio.trim()) {
        profileUpdatePromises.push(dispatch(updateUserProfile({ bio })));
      }

      // Run all updates in parallel
      await Promise.all(profileUpdatePromises.map((p) => p.unwrap()));
      // Success feedback
      Alert.alert('Profile Saved!', 'Welcome to the app.');
    } catch (error: any) {
      console.error('Profile setup failed:', error);
      const errorMessage = typeof error === 'string' ? error : 'An unknown error occurred while saving your profile.';
      Alert.alert('Save Failed', errorMessage);
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollContent}>
        <View style={styles.header}>
          <Text style={styles.title}>Complete Your Profile</Text>
          <Text style={styles.subtitle}>This is how others will see you.</Text>
        </View>
        <View style={styles.form}>
          <ImagePicker
            value={profileImageUri}
            onSelect={setProfileImageUri}
            style={styles.imagePicker}
          />
          <Input
            label="Display Name *"
            placeholder="e.g., Jane D."
            value={displayName}
            onChangeText={setDisplayName}
            maxLength={50}
          />
          <Input
            label="Bio"
            placeholder="Tell us a little about yourself..."
            value={bio}
            onChangeText={setBio}
            multiline
            numberOfLines={3}
            maxLength={200}
            containerStyle={styles.bioInput}
          />
          <Button
            title="Save & Continue"
            onPress={handleSaveProfile}
            loading={isLoading}
            style={styles.button}
          />
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  scrollContent: {
    paddingHorizontal: 20,
    paddingBottom: 40,
  },
  header: {
    alignItems: 'center',
    paddingTop: 40,
    paddingBottom: 30,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 16,
    color: '#666',
    textAlign: 'center',
    lineHeight: 22,
  },
  form: {
    flex: 1,
  },
  imagePicker: {
    alignSelf: 'center',
    marginBottom: 30,
  },
  bioInput: {
    height: 100, // For multiline input
  },
  button: {
    marginTop: 30,
  },
});
