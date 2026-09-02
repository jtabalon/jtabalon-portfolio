import type { ReactNode } from 'react';
import { Image } from 'expo-image';
import { Link, type Href } from 'expo-router';
import Head from 'expo-router/head';
import { Pressable, Text, View } from 'react-native';

import { SiteFrame } from '@/components/site-frame';
import { publicSiteContent } from '@/data/public-site-content';
import { scrollToSection } from '@/lib/scroll-to-section';

function PageSection({
  children,
  id,
  title,
}: {
  children: ReactNode;
  id: string;
  title: string;
}) {
  return (
    <View nativeID={id} className="gap-5 border-t border-line pt-6">
      <Text
        accessibilityRole="header"
        aria-level={2}
        className="font-body-semibold text-[26px] leading-[32px] text-ink tracking-tight">
        {title}
      </Text>
      {children}
    </View>
  );
}

function PrimaryEmailAction({
  href,
  label,
  surface,
}: {
  href: Href;
  label: string;
  surface: 'canvas' | 'panel';
}) {
  const ringOffsetClass =
    surface === 'canvas'
      ? 'focus-visible:ring-offset-canvas'
      : 'focus-visible:ring-offset-panel';

  return (
    <Link href={href} asChild>
      <Pressable
        className={`motion-primary-contact cursor-pointer rounded-lg bg-ink px-5 py-3.5 hover:bg-accent focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent focus-visible:ring-offset-2 active:opacity-80 ${ringOffsetClass}`}>
        <Text className="font-body-semibold text-base text-canvas">{label}</Text>
      </Pressable>
    </Link>
  );
}

