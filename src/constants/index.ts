export const APP_CONSTANTS = {
  SAMPLE: 'sample',
  STORAGE_KEYS: {
    ENTRIES: '@totp_entries',
    SETTINGS: '@totp_settings',
    AUTH_STATE: '@totp_auth_state'
  },
  DEFAULT_SETTINGS: {
    theme: 'system',
    language: 'en',
    biometricEnabled: false,
    autoLockTimeout: 300 // 5 minutes in seconds
  },
  TOTP_DEFAULTS: {
    algorithm: 'SHA1',
    digits: 6,
    period: 30
  },
  ROUTES: {
    HOME: '/',
    ADD_ENTRY: '/add',
    EDIT_ENTRY: '/edit',
    SETTINGS: '/settings',
    AUTH: '/auth'
  }
} as const;

export const THEME = {
  LIGHT: 'light',
  DARK: 'dark',
  SYSTEM: 'system'
} as const;

export const ALGORITHMS = {
  SHA1: 'SHA1',
  SHA256: 'SHA256',
  SHA512: 'SHA512'
} as const; 