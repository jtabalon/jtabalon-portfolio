import { Image } from 'expo-image';
import { Link } from 'expo-router';
import * as Linking from 'expo-linking';
import { Pressable, Text, View } from 'react-native';

import { SectionHeading, SiteFrame, Surface } from '@/components/site-frame';
import { demoSiteContent } from '@/lib/resume-parser';
import type { SiteContent, SiteLink } from '@/types/content';

// Note: while iterating on the design we always render the local demo content.
// To re-wire to Convex later, restore the ConnectedHomeScreen pattern that uses
// useQuery(api.site.getPublicSiteContent).

function Avatar() {
  return (
    <View className="h-[72px] w-[72px] overflow-hidden rounded-full border border-hairline bg-paper shadow-paper">
      <Image
        source={require('../../assets/images/icon.png')}
        contentFit="cover"
        className="h-full w-full"
      />
    </View>
  );
}

function ContactChip({ link }: { link: SiteLink }) {
  return (
    <Pressable
      className="rounded-md border border-hairline px-3 py-2"
      onPress={() => Linking.openURL(link.href)}>
      <Text className="font-mono text-xs text-graphite">[ {link.label.toLowerCase()} ]</Text>
    </Pressable>
  );
}

function MetaRow({ label, value }: { label: string; value: string }) {
  return (
    <View className="flex-row gap-4">
      <Text className="w-10 font-mono text-xs text-signal">{label}</Text>
      <Text className="flex-1 font-mono text-xs leading-5 text-slate">─ {value}</Text>
    </View>
  );
}

function StackChip({ label }: { label: string }) {
  return (
    <View className="rounded-sm border border-hairline px-2 py-1">
      <Text className="font-mono text-[10px] text-slate">{label}</Text>
    </View>
  );
}

