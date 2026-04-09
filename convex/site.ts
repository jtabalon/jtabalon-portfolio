import { query, mutation, internalMutation } from './_generated/server';
import { v } from 'convex/values';

import { demoSiteContent, parseResumeMarkdown } from '../src/lib/resume-parser';
import type {
  BlogPostSummary,
  EducationItem,
  ExperienceItem,
  ProjectItem,
  SiteLink,
  SkillGroup,
} from '../src/types/content';

const linkKind = v.union(
  v.literal('email'),
  v.literal('linkedin'),
  v.literal('github'),
  v.literal('website'),
  v.literal('custom')
);

const profileValidator = v.object({
  name: v.string(),
  role: v.string(),
  location: v.string(),
  availability: v.string(),
  intro: v.string(),
  summary: v.string(),
  email: v.string(),
  statement: v.string(),
  yearsExperience: v.number(),
});

const linkValidator = v.object({
  label: v.string(),
  href: v.string(),
  kind: linkKind,
});

type OrderedLink = SiteLink & { displayOrder: number };
type OrderedExperience = ExperienceItem & { displayOrder: number };
type OrderedProject = ProjectItem & { displayOrder: number };
type OrderedSkill = SkillGroup & { displayOrder: number };
type OrderedEducation = EducationItem & { displayOrder: number };
type StoredBlogPost = BlogPostSummary & { updatedAt: string };

async function requireIdentity(ctx: { auth: { getUserIdentity: () => Promise<unknown> } }) {
  const identity = await ctx.auth.getUserIdentity();

  if (!identity) {
    throw new Error('Unauthenticated');
  }

  return identity;
}

async function clearTable(
  ctx: any,
  tableName: 'profile' | 'links' | 'experience' | 'projects' | 'skills' | 'education'
) {
  const rows = await ctx.db.query(tableName).collect();
  await Promise.all(rows.map((row: { _id: string }) => ctx.db.delete(row._id)));
}

async function replaceSiteContent(
  ctx: any,
  content: ReturnType<typeof parseResumeMarkdown>
) {
  await clearTable(ctx, 'profile');
  await clearTable(ctx, 'links');
  await clearTable(ctx, 'experience');
  await clearTable(ctx, 'projects');
  await clearTable(ctx, 'skills');
  await clearTable(ctx, 'education');

  await ctx.db.insert('profile', {
    ...content.profile,
    updatedAt: content.updatedAt,
  });

  await Promise.all(
    content.links.map((link, index) =>
      ctx.db.insert('links', {
        ...link,
        displayOrder: index,
      })
    )
  );

  await Promise.all(
    content.experience.map((item, index) =>
      ctx.db.insert('experience', {
        ...item,
        displayOrder: index,
      })
    )
  );

  await Promise.all(
    content.projects.map((project, index) =>
      ctx.db.insert('projects', {
        ...project,
        displayOrder: index,
      })
    )
  );

  await Promise.all(
    content.skills.map((group, index) =>
      ctx.db.insert('skills', {
        ...group,
        displayOrder: index,
      })
    )
  );

  await Promise.all(
    content.education.map((item, index) =>
      ctx.db.insert('education', {
        ...item,
        displayOrder: index,
      })
    )
  );
}

