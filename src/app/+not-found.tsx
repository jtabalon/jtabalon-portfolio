import { Link } from 'expo-router';
import Head from 'expo-router/head';
import { ScrollView, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { publicSiteContent } from '@/data/public-site-content';

export default function NotFoundRoute() {
  return (
    <>
      <Head>
        <title>{`Page not found | ${publicSiteContent.name}`}</title>
        <meta name="robots" content="noindex, follow" />
      </Head>
      <SafeAreaView className="flex-1 bg-canvas">
        <ScrollView className="flex-1" showsVerticalScrollIndicator={false}>
          <View
            role="main"
            className="mx-auto w-full max-w-2xl gap-6 px-6 py-20 md:px-10 md:py-28">
            <Text className="font-body-medium text-sm text-muted">
              {publicSiteContent.name}
            </Text>
            <View className="gap-4 border-t border-line pt-6">
              <Text className="font-mono text-xs text-accent">404</Text>
              <Text
                accessibilityRole="header"
                aria-level={1}
                className="font-body-semibold text-[36px] leading-[42px] text-ink tracking-tight md:text-[44px] md:leading-[50px]">
                Page not found
              </Text>
              <Text className="font-body text-base leading-7 text-muted">
                The page you’re looking for is unavailable. You can return to the
                homepage to view my work or get in touch.
              </Text>
              <View className="items-start pt-2">
                <Link
                  href="/"
                  className="rounded-md py-2 font-body-medium text-base text-ink underline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent focus-visible:ring-offset-2 focus-visible:ring-offset-canvas">
                  Return to homepage
                </Link>
              </View>
            </View>
          </View>
        </ScrollView>
      </SafeAreaView>
    </>
  );
}
