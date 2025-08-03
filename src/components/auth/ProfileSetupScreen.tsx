// src/components/auth/ProfileSetupScreen.tsx
import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  Alert,
  Image,
  TouchableOpacity,
} from 'react-native';
import { useDispatch } from 'react-redux';
import { updateUser, updateUserProfile } from "@/store/slices/userSlice.ts";
import { AppDispatch } from "@/store/store";
import { Input } from '../common/Input';
import { Button } from '../common/Button';
import { ImagePicker } from '../common/ImagePicker';

export const ProfileSetupScreen: React.FC = () => {
  const [formData, setFormData] = useState({
    displayName: '',
    bio: '',
    dateOfBirth: '',
    interests: [] as string[],
  });
  const [profileImage, setProfileImage] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const dispatch = useDispatch<AppDispatch>();

  const handleUpdateField = (field: string, value: any) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleSubmit = async () => {
    if (!formData.displayName.trim()) {
      Alert.alert('Required Field', 'Please enter your display name');
      return;
    }

    setLoading(true);
    try {
      // Update top-level user fields
      await dispatch(updateUser({
        dateOfBirth: undefined,
        gender: undefined,
        id: "",
        isActive: false,
        lastSeen: undefined,
        phoneNumber: "",
        privacyLevel: undefined,
        profile: undefined,
        sexualOrientation: undefined,
        displayName: formData.displayName,
        profileImage: profileImage || undefined,
      })).unwrap();

      // Update profile fields
      await dispatch(updateUserProfile({
        bio: formData.bio
      })).unwrap();

    } catch (error) {
      Alert.alert('Error', 'Failed to save profile');
    } finally {
      setLoading(false);
    }
  };

  return (
    <ScrollView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Complete Your Profile</Text>
        <Text style={styles.subtitle}>
          Help others get to know you better
        </Text>
      </View>

      <View style={styles.form}>
        <ImagePicker
          value={profileImage}
          onSelect={setProfileImage}
          style={styles.imagePicker}
        />

        <Input
          label="Display Name *"
          placeholder="How should others see you?"
          value={formData.displayName}
          onChangeText={(value) => handleUpdateField('displayName', value)}
          maxLength={50}
        />

        <Input
          label="Bio"
          placeholder="Tell us about yourself..."
          value={formData.bio}
          onChangeText={(value) => handleUpdateField('bio', value)}
          multiline
          numberOfLines={3}
          maxLength={200}
        />

        <Button
          title="Complete Setup"
          onPress={handleSubmit}
          loading={loading}
          style={styles.button}
        />
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    paddingHorizontal: 20,
  },
  header: {
    alignItems: 'center',
    paddingVertical: 40,
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
  button: {
    marginTop: 20,
  },
  footer: {
    paddingVertical: 20,
    alignItems: 'center',
  },
  footerText: {
    fontSize: 12,
    color: '#888',
    textAlign: 'center',
    lineHeight: 18,
  },
  resendButton: {
    marginTop: 15,
    alignItems: 'center',
  },
  resendText: {
    fontSize: 16,
    color: '#007AFF',
    fontWeight: '500',
  },
  resendTextDisabled: {
    color: '#999',
  },
  imagePicker: {
    alignSelf: 'center',
    marginBottom: 20,
  },
});
