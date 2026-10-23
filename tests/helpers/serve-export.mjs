import assert from 'node:assert/strict';
import { resolve, sep } from 'node:path';

export function serveExport({ notFound = null, cleanUrls = false } = {}) {
  const root = resolve('dist');
  return Bun.serve({
    hostname: '127.0.0.1',
    port: 0,
    async fetch(request) {
      let pathname;
      try {
        pathname = decodeURIComponent(new URL(request.url).pathname);
      } catch {
        return new Response('Bad request', { status: 400 });
      }
      const path = resolve(root, `.${pathname === '/' ? '/index.html' : pathname}`);
      if (!path.startsWith(root + sep)) return new Response('Not found', { status: 404 });
      const file = Bun.file(path);
      if (await file.exists()) return new Response(file);
      if (cleanUrls && !pathname.endsWith('/')) {
        const html = Bun.file(`${path}.html`);
        if (await html.exists()) return new Response(html);
      }
      if (notFound) {
        const fallback = resolve(root, notFound);
        assert(fallback.startsWith(root + sep), '404 fixture must stay inside dist');
        const html = Bun.file(fallback);
        if (await html.exists()) return new Response(html, { status: 404 });
      }
      return new Response('Not found', { status: 404 });
    },
  });
}
