import React from 'react';
import {
  View,
  Text,
  TextInput,
  StyleSheet,
  ViewStyle,
  TextInputProps,
  TextStyle,
  Platform,
} from 'react-native';

interface InputProps extends TextInputProps {
  label?: string;
  error?: string;
  containerStyle?: ViewStyle;
  inputStyle?: TextStyle;
}

/**
 * A customizable text input component with support for labels and error messages.
 */
export const Input: React.FC<InputProps> = ({
                                              label,
                                              error,
                                              containerStyle,
                                              inputStyle,
                                              style, // Destructure to prevent passing it to the root View
                                              ...textInputProps
                                            }) => {
  const hasError = Boolean(error);

  return (
    <View style={[styles.container, containerStyle]}>
      {label && <Text style={styles.label}>{label}</Text>}
      <TextInput
        // FIX: Removed invalid escaped quotes and used a constant for the color.
        placeholderTextColor="#999"
        style={[
          styles.input,
          // REFACTOR: Apply error style conditionally for better readability.
          hasError && styles.inputError,
          inputStyle,
        ]}
        {...textInputProps}
      />
      {hasError && <Text style={styles.errorText}>{error}</Text>}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginBottom: 16,
    width: '100%',
  },
  label: {
    fontSize: 16,
    fontWeight: '500',
    color: '#333',
    marginBottom: 8,
  },
  input: {
    height: 50,
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 12, // Softened border radius for a modern look
    paddingHorizontal: 16,
    fontSize: 16,
    backgroundColor: '#f9f9f9', // Slightly off-white background
    color: '#000',
    // GEN: Added platform-specific shadow for better depth perception.
    ...Platform.select({
      ios: {
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.05,
        shadowRadius: 2,
      },
      android: {
        elevation: 1,
      },
    }),
  },
  inputError: {
    borderColor: '#FF3B30',
    backgroundColor: '#FFF6F5', // Add a subtle background tint for errors
  },
  errorText: {
    fontSize: 14,
    color: '#FF3B30',
    marginTop: 6,
    paddingLeft: 4,
  },
});
