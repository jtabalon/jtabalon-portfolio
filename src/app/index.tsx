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

        <View
          nativeID={publicSiteContent.publishedWork.id}
          className="gap-5 border-t border-line pt-6">
          <Text className="font-body-semibold text-[26px] leading-[32px] text-graphite tracking-tight">
            {publicSiteContent.publishedWork.title}
          </Text>

          <View className="gap-5 rounded-2xl border border-line bg-panel p-5 shadow-paper md:flex-row md:items-start md:justify-between md:gap-10 md:p-7">
            <View className="max-w-3xl flex-1 gap-3">
              <Text className="font-mono-medium text-xs uppercase text-accent tracking-whisper">
                {publicSiteContent.publishedWork.item.name}
              </Text>
              <Text className="font-body-semibold text-xl leading-7 text-graphite md:text-2xl md:leading-8">
                {publicSiteContent.publishedWork.item.publicationTitle}
              </Text>
              <Text className="font-mono text-xs leading-5 text-muted">
                {publicSiteContent.publishedWork.item.publicationMeta}
              </Text>
              <Text className="max-w-2xl font-body text-[15px] leading-7 text-muted">
                {publicSiteContent.publishedWork.item.contribution}
              </Text>
            </View>

            <View className="min-w-56 gap-3 border-t border-line pt-4 md:border-l md:border-t-0 md:pl-6 md:pt-0">
              <Text className="font-body-medium text-xs uppercase text-muted tracking-[0.14em]">
                Evidence
              </Text>
              {publicSiteContent.publishedWork.item.links.map((link) => (
                <Link key={link.href} href={link.href} target="_blank" asChild>
                  <Pressable className="cursor-pointer self-start rounded-sm py-1 hover:opacity-70 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent focus-visible:ring-offset-2 focus-visible:ring-offset-panel active:opacity-60">
                    <Text className="font-body-medium text-sm leading-5 text-graphite underline decoration-line underline-offset-4">
                      {link.label}
                    </Text>
                  </Pressable>
                </Link>
              ))}
            </View>
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
