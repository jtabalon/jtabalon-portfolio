import { copyFile } from 'node:fs/promises';

// Expo 55 exports the unmatched route here. Vercel's static hosting recognizes
// 404.html as its fallback and retains HTTP 404 for unknown request paths.
await copyFile(
  new URL('../dist/+not-found.html', import.meta.url),
  new URL('../dist/404.html', import.meta.url),
);
