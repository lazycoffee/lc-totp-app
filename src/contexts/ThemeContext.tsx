import AsyncStorage from '@react-native-async-storage/async-storage';
import React, { createContext, useContext, useEffect, useState } from 'react';
import { useColorScheme } from 'react-native';

type ThemeType = 'light' | 'dark' | 'system';

interface ThemeContextType {
  theme: ThemeType;
  setTheme: (theme: ThemeType) => void;
  isDarkMode: boolean;
  isLoading: boolean;
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  const systemColorScheme = useColorScheme();
  const [theme, setTheme] = useState<ThemeType>('system');
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Load saved theme preference synchronously
    const loadTheme = async () => {
      try {
        const savedTheme = await AsyncStorage.getItem('theme');
        if (savedTheme) {
          setTheme(savedTheme as ThemeType);
        }
      } finally {
        setIsLoading(false);
      }
    };
    loadTheme();
  }, []);

  const handleSetTheme = (newTheme: ThemeType) => {
    setTheme(newTheme);
    AsyncStorage.setItem('theme', newTheme);
  };

  const isDarkMode =
    theme === 'system' ? systemColorScheme === 'dark' : theme === 'dark';

  if (isLoading) {
    return null; // Don't render anything until theme is loaded
  }

  return (
    <ThemeContext.Provider
      value={{
        theme,
        setTheme: handleSetTheme,
        isDarkMode,
        isLoading,
      }}
    >
      {children}
    </ThemeContext.Provider>
  );
}

export function useThemeContext() {
  const context = useContext(ThemeContext);
  if (context === undefined) {
    throw new Error('useThemeContext must be used within a ThemeProvider');
  }
  return context;
} 