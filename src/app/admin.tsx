import { useAuth, useClerk } from '@clerk/expo';
import { Redirect } from 'expo-router';
import { useMutation, useQuery } from 'convex/react';
import { startTransition, useEffect, useState } from 'react';
import { Alert, Platform, Pressable, Text, TextInput, View } from 'react-native';

import { ActionButton, SectionHeading, SiteFrame, Surface } from '@/components/site-frame';
import { demoResumeMarkdown } from '@/data/demo-resume';
import { env, hasClerk, hasConvex } from '@/lib/env';
import {
  createSlug,
  demoSiteContent,
  parseEditableLinks,
  parseResumeMarkdown,
  serializeLinks,
} from '@/lib/resume-parser';
import type { BlogPostStatus } from '@/types/content';
import { api } from '../../convex/_generated/api';

function Field({
  label,
  value,
  onChangeText,
  multiline = false,
  placeholder,
}: {
  label: string;
  value: string;
  onChangeText: (text: string) => void;
  multiline?: boolean;
  placeholder?: string;
}) {
  return (
    <View className="gap-2">
      <Text className="font-body-medium text-[11px] uppercase tracking-whisper text-accent">
        {label}
      </Text>
      <TextInput
        className={`rounded-[22px] border border-line bg-canvas px-4 py-4 font-body text-sm leading-7 text-ink ${
          multiline ? 'min-h-[140px]' : ''
        }`}
        multiline={multiline}
        onChangeText={onChangeText}
        placeholder={placeholder}
        placeholderTextColor="#9a8d7c"
        textAlignVertical={multiline ? 'top' : 'center'}
        value={value}
      />
    </View>
  );
}

function SetupAdminState() {
  return (
    <SiteFrame
      activeRoute="/admin"
      title="Admin setup"
      intro="The interface is ready, but the private editor only becomes active once Convex and Clerk environment variables are present.">
      <Surface className="gap-4">
        <Text className="font-body text-base leading-8 text-muted">
          Required values:
        </Text>
        <Text className="font-body text-sm leading-7 text-ink">
          • `EXPO_PUBLIC_CONVEX_URL`{'\n'}• `EXPO_PUBLIC_CLERK_PUBLISHABLE_KEY`{'\n'}•
          `CLERK_JWT_ISSUER_DOMAIN`
        </Text>
        <Text className="font-body text-sm leading-7 text-muted">
          Current status: Convex {hasConvex ? 'configured' : 'missing'} · Clerk{' '}
          {hasClerk ? 'configured' : 'missing'}
        </Text>
      </Surface>
    </SiteFrame>
  );
}

