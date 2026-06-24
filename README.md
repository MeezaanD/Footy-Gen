# NextUp

NextUp is a React Native mobile app for generating balanced random teams for soccer and padel.

## Features

- Choose between Soccer and Padel
- Add player names manually with validation
- Optional session naming
- Sport-specific format selection
- Generate balanced random teams
- Save generations locally on device
- Browse and manage session history
- Black / yellow glass-style UI

## Tech Stack

- Expo (managed workflow)
- React Native
- TypeScript
- React Navigation (bottom tabs + native stack)
- AsyncStorage for local persistence
- expo-blur for glassmorphism
- lucide-react-native for icons

## Run locally

```bash
npm install
npm start
```

Then press `i` for iOS simulator, `a` for Android emulator, or scan the QR code with Expo Go.

## Typecheck

```bash
npm run typecheck
```

## Project structure

- `App.tsx` - App entry with navigation
- `src/screens/` - Generator, Result, History, Settings
- `src/navigation/` - Tab and stack navigators
- `src/components/` - UI and feature components
- `src/storage/` - AsyncStorage helpers
- `src/utils/` - Team generation and validation logic
- `src/theme/` - Colors, spacing, typography tokens
