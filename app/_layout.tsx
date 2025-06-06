import { BottomSheetModalProvider } from '@gorhom/bottom-sheet';
import { Stack } from "expo-router";
import '../src/i18n'; // Import i18n configuration

export default function RootLayout() {
  return (
    <BottomSheetModalProvider>
      <Stack
        screenOptions={{
          headerTitle: "LazyCoffee TOTP",
          headerStyle: {
            backgroundColor: '#fff',
          },
          headerTintColor: '#000',
          headerTitleStyle: {
            fontWeight: 'bold',
          },
        }}
      />
    </BottomSheetModalProvider>
  );
}
