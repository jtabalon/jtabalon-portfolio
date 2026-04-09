import { demoResumeMarkdown } from '../data/demo-resume';
import type {
  BlogPostSummary,
  EducationItem,
  ExperienceItem,
  LinkKind,
  ProjectItem,
  SiteContent,
  SiteLink,
  SkillGroup,
} from '../types/content';

interface Section {
  title: string;
  lines: string[];
}

function cleanLine(line: string) {
  return line.trim();
}

function slugify(input: string) {
  return input
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/(^-|-$)/g, '');
}

function splitSections(markdown: string) {
  const lines = markdown.replace(/\r\n/g, '\n').split('\n');
  const topLines: string[] = [];
  const sections: Section[] = [];
  let current: Section | null = null;

  for (const rawLine of lines) {
    const line = rawLine.trimEnd();

    if (line.startsWith('## ')) {
      current = { title: line.slice(3).trim().toLowerCase(), lines: [] };
      sections.push(current);
      continue;
    }

    if (current) {
      current.lines.push(line);
    } else {
      topLines.push(line);
    }
  }

  return { topLines, sections };
}

function splitEntries(lines: string[]) {
  const entries: string[][] = [];
  let current: string[] = [];

  for (const rawLine of lines) {
    const line = cleanLine(rawLine);

    if (line.startsWith('### ')) {
      if (current.length > 0) {
        entries.push(current);
      }
      current = [line.slice(4).trim()];
      continue;
    }

    if (current.length > 0) {
      current.push(line);
    }
  }

  if (current.length > 0) {
    entries.push(current);
  }

  return entries;
}

function compactLines(lines: string[]) {
  return lines.map(cleanLine).filter(Boolean);
}

function parseTop(topLines: string[]) {
  const compact = compactLines(topLines);
  const name = compact[0]?.replace(/^#\s*/, '') || 'Your Name';
  const metadata = compact[1] ?? 'Product Engineer | Remote | Open to new opportunities';
  const [role = 'Product Engineer', location = 'Remote', availability = 'Open to new opportunities'] =
    metadata.split('|').map((part) => part.trim());
  const intro = compact.slice(2).join(' ') || 'A calm, intentional introduction to your work.';

  return { name, role, location, availability, intro };
}

function inferKind(label: string, value: string): LinkKind {
  const normalizedLabel = label.toLowerCase();
  if (normalizedLabel.includes('email') || value.startsWith('mailto:') || value.includes('@')) {
    return 'email';
  }
  if (normalizedLabel.includes('linkedin')) {
    return 'linkedin';
  }
  if (normalizedLabel.includes('github')) {
    return 'github';
  }
  if (normalizedLabel.includes('website') || normalizedLabel.includes('portfolio')) {
    return 'website';
  }
  return 'custom';
}

function parseLinks(lines: string[]) {
  return compactLines(lines)
    .filter((line) => line.startsWith('-'))
    .map((line) => line.replace(/^-+\s*/, ''))
    .map((line) => {
      const [labelPart, ...valueParts] = line.split(':');
      const label = labelPart?.trim() || 'Link';
      const rawValue = valueParts.join(':').trim();
      const href = inferKind(label, rawValue) === 'email' && !rawValue.startsWith('mailto:')
        ? `mailto:${rawValue}`
        : rawValue;

      return {
        label,
        href,
        kind: inferKind(label, rawValue),
      } satisfies SiteLink;
    });
}

function parseExperience(lines: string[]) {
  return splitEntries(lines).map((entry) => {
    const [header, ...body] = entry;
    const [role = 'Role', company = 'Company', location = 'Remote', dateRange = '2024 - Present'] =
      header.split('|').map((part) => part.trim());
    const summaryLines = compactLines(body).filter((line) => !line.startsWith('-'));
    const highlights = compactLines(body)
      .filter((line) => line.startsWith('-'))
      .map((line) => line.replace(/^-+\s*/, ''));
    const [start = '2024', end = 'Present'] = dateRange.split('-').map((part) => part.trim());

    return {
      role,
      company,
      location,
      start,
      end,
      summary: summaryLines.join(' '),
      highlights,
    } satisfies ExperienceItem;
  });
}

function parseProjects(lines: string[]) {
  return splitEntries(lines).map((entry) => {
    const [header, ...body] = entry;
    const [title = 'Project', href = '', period = 'Recent'] = header
      .split('|')
      .map((part) => part.trim());
    const compact = compactLines(body);
    const stackLine = compact.find((line) => line.toLowerCase().startsWith('stack:'));
    const summary = compact.find((line) => !line.startsWith('-') && !line.toLowerCase().startsWith('stack:')) || '';
    const stack =
      stackLine
        ?.replace(/^stack:\s*/i, '')
        .split(',')
        .map((item) => item.trim())
        .filter(Boolean) ?? [];
    const highlights = compact
      .filter((line) => line.startsWith('-'))
      .map((line) => line.replace(/^-+\s*/, ''));

    return {
      title,
      href: href || undefined,
      period,
      summary,
      stack,
      highlights,
    } satisfies ProjectItem;
  });
}

function parseSkills(lines: string[]) {
  return splitEntries(lines).map((entry) => {
    const [title, ...body] = entry;
    const items = compactLines(body)
      .flatMap((line) =>
        line.startsWith('-')
          ? line
              .replace(/^-+\s*/, '')
              .split(',')
              .map((item) => item.trim())
          : line.split(',').map((item) => item.trim())
      )
      .filter(Boolean);

    return {
      title,
      items,
    } satisfies SkillGroup;
  });
}

function parseEducation(lines: string[]) {
  return splitEntries(lines).map((entry) => {
    const [header, ...body] = entry;
    const [institution = 'Institution', program = 'Program', dateRange = '2018 - 2022'] = header
      .split('|')
      .map((part) => part.trim());
    const [start = '2018', end = '2022'] = dateRange.split('-').map((part) => part.trim());
    const details = compactLines(body).map((line) => line.replace(/^-+\s*/, ''));

    return {
      institution,
      program,
      start,
      end,
      details,
    } satisfies EducationItem;
  });
}

function createPlaceholderBlogPost(): BlogPostSummary {
  return {
    title: 'Writing soon',
    slug: 'writing-soon',
    excerpt: 'A placeholder entry for future essays, case studies, and notes.',
    status: 'draft',
    body: 'Future writing will live here.',
  };
}

function calculateYears(experience: ExperienceItem[]) {
  const years = experience
    .map((item) => Number.parseInt(item.start.match(/\d{4}/)?.[0] ?? '', 10))
    .filter((value) => Number.isFinite(value));

  if (years.length === 0) {
    return 5;
  }

  return Math.max(1, new Date().getFullYear() - Math.min(...years));
}

export function parseResumeMarkdown(markdown: string): SiteContent {
  const { topLines, sections } = splitSections(markdown);
  const sectionMap = new Map(sections.map((section) => [section.title, section.lines]));
  const top = parseTop(topLines);
  const experience = parseExperience(sectionMap.get('experience') ?? []);
  const links = parseLinks(sectionMap.get('links') ?? []);

  return {
    profile: {
      name: top.name,
      role: top.role,
      location: top.location,
      availability: top.availability,
      intro: top.intro,
      summary: compactLines(sectionMap.get('about') ?? []).join(' ') || top.intro,
      email: links.find((link) => link.kind === 'email')?.href.replace(/^mailto:/, '') || '',
      statement:
        'Minimal, editorial, and intentionally paced. Built to feel more like a quiet publication than a template.',
      yearsExperience: calculateYears(experience),
    },
    links,
    experience,
    projects: parseProjects(sectionMap.get('projects') ?? []),
    skills: parseSkills(sectionMap.get('skills') ?? []),
    education: parseEducation(sectionMap.get('education') ?? []),
    blogPosts: [createPlaceholderBlogPost()],
    updatedAt: new Date().toISOString(),
  };
}

export const demoSiteContent = parseResumeMarkdown(demoResumeMarkdown);

export function serializeLinks(links: SiteLink[]) {
  return links.map((link) => `${link.label} | ${link.href} | ${link.kind}`).join('\n');
}

export function parseEditableLinks(text: string) {
  return text
    .split('\n')
    .map((line) => line.trim())
    .filter(Boolean)
    .map((line) => {
      const [label = 'Link', href = '', kind = 'custom'] = line.split('|').map((part) => part.trim());
      return {
        label,
        href,
        kind: (['email', 'linkedin', 'github', 'website', 'custom'].includes(kind)
          ? kind
          : inferKind(label, href)) as LinkKind,
      } satisfies SiteLink;
    });
}

export function createSlug(value: string) {
  return slugify(value);
}
