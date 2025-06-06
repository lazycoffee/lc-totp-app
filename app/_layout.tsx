import { Ionicons } from '@expo/vector-icons';
import { BottomSheetModalProvider } from '@gorhom/bottom-sheet';
import { DarkTheme, DefaultTheme } from '@react-navigation/native';
import { Stack, usePathname, useRouter } from "expo-router";
import { TouchableOpacity } from 'react-native';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { LanguageProvider } from '../src/contexts/LanguageContext';
import { ThemeProvider, useThemeContext } from '../src/contexts/ThemeContext';
import { TotpProvider } from '../src/contexts/TotpContext';
import '../src/i18n';

function RootLayoutNav() {
  const { isDarkMode } = useThemeContext();
  const theme = isDarkMode ? DarkTheme : DefaultTheme;
  const router = useRouter();
  const pathname = usePathname();
  const isSettingsPage = pathname === '/settings';
  const isHomePage = pathname === '/';

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
        headerLeft: isSettingsPage ? () => (
          <TouchableOpacity
            onPress={() => router.back()}
            style={{ marginLeft: 15 }}
          >
            <Ionicons name="arrow-back" size={24} color={theme.colors.text} />
          </TouchableOpacity>
        ) : undefined,
        headerRight: isSettingsPage ? undefined : () => (
          <TouchableOpacity
            onPress={() => router.push('/settings')}
            style={{ marginRight: 15 }}
          >
            <Ionicons name="settings-outline" size={24} color={theme.colors.text} />
          </TouchableOpacity>
        ),
        animation: 'slide_from_right',
        presentation: 'card',
      }}
    />
  );
}

export default function RootLayout() {
  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <ThemeProvider>
        <LanguageProvider>
          <BottomSheetModalProvider>
            <TotpProvider>
              <RootLayoutNav />
            </TotpProvider>
          </BottomSheetModalProvider>
        </LanguageProvider>
      </ThemeProvider>
    </GestureHandlerRootView>
  );
}
