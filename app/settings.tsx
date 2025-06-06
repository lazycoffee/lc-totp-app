import React from 'react';
import { useTranslation } from 'react-i18next';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import { useLanguageContext } from '../src/contexts/LanguageContext';
import { useThemeContext } from '../src/contexts/ThemeContext';
import { colors } from '../src/services/theme';

type ThemeType = 'light' | 'dark' | 'system';

export default function SettingsScreen() {
  const { t } = useTranslation();
  const { theme, setTheme, isDarkMode } = useThemeContext();
  const { language, setLanguage } = useLanguageContext();

  const themeOptions: { value: ThemeType; label: string }[] = [
    { value: 'system', label: t('settings.theme.system') },
    { value: 'light', label: t('settings.theme.light') },
    { value: 'dark', label: t('settings.theme.dark') },
  ];

  const languageOptions = [
    { value: 'en', label: t('settings.language.en') },
    { value: 'zh', label: t('settings.language.zh') },
  ];

  return (
    <View style={[styles.container, { backgroundColor: isDarkMode ? colors.dark.background : colors.light.background }]}>
      <View style={styles.section}>
        <Text style={[styles.sectionTitle, { color: isDarkMode ? colors.dark.text : colors.light.text }]}>
          {t('settings.theme.title')}
        </Text>
        {themeOptions.map((option) => (
          <Pressable
            key={option.value}
            style={[
              styles.option,
              {
                backgroundColor: theme === option.value 
                  ? (isDarkMode ? colors.dark.primary : colors.light.primary)
                  : (isDarkMode ? colors.dark.card : colors.light.card),
                borderColor: isDarkMode ? colors.dark.border : colors.light.border,
                borderWidth: 1,
              },
            ]}
            onPress={() => setTheme(option.value)}
          >
            <Text
              style={[
                styles.optionText,
                { 
                  color: theme === option.value 
                    ? (isDarkMode ? colors.dark.background : colors.light.background)
                    : (isDarkMode ? colors.dark.text : colors.light.text),
                  fontWeight: theme === option.value ? '600' : '400',
                },
              ]}
            >
              {option.label}
            </Text>
          </Pressable>
        ))}
      </View>

      <View style={styles.section}>
        <Text style={[styles.sectionTitle, { color: isDarkMode ? colors.dark.text : colors.light.text }]}>
          {t('settings.language.title')}
        </Text>
        {languageOptions.map((option) => (
          <Pressable
            key={option.value}
            style={[
              styles.option,
              {
                backgroundColor: language === option.value 
                  ? (isDarkMode ? colors.dark.primary : colors.light.primary)
                  : (isDarkMode ? colors.dark.card : colors.light.card),
                borderColor: isDarkMode ? colors.dark.border : colors.light.border,
                borderWidth: 1,
              },
            ]}
            onPress={() => setLanguage(option.value as 'en' | 'zh')}
          >
            <Text
              style={[
                styles.optionText,
                { 
                  color: language === option.value 
                    ? (isDarkMode ? colors.dark.background : colors.light.background)
                    : (isDarkMode ? colors.dark.text : colors.light.text),
                  fontWeight: language === option.value ? '600' : '400',
                },
              ]}
            >
              {option.label}
            </Text>
          </Pressable>
        ))}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
  },
  section: {
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 12,
  },
  option: {
    padding: 16,
    borderRadius: 8,
    marginBottom: 8,
  },
  optionText: {
    fontSize: 16,
  },
}); 