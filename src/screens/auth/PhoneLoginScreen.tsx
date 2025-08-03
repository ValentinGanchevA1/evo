import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Alert,
  SafeAreaView,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { AuthStackNavigationProp } from '@/types/navigation';
import { useAppDispatch, useAppSelector } from '@/store/hooks';
// FIX: Import the correct thunk for this screen's purpose.
import { sendVerificationCode, clearError } from '@/store/slices/authSlice';
import { Button } from '@/components/common/Button';
import { Input } from '@/components/common/Input';

export const PhoneLoginScreen: React.FC = () => {
  const dispatch = useAppDispatch();
  const { loading, error } = useAppSelector((state) => state.auth);
  const [phoneNumber, setPhoneNumber] = useState('');
  const navigation = useNavigation<AuthStackNavigationProp<'Login'>>();

  useEffect(() => {
    dispatch(clearError());
  }, [dispatch]);

// Extract validation into a utility function for clarity and reuse
  const PHONE_REGEX = /^\+?[1-9]\d{1,14}$/;

  const isValidPhoneNumber = (phone: string): boolean => {
    return PHONE_REGEX.test(phone.replace(/\s+/g, ''));
  };

// Rename handler to clearly indicate its purpose
  const onSendVerificationCode = async () => {
    if (!isValidPhoneNumber(phoneNumber)) {
      Alert.alert(
        INVALID_PHONE_TITLE,
        INVALID_PHONE_MESSAGE,
      );
      return;
    }
    try {
      await dispatch(sendVerificationCode(phoneNumber)).unwrap();
      navigation.navigate('Verification', { phoneNumber });
    } catch (error) {
      Alert.alert(ERROR_TITLE, (error as string) || DEFAULT_ERROR_MESSAGE);
    }
  };

  const INVALID_PHONE_TITLE = 'Invalid Phone';
  const INVALID_PHONE_MESSAGE = 'Please enter a valid phone number including the country code (e.g., +15551234567).';
  const ERROR_TITLE = 'Error';
  const DEFAULT_ERROR_MESSAGE = 'An unknown error occurred.';

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

        <Input
          label="Phone Number"
          placeholder="+1 (555) 123-4567"
          value={phoneNumber}
          onChangeText={setPhoneNumber}
          keyboardType="phone-pad"
          autoComplete="tel"
          textContentType="telephoneNumber"
        />

        <Button
          title="Continue"
          onPress={onSendVerificationCode
          }
          loading={loading}
          disabled={!phoneNumber.trim() || loading}
        />

        {error && !loading && <Text style={styles.errorText}>{error}</Text>}
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};

// Simplified styles for brevity
const styles = StyleSheet.create({
  safeArea: { flex: 1, backgroundColor: '#f8f9fa' },
  container: { flex: 1, justifyContent: 'center', padding: 20 },
  title: { fontSize: 28, fontWeight: 'bold', textAlign: 'center', marginBottom: 10 },
  subtitle: { fontSize: 16, textAlign: 'center', marginBottom: 40, color: '#6c757d' },
  errorText: { color: 'red', textAlign: 'center', marginTop: 10 },
});
