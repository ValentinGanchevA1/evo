// src/components/common/CodeInput.tsx
import React from 'react';
import { View, TextInput, StyleSheet, TextInputProps } from 'react-native';

interface CodeInputProps extends TextInputProps {
  length?: number;
}

export const CodeInput: React.FC<CodeInputProps> = ({
                                                      length = 6,
                                                      ...props
                                                    }) => {
  return (
    <View style={styles.container}>
      <TextInput
        style={styles.input}
        maxLength={length}
        keyboardType="number-pad"
        textContentType="oneTimeCode"
        autoFocus
        {...props}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    width: '100%',
    alignItems: 'center',
    justifyContent: 'center',
  },
  input: {
    height: 60,
    width: '90%',
    fontSize: 24,
    fontWeight: 'bold',
    textAlign: 'center',
    letterSpacing: 15, // Creates visual separation for digits
    borderBottomWidth: 2,
    borderColor: '#ddd',
    color: '#333',
  },
});
