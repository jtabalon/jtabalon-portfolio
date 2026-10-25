import { Stack } from 'expo-router';
import * as SplashScreen from 'expo-splash-screen';
import { useEffect } from 'react';
import { SafeAreaProvider } from 'react-native-safe-area-context';

import '@/global.css';
import { useSiteFonts } from '@/lib/use-site-fonts';

SplashScreen.preventAutoHideAsync().catch(() => undefined);

export default function RootLayout() {
  const fontsLoaded = useSiteFonts();

  useEffect(() => {
    if (fontsLoaded) {
      SplashScreen.hideAsync().catch(() => undefined);
    }
  }, [fontsLoaded]);

  if (!fontsLoaded) {
    return null;
  }

  return (
    <SafeAreaProvider>
      <Stack
        screenOptions={{
          headerShown: false,
          animation: 'fade',
          contentStyle: { backgroundColor: '#f5f0e7' },
        }}
      />
    </SafeAreaProvider>
  );
}
