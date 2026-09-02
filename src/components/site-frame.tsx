import type { ReactNode } from 'react';
import { Link, type Href } from 'expo-router';
import { Pressable, ScrollView, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { scrollToSection } from '@/lib/scroll-to-section';

interface SiteFrameProps {
  navigation: readonly { label: string; targetId: string }[];
  children?: ReactNode;
}

function NavLink({ label, targetId }: { label: string; targetId: string }) {
  const href = `/#${targetId}` as Href;

  return (
    <Link href={href} asChild>
      <Pressable
        className="cursor-pointer rounded-md px-2 py-2 hover:bg-wash focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent focus-visible:ring-offset-2 focus-visible:ring-offset-canvas active:opacity-70 md:px-3"
        onPress={() => scrollToSection(targetId)}>
        <Text className="font-body-medium text-[13px] text-muted md:text-sm">
          {label}
        </Text>
      </Pressable>
    </Link>
  );
}

export function SiteFrame({ navigation, children }: SiteFrameProps) {
  return (
    <SafeAreaView className="flex-1 bg-canvas">
      <ScrollView className="flex-1" showsVerticalScrollIndicator={false}>
        <View className="mx-auto w-full max-w-6xl px-6 pb-20 pt-5 md:px-10 md:pt-8">
          <View className="flex-row items-center justify-between gap-2 md:gap-4">
            <Text className="shrink font-body-semibold text-xs text-ink tracking-tight md:text-sm">
              joseph tabalon
            </Text>

            <View className="flex-row gap-0.5 md:gap-1">
              {navigation.map((item) => (
                <NavLink
                  key={item.targetId}
                  label={item.label}
                  targetId={item.targetId}
                />
              ))}
            </View>
          </View>

          <View className="mt-10 md:mt-14">{children}</View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}
