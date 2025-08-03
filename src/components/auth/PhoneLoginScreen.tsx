import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Alert,
  ActivityIndicator,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { AuthStackNavigationProp } from '../../types/navigation';
import { authService } from '../../services/authService';
import { Button } from '../common/Button';
import { Input } from '../common/Input';

export const PhoneLoginScreen: React.FC = () => {
  const [phoneNumber, setPhoneNumber] = useState('');
  const [loading, setLoading] = useState(false);
  const navigation = useNavigation<AuthStackNavigationProp<'PhoneLogin'>>();

  const validatePhoneNumber = (phone: string): boolean => {
    const phoneRegex = /^\\+?[1-9]\\d{1,14}$/;
    return phoneRegex.test(phone.replace(/\\s+/g, ''));
  };

  const handleSendCode = async () => {
    if (!validatePhoneNumber(phoneNumber)) {
      Alert.alert('Invalid Phone', 'Please enter a valid phone number');
      return;
    }

    setLoading(true);
    try {
      const result = await authService.sendVerificationCode(phoneNumber);
      if (result.success) {
        navigation.navigate('Verification', { phoneNumber });
      } else {
        Alert.alert('Error', 'Failed to send verification code');
      }
    } catch (error) {
      Alert.alert('Error', 'Something went wrong. Please try again.');
      console.error('Send code error:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Welcome</Text>
        <Text style={styles.subtitle}>
          Enter your phone number to get started
        </Text>
      </View>

      <View style={styles.form}>
        <Input
          label=\"Phone Number\"
                 placeholder=\"+1 (555) 123-4567\"
                 value={phoneNumber}
                 onChangeText={setPhoneNumber}
                 keyboardType=\"phone-pad\"
                 autoCompleteType=\"tel\"
                 textContentType=\"telephoneNumber\"
                 />

        <Button
          title=\"Send Verification Code\"
                 onPress={handleSendCode}
                 loading={loading}
                 disabled={!phoneNumber.trim()}
                 style={styles.button}
                 />
      </View>

      <View style={styles.footer}>
        <Text style={styles.footerText}>
          By continuing, you agree to our Terms of Service and Privacy Policy
        </Text>
      </View>
    </View>
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
    paddingVertical: 60,
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
    paddingTop: 40,
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
});
