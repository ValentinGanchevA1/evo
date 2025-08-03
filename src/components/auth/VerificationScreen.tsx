// src/components/auth/VerificationScreen.tsx
import React, { useState, useRef, useEffect } from 'react';
import {
  View,
  Text,
  TextInput,
  StyleSheet,
  Alert,
  TouchableOpacity,
} from 'react-native';
import { useNavigation, useRoute } from '@react-navigation/native';
import { useAuth } from '../../hooks/useAuth';
import { AuthStackNavigationProp, AuthStackRouteProp } from '../../types/navigation.ts';
import { Button } from '../common/Button';
import { CodeInput } from '../common/CodeInput';

export const VerificationScreen: React.FC = () => {
  const [code, setCode] = useState('');
  const [loading, setLoading] = useState(false);
  const [resendLoading, setResendLoading] = useState(false);
  const [timer, setTimer] = useState(60);

  const navigation = useNavigation<AuthStackNavigationProp<'Verification'>>();
  const route = useRoute<AuthStackRouteProp<'Verification'>>();
  const { login } = useAuth();

  const { phoneNumber } = route.params;

  useEffect(() => {
    if (timer > 0) {
      const interval = setTimeout(() => setTimer(timer - 1), 1000);
      return () => clearTimeout(interval);
    }
  }, [timer]);

  const handleVerifyCode = async () => {
    if (code.length !== 6) {
      Alert.alert('Invalid Code', 'Please enter the 6-digit code');
      return;
    }

    setLoading(true);
    try {
      const result = await login({ phoneNumber, verificationCode: code });
      if (result.meta.requestStatus === 'fulfilled') {
        // Navigation handled by RootNavigator based on auth state
      } else {
        Alert.alert('Invalid Code', 'Please check your code and try again');
      }
    } catch (error) {
      Alert.alert('Error', 'Failed to verify code. Please try again.');
      console.error('Verification error:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleResendCode = async () => {
    setResendLoading(true);
    try {
      // Implement resend logic
      setTimer(60);
      Alert.alert('Code Sent', 'A new verification code has been sent');
    } catch (error) {
      Alert.alert('Error', 'Failed to resend code');
    } finally {
      setResendLoading(false);
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Verify Phone</Text>
        <Text style={styles.subtitle}>
          Enter the 6-digit code sent to {phoneNumber}
        </Text>
      </View>

      <View style={styles.form}>
        <CodeInput
          value={code}
          onChangeText={setCode}
          length={6}
        />

        <Button
          title="Verify Code"
          onPress={handleVerifyCode}
          loading={loading}
          disabled={code.length !== 6}
          style={styles.button}
        />

        <TouchableOpacity
          onPress={handleResendCode}
          disabled={timer > 0 || resendLoading}
          style={styles.resendButton}
        >
          <Text style={[
            styles.resendText,
            (timer > 0 || resendLoading) && styles.resendTextDisabled
          ]}>
            {timer > 0 ? `Resend code in ${timer}s` : 'Resend code'}
          </Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};