function HomeScreenContent({ content }: { content: SiteContent }) {
  return (
    <SiteFrame activeRoute="/">
      <View className="gap-20">
        {/* Hero */}
        <View className="gap-8">
          <View className="flex-row items-center justify-between gap-4">
            <View className="flex-row items-center gap-4">
              <Avatar />
              <Text className="font-mono text-xs uppercase tracking-whisper text-slate">
                {content.profile.role}
              </Text>
            </View>
            <View className="flex-row items-center gap-2">
              <View className="h-2 w-2 rounded-full bg-signal" />
              <Text className="font-mono text-xs text-slate">available</Text>
            </View>
          </View>

          <View className="h-px bg-hairline" />

          <Text className="max-w-2xl font-body text-[22px] leading-[32px] text-graphite md:text-[26px] md:leading-[36px]">
            {content.profile.summary}
          </Text>

          <View className="max-w-xl gap-3 pt-2">
            <MetaRow label="LOC" value={content.profile.location} />
            <MetaRow
              label="EXP"
              value={`${content.profile.yearsExperience}+ yrs · Python / PyTorch / SQL`}
            />
            <MetaRow label="NOW" value={content.profile.availability} />
          </View>

          <View className="flex-row flex-wrap gap-2 pt-2">
            {content.links.map((link) => (
              <ContactChip key={`hero-${link.label}-${link.href}`} link={link} />
            ))}
          </View>
        </View>

        {/* About */}
        <View className="gap-5">
          <Text className="font-mono text-[11px] uppercase tracking-whisper text-signal">
            {'// ABOUT'}
          </Text>
          <Text className="max-w-2xl font-body text-base leading-7 text-graphite">
            {content.profile.intro}
          </Text>
        </View>

        {/* Experience */}
        <View className="gap-8">
          <Text className="font-mono text-[11px] uppercase tracking-whisper text-signal">
            {'// EXPERIENCE'}
          </Text>
          <View className="gap-8">
            {content.experience.map((item) => (
              <Surface key={`${item.company}-${item.role}`} variant="flat" className="gap-4">
                <View className="gap-2 md:flex-row md:items-baseline md:justify-between">
                  <View className="max-w-2xl gap-1">
                    <Text className="font-body-semibold text-[22px] leading-[28px] text-graphite tracking-tight">
                      {item.role}
                    </Text>
                    <Text className="font-mono text-xs text-slate">
                      {item.company.toLowerCase()} · {item.location.toLowerCase()}
                    </Text>
                  </View>
                  <Text className="font-mono text-[11px] uppercase tracking-whisper text-slate">
                    {item.start} — {item.end}
                  </Text>
                </View>
                {item.summary ? (
                  <Text className="font-body text-base leading-7 text-graphite">{item.summary}</Text>
                ) : null}
                <View className="gap-2">
                  {item.highlights.map((highlight) => (
                    <View key={highlight} className="flex-row gap-3">
                      <Text className="pt-0.5 font-mono text-xs text-signal">→</Text>
                      <Text className="flex-1 font-body text-sm leading-6 text-slate">
                        {highlight}
                      </Text>
                    </View>
                  ))}
                </View>
              </Surface>
            ))}
          </View>
        </View>

        {/* Projects */}
        <View className="gap-8">
          <Text className="font-mono text-[11px] uppercase tracking-whisper text-signal">
            {'// PROJECTS'}
          </Text>
          <View className="gap-8 md:flex-row md:flex-wrap md:gap-x-8">
            {content.projects.map((project) => (
              <Surface
                key={project.title}
                variant="flat"
                className="w-full gap-4 md:w-[calc(50%-16px)]">
                <View className="gap-1 md:flex-row md:items-baseline md:justify-between">
                  <Text className="font-body-semibold text-[20px] leading-[26px] text-graphite tracking-tight">
                    {project.title}
                  </Text>
                  <Text className="font-mono text-[11px] uppercase tracking-whisper text-slate">
                    {project.period ?? 'Recent'}
                  </Text>
                </View>
                <Text className="font-body text-sm leading-6 text-graphite">{project.summary}</Text>
                <View className="flex-row flex-wrap gap-2">
                  {project.stack.map((item) => (
                    <StackChip key={item} label={item} />
                  ))}
                </View>
                <View className="gap-2">
                  {project.highlights.map((highlight) => (
                    <View key={highlight} className="flex-row gap-3">
                      <Text className="pt-0.5 font-mono text-xs text-signal">→</Text>
                      <Text className="flex-1 font-body text-sm leading-6 text-slate">
                        {highlight}
                      </Text>
                    </View>
                  ))}
                </View>
                {project.href ? (
                  <View className="flex-row">
                    <ContactChip
                      link={{ label: 'visit', href: project.href, kind: 'website' }}
                    />
                  </View>
                ) : null}
              </Surface>
            ))}
          </View>
        </View>

        {/* Skills */}
        <View className="gap-8">
          <Text className="font-mono text-[11px] uppercase tracking-whisper text-signal">
            {'// SKILLS'}
          </Text>
          <View className="gap-6">
            {content.skills.map((group) => (
              <View key={group.title} className="border-t border-hairline pt-4 gap-2 md:flex-row md:gap-8">
                <Text className="font-mono text-[11px] uppercase tracking-whisper text-graphite md:w-48">
                  {group.title}
                </Text>
                <Text className="flex-1 font-mono text-xs leading-6 text-slate">
                  {group.items.join(' · ')}
                </Text>
              </View>
            ))}
          </View>
        </View>

        {/* Education */}
        <View className="gap-8">
          <Text className="font-mono text-[11px] uppercase tracking-whisper text-signal">
            {'// EDUCATION'}
          </Text>
          <View className="gap-6">
            {content.education.map((item) => (
              <Surface
                key={`${item.institution}-${item.program}`}
                variant="flat"
                className="gap-2">
                <View className="md:flex-row md:items-baseline md:justify-between">
                  <Text className="font-body-semibold text-[18px] leading-[24px] text-graphite tracking-tight">
                    {item.institution}
                  </Text>
                  <Text className="font-mono text-[11px] uppercase tracking-whisper text-slate">
                    {item.start} — {item.end}
                  </Text>
                </View>
                <Text className="font-mono text-xs text-slate">{item.program}</Text>
                {item.details.map((detail) => (
                  <Text key={detail} className="font-body text-sm leading-6 text-slate">
                    {detail}
                  </Text>
                ))}
              </Surface>
            ))}
          </View>
        </View>

        {/* Contact */}
        <View className="gap-6 border-t border-hairline pt-10">
          <SectionHeading
            eyebrow="CONTACT"
            title="Open to careful, ambitious work."
            description="Best reached by email. I read everything; I reply to anything that fits."
          />
          <View className="flex-row flex-wrap gap-2">
            {content.links.map((link) => (
              <ContactChip key={`contact-${link.label}-${link.href}`} link={link} />
            ))}
          </View>
          <View className="flex-row">
            <Link href="/blog" asChild>
              <Pressable className="rounded-md border border-hairline px-4 py-3">
                <Text className="font-mono text-[11px] uppercase tracking-whisper text-graphite">
                  read the blog
                </Text>
              </Pressable>
            </Link>
          </View>
        </View>
      </View>
    </SiteFrame>
  );
}

export default function HomeRoute() {
  return <HomeScreenContent content={demoSiteContent} />;
}
