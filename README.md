# Coterie — Native App

React Native + Expo SDK 51 app for the Coterie private fashion network.

## Stack

- **Framework**: Expo SDK 51 + Expo Router (file-based routing)
- **Language**: TypeScript (strict mode)
- **Fonts**: Cormorant Garamond (300, 300 Italic, 400, 400 Italic) + Inter (400, 500)
- **Navigation**: Expo Router with Stack (root) → `(auth)` group → `(app)` tab group
- **Auth**: AsyncStorage-backed mock auth (`contexts/AuthContext.tsx`)
- **Haptics**: `expo-haptics` throughout all interactions
- **Gestures**: `react-native-gesture-handler` + `react-native-reanimated`

## Getting Started

```bash
cd coterie-app
npm install
npx expo start
```

Then press `i` for iOS Simulator or `a` for Android Emulator.

## Screens

| Route | Screen | Description |
|---|---|---|
| `/` | Splash | Animated editorial entrance |
| `/(auth)/sign-in` | Sign In | Email + password, mock auth |
| `/(app)/` | Dashboard | Activity feed, availability toggle, pending intros, matched roles |
| `/(app)/opportunities` | Roles | Searchable + filterable job board with full-screen detail sheet + bookmarks |
| `/(app)/introductions` | Intros | Swipe-to-accept/decline cards, request form, history |
| `/(app)/events` | Events | Upcoming/past private events with RSVP modal |
| `/(app)/profile` | Profile | Portfolio/Badges/Privacy tabs, edit mode, credits |

## Design System

All design tokens live in `constants/Colors.ts`:

- **Background**: `#0B0B0B`
- **Surface**: `#111111`
- **Elevated**: `#171717`
- **Border**: `#1E1E1E`
- **Text**: `#EDEDEB`
- **Muted**: `#8C8C8A`
- **Gold**: `#C9A84C`
- **Emerald**: `#34D399`

## App Differentiators vs Website

- **Swipe gestures** on introduction cards (accept/decline like Tinder)
- **Bookmark system** for opportunities (star/save roles, persists in session)
- **Activity feed** on Dashboard with unread indicators
- **Pull-to-refresh** on all list screens
- **Haptic feedback** on every meaningful interaction
- **Native bottom sheets** for opportunity detail (slides up from bottom)
- **Availability toggle** with animated indicator on Dashboard
- **RSVP confirmation flow** in Events with multi-step modal
- **Swipe card stack** for pending introductions with visual accept/decline overlays
# Coterie-app
# Coterie.app
