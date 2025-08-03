import React, { useRef, useEffect } from 'react';
import {
  View,
  TextInput,
  StyleSheet,
  ViewStyle,
} from 'react-native';

interface CodeInputProps {
  value: string;
  onChangeText: (text: string) => void;
  length: number;
  style?: ViewStyle;
}

export const CodeInput: React.FC<CodeInputProps> = ({
                                                      value,
                                                      onChangeText,
                                                      length,
                                                      style,
                                                    }) => {
  const inputRefs = useRef<(TextInput | null)[]>([]);

  useEffect(() => {
    if (value.length === 0) {
      inputRefs.current[0]?.focus();
    }
  }, []);

  const handleTextChange = (text: string, index: number) => {
    const newValue = value.split('');
    newValue[index] = text;

    const result = newValue.join('').slice(0, length);
    onChangeText(result);

    // Auto-focus next input
    if (text && index < length - 1) {
      inputRefs.current[index + 1]?.focus();
    }
  };

  const handleKeyPress = (key: string, index: number) => {
    if (key === 'Backspace' && !value[index] && index > 0) {
      inputRefs.current[index - 1]?.focus();
    }
  };

  return (
    <View style={[styles.container, style]}>
      {Array.from({ length }, (_, index) => (
        <TextInput
          key={index}
          ref={(ref) => (inputRefs.current[index] = ref)}
          style={[
            styles.input,
            value[index] && styles.inputFilled,
          ]}
          value={value[index] || ''}
          onChangeText={(text) => handleTextChange(text, index)}
          onKeyPress={({ nativeEvent }) => handleKeyPress(nativeEvent.key, index)}
          keyboardType=\"numeric\"
        maxLength={1}
        textAlign=\"center\"
        selectTextOnFocus
        />
        ))}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginVertical: 20,
  },
  input: {
    width: 45,
    height: 55,
    borderWidth: 2,
    borderColor: '#ddd',
    borderRadius: 12,
    fontSize: 24,
    fontWeight: 'bold',
    color: '#333',
    backgroundColor: '#fff',
  },
  inputFilled: {
    borderColor: '#007AFF',
    backgroundColor: '#F0F8FF',
  },
});
