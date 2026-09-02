import { Text, View } from 'react-native';

import { SiteFrame } from '@/components/site-frame';
import { publicSiteContent } from '@/data/public-site-content';

export default function HomeRoute() {
  return (
    <SiteFrame navigation={publicSiteContent.navigation}>
      <View className="gap-20">
        <View className="gap-3">
          <Text className="font-display-bold text-[46px] leading-[52px] text-ink md:text-[62px] md:leading-[68px]">
            {publicSiteContent.name}
          </Text>
          <Text className="font-body text-lg text-muted">{publicSiteContent.role}</Text>
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