async function readSiteContent(ctx: any) {
  const [profile, links, experience, projects, skills, education, blogPosts] = await Promise.all([
    ctx.db.query('profile').first(),
    ctx.db.query('links').collect() as Promise<OrderedLink[]>,
    ctx.db.query('experience').collect() as Promise<OrderedExperience[]>,
    ctx.db.query('projects').collect() as Promise<OrderedProject[]>,
    ctx.db.query('skills').collect() as Promise<OrderedSkill[]>,
    ctx.db.query('education').collect() as Promise<OrderedEducation[]>,
    ctx.db.query('blogPosts').collect() as Promise<StoredBlogPost[]>,
  ]);

  if (!profile) {
    return demoSiteContent;
  }

  return {
    profile: {
      name: profile.name,
      role: profile.role,
      location: profile.location,
      availability: profile.availability,
      intro: profile.intro,
      summary: profile.summary,
      email: profile.email,
      statement: profile.statement,
      yearsExperience: profile.yearsExperience,
    },
    links: links
      .sort((a, b) => a.displayOrder - b.displayOrder)
      .map(({ label, href, kind }) => ({ label, href, kind })),
    experience: experience
      .sort((a, b) => a.displayOrder - b.displayOrder)
      .map(({ role, company, location, start, end, summary, highlights }) => ({
        role,
        company,
        location,
        start,
        end,
        summary,
        highlights,
      })),
    projects: projects
      .sort((a, b) => a.displayOrder - b.displayOrder)
      .map(({ title, href, period, summary, stack, highlights }) => ({
        title,
        href,
        period,
        summary,
        stack,
        highlights,
      })),
    skills: skills
      .sort((a, b) => a.displayOrder - b.displayOrder)
      .map(({ title, items }) => ({ title, items })),
    education: education
      .sort((a, b) => a.displayOrder - b.displayOrder)
      .map(({ institution, program, start, end, details }) => ({
        institution,
        program,
        start,
        end,
        details,
      })),
    blogPosts: blogPosts
      .sort((a, b) => b.updatedAt.localeCompare(a.updatedAt))
      .map(({ title, slug, excerpt, status, publishedAt, body }) => ({
        title,
        slug,
        excerpt,
        status,
        publishedAt,
        body,
      })),
    updatedAt: profile.updatedAt,
  };
}

export const getPublicSiteContent = query({
  args: {},
  handler: async (ctx) => {
    return readSiteContent(ctx);
  },
});

export const getPublicBlogPosts = query({
  args: {},
  handler: async (ctx) => {
    const posts = await ctx.db.query('blogPosts').collect();

    return posts
      .filter((post) => post.status === 'published')
      .sort((a, b) => (b.publishedAt ?? '').localeCompare(a.publishedAt ?? ''))
      .map(({ title, slug, excerpt, status, publishedAt, body }) => ({
        title,
        slug,
        excerpt,
        status,
        publishedAt,
        body,
      }));
  },
});

export const getAdminSiteContent = query({
  args: {},
  handler: async (ctx) => {
    await requireIdentity(ctx);
    return readSiteContent(ctx);
  },
});

export const saveProfileAndLinks = mutation({
  args: {
    profile: profileValidator,
    links: v.array(linkValidator),
  },
  handler: async (ctx, args) => {
    await requireIdentity(ctx);
    const currentProfile = await ctx.db.query('profile').first();
    const now = new Date().toISOString();

    if (currentProfile) {
      await ctx.db.patch(currentProfile._id, {
        ...args.profile,
        updatedAt: now,
      });
    } else {
      await ctx.db.insert('profile', {
        ...args.profile,
        updatedAt: now,
      });
    }

    await clearTable(ctx, 'links');
    await Promise.all(
      args.links.map((link, index) =>
        ctx.db.insert('links', {
          ...link,
          displayOrder: index,
        })
      )
    );
  },
});

export const importResumeMarkdown = mutation({
  args: {
    markdown: v.string(),
  },
  handler: async (ctx, args) => {
    await requireIdentity(ctx);
    const parsed = parseResumeMarkdown(args.markdown);
    await replaceSiteContent(ctx, parsed);
    return parsed;
  },
});

export const upsertBlogPost = mutation({
  args: {
    title: v.string(),
    slug: v.string(),
    excerpt: v.string(),
    body: v.string(),
    status: v.union(v.literal('draft'), v.literal('published')),
  },
  handler: async (ctx, args) => {
    await requireIdentity(ctx);
    const existing = await ctx.db
      .query('blogPosts')
      .withIndex('by_slug', (q) => q.eq('slug', args.slug))
      .unique();
    const updatedAt = new Date().toISOString();
    const payload = {
      ...args,
      updatedAt,
      publishedAt: args.status === 'published' ? updatedAt : undefined,
    };

    if (existing) {
      await ctx.db.patch(existing._id, payload);
      return existing._id;
    }

    return ctx.db.insert('blogPosts', payload);
  },
});

export const seedDemoContent = internalMutation({
  args: {},
  handler: async (ctx) => {
    await replaceSiteContent(ctx, demoSiteContent);
  },
});
