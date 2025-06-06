import { BottomSheetModalProvider } from '@gorhom/bottom-sheet';
import { DarkTheme, DefaultTheme } from '@react-navigation/native';
import { Stack } from "expo-router";
import { LanguageProvider } from '../src/contexts/LanguageContext';
import { ThemeProvider, useThemeContext } from '../src/contexts/ThemeContext';
import '../src/i18n';

function RootLayoutNav() {
  const { isDarkMode } = useThemeContext();
  const theme = isDarkMode ? DarkTheme : DefaultTheme;

  return (
    <Stack
      screenOptions={{
        headerTitle: "LazyCoffee TOTP",
        headerStyle: {
          backgroundColor: theme.colors.background,
        },
        headerTintColor: theme.colors.text,
        headerTitleStyle: {
          fontWeight: 'bold',
        },
      }}
    />
  );
}

export default function RootLayout() {
  return (
    <ThemeProvider>
      <LanguageProvider>
        <BottomSheetModalProvider>
          <RootLayoutNav />
        </BottomSheetModalProvider>
      </LanguageProvider>
    </ThemeProvider>
  );
}
