// src/components/auth/VerificationScreen.tsx
import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Alert,
  TouchableOpacity,
  SafeAreaView,
  KeyboardAvoidingView,
  Platform,
  ActivityIndicator,
} from 'react-native';
import { useNavigation, useRoute } from '@react-navigation/native';
import { useAppDispatch, useAppSelector } from '@/store/hooks';
import {
  loginWithPhone,
  sendVerificationCode,
  clearError,
} from '@/store/slices/authSlice';
import {
  AuthStackNavigationProp,
  AuthStackRouteProp,
} from '@/types/navigation';
import { Button } from '@/components/common/Button';
import { CodeInput } from '@/components/common/CodeInput';
import { AuthResponseData } from '@/types';

export const VerificationScreen: React.FC = () => {
  const [code, setCode] = useState('');
  const [timer, setTimer] = useState(60);
  const [isResending, setIsResending] = useState(false);

  const dispatch = useAppDispatch();
  const { loading, error } = useAppSelector((state) => state.auth);

  const navigation = useNavigation<AuthStackNavigationProp<'Verification'>>();
  const route = useRoute<AuthStackRouteProp<'Verification'>>();
  const { phoneNumber } = route.params;

  useEffect(() => {
    if (timer > 0) {
      const interval = setTimeout(() => setTimer(timer - 1), 1000);
      return () => clearTimeout(interval);
    }
  }, [timer]);

  useEffect(() => {
    dispatch(clearError());
  }, [dispatch]);

  const handleVerifyCode = async () => {
    if (code.length !== 6) {
      Alert.alert('Invalid Code', 'Please enter the 6-digit code.');
      return;
    }

    try {
      // FIX: Pass the complete credentials, including the verification code.
      const result = await dispatch(
        loginWithPhone({ phoneNumber, verificationCode: code }),
      ).unwrap();

      if (result.isNewUser) {
        navigation.navigate('ProfileSetup');
      }
      // If not a new user, the RootNavigator will handle the switch to the Main stack.
    } catch (rejectedValue) {
      Alert.alert('Verification Failed', rejectedValue as string);
    }
  };

  const handleResendCode = async () => {
    setIsResending(true);
    try {
      await dispatch(sendVerificationCode(phoneNumber)).unwrap();
      setTimer(60);
      Alert.alert('Code Sent', 'A new verification code has been sent.');
    } catch (rejectedValue) {
      Alert.alert('Error', rejectedValue as string);
    } finally {
      setIsResending(false);
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={styles.keyboardView}
      >
        <View style={styles.header}>
          <Text style={styles.title}>Verify Your Phone</Text>
          <Text style={styles.subtitle}>
            Enter the 6-digit code sent to {phoneNumber}
          </Text>
        </View>

        <View style={styles.form}>
          <CodeInput value={code} onChangeText={setCode} />

          <Button
            title="Verify & Continue"
            onPress={handleVerifyCode}
            loading={loading}
            disabled={code.length !== 6 || loading || isResending}
            style={styles.button}
          />

          <TouchableOpacity
            onPress={handleResendCode}
            disabled={timer > 0 || loading || isResending}
            style={styles.resendButton}
          >
            {isResending ? (
              <ActivityIndicator size="small" color="#007AFF" />
            ) : (
              <Text
                style={[
                  styles.resendText,
                  (timer > 0 || loading) && styles.resendTextDisabled,
                ]}
              >
                {timer > 0 ? `Resend code in ${timer}s` : 'Resend code'}
              </Text>
            )}
          </TouchableOpacity>
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};

// Styles are unchanged
const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#fff' },
  keyboardView: { flex: 1, justifyContent: 'center', paddingHorizontal: 20 },
  header: { alignItems: 'center', marginBottom: 40 },
  title: { fontSize: 28, fontWeight: 'bold', color: '#333' },
  subtitle: { fontSize: 16, color: '#666', marginTop: 8, textAlign: 'center' },
  form: { width: '100%', alignItems: 'center' },
  button: { marginTop: 40, width: '100%' },
  resendButton: { marginTop: 20, padding: 10, minHeight: 24, justifyContent: 'center' },
  resendText: { fontSize: 16, color: '#007AFF', fontWeight: '500' },
  resendTextDisabled: { color: '#999' },
});
