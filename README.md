# TOTP Authenticator App

A secure and user-friendly Time-based One-Time Password (TOTP) authenticator app built with React Native and Expo.

## Features

- Generate TOTP codes for multiple accounts
- Secure storage using MMKV
- Biometric authentication support
- Dark/Light theme support
- Internationalization support
- Offline functionality
- Modern and intuitive UI

## Prerequisites

- Node.js (v16 or higher)
- npm or yarn
- Expo CLI
- iOS Simulator (for iOS development)
- Android Studio (for Android development)

## Installation

1. Clone the repository:
```bash
git clone https://github.com/yourusername/totp-authenticator.git
cd totp-authenticator
```

2. Install dependencies:
```bash
npm install
# or
yarn install
```

3. Start the development server:
```bash
npm start
# or
yarn start
```

## Project Structure

```
src/
├── components/     # Reusable UI components
├── hooks/         # Custom React hooks
├── services/      # Business logic and services
├── store/         # State management
├── types/         # TypeScript type definitions
├── constants/     # App constants
├── config/        # Configuration files
├── assets/        # Static assets
└── styles/        # Global styles
```

## Development

### Available Scripts

- `npm start` - Start the Expo development server
- `npm run android` - Run on Android device/emulator
- `npm run ios` - Run on iOS simulator
- `npm run web` - Run in web browser
- `npm run lint` - Run ESLint
- `npm test` - Run tests
- `npm run type-check` - Run TypeScript type checking

### Code Style

This project uses:
- ESLint for code linting
- Prettier for code formatting
- TypeScript for type safety

### Testing

The project uses Jest and React Native Testing Library for testing. Run tests with:

```bash
npm test
```

## Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## Security

- All sensitive data is stored securely using MMKV
- Biometric authentication is available for additional security
- No data is sent to external servers
- All TOTP generation happens locally on the device

## License

This is a private project. All right reserved.

## Acknowledgments

- [Expo](https://expo.dev/)
- [React Native](https://reactnative.dev/)
- [OTPLib](https://github.com/yeojz/otplib)
- [MMKV](https://github.com/mrousavy/react-native-mmkv)