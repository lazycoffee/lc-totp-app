import React, { useEffect, useState } from 'react';
import { StyleSheet, Text, TextInput, View } from 'react-native';
import { useTOTP } from '../hooks/useTOTP';

interface TOTPInputProps {
  onSuccess?: () => void;
  onError?: () => void;
}

const TOTPInput: React.FC<TOTPInputProps> = ({ onSuccess, onError }) => {
  const [code, setCode] = useState('');
  const [error, setError] = useState('');
  const { verifyTOTP } = useTOTP();

  useEffect(() => {
    // Clear error state before validation
    setError('');
    
    if (code.length === 6) {
      const isValid = verifyTOTP('test-secret', code); // TODO: Replace with actual secret
      if (isValid) {
        onSuccess?.();
      } else {
        setError('Invalid code');
        onError?.();
      }
    }
  }, [code, verifyTOTP, onSuccess, onError]);

  const handleChange = (text: string) => {
    // Only allow numeric input
    const numericValue = text.replace(/[^0-9]/g, '');
    // Limit to 6 digits
    const newCode = numericValue.slice(0, 6);
    setCode(newCode);
    // Clear error when input changes
    setError('');
  };

  return (
    <View style={styles.container}>
      <TextInput
        style={[styles.input, error ? styles.inputError : null]}
        value={code}
        onChangeText={handleChange}
        keyboardType="numeric"
        maxLength={6}
        placeholder="Enter 6-digit code"
        testID="totp-input"
      />
      {error ? <Text style={styles.errorText}>{error}</Text> : null}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    width: '100%',
  },
  input: {
    height: 50,
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 8,
    paddingHorizontal: 16,
    fontSize: 18,
    textAlign: 'center',
    letterSpacing: 8,
  },
  inputError: {
    borderColor: 'red',
  },
  errorText: {
    color: 'red',
    marginTop: 8,
    textAlign: 'center',
  },
});

export default TOTPInput; 