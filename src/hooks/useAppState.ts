import { StorageService } from '@services/storage';
import { useCallback, useEffect, useState } from 'react';
import { AppState, AppStateStatus } from 'react-native';
import { APP_CONSTANTS } from '../constants/index';
import type { AppSettings, TOTPEntry } from '../types';

interface UseAppStateReturn {
  settings: AppSettings;
  entries: TOTPEntry[];
  isLoading: boolean;
  error: Error | null;
  updateSettings: (settings: Partial<AppSettings>) => void;
  addEntry: (entry: TOTPEntry) => void;
  updateEntry: (entry: TOTPEntry) => void;
  deleteEntry: (id: string) => void;
  refreshEntries: () => Promise<void>;
}

export const useAppState = (): UseAppStateReturn => {
  const [settings, setSettings] = useState<AppSettings>(APP_CONSTANTS.DEFAULT_SETTINGS);
  const [entries, setEntries] = useState<TOTPEntry[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  const loadInitialData = useCallback(async () => {
    try {
      setIsLoading(true);
      const [loadedSettings, loadedEntries] = await Promise.all([
        StorageService.getSettings(),
        StorageService.getEntries()
      ]);
      setSettings(loadedSettings);
      setEntries(loadedEntries);
      setError(null);
    } catch (err) {
      setError(err instanceof Error ? err : new Error('Failed to load data'));
    } finally {
      setIsLoading(false);
    }
  }, []);

  const updateSettings = useCallback((newSettings: Partial<AppSettings>) => {
    const updatedSettings = { ...settings, ...newSettings };
    setSettings(updatedSettings);
    StorageService.saveSettings(updatedSettings);
  }, [settings]);

  const addEntry = useCallback((entry: TOTPEntry) => {
    setEntries(prev => [...prev, entry]);
    StorageService.addEntry(entry);
  }, []);

  const updateEntry = useCallback((entry: TOTPEntry) => {
    setEntries(prev => prev.map(e => e.id === entry.id ? entry : e));
    StorageService.updateEntry(entry);
  }, []);

  const deleteEntry = useCallback((id: string) => {
    setEntries(prev => prev.filter(e => e.id !== id));
    StorageService.deleteEntry(id);
  }, []);

  const refreshEntries = useCallback(async () => {
    try {
      const loadedEntries = await StorageService.getEntries();
      setEntries(loadedEntries);
      setError(null);
    } catch (err) {
      setError(err instanceof Error ? err : new Error('Failed to refresh entries'));
    }
  }, []);

  useEffect(() => {
    loadInitialData();

    const subscription = AppState.addEventListener('change', (nextAppState: AppStateStatus) => {
      if (nextAppState === 'active') {
        refreshEntries();
      }
    });

    return () => {
      subscription.remove();
    };
  }, [loadInitialData, refreshEntries]);

  return {
    settings,
    entries,
    isLoading,
    error,
    updateSettings,
    addEntry,
    updateEntry,
    deleteEntry,
    refreshEntries
  };
}; 