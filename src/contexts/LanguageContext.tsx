import AsyncStorage from '@react-native-async-storage/async-storage';
import i18n from 'i18next';
import React, { createContext, useContext, useEffect, useState } from 'react';
import { NativeModules, Platform } from 'react-native';

type LanguageType = 'en' | 'zh' | 'system';

interface LanguageContextType {
  language: LanguageType;
  setLanguage: (language: LanguageType) => void;
  currentLanguage: 'en' | 'zh';
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

const getSystemLanguage = (): 'en' | 'zh' => {
  if (Platform.OS === 'web') {
    // For web platform, use browser's language
    const browserLang = navigator.language || (navigator as any).userLanguage;
    return browserLang.startsWith('zh') ? 'zh' : 'en';
  }

  // For native platforms
  const deviceLanguage =
    Platform.OS === 'ios'
      ? NativeModules.SettingsManager.settings.AppleLocale ||
        NativeModules.SettingsManager.settings.AppleLanguages[0]
      : NativeModules.I18nManager.localeIdentifier;

  return deviceLanguage.startsWith('zh') ? 'zh' : 'en';
};

export const LanguageProvider = ({ children }: { children: React.ReactNode }) => {
  const [language, setLanguage] = useState<LanguageType>('en');
  const [currentLanguage, setCurrentLanguage] = useState<'en' | 'zh'>('en');

  useEffect(() => {
    // Load saved language preference
    AsyncStorage.getItem('language').then((savedLanguage) => {
      if (savedLanguage) {
        const newLanguage = savedLanguage as LanguageType;
        setLanguage(newLanguage);
        const actualLanguage = newLanguage === 'system' ? getSystemLanguage() : newLanguage;
        setCurrentLanguage(actualLanguage);
        i18n.changeLanguage(actualLanguage);
      }
    });
  }, []);

  const handleSetLanguage = (newLanguage: LanguageType) => {
    setLanguage(newLanguage);
    const actualLanguage = newLanguage === 'system' ? getSystemLanguage() : newLanguage;
    setCurrentLanguage(actualLanguage);
    i18n.changeLanguage(actualLanguage);
    AsyncStorage.setItem('language', newLanguage);
  };

  return (
    <LanguageContext.Provider
      value={{
        language,
        setLanguage: handleSetLanguage,
        currentLanguage,
      }}
    >
      {children}
    </LanguageContext.Provider>
  );
};

export const useLanguageContext = () => {
  const context = useContext(LanguageContext);
  if (context === undefined) {
    throw new Error('useLanguageContext must be used within a LanguageProvider');
  }
  return context;
}; 