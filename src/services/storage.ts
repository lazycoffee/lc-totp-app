import { APP_CONSTANTS } from '@constants/index';
import type { AppSettings, AuthState, TOTPEntry } from '@types/index';
import { MMKV } from 'react-native-mmkv';

const storage = new MMKV();

export const StorageService = {
  // TOTP Entries
  getEntries: (): TOTPEntry[] => {
    const entries = storage.getString(APP_CONSTANTS.STORAGE_KEYS.ENTRIES);
    return entries ? JSON.parse(entries) : [];
  },

  saveEntries: (entries: TOTPEntry[]): void => {
    storage.set(APP_CONSTANTS.STORAGE_KEYS.ENTRIES, JSON.stringify(entries));
  },

  addEntry: (entry: TOTPEntry): void => {
    const entries = StorageService.getEntries();
    entries.push(entry);
    StorageService.saveEntries(entries);
  },

  updateEntry: (entry: TOTPEntry): void => {
    const entries = StorageService.getEntries();
    const index = entries.findIndex(e => e.id === entry.id);
    if (index !== -1) {
      entries[index] = entry;
      StorageService.saveEntries(entries);
    }
  },

  deleteEntry: (id: string): void => {
    const entries = StorageService.getEntries();
    const filteredEntries = entries.filter(entry => entry.id !== id);
    StorageService.saveEntries(filteredEntries);
  },

  // Settings
  getSettings: (): AppSettings => {
    const settings = storage.getString(APP_CONSTANTS.STORAGE_KEYS.SETTINGS);
    return settings
      ? JSON.parse(settings)
      : APP_CONSTANTS.DEFAULT_SETTINGS;
  },

  saveSettings: (settings: AppSettings): void => {
    storage.set(APP_CONSTANTS.STORAGE_KEYS.SETTINGS, JSON.stringify(settings));
  },

  // Auth State
  getAuthState: (): AuthState => {
    const authState = storage.getString(APP_CONSTANTS.STORAGE_KEYS.AUTH_STATE);
    return authState
      ? JSON.parse(authState)
      : {
          isAuthenticated: false,
          isBiometricEnabled: false,
          lastUnlockTime: null
        };
  },

  saveAuthState: (authState: AuthState): void => {
    storage.set(APP_CONSTANTS.STORAGE_KEYS.AUTH_STATE, JSON.stringify(authState));
  },

  // Clear all data
  clearAll: (): void => {
    storage.clearAll();
  }
}; 