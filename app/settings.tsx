import { useTheme } from '@react-navigation/native';
import React, { useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import { useLanguageContext } from '../src/contexts/LanguageContext';
import { useThemeContext } from '../src/contexts/ThemeContext';

type ThemeType = 'light' | 'dark' | 'system';

export default function SettingsScreen() {
  const { colors } = useTheme();
  const { t, i18n } = useTranslation();
  const { theme, setTheme } = useThemeContext();
  const { language, setLanguage } = useLanguageContext();

  useEffect(() => {
    console.log('Current language:', i18n.language);
    console.log('Available resources:', i18n.options.resources);
    console.log('Theme translations:', {
      title: t('settings.theme.title'),
      system: t('settings.theme.system'),
      light: t('settings.theme.light'),
      dark: t('settings.theme.dark'),
    });
    console.log('Language translations:', {
      title: t('settings.language.title'),
      en: t('settings.language.en'),
      zh: t('settings.language.zh'),
    });
  }, [i18n.language, t]);

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
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <View style={styles.section}>
        <Text style={[styles.sectionTitle, { color: colors.text }]}>
          {t('settings.theme.title')}
        </Text>
        {themeOptions.map((option) => (
          <Pressable
            key={option.value}
            style={[
              styles.option,
              {
                backgroundColor: theme === option.value ? colors.primary : colors.card,
              },
            ]}
            onPress={() => setTheme(option.value)}
          >
            <Text
              style={[
                styles.optionText,
                { color: theme === option.value ? colors.background : colors.text },
              ]}
            >
              {option.label}
            </Text>
          </Pressable>
        ))}
      </View>

      <View style={styles.section}>
        <Text style={[styles.sectionTitle, { color: colors.text }]}>
          {t('settings.language.title')}
        </Text>
        {languageOptions.map((option) => (
          <Pressable
            key={option.value}
            style={[
              styles.option,
              {
                backgroundColor: language === option.value ? colors.primary : colors.card,
              },
            ]}
            onPress={() => setLanguage(option.value as 'en' | 'zh')}
          >
            <Text
              style={[
                styles.optionText,
                { color: language === option.value ? colors.background : colors.text },
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