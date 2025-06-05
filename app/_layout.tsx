import { BottomSheetModalProvider } from '@gorhom/bottom-sheet';
import { Stack } from "expo-router";

export default function RootLayout() {
  return (
    <BottomSheetModalProvider>
      <Stack />
    </BottomSheetModalProvider>
  );
}
