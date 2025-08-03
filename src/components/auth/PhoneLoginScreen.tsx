import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Alert,
  SafeAreaView,
  KeyboardAvoidingView,
  Platform,
  ActivityIndicator,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { AuthStackNavigationProp } from '@/types/navigation';
import { useAppDispatch, useAppSelector } from '@/store/hooks';
import { sendVerificationCode, clearError } from '@/store/slices/authSlice';
import { Button } from '@/components/common/Button';
import { Input } from '@/components/common/Input';

export const PhoneLoginScreen: React.FC = () => {
  const [phoneNumber, setPhoneNumber] = useState('');
  const dispatch = useAppDispatch();
  const { loading, error } = useAppSelector((state) => state.auth);
  const navigation = useNavigation<AuthStackNavigationProp<'PhoneLogin'>>();

  // Clear previous errors when the screen is shown
  useEffect(() => {
    dispatch(clearError());
  }, [dispatch]);

  // FIX: Corrected regex for phone number validation (E.164 format)
  const validatePhoneNumber = (phone: string): boolean => {
    const phoneRegex = /^\+?[1-9]\d{1,14}$/;
    return phoneRegex.test(phone.replace(/\s+/g, ''));
  };

  const handleSendCode = async () => {
    if (!validatePhoneNumber(phoneNumber)) {
      Alert.alert('Invalid Phone', 'Please enter a valid phone number including the country code (e.g., +15551234567).');
      return;
    }

    try {
      // REFACTOR: Dispatch a thunk to handle the async logic and state updates.
      // Using unwrap() allows us to handle the promise result directly.
      await dispatch(sendVerificationCode(phoneNumber)).unwrap();
      navigation.navigate('Verification', { phoneNumber });
    } catch (rejectedValue) {
      // The error message is now sourced from the Redux state via the thunk.
      Alert.alert('Error', rejectedValue as string);
    }
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={styles.container}
      >
        <View style={styles.header}>
          <Text style={styles.title}>Welcome</Text>
          <Text style={styles.subtitle}>
            Enter your phone number to get started
          </Text>
        </View>

        <View style={styles.form}>
          {/* FIX: Removed invalid escaped quotes from props */}
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
            title="Send Verification Code"
            onPress={handleSendCode}
            loading={loading}
            disabled={!phoneNumber.trim() || loading}
            style={styles.button}
          />

          {/* Display error from Redux store */}
          {error && !loading && <Text style={styles.errorText}>{error}</Text>}
        </View>

        <View style={styles.footer}>
          <Text style={styles.footerText}>
            By continuing, you agree to our Terms of Service and Privacy Policy
          </Text>
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#fff',
  },
  container: {
    flex: 1,
    justifyContent: 'center',
    paddingHorizontal: 20,
  },
  header: {
    alignItems: 'center',
    marginBottom: 40,
  },
  title: {
    fontSize: 32,
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
  errorText: {
    color: '#d9534f',
    textAlign: 'center',
    marginTop: 15,
    fontSize: 14,
  },
});
