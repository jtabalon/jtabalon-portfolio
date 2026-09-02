import { Image } from 'expo-image';
import { Link } from 'expo-router';
import { Pressable, Text, View } from 'react-native';

import { SiteFrame } from '@/components/site-frame';
import { publicSiteContent } from '@/data/public-site-content';

export default function HomeRoute() {
  return (
    <SiteFrame navigation={publicSiteContent.navigation}>
      <View className="gap-20">
        <View className="gap-7 md:flex-row md:items-center md:justify-between md:gap-12">
          <View className="order-2 max-w-2xl gap-5 md:order-1 md:flex-1">
            <View className="gap-2">
              <Text className="font-body-semibold text-base text-accent">
                {publicSiteContent.role}
              </Text>
              <Text
                accessibilityRole="header"
                className="font-display-bold text-[46px] leading-[48px] text-ink md:text-[68px] md:leading-[68px]">
                {publicSiteContent.name}
              </Text>
            </View>

            <Text className="max-w-xl font-body-semibold text-[24px] leading-[31px] text-graphite md:text-[30px] md:leading-[38px]">
              {publicSiteContent.hero.headline}
            </Text>

            <Text className="max-w-xl font-body text-base leading-7 text-muted md:text-lg md:leading-8">
              {publicSiteContent.hero.valueProposition}
            </Text>

            <View className="items-start gap-3 pt-1">
              <Text className="font-body text-sm text-muted">
                {publicSiteContent.hero.contactContext}
              </Text>
              <Link href={publicSiteContent.hero.emailHref} asChild>
                <Pressable className="cursor-pointer rounded-lg bg-ink px-5 py-3.5 hover:bg-accent focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent focus-visible:ring-offset-2 focus-visible:ring-offset-canvas active:opacity-80">
                  <Text className="font-body-semibold text-base text-paper">
                    {publicSiteContent.hero.emailLabel}
                  </Text>
                </Pressable>
              </Link>
            </View>
          </View>

          <View className="order-1 self-start overflow-hidden rounded-[28px] border border-line bg-panel shadow-paper md:order-2 md:self-center">
            <Image
              source={require('../../assets/images/icon.png')}
              accessibilityLabel="Portrait of Joseph Tabalon"
              contentFit="cover"
              className="h-[148px] w-[148px] md:h-[330px] md:w-[280px]"
            />
          </View>
        </View>

        {publicSiteContent.sections.map((section) => (
          <View
            key={section.id}
            nativeID={section.id}
            className="min-h-32 gap-3 border-t border-line pt-6">
            <Text className="font-body-semibold text-[26px] leading-[32px] text-graphite tracking-tight">
              {section.title}
            </Text>
            <Text className="max-w-2xl font-body text-base leading-7 text-muted">
              {section.description}
            </Text>
          </View>
        ))}
      </View>
    </SiteFrame>
  );
}