function ConnectedAdminScreen() {
  const data = useQuery(api.site.getAdminSiteContent);
  const saveProfile = useMutation(api.site.saveProfileAndLinks);
  const importResume = useMutation(api.site.importResumeMarkdown);
  const upsertBlogPost = useMutation(api.site.upsertBlogPost);
  const clerk = useClerk();

  const source = data ?? demoSiteContent;
  const [profileName, setProfileName] = useState(source.profile.name);
  const [profileRole, setProfileRole] = useState(source.profile.role);
  const [profileLocation, setProfileLocation] = useState(source.profile.location);
  const [profileAvailability, setProfileAvailability] = useState(source.profile.availability);
  const [profileIntro, setProfileIntro] = useState(source.profile.intro);
  const [profileSummary, setProfileSummary] = useState(source.profile.summary);
  const [profileStatement, setProfileStatement] = useState(source.profile.statement);
  const [profileEmail, setProfileEmail] = useState(source.profile.email);
  const [linksInput, setLinksInput] = useState(serializeLinks(source.links));
  const [resumeInput, setResumeInput] = useState(demoResumeMarkdown);
  const [blogTitle, setBlogTitle] = useState(source.blogPosts[0]?.title ?? '');
  const [blogSlug, setBlogSlug] = useState(source.blogPosts[0]?.slug ?? '');
  const [blogExcerpt, setBlogExcerpt] = useState(source.blogPosts[0]?.excerpt ?? '');
  const [blogBody, setBlogBody] = useState(source.blogPosts[0]?.body ?? '');
  const [blogStatus, setBlogStatus] = useState<BlogPostStatus>(source.blogPosts[0]?.status ?? 'draft');

  useEffect(() => {
    if (!data) {
      return;
    }

    startTransition(() => {
      setProfileName(data.profile.name);
      setProfileRole(data.profile.role);
      setProfileLocation(data.profile.location);
      setProfileAvailability(data.profile.availability);
      setProfileIntro(data.profile.intro);
      setProfileSummary(data.profile.summary);
      setProfileStatement(data.profile.statement);
      setProfileEmail(data.profile.email);
      setLinksInput(serializeLinks(data.links));
      setBlogTitle(data.blogPosts[0]?.title ?? '');
      setBlogSlug(data.blogPosts[0]?.slug ?? '');
      setBlogExcerpt(data.blogPosts[0]?.excerpt ?? '');
      setBlogBody(data.blogPosts[0]?.body ?? '');
      setBlogStatus(data.blogPosts[0]?.status ?? 'draft');
    });
  }, [data]);

  const preview = parseResumeMarkdown(resumeInput);

  const handleSaveProfile = async () => {
    try {
      await saveProfile({
        profile: {
          name: profileName,
          role: profileRole,
          location: profileLocation,
          availability: profileAvailability,
          intro: profileIntro,
          summary: profileSummary,
          email: profileEmail,
          statement: profileStatement,
          yearsExperience: source.profile.yearsExperience,
        },
        links: parseEditableLinks(linksInput),
      });
      Alert.alert('Saved', 'Profile and links were updated in Convex.');
    } catch (error) {
      Alert.alert('Save failed', error instanceof Error ? error.message : 'Unknown error');
    }
  };

  const handleImportResume = async () => {
    try {
      await importResume({ markdown: resumeInput });
      Alert.alert('Imported', 'Resume content was parsed and written to Convex.');
    } catch (error) {
      Alert.alert('Import failed', error instanceof Error ? error.message : 'Unknown error');
    }
  };

  const handleSaveBlog = async () => {
    try {
      await upsertBlogPost({
        title: blogTitle,
        slug: blogSlug || createSlug(blogTitle),
        excerpt: blogExcerpt,
        body: blogBody,
        status: blogStatus,
      });
      Alert.alert('Saved', 'Blog draft metadata was updated.');
    } catch (error) {
      Alert.alert('Blog save failed', error instanceof Error ? error.message : 'Unknown error');
    }
  };

  return (
    <SiteFrame
      activeRoute="/admin"
      title="Private editorial desk"
      intro="Use this route to import resume markdown, tune your public profile, and stage future writing without exposing admin controls to visitors.">
      <View className="gap-8">
        <Surface className="gap-4">
          <SectionHeading
            eyebrow="Status"
            title="Connected workspace"
            description="This route is authenticated with Clerk and persists content through Convex mutations."
          />
          <Text className="font-body text-sm leading-7 text-muted">
            Convex URL: {env.convexUrl || 'not set'}{'\n'}
            Clerk key: {env.clerkPublishableKey ? 'configured' : 'missing'}
          </Text>
          <ActionButton label="Sign out" tone="secondary" onPress={() => clerk.signOut({ redirectUrl: '/' })} />
        </Surface>

        <View className="gap-5 md:flex-row">
          <Surface className="flex-1 gap-4">
            <SectionHeading
              eyebrow="Profile"
              title="Edit the public overview"
              description="This form is meant for small refinements after the markdown import does the structural work."
            />
            <Field label="Name" value={profileName} onChangeText={setProfileName} />
            <Field label="Role" value={profileRole} onChangeText={setProfileRole} />
            <Field label="Location" value={profileLocation} onChangeText={setProfileLocation} />
            <Field label="Availability" value={profileAvailability} onChangeText={setProfileAvailability} />
            <Field label="Intro" value={profileIntro} onChangeText={setProfileIntro} multiline />
            <Field label="About summary" value={profileSummary} onChangeText={setProfileSummary} multiline />
            <Field label="Design statement" value={profileStatement} onChangeText={setProfileStatement} multiline />
            <Field label="Email" value={profileEmail} onChangeText={setProfileEmail} />
            <Field
              label="Links"
              value={linksInput}
              onChangeText={setLinksInput}
              multiline
              placeholder="Label | https://example.com | kind"
            />
            <ActionButton label="Save profile" onPress={handleSaveProfile} />
          </Surface>

          <Surface className="flex-1 gap-4">
            <SectionHeading
              eyebrow="Import"
              title="Paste resume markdown"
              description="The parser expects a heading-based markdown format and replaces your timeline, projects, skills, education, and links."
            />
            <Field label="Resume markdown" value={resumeInput} onChangeText={setResumeInput} multiline />
            <ActionButton label="Import into Convex" onPress={handleImportResume} />
            <View className="rounded-[22px] border border-line bg-canvas p-4">
              <Text className="font-body-medium text-[11px] uppercase tracking-whisper text-accent">
                Preview
              </Text>
              <Text className="mt-3 font-body text-sm leading-7 text-muted">
                {preview.profile.name} · {preview.experience.length} roles · {preview.projects.length}{' '}
                projects · {preview.skills.length} skill groups
              </Text>
            </View>
          </Surface>
        </View>

        <Surface className="gap-4">
          <SectionHeading
            eyebrow="Blog draft"
            title="Prepare writing for later"
            description="The public blog route can stay empty while you save metadata and a draft body in the database."
          />
          <View className="gap-4 md:flex-row">
            <View className="flex-1 gap-4">
              <Field label="Title" value={blogTitle} onChangeText={setBlogTitle} />
              <Field
                label="Slug"
                value={blogSlug}
                onChangeText={setBlogSlug}
                placeholder="future-case-study"
              />
              <Field label="Excerpt" value={blogExcerpt} onChangeText={setBlogExcerpt} multiline />
            </View>
            <View className="flex-1 gap-4">
              <Field label="Body" value={blogBody} onChangeText={setBlogBody} multiline />
              <View className="gap-2">
                <Text className="font-body-medium text-[11px] uppercase tracking-whisper text-accent">
                  Status
                </Text>
                <View className="flex-row gap-3">
                  {(['draft', 'published'] as const).map((status) => (
                    <Pressable
                      key={status}
                      className={`rounded-full border px-4 py-3 ${
                        blogStatus === status ? 'border-ink bg-ink' : 'border-line bg-canvas'
                      }`}
                      onPress={() => setBlogStatus(status)}>
                      <Text
                        className={`font-body-medium text-xs uppercase tracking-whisper ${
                          blogStatus === status ? 'text-canvas' : 'text-ink'
                        }`}>
                        {status}
                      </Text>
                    </Pressable>
                  ))}
                </View>
              </View>
              <ActionButton label="Save draft" onPress={handleSaveBlog} />
            </View>
          </View>
        </Surface>
      </View>
    </SiteFrame>
  );
}

function AuthenticatedAdminRoute() {
  const { isLoaded, isSignedIn } = useAuth();

  if (!isLoaded) {
    return (
      <SiteFrame
        activeRoute="/admin"
        title="Loading admin"
        intro="Verifying your Clerk session before opening the private editor."
      />
    );
  }

  if (!isSignedIn) {
    return <Redirect href={Platform.OS === 'web' ? '/sign-in?redirect=/admin' : '/sign-in'} />;
  }

  return <ConnectedAdminScreen />;
}

export default function AdminRoute() {
  if (!hasConvex || !hasClerk) {
    return <SetupAdminState />;
  }

  return <AuthenticatedAdminRoute />;
}
