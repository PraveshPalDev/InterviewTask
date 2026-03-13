# 🛒 React Native Shopping App

A high-performance, scalable React Native application built for a technical assessment. The app demonstrates advanced API integration, global state management with Redux, data persistence, and offline capabilities.

## 🚀 Key Features

- **Product Explorer**: A smooth, paginated listing of products fetched from DummyJSON.
- **Advanced Cart Logic**: 
  - Real-time calculation of original vs. discounted prices.
  - Automatic quantity management (prevents duplicates).
  - Persistence across app restarts using `AsyncStorage`.
- **Offline Resilience**:
  - Automatic caching of the first page of products.
  - Graceful fallback to cached data when the network is unavailable.
  - Real-time "Offline Mode" UI banner indicators.
- **Premium UI/UX**:
  - 2-column grid layout for product browsing.
  - Horizontal image carousels for product details.
  - Type-safe navigation flows with React Navigation.

## 🛠️ Technology Stack

- **Framework**: React Native (CLI)
- **Language**: TypeScript (Strict mode)
- **State Management**: Redux Toolkit + Redux Persist
- **Navigation**: React Navigation (Stack)
- **API Client**: Axios with global interceptors
- **Storage**: AsyncStorage
- **Styling**: Vanilla StyleSheet with a centralized `theme` system

## 📂 Project Structure

The project follows a **Clean Architecture** pattern to ensure modularity and ease of testing.

```text
/src
  ├── api/          # Axios instance, interceptors, and endpoint constants
  ├── components/   # Reusable UI atoms and molecules
  ├── constants/    # App-wide configurations and static values
  ├── hooks/        # Custom hooks (e.g., useNetwork for connectivity)
  ├── navigation/   # Type-safe navigation stacks and screen definitions
  ├── screens/      # Full-page components (Home, Detail, Cart)
  ├── services/     # Business logic & API calls (Separated from UI)
  ├── store/        # Redux Toolkit slices and persistence config
  ├── theme/        # Global style tokens (Colors, Spacing, Typography)
  ├── types/        # TypeScript interfaces for API and data models
  └── utils/        # Utility helpers (Price calculations, storage wrappers)
```

## 📋 Business Logic Details

### 💰 Discount Calculation
The app uses a strict formula for all pricing displays:
`discountedPrice = price - (price * discountPercentage / 100)`
This logic is centralized in `src/utils/price.ts` to ensure consistency across all screens.

### 📶 Offline Strategy
1. The app monitors network status using `@react-native-community/netinfo`.
2. Every successful load of the Home screen caches the top 10 products.
3. If an API call fails or the `isOffline` hook returns true, the app injects cached data into the UI.

## ⚙️ Setup & Installation

### 1. Prerequisites
- Node.js > 22
- JDK 17+ (for Android)
- Android Studio / CocoaPods (for iOS)

### 2. Installation
```bash
# Install dependencies
npm install
```

### 3. Environment Setup
Create a `.env` file in the root directory:
```env
API_BASE_URL=https://dummyjson.com
API_TIMEOUT=15000
```

### 4. Running the App
```bash
# Start Metro Bundler
npm start

# Run on Android
npm run android

# Run on iOS
npx pod-install && npm run ios
```

---
Generated with ❤️ by Antigravity AI Assistant.
