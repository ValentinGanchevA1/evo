import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  TextInput,
  Button,
  StyleSheet,
  ActivityIndicator,
  SafeAreaView,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import { useAppDispatch, useAppSelector } from '@/store/hooks';
import { loginWithPhone } from '.store/slices/authSlice';
import { clearError } from './store/slices/authSlice';

/**
 * The PhoneLoginScreen allows users to enter their phone number to authenticate.
 * This is the first step in the login/signup process.
 */
export const PhoneLoginScreen: React.FC = () => {
  const dispatch = useAppDispatch();
  const { loading, error } = useAppSelector((state) => state.auth);
  const [phoneNumber, setPhoneNumber] = useState('');

  // Clear previous errors when the screen is shown
  useEffect(() => {
    dispatch(clearError());
  }, [dispatch]);

  const handleLogin = () => {
    // Basic validation
    if (phoneNumber.trim().length > 8) {
      dispatch(loginWithPhone({ phoneNumber }));
      // In a real app, successful dispatch would either log the user in
      // (triggering RootNavigator to switch stacks) or navigate to an
      // OTP screen, and then potentially to ProfileSetupScreen for new users.
    }
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={styles.container}
      >
        <Text style={styles.title}>Enter Your Phone</Text>
        <Text style={styles.subtitle}>
          We'll send you a code to verify your number.
        </Text>

        <TextInput
          style={styles.input}
          placeholder="Phone Number"
          value={phoneNumber}
          onChangeText={setPhoneNumber}
          keyboardType="phone-pad"
          autoCapitalize="none"
          placeholderTextColor="#888"
        />

        {loading ? (
          <ActivityIndicator size="large" color="#007AFF" style={styles.button} />
        ) : (
          <Button title="Continue" onPress={handleLogin} disabled={!phoneNumber} />
        )}

        {error && <Text style={styles.errorText}>{error}</Text>}
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};

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
  button: {
    height: 50,
    justifyContent: 'center',
  },
  errorText: {
    color: '#d9534f',
    textAlign: 'center',
    marginTop: 15,
    fontSize: 14,
  },
});
