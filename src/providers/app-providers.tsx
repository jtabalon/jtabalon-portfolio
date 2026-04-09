import { ClerkProvider, useAuth } from '@clerk/expo';
import { tokenCache } from '@clerk/expo/token-cache';
import { ConvexProvider } from 'convex/react';
import { ConvexProviderWithClerk } from 'convex/react-clerk';
import type { ReactNode } from 'react';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { SafeAreaProvider } from 'react-native-safe-area-context';

import { getConvexClient } from '@/lib/convex';
import { env, hasClerk } from '@/lib/env';

function BaseProviders({ children }: { children: ReactNode }) {
  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <SafeAreaProvider>{children}</SafeAreaProvider>
    </GestureHandlerRootView>
  );
}

export function AppProviders({ children }: { children: ReactNode }) {
  const convex = getConvexClient();

  if (hasClerk && convex) {
    return (
      <BaseProviders>
        <ClerkProvider publishableKey={env.clerkPublishableKey} tokenCache={tokenCache}>
          <ConvexProviderWithClerk client={convex} useAuth={useAuth}>
            {children}
          </ConvexProviderWithClerk>
        </ClerkProvider>
      </BaseProviders>
    );
  }

  if (hasClerk) {
    return (
      <BaseProviders>
        <ClerkProvider publishableKey={env.clerkPublishableKey} tokenCache={tokenCache}>
          {children}
        </ClerkProvider>
      </BaseProviders>
    );
  }

  if (convex) {
    return (
      <BaseProviders>
        <ConvexProvider client={convex}>{children}</ConvexProvider>
      </BaseProviders>
    );
  }

  return <BaseProviders>{children}</BaseProviders>;
}
