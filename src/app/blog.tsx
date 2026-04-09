import { useQuery } from 'convex/react';
import { Text, View } from 'react-native';

import { SectionHeading, SiteFrame, Surface } from '@/components/site-frame';
import { demoSiteContent } from '@/lib/resume-parser';
import { hasConvex } from '@/lib/env';
import { api } from '../../convex/_generated/api';

function BlogContent({ posts }: { posts: typeof demoSiteContent.blogPosts }) {
  const publishedPosts = posts.filter((post) => post.status === 'published');

  return (
    <SiteFrame
      activeRoute="/blog"
      title="Writing, eventually."
      intro="The route is live and the content model is ready. For v1, the surface stays intentionally quiet until you add essays, case studies, or notes.">
      <View className="gap-8">
        <SectionHeading
          eyebrow="Blog"
          title={publishedPosts.length > 0 ? 'Published notes' : 'A prepared empty state'}
          description="Convex already has the blog schema, so adding real posts later is a content decision rather than a structural rewrite."
        />
        {publishedPosts.length > 0 ? (
          <View className="gap-4">
            {publishedPosts.map((post) => (
              <Surface key={post.slug} className="gap-3">
                <Text className="font-display text-[30px] leading-[34px] text-ink">{post.title}</Text>
                <Text className="font-body text-sm text-muted">
                  {post.publishedAt ?? 'Ready when you are'}
                </Text>
                <Text className="font-body text-base leading-7 text-ink">{post.excerpt}</Text>
              </Surface>
            ))}
          </View>
        ) : (
          <Surface className="gap-4">
            <Text className="font-display text-[30px] leading-[34px] text-ink">
              No posts are published yet.
            </Text>
            <Text className="font-body text-base leading-8 text-muted">
              Use the private admin route to save a draft title, slug, excerpt, and body. When you
              are ready, publish it and add the dedicated post route later.
            </Text>
          </Surface>
        )}
      </View>
    </SiteFrame>
  );
}

function ConnectedBlogRoute() {
  const data = useQuery(api.site.getPublicBlogPosts);
  return <BlogContent posts={data ?? []} />;
}

export default function BlogRoute() {
  if (!hasConvex) {
    return <BlogContent posts={demoSiteContent.blogPosts} />;
  }

  return <ConnectedBlogRoute />;
}
