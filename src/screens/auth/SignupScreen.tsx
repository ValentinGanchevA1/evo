import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  TextInput,
  Button,
  StyleSheet,
  ActivityIndicator,
  TouchableOpacity,
  SafeAreaView,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { useAppDispatch, useAppSelector } from '@/store/hooks';
import {clearError } from '@/store/slices/authSlice';
import { AuthStackParamList } from "@/types/auth";


const SIGNUP_PLACEHOLDER_USERNAME = "Username";
const SIGNUP_PLACEHOLDER_EMAIL = "Email";
const SIGNUP_PLACEHOLDER_PASSWORD = "Password";
const BUTTON_TITLE_SIGNUP = "Sign Up";
const TITLE_TEXT = "Create Account";
const SUBTITLE_TEXT = "Join the Cyberealm community";
const ALREADY_HAVE_ACCOUNT_TEXT = "Already have an account?";
const LOG_IN_TEXT = "Log In";

// Helper function to render input fields
const InputField = (
  placeholder: string,
  value: string,
  onChange: (text: string) => void,
  secureTextEntry = false,
  keyboardType?: 'default' | 'email-address'
) => (
  <TextInput
    style={styles.input}
    placeholder={placeholder}
    value={value}
    onChangeText={onChange}
    secureTextEntry={secureTextEntry}
    keyboardType={keyboardType}
    autoCapitalize="none"
    placeholderTextColor="#888"
  />
);

const SignupScreen: React.FC = () => {
  const navigation = useNavigation<SignupScreenNavigationProp>();
  const dispatch = useAppDispatch();
  const { isLoading, error } = useAppSelector((state) => state.auth);
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  // Clear error on mount
  useEffect(() => {
    dispatch(clearError());
  }, [dispatch]);

  const onSignupPress = () => {
    if (username && email && password) {
      dispatch(registerUser({ username, email, password }));
    }
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={styles.container}
      >
        <Text style={styles.title}>{TITLE_TEXT}</Text>
        <Text style={styles.subtitle}>{SUBTITLE_TEXT}</Text>

        {InputField(SIGNUP_PLACEHOLDER_USERNAME, username, setUsername)}
        {InputField(SIGNUP_PLACEHOLDER_EMAIL, email, setEmail, false, 'email-address')}
        {InputField(SIGNUP_PLACEHOLDER_PASSWORD, password, setPassword, true)}

        {isLoading ? (
          <ActivityIndicator size="large" color="#007AFF" style={styles.button} />
        ) : (
          <Button
            title={BUTTON_TITLE_SIGNUP}
            onPress={onSignupPress}
            disabled={!username || !email || !password}
          />
        )}

        {error && <Text style={styles.errorText}>{error.message}</Text>}

        <View style={styles.footer}>
          <Text style={styles.footerText}>{ALREADY_HAVE_ACCOUNT_TEXT}</Text>
          <TouchableOpacity onPress={() => navigation.navigate('Login')}>
            <Text style={styles.linkText}>{LOG_IN_TEXT}</Text>
          </TouchableOpacity>
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};

// Using the same styles as LoginScreen for consistency
const styles = StyleSheet.create({
  safeArea: { flex: 1, backgroundColor: '#f8f9fa' },
  container: {
    flex: 1,
    justifyContent: 'center',
    padding: 20,
  },
  title: {
    fontSize: 32,
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
    marginBottom: 15,
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
  footer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 30,
  },
  footerText: {
    color: '#6c757d',
    fontSize: 14,
  },
  linkText: {
    color: '#007AFF',
    fontWeight: 'bold',
    marginLeft: 5,
    fontSize: 14,
  },
});

export default SignupScreen;