export default function HomeRoute() {
  return (
    <>
      <Head>
        <title>Joseph Tabalon | Senior Data Scientist</title>
        <meta
          name="description"
          content="Senior Data Scientist building machine-learning systems from rigorous modeling and evaluation through reliable, secure deployment."
        />
      </Head>
      <SiteFrame navigation={publicSiteContent.navigation}>
        <View className="gap-20">
          <View
            nativeID="top"
            className="motion-hero-entrance gap-7 md:flex-row md:items-center md:justify-between md:gap-12">
            <View className="order-2 max-w-2xl gap-5 md:order-1 md:flex-1">
              <View className="gap-2">
                <Text className="font-body-semibold text-base text-accent">
                  {publicSiteContent.role}
                </Text>
                <Text
                  accessibilityRole="header"
                  className="font-body-semibold text-[44px] leading-[48px] text-ink tracking-[-0.045em] md:text-[64px] md:leading-[68px]">
                  {publicSiteContent.name}
                </Text>
              </View>

              <Text className="max-w-xl font-body-semibold text-[24px] leading-[31px] text-ink md:text-[30px] md:leading-[38px]">
                {publicSiteContent.hero.headline}
              </Text>

              <Text className="max-w-xl font-body text-base leading-7 text-muted md:text-lg md:leading-8">
                {publicSiteContent.hero.valueProposition}
              </Text>

              <View className="items-start gap-3 pt-1">
                <Text className="font-body text-sm text-muted">
                  {publicSiteContent.hero.contactContext}
                </Text>
                <PrimaryEmailAction
                  href={publicSiteContent.hero.emailHref}
                  label={publicSiteContent.hero.emailLabel}
                  surface="canvas"
                />
              </View>
            </View>

            <View className="order-1 self-start overflow-hidden rounded-[28px] border border-line bg-panel shadow-soft md:order-2 md:self-center">
              <Image
                source={require('../../assets/images/icon.png')}
                accessibilityLabel="Portrait of Joseph Tabalon"
                contentFit="cover"
                className="h-[148px] w-[148px] md:h-[330px] md:w-[280px]"
              />
            </View>
          </View>

          <PageSection
            id={publicSiteContent.publishedWork.id}
            title={publicSiteContent.publishedWork.title}>
            <View className="gap-5 rounded-2xl border border-line bg-panel p-5 shadow-soft md:flex-row md:items-start md:justify-between md:gap-10 md:p-7">
              <View className="max-w-3xl flex-1 gap-3">
                <Text className="font-mono-medium text-xs uppercase text-accent tracking-whisper">
                  {publicSiteContent.publishedWork.publication.name}
                </Text>
                <Text className="font-body-semibold text-xl leading-7 text-ink md:text-2xl md:leading-8">
                  {publicSiteContent.publishedWork.publication.publicationTitle}
                </Text>
                <Text className="font-mono text-xs leading-5 text-muted">
                  {publicSiteContent.publishedWork.publication.publicationMeta}
                </Text>
                <Text className="max-w-2xl font-body text-[15px] leading-7 text-muted">
                  {publicSiteContent.publishedWork.publication.contribution}
                </Text>
              </View>

              <View className="min-w-56 gap-3 border-t border-line pt-4 md:border-l md:border-t-0 md:pl-6 md:pt-0">
                <Text className="font-body-medium text-xs uppercase text-muted tracking-[0.14em]">
                  Evidence
                </Text>
                {publicSiteContent.publishedWork.publication.links.map((link) => (
                  <Link
                    key={link.href}
                    href={link.href}
                    target="_blank"
                    asChild>
                    <Pressable
                      className="motion-secondary-link cursor-pointer self-start rounded-sm py-1 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent focus-visible:ring-offset-2 focus-visible:ring-offset-panel active:opacity-60">
                      <Text className="font-body-medium text-sm leading-5 text-ink underline decoration-line underline-offset-4">
                        {link.label}
                      </Text>
                    </Pressable>
                  </Link>
                ))}
              </View>
            </View>
          </PageSection>

          <PageSection
            id={publicSiteContent.careerSnapshot.id}
            title={publicSiteContent.careerSnapshot.title}>
            <View className="overflow-hidden rounded-2xl border border-line bg-panel shadow-soft">
              {publicSiteContent.careerSnapshot.entries.map((entry, index) => (
                <View
                  key={entry.organization}
                  className={`gap-4 p-5 md:flex-row md:gap-10 md:p-7 ${
                    index > 0 ? 'border-t border-line' : ''
                  }`}>
                  <View className="gap-1 md:w-64">
                    <Text className="font-body-semibold text-lg leading-6 text-ink">
                      {entry.organization}
                    </Text>
                    <Text className="font-body-medium text-sm leading-5 text-muted">
                      {entry.role}
                    </Text>
                    <Text className="pt-1 font-mono text-[11px] uppercase text-accent tracking-[0.12em]">
                      {entry.period}
                    </Text>
                  </View>

                  <View className="max-w-2xl flex-1 items-start gap-2">
                    <Text className="font-body text-[15px] leading-7 text-muted">
                      {entry.description}
                    </Text>
                    {entry.link ? (
                      <Link href={entry.link.href} asChild>
                        <Pressable
                          className="motion-secondary-link cursor-pointer rounded-sm py-1 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent focus-visible:ring-offset-2 focus-visible:ring-offset-panel active:opacity-60">
                          <Text className="font-body-medium text-sm text-ink underline decoration-line underline-offset-4">
                            {entry.link.label}
                          </Text>
                        </Pressable>
                      </Link>
                    ) : null}
                  </View>
                </View>
              ))}

              <View className="gap-2 border-t border-line bg-wash px-5 py-4 md:flex-row md:items-baseline md:gap-8 md:px-7">
                <Text className="font-body-semibold text-xs uppercase text-accent tracking-[0.14em] md:w-56">
                  {publicSiteContent.careerSnapshot.education.label}
                </Text>
                <Text className="max-w-3xl flex-1 font-body text-sm leading-6 text-ink">
                  {publicSiteContent.careerSnapshot.education.description}
                </Text>
              </View>
            </View>
          </PageSection>

          <PageSection
            id={publicSiteContent.about.id}
            title={publicSiteContent.about.title}>
            <View className="max-w-3xl gap-4">
              {publicSiteContent.about.paragraphs.map((paragraph) => (
                <Text
                  key={paragraph}
                  className="font-body text-base leading-7 text-muted md:text-lg md:leading-8">
                  {paragraph}
                </Text>
              ))}
            </View>
          </PageSection>

          <PageSection
            id={publicSiteContent.contact.id}
            title={publicSiteContent.contact.title}>
            <View className="gap-6 rounded-2xl border border-line bg-panel p-5 shadow-soft md:flex-row md:items-end md:justify-between md:gap-10 md:p-7">
              <View className="max-w-2xl gap-3">
                <Text className="font-body text-base leading-7 text-muted md:text-lg md:leading-8">
                  {publicSiteContent.contact.description}
                </Text>
                <Text className="font-body-medium text-sm text-ink">
                  {publicSiteContent.contact.emailAddress}
                </Text>
              </View>

              <View className="items-start gap-3 md:items-end">
                <PrimaryEmailAction
                  href={publicSiteContent.contact.emailHref}
                  label={publicSiteContent.contact.emailLabel}
                  surface="panel"
                />
                <Link
                  href={publicSiteContent.contact.linkedInHref}
                  target="_blank"
                  asChild>
                  <Pressable
                    className="motion-secondary-link cursor-pointer rounded-sm py-1 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent focus-visible:ring-offset-2 focus-visible:ring-offset-panel active:opacity-60">
                    <Text className="font-body-medium text-sm text-ink underline decoration-line underline-offset-4">
                      {publicSiteContent.contact.linkedInLabel}
                    </Text>
                  </Pressable>
                </Link>
              </View>
            </View>
          </PageSection>

          <View
            role="contentinfo"
            className="flex-row items-center justify-between gap-4 border-t border-line pb-2 pt-5">
            <Text className="shrink font-body text-xs text-muted">
              Joseph Tabalon · Senior Data Scientist
            </Text>
            <Link href="/#top" asChild>
              <Pressable
                className="motion-secondary-link cursor-pointer rounded-sm px-1 py-1 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent focus-visible:ring-offset-2 focus-visible:ring-offset-canvas active:opacity-60"
                onPress={() => scrollToSection('top')}>
                <Text className="font-body-medium text-xs text-ink underline decoration-line underline-offset-4">
                  Back to top
                </Text>
              </Pressable>
            </Link>
          </View>
        </View>
      </SiteFrame>
    </>
  );
}
