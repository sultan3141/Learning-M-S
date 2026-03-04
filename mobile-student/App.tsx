import React from 'react';
import { StatusBar } from 'expo-status-bar';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { AppNavigator } from './src/navigation/AppNavigator';
import { useThemeStore } from './src/store/useThemeStore';
import { Platform } from 'react-native';

// Safely import expo-navigation-bar
let NavigationBar: any;
try {
  NavigationBar = require('expo-navigation-bar');
} catch (e) {
  console.warn('NavigationBar library not found, relying on app.json settings');
}

export default function App() {
  const { theme } = useThemeStore();

  React.useEffect(() => {
    if (Platform.OS === 'android' && NavigationBar) {
      try {
        NavigationBar.setBackgroundColorAsync('#000000');
        NavigationBar.setButtonStyleAsync('light');
      } catch (e) {
        console.warn('Failed to set NavigationBar color:', e);
      }
    }
  }, []);

  return (
    <SafeAreaProvider>
      <StatusBar style={theme === 'dark' ? 'light' : 'dark'} translucent backgroundColor="transparent" />
      <AppNavigator />
    </SafeAreaProvider>
  );
}
