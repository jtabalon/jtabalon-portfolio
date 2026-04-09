import { defineSchema, defineTable } from 'convex/server';
import { v } from 'convex/values';

export default defineSchema({
  profile: defineTable({
    name: v.string(),
    role: v.string(),
    location: v.string(),
    availability: v.string(),
    intro: v.string(),
    summary: v.string(),
    email: v.string(),
    statement: v.string(),
    yearsExperience: v.number(),
    updatedAt: v.string(),
  }),
  links: defineTable({
    label: v.string(),
    href: v.string(),
    kind: v.union(
      v.literal('email'),
      v.literal('linkedin'),
      v.literal('github'),
      v.literal('website'),
      v.literal('custom')
    ),
    displayOrder: v.number(),
  }),
  experience: defineTable({
    role: v.string(),
    company: v.string(),
    location: v.string(),
    start: v.string(),
    end: v.string(),
    summary: v.string(),
    highlights: v.array(v.string()),
    displayOrder: v.number(),
  }),
  projects: defineTable({
    title: v.string(),
    href: v.optional(v.string()),
    period: v.optional(v.string()),
    summary: v.string(),
    stack: v.array(v.string()),
    highlights: v.array(v.string()),
    displayOrder: v.number(),
  }),
  skills: defineTable({
    title: v.string(),
    items: v.array(v.string()),
    displayOrder: v.number(),
  }),
  education: defineTable({
    institution: v.string(),
    program: v.string(),
    start: v.string(),
    end: v.string(),
    details: v.array(v.string()),
    displayOrder: v.number(),
  }),
  blogPosts: defineTable({
    title: v.string(),
    slug: v.string(),
    excerpt: v.string(),
    status: v.union(v.literal('draft'), v.literal('published')),
    publishedAt: v.optional(v.string()),
    body: v.string(),
    updatedAt: v.string(),
  }).index('by_slug', ['slug']),
});
