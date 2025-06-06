import AsyncStorage from '@react-native-async-storage/async-storage';
import i18n from 'i18next';
import React, { createContext, useContext, useEffect, useState } from 'react';

type LanguageType = 'en' | 'zh';

interface LanguageContextType {
  language: LanguageType;
  setLanguage: (language: LanguageType) => void;
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

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