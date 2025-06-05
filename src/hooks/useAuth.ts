import { StorageService } from '@services/storage';
import * as LocalAuthentication from 'expo-local-authentication';
import { useCallback, useEffect, useState } from 'react';
import type { AuthState } from '../types';

interface UseAuthReturn {
  isAuthenticated: boolean;
  isBiometricEnabled: boolean;
  isLoading: boolean;
  error: Error | null;
  authenticate: () => Promise<boolean>;
  enableBiometric: () => Promise<void>;
  disableBiometric: () => void;
  logout: () => void;
}

export const useAuth = (): UseAuthReturn => {
  const [authState, setAuthState] = useState<AuthState>({
    isAuthenticated: false,
    isBiometricEnabled: false,
    lastUnlockTime: null
  });
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  const loadAuthState = useCallback(async () => {
    try {
      const state = await StorageService.getAuthState();
      setAuthState(state);
      setError(null);
    } catch (err) {
      setError(err instanceof Error ? err : new Error('Failed to load auth state'));
    } finally {
      setIsLoading(false);
    }
  }, []);

  const authenticate = useCallback(async (): Promise<boolean> => {
    try {
      if (!authState.isBiometricEnabled) {
        setAuthState(prev => ({
          ...prev,
          isAuthenticated: true,
          lastUnlockTime: Date.now()
        }));
        return true;
      }

      const hasHardware = await LocalAuthentication.hasHardwareAsync();
      if (!hasHardware) {
        throw new Error('Biometric authentication is not available on this device');
      }

      const isEnrolled = await LocalAuthentication.isEnrolledAsync();
      if (!isEnrolled) {
        throw new Error('No biometric credentials enrolled');
      }

      const result = await LocalAuthentication.authenticateAsync({
        promptMessage: 'Authenticate to access your TOTP codes',
        fallbackLabel: 'Use passcode'
      });

      if (result.success) {
        setAuthState(prev => ({
          ...prev,
          isAuthenticated: true,
          lastUnlockTime: Date.now()
        }));
        return true;
      }

      return false;
    } catch (err) {
      setError(err instanceof Error ? err : new Error('Authentication failed'));
      return false;
    }
  }, [authState.isBiometricEnabled]);

  const enableBiometric = useCallback(async () => {
    try {
      const hasHardware = await LocalAuthentication.hasHardwareAsync();
      if (!hasHardware) {
        throw new Error('Biometric authentication is not available on this device');
      }

      const isEnrolled = await LocalAuthentication.isEnrolledAsync();
      if (!isEnrolled) {
        throw new Error('No biometric credentials enrolled');
      }

      setAuthState(prev => ({
        ...prev,
        isBiometricEnabled: true
      }));
      await StorageService.saveAuthState({
        ...authState,
        isBiometricEnabled: true
      });
    } catch (err) {
      setError(err instanceof Error ? err : new Error('Failed to enable biometric authentication'));
    }
  }, [authState]);

  const disableBiometric = useCallback(() => {
    setAuthState(prev => ({
      ...prev,
      isBiometricEnabled: false
    }));
    StorageService.saveAuthState({
      ...authState,
      isBiometricEnabled: false
    });
  }, [authState]);

  const logout = useCallback(() => {
    setAuthState(prev => ({
      ...prev,
      isAuthenticated: false,
      lastUnlockTime: null
    }));
    StorageService.saveAuthState({
      ...authState,
      isAuthenticated: false,
      lastUnlockTime: null
    });
  }, [authState]);

  useEffect(() => {
    loadAuthState();
  }, [loadAuthState]);

  return {
    isAuthenticated: authState.isAuthenticated,
    isBiometricEnabled: authState.isBiometricEnabled,
    isLoading,
    error,
    authenticate,
    enableBiometric,
    disableBiometric,
    logout
  };
}; 