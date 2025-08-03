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
// Update these import paths according to your project structure
import {Input} from '@/components/ui/Input';
import {Button} from '@/components/ui/Button';
import { useNavigation } from '@react-navigation/native';
import { AuthStackNavigationProp } from '@/types/navigation';
import { useAppDispatch, useAppSelector } from '@/store/hooks';
import { sendVerificationCode, clearError } from '@/store/slices/authSlice';

export const PhoneLoginScreen: React.FC = () => {
  const [phoneNumber, setPhoneNumber] = useState('');
  const dispatch = useAppDispatch();
  const { loading, error } = useAppSelector((state) => state.auth);
  const navigation = useNavigation<AuthStackNavigationProp<'Login'>>();

  useEffect(() => {
    dispatch(clearError());
  }, [dispatch]);

  const validatePhoneNumber = (phone: string): boolean => {
    const phoneRegex = /^\+?[1-9]\d{1,14}$/;
    return phoneRegex.test(phone.replace(/\s+/g, ''));
  };

  const handleSendCode = async () => {
    if (!validatePhoneNumber(phoneNumber)) {
      Alert.alert(
        'Invalid Phone',
        'Please enter a valid phone number including the country code (e.g., +15551234567).',
      );
      return;
    }

    try {
      await dispatch(sendVerificationCode(phoneNumber)).unwrap();
      navigation.navigate('Verification', { phoneNumber });
    } catch (rejectedValue) {
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
  /* Your existing styles */
});
