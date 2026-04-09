# Resume Atelier

A web-first personal site built with Expo / React Native, Expo Router, NativeWind, Convex, Clerk, TypeScript, and Bun.

The public experience lives at:

- `/` for the resume-driven landing page
- `/blog` for a future-ready writing surface
- `/admin` for the private content editor

## Local workflow

Install dependencies:

```bash
bun install
```

Start the Expo app:

```bash
bun run web
```

Run the local Convex backend:

```bash
bun run convex:dev
```

Run checks:

```bash
bun run check
```

## Environment

Copy `.env.example` into `.env.local` and add real keys when you are ready to wire live auth:

```bash
EXPO_PUBLIC_CONVEX_URL=
EXPO_PUBLIC_CLERK_PUBLISHABLE_KEY=
CLERK_JWT_ISSUER_DOMAIN=
```

Notes:

- `EXPO_PUBLIC_CONVEX_URL` is generated automatically when you initialize a local Convex deployment.
- `EXPO_PUBLIC_CLERK_PUBLISHABLE_KEY` is used by the Expo app for the private admin sign-in.
- `CLERK_JWT_ISSUER_DOMAIN` is used by Convex auth configuration.

Until the Clerk keys are set, the public site still renders and the admin route shows setup guidance.

## Resume import format

The admin import expects pasted markdown with this general shape:

```md
# Your Name
Role | Location | Availability

Short intro paragraph.

## About
Longer summary paragraph.

## Links
- Email: you@example.com
- GitHub: https://github.com/you

## Experience
### Role | Company | Location | 2022 - Present
Summary sentence.
- Highlight

## Projects
### Project Name | https://example.com | 2025
Short summary sentence.
Stack: Expo Router, NativeWind, Convex
- Highlight

## Skills
### Product Engineering
TypeScript, React Native, Expo

## Education
### School | Degree | 2016 - 2020
- Detail
```

The parser converts that markdown into structured Convex records for profile, links, experience, projects, skills, and education.
