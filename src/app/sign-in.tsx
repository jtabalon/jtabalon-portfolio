import { useAuth } from '@clerk/expo';
import { Redirect, useLocalSearchParams } from 'expo-router';
import { useEffect, useState } from 'react';
import { Platform, Text, View } from 'react-native';

import { SectionHeading, SiteFrame, Surface } from '@/components/site-frame';
import { hasClerk } from '@/lib/env';

function ConnectedSignInRoute() {
  const { isLoaded, isSignedIn } = useAuth();
  const params = useLocalSearchParams<{ redirect?: string }>();
  const redirectTo = typeof params.redirect === 'string' ? params.redirect : '/admin';
  const [webSignIn, setWebSignIn] = useState<null | typeof import('@clerk/expo/web').SignIn>(null);

  useEffect(() => {
    if (Platform.OS !== 'web') {
      return;
    }

    import('@clerk/expo/web').then((module) => {
      setWebSignIn(() => module.SignIn);
    });
  }, []);

  if (isLoaded && isSignedIn) {
    return <Redirect href={redirectTo} />;
  }

  if (Platform.OS === 'web') {
    if (!webSignIn) {
      return (
        <SiteFrame
          activeRoute="/sign-in"
          title="Loading sign-in"
          intro="Preparing the Clerk web components for the private admin flow."
        />
      );
    }

    const WebSignIn = webSignIn;

    return (
      <SiteFrame
        activeRoute="/sign-in"
        title="Private admin access"
        intro="The public site stays open. Only the admin surface needs Clerk authentication.">
        <View className="items-start">
          <Surface className="w-full max-w-xl">
            <WebSignIn
              routing="path"
              path="/sign-in"
              forceRedirectUrl={redirectTo}
              fallbackRedirectUrl={redirectTo}
            />
          </Surface>
        </View>
      </SiteFrame>
    );
  }

  return (
    <SiteFrame
      activeRoute="/sign-in"
      title="Web-first auth"
      intro="The v1 sign-in experience uses Clerk’s prebuilt web flow. Native sign-in can be added later without changing the content model.">
      <SectionHeading
        eyebrow="Sign in"
        title="Open this route on web."
        description="Because this project is web-first in v1, the polished sign-in experience is implemented for Expo web first and can be extended to native when you want to ship mobile."
      />
    </SiteFrame>
  );
}

export default function SignInRoute() {
  if (!hasClerk) {
    return (
      <SiteFrame
        activeRoute="/sign-in"
        title="Auth needs keys first."
        intro="Clerk is wired into the app, but the publishable key and issuer domain still need to be added to your local environment.">
        <Surface className="gap-3">
          <Text className="font-body text-base leading-8 text-muted">
            Add `EXPO_PUBLIC_CLERK_PUBLISHABLE_KEY` for the Expo app and `CLERK_JWT_ISSUER_DOMAIN`
            for Convex. Once those exist, this route will render Clerk’s web sign-in flow.
          </Text>
        </Surface>
      </SiteFrame>
    );
  }

  return <ConnectedSignInRoute />;
}
