import '@testing-library/jest-native/extend-expect';

// Mock expo modules
jest.mock('expo-local-authentication', () => ({
  authenticateAsync: jest.fn(),
  hasHardwareAsync: jest.fn(),
  isEnrolledAsync: jest.fn(),
}));

jest.mock('expo-router', () => ({
  useRouter: () => ({
    push: jest.fn(),
    replace: jest.fn(),
    back: jest.fn(),
  }),
  useLocalSearchParams: () => ({}),
}));

// Mock AsyncStorage
jest.mock('@react-native-async-storage/async-storage', () => ({
  setItem: jest.fn(),
  getItem: jest.fn(),
  removeItem: jest.fn(),
  clear: jest.fn(),
}));

// Mock MMKV storage
jest.mock('react-native-mmkv', () => ({
  MMKV: jest.fn().mockImplementation(() => ({
    set: jest.fn(),
    getString: jest.fn(),
    delete: jest.fn(),
    clearAll: jest.fn(),
  })),
}));

// Mock i18next
jest.mock('i18next', () => ({
  t: (key) => key,
  init: jest.fn(),
}));

// Mock react-native-reanimated
jest.mock('react-native-reanimated', () => ({
  useSharedValue: jest.fn(),
  useAnimatedStyle: jest.fn(),
  withSpring: jest.fn(),
  withTiming: jest.fn(),
  runOnJS: jest.fn(),
}));

// Mock expo-haptics
jest.mock('expo-haptics', () => ({
  notificationAsync: jest.fn(),
  impactAsync: jest.fn(),
}));

// Mock expo-blur
jest.mock('expo-blur', () => ({
  BlurView: 'BlurView',
}));

// Mock expo-image
jest.mock('expo-image', () => ({
  Image: 'Image',
}));

// Mock expo-symbols
jest.mock('expo-symbols', () => ({
  Symbol: 'Symbol',
}));

// Mock expo-system-ui
jest.mock('expo-system-ui', () => ({
  setBackgroundColorAsync: jest.fn(),
}));

// Mock expo-web-browser
jest.mock('expo-web-browser', () => ({
  openBrowserAsync: jest.fn(),
}));

// Mock expo-constants
jest.mock('expo-constants', () => ({
  expoConfig: {
    extra: {
      eas: {
        projectId: 'test-project-id',
      },
    },
  },
}));

// Mock expo-linking
jest.mock('expo-linking', () => ({
  createURL: jest.fn(),
  parse: jest.fn(),
}));

// Mock expo-splash-screen
jest.mock('expo-splash-screen', () => ({
  preventAutoHideAsync: jest.fn(),
  hideAsync: jest.fn(),
}));

// Mock expo-status-bar
jest.mock('expo-status-bar', () => ({
  StatusBar: 'StatusBar',
}));

// Mock expo-dev-client
jest.mock('expo-dev-client', () => ({
  getDevClient: jest.fn(),
}));

// Mock expo-font
jest.mock('expo-font', () => ({
  useFonts: jest.fn(),
}));

// Mock react-native-gesture-handler
jest.mock('react-native-gesture-handler', () => ({
  GestureHandlerRootView: 'GestureHandlerRootView',
  PanGestureHandler: 'PanGestureHandler',
  TapGestureHandler: 'TapGestureHandler',
}));

// Mock react-native-safe-area-context
jest.mock('react-native-safe-area-context', () => ({
  SafeAreaProvider: 'SafeAreaProvider',
  useSafeAreaInsets: jest.fn(),
}));

// Mock react-native-screens
jest.mock('react-native-screens', () => ({
  enableScreens: jest.fn(),
}));

// Mock react-native-webview
jest.mock('react-native-webview', () => ({
  WebView: 'WebView',
}));

// Mock react-native-progress
jest.mock('react-native-progress', () => ({
  Circle: 'Circle',
  Bar: 'Bar',
}));

// Mock @gorhom/bottom-sheet
jest.mock('@gorhom/bottom-sheet', () => ({
  BottomSheetModal: 'BottomSheetModal',
  BottomSheetBackdrop: 'BottomSheetBackdrop',
}));

// Mock @react-native-picker/picker
jest.mock('@react-native-picker/picker', () => ({
  Picker: 'Picker',
}));

// Mock @react-navigation/bottom-tabs
jest.mock('@react-navigation/bottom-tabs', () => ({
  createBottomTabNavigator: jest.fn(),
}));

// Mock @react-navigation/elements
jest.mock('@react-navigation/elements', () => ({
  Header: 'Header',
}));

// Mock @react-navigation/native
jest.mock('@react-navigation/native', () => ({
  useNavigation: jest.fn(),
  useRoute: jest.fn(),
}));

// Mock @expo/vector-icons
jest.mock('@expo/vector-icons', () => ({
  MaterialIcons: 'MaterialIcons',
  Ionicons: 'Ionicons',
  FontAwesome: 'FontAwesome',
}));

// Mock react-hook-form
jest.mock('react-hook-form', () => ({
  useForm: jest.fn(),
  Controller: 'Controller',
}));

// Mock react-i18next
jest.mock('react-i18next', () => ({
  useTranslation: () => ({
    t: (key) => key,
    i18n: {
      changeLanguage: jest.fn(),
    },
  }),
}));

// Mock otpauth
jest.mock('otpauth', () => ({
  TOTP: jest.fn(),
}));

// Mock otplib
jest.mock('otplib', () => ({
  authenticator: {
    generate: jest.fn(),
    verify: jest.fn(),
  },
}));

// Mock uuid
jest.mock('uuid', () => ({
  v4: jest.fn(),
}));

// Mock buffer
jest.mock('buffer', () => ({
  Buffer: {
    from: jest.fn(),
  },
})); 