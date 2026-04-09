export type LinkKind = 'email' | 'linkedin' | 'github' | 'website' | 'custom';
export type BlogPostStatus = 'draft' | 'published';

export interface Profile {
  name: string;
  role: string;
  location: string;
  availability: string;
  intro: string;
  summary: string;
  email: string;
  statement: string;
  yearsExperience: number;
}

export interface SiteLink {
  label: string;
  href: string;
  kind: LinkKind;
}

export interface ExperienceItem {
  role: string;
  company: string;
  location: string;
  start: string;
  end: string;
  summary: string;
  highlights: string[];
}

export interface ProjectItem {
  title: string;
  href?: string;
  period?: string;
  summary: string;
  stack: string[];
  highlights: string[];
}

export interface SkillGroup {
  title: string;
  items: string[];
}

export interface EducationItem {
  institution: string;
  program: string;
  start: string;
  end: string;
  details: string[];
}

export interface BlogPostSummary {
  title: string;
  slug: string;
  excerpt: string;
  status: BlogPostStatus;
  publishedAt?: string;
  body: string;
}

export interface SiteContent {
  profile: Profile;
  links: SiteLink[];
  experience: ExperienceItem[];
  projects: ProjectItem[];
  skills: SkillGroup[];
  education: EducationItem[];
  blogPosts: BlogPostSummary[];
  updatedAt: string;
}
