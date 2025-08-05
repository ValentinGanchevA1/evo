import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  SafeAreaView,
  KeyboardAvoidingView,
  Platform,
  Alert,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { useAppDispatch, useAppSelector } from '@/store/hooks';
import { registerUser, clearError } from '@/store/slices/authSlice';
import { AuthStackNavigationProp } from '@/types/navigation';
import { Input } from '@/components/common/Input';
import { Button } from '@/components/common/Button';

const SignupScreen: React.FC = () => {
  type SignupNavigationProp = AuthStackNavigationProp<'Signup'>;
  const navigation = useNavigation<SignupNavigationProp>();
  const dispatch = useAppDispatch();
  const { loading, error } = useAppSelector((state) => state.auth);
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  useEffect(() => {
    dispatch(clearError());
  }, [dispatch]);

  const handleSignup = async () => {
    if (username && email && password) {
      try {
        const result = await dispatch(
          registerUser({ username, email, password }),
        ).unwrap();

        // On success, the RootNavigator will handle the switch to the Main stack.
        // If the user is new (which they always will be on signup),
        // navigate them to complete their profile.
        if (result.isNewUser) {
          navigation.navigate('ProfileSetup');
        }
      } catch (rejectedValue) {
        Alert.alert('Signup Failed', rejectedValue as string);
      }
    }
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={styles.container}
      >
        <Text style={styles.title}>Create Account</Text>
        <Text style={styles.subtitle}>Join the community</Text>

        <Input
          label="Username"
          placeholder="Choose a unique username"
          value={username}
          onChangeText={setUsername}
          autoCapitalize="none"
        />
        <Input
          label="Email"
          placeholder="you@example.com"
          value={email}
          onChangeText={setEmail}
          keyboardType="email-address"
          autoCapitalize="none"
        />
        <Input
          label="Password"
          placeholder="Create a secure password"
          value={password}
          onChangeText={setPassword}
          secureTextEntry
          autoCapitalize="none"
        />

        <Button
          title="Sign Up"
          onPress={handleSignup}
          loading={loading}
          disabled={!username || !email || !password}
          style={styles.button}
        />

        {error && !loading && <Text style={styles.errorText}>{error}</Text>}

        <View style={styles.footer}>
          <Text style={styles.footerText}>Already have an account?</Text>
          <TouchableOpacity onPress={() => navigation.navigate('Login')}>
            <Text style={styles.linkText}>Log In</Text>
          </TouchableOpacity>
        </View>
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
  button: {
    marginTop: 10,
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
