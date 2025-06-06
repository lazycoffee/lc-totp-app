import { HashAlgorithms } from '@otplib/core';
import React, { createContext, useCallback, useContext, useEffect, useState } from 'react';
import { v4 as uuidv4 } from 'uuid';
import { StorageService } from '../services/storage';
import { TotpConfig, TotpConfigForm, TotpContextType } from '../types/totp';

const TotpContext = createContext<TotpContextType | undefined>(undefined);

export const useTotp = () => {
  const context = useContext(TotpContext);
  if (!context) {
    throw new Error('useTotp must be used within a TotpProvider');
  }
  return context;
};

const formToConfig = (form: TotpConfigForm, id: string): TotpConfig => ({
  ...form,
  id,
  algorithm:
    form.algorithm === 'SHA-1' ? HashAlgorithms.SHA1 :
    form.algorithm === 'SHA-256' ? HashAlgorithms.SHA256 :
    HashAlgorithms.SHA512
});

export const TotpProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [configs, setConfigs] = useState<TotpConfig[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    try {
      const storedConfigs = StorageService.getEntries();
      setConfigs(storedConfigs);
    } catch (err) {
      setError('Failed to load TOTP configurations');
    } finally {
      setIsLoading(false);
    }
  }, []);

  const saveConfigs = useCallback((newConfigs: TotpConfig[]) => {
    try {
      StorageService.saveEntries(newConfigs);
      setConfigs(newConfigs);
    } catch (err) {
      setError('Failed to save TOTP configurations');
    }
  }, []);

  const addConfig = useCallback((form: TotpConfigForm) => {
    const newConfig = formToConfig(form, uuidv4());
    StorageService.addEntry(newConfig);
    setConfigs(prev => [...prev, newConfig]);
  }, []);

  const updateConfig = useCallback((idOrConfigs: string | TotpConfig[], form?: TotpConfigForm) => {
    if (Array.isArray(idOrConfigs)) {
      saveConfigs(idOrConfigs);
    } else if (form) {
      const updatedConfig = formToConfig(form, idOrConfigs);
      StorageService.updateEntry(updatedConfig);
      setConfigs(prev => prev.map(config => config.id === idOrConfigs ? updatedConfig : config));
    }
  }, [saveConfigs]);

  const deleteConfig = useCallback((id: string) => {
    StorageService.deleteEntry(id);
    setConfigs(prev => prev.filter(config => config.id !== id));
  }, []);

  const value = {
    configs,
    addConfig,
    updateConfig,
    deleteConfig,
    isLoading,
    error
  };

  return <TotpContext.Provider value={value}>{children}</TotpContext.Provider>;
}; 