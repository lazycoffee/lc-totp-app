import AsyncStorage from '@react-native-async-storage/async-storage';
import i18n from 'i18next';
import React, { createContext, useContext, useEffect, useState } from 'react';
import { initReactI18next } from 'react-i18next';

type LanguageType = 'en' | 'zh';

interface LanguageContextType {
  language: LanguageType;
  setLanguage: (language: LanguageType) => void;
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

// Initialize i18next
i18n.use(initReactI18next).init({
  resources: {
    en: {
      translation: {
        'settings.theme.title': 'Theme',
        'settings.theme.system': 'System',
        'settings.theme.light': 'Light',
        'settings.theme.dark': 'Dark',
        'settings.language.title': 'Language',
      },
    },
    zh: {
      translation: {
        'settings.theme.title': '主题',
        'settings.theme.system': '跟随系统',
        'settings.theme.light': '浅色',
        'settings.theme.dark': '深色',
        'settings.language.title': '语言',
      },
    },
  },
  lng: 'en',
  fallbackLng: 'en',
  interpolation: {
    escapeValue: false,
  },
});

export const LanguageProvider = ({ children }: { children: React.ReactNode }) => {
  const [language, setLanguage] = useState<LanguageType>('en');

  useEffect(() => {
    // Load saved language preference
    AsyncStorage.getItem('language').then((savedLanguage) => {
      if (savedLanguage) {
        setLanguage(savedLanguage as LanguageType);
        i18n.changeLanguage(savedLanguage);
      }
    });
  }, []);

  const handleSetLanguage = (newLanguage: LanguageType) => {
    setLanguage(newLanguage);
    i18n.changeLanguage(newLanguage);
    AsyncStorage.setItem('language', newLanguage);
  };

  return (
    <LanguageContext.Provider
      value={{
        language,
        setLanguage: handleSetLanguage,
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