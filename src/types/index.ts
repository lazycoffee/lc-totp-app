export interface TOTPEntry {
  id: string;
  name: string;
  secret: string;
  issuer?: string;
  algorithm?: 'SHA1' | 'SHA256' | 'SHA512';
  digits?: number;
  period?: number;
  createdAt: number;
  updatedAt: number;
}

export interface AppState {
  entries: TOTPEntry[];
  isAuthenticated: boolean;
  settings: AppSettings;
}

export interface AppSettings {
  theme: 'light' | 'dark' | 'system';
  language: string;
  biometricEnabled: boolean;
  autoLockTimeout: number;
}

export interface AuthState {
  isAuthenticated: boolean;
  isBiometricEnabled: boolean;
  lastUnlockTime: number | null;
}

export type RootStackParamList = {
  Home: undefined;
  AddEntry: undefined;
  EditEntry: { id: string };
  Settings: undefined;
  Auth: undefined;
}; 