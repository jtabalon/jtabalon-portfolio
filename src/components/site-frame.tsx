import type { ReactNode } from 'react';
import { Link, type Href } from 'expo-router';
import { Pressable, ScrollView, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

interface SiteFrameProps {
  activeRoute: '/' | '/blog' | '/admin' | '/sign-in';
  title?: string;
  intro?: string;
  children?: ReactNode;
}

function NavLink({ href, label, active }: { href: Href; label: string; active: boolean }) {
  return (
    <Link href={href} asChild>
      <Pressable
        className={`rounded-md px-3 py-2 ${active ? 'bg-graphite' : 'bg-transparent'}`}>
        <Text
          className={`font-mono text-[11px] tracking-whisper ${
            active ? 'text-paper' : 'text-slate'
          }`}>
          {label.toLowerCase()}
        </Text>
      </Pressable>
    </Link>
  );
}

export function SiteFrame({ activeRoute, title, intro, children }: SiteFrameProps) {
  return (
    <SafeAreaView className="flex-1 bg-canvas">
      <ScrollView className="flex-1" showsVerticalScrollIndicator={false}>
        <View className="mx-auto w-full max-w-6xl px-6 pb-20 pt-5 md:px-10 md:pt-8">
          <View className="flex flex-row items-center justify-between gap-4">
            <Text className="font-mono-medium text-sm text-graphite tracking-tight">
              joseph tabalon
            </Text>

            <View className="flex-row flex-wrap gap-1">
              <NavLink href="/" label="Home" active={activeRoute === '/'} />
              <NavLink href="/blog" label="Blog" active={activeRoute === '/blog'} />
              <NavLink href="/admin" label="Admin" active={activeRoute === '/admin' || activeRoute === '/sign-in'} />
            </View>
          </View>

          {(title || intro) && (
            <View className="mt-16 max-w-3xl gap-4">
              {title ? (
                <Text className="font-display-bold text-[46px] leading-[52px] text-ink md:text-[62px] md:leading-[68px]">
                  {title}
                </Text>
              ) : null}
              {intro ? (
                <Text className="max-w-2xl font-body text-base leading-8 text-muted md:text-lg">
                  {intro}
                </Text>
              ) : null}
            </View>
          )}

          <View className="mt-14">{children}</View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

export function SectionHeading({
  eyebrow,
  title,
  description,
}: {
  eyebrow: string;
  title: string;
  description: string;
}) {
  return (
    <View className="max-w-2xl gap-3">
      <Text className="font-mono text-[11px] uppercase tracking-whisper text-signal">
        {`// ${eyebrow}`}
      </Text>
      <Text className="font-body-semibold text-[26px] leading-[32px] text-graphite tracking-tight md:text-[32px] md:leading-[38px]">
        {title}
      </Text>
      <Text className="font-body text-base leading-7 text-slate">{description}</Text>
    </View>
  );
}

export function Surface({
  children,
  className = '',
  variant = 'card',
}: {
  children: ReactNode;
  className?: string;
  variant?: 'card' | 'flat';
}) {
  if (variant === 'flat') {
    return <View className={`border-t border-hairline pt-6 ${className}`}>{children}</View>;
  }
  return (
    <View className={`rounded-[28px] border border-line bg-panel p-6 shadow-paper ${className}`}>
      {children}
    </View>
  );
}

export function ActionButton({
  label,
  onPress,
  tone = 'primary',
}: {
  label: string;
  onPress?: () => void;
  tone?: 'primary' | 'secondary';
}) {
  return (
    <Pressable
      className={`rounded-md px-4 py-3 ${
        tone === 'primary' ? 'bg-graphite' : 'border border-hairline bg-transparent'
      }`}
      onPress={onPress}>
      <Text
        className={`font-mono text-[11px] uppercase tracking-whisper ${
          tone === 'primary' ? 'text-paper' : 'text-graphite'
        }`}>
        {label}
      </Text>
    </Pressable>
  );
}
