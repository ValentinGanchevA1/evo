import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  Button,
  StyleSheet,
  SafeAreaView,
} from 'react-native';
import { useAppDispatch } from './../../hooks';
import { setUser } from './store/slices/authSlice'; // Assuming an action to update user

/**
 * A placeholder screen for new users to set up their profile
 * after phone verification.
 */
export const ProfileSetupScreen: React.FC = () => {
  const dispatch = useAppDispatch();
  const [displayName, setDisplayName] = useState('');

  const handleCompleteProfile = () => {
    // In a real app, this would dispatch an async thunk to update the user profile
    // on the backend and then update the local user object.
    console.log('Completing profile with name:', displayName);
    // For now, we can imagine it updates the user and the app proceeds.
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.container}>
        <Text style={styles.title}>Setup Your Profile</Text>
        <Text style={styles.subtitle}>This is how others will see you.</Text>

        <TextInput
          style={styles.input}
          placeholder="Display Name"
          value={displayName}
          onChangeText={setDisplayName}
          placeholderTextColor="#888"
        />

        <Button
          title="Complete Profile"
          onPress={handleCompleteProfile}
          disabled={!displayName}
        />
      </View>
    </SafeAreaView>
  );
};

// Re-using styles for consistency
const styles = StyleSheet.create({
  safeArea: { flex: 1, backgroundColor: '#f8f9fa' },
  container: {
    flex: 1,
    justifyContent: 'center',
    padding: 20,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 10,
    color: '#343a40',
  },
  subtitle: {
    fontSize: 16,
    textAlign: 'center',
    marginBottom: 40,
    color: '#6c757d',
  },
  input: {
    height: 50,
    borderColor: '#ced4da',
    borderWidth: 1,
    borderRadius: 8,
    marginBottom: 20,
    paddingHorizontal: 15,
    backgroundColor: '#fff',
    fontSize: 16,
  },
});
