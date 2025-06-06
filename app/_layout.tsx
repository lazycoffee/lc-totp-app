import { Ionicons } from '@expo/vector-icons';
import { BottomSheetModalProvider } from '@gorhom/bottom-sheet';
import { DarkTheme, DefaultTheme } from '@react-navigation/native';
import { Stack, useRouter } from "expo-router";
import { TouchableOpacity } from 'react-native';
import { LanguageProvider } from '../src/contexts/LanguageContext';
import { ThemeProvider, useThemeContext } from '../src/contexts/ThemeContext';
import '../src/i18n';

function RootLayoutNav() {
  const { isDarkMode } = useThemeContext();
  const theme = isDarkMode ? DarkTheme : DefaultTheme;
  const router = useRouter();

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
        headerRight: () => (
          <TouchableOpacity
            onPress={() => router.push('/settings')}
            style={{ marginRight: 15 }}
          >
            <Ionicons name="settings-outline" size={24} color={theme.colors.text} />
          </TouchableOpacity>
        ),
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
