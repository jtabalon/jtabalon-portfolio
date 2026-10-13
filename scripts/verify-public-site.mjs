import assert from 'node:assert/strict';
import { access, readFile } from 'node:fs/promises';

const indexHtml = await readFile(new URL('../dist/index.html', import.meta.url), 'utf8');
const canonicalUrl = 'https://www.josephtabalonjr.com';
const description =
  'Senior Data Scientist building machine-learning systems from rigorous modeling and evaluation through reliable, secure deployment.';

function findTag(tagName, key, value) {
  const tags = indexHtml.match(new RegExp(`<${tagName}\\b[^>]*>`, 'g')) ?? [];
  return tags.find((tag) => tag.includes(`${key}="${value}"`));
}

function readAttribute(tag, attribute) {
  return tag?.match(new RegExp(`${attribute}="([^"]*)"`))?.[1];
}

assert.match(
  indexHtml,
  /<title[^>]*>Joseph Tabalon \| Senior Data Scientist<\/title>/,
  'The exported homepage must contain its Search identity in the initial HTML.',
);
assert.match(
  indexHtml,
  /Machine learning that holds up beyond the notebook\./,
  'The exported homepage must contain its hero content before hydration.',
);

const heroPortrait = findTag('img', 'alt', 'Portrait of Joseph Tabalon');
assert.equal(
  readAttribute(heroPortrait, 'src'),
  '/portraits/joseph-tabalon-640.webp',
  'The initial homepage HTML must contain its portrait.',
);
assert.equal(
  readAttribute(heroPortrait, 'srcSet') ?? readAttribute(heroPortrait, 'srcset'),
  '/portraits/joseph-tabalon-320.webp 320w, /portraits/joseph-tabalon-640.webp 640w, /portraits/joseph-tabalon-960.webp 960w',
  'The portrait must offer appropriately sized resources before hydration.',
);
assert.equal(readAttribute(heroPortrait, 'sizes'), '(min-width: 768px) 280px, 148px');
assert.equal(readAttribute(heroPortrait, 'width'), '1024');
assert.equal(readAttribute(heroPortrait, 'height'), '1024');

const webFonts = [
  ['Inter_400Regular', 'inter-400-latin.woff2'],
  ['Inter_500Medium', 'inter-500-latin.woff2'],
  ['Inter_600SemiBold', 'inter-600-latin.woff2'],
  ['JetBrainsMono_400Regular', 'jetbrains-mono-400-latin.woff2'],
  ['JetBrainsMono_500Medium', 'jetbrains-mono-500-latin.woff2'],
];
let fontBytes = 0;
for (const [family, filename] of webFonts) {
  const href = `/fonts/${filename}`;
  assert.ok(
    indexHtml.includes(`font-family:"${family}";src:url("${href}");font-display:swap`),
    `${family} must be available without JavaScript and allow readable fallback text.`,
  );
  const preload = findTag('link', 'href', href);
  assert.equal(readAttribute(preload, 'rel'), 'preload');
  assert.equal(readAttribute(preload, 'as'), 'font');
  const font = await readFile(new URL(`../dist${href}`, import.meta.url));
  assert.equal(font.toString('ascii', 0, 4), 'wOF2', `${filename} must be WOFF2.`);
  assert.equal(font.readUInt32BE(8), font.length, 'WOFF2 length must match its header.');
  fontBytes += font.length;
}
assert.ok(fontBytes < 150 * 1024, 'Keep combined web-font delivery below 150 KiB.');
assert.doesNotMatch(indexHtml, /\.ttf\b/, 'The web page must not preload native TTF resources.');

const descriptionTag = findTag('meta', 'name', 'description');
assert.equal(readAttribute(descriptionTag, 'content'), description);

const canonicalTag = findTag('link', 'rel', 'canonical');
assert.equal(readAttribute(canonicalTag, 'href'), `${canonicalUrl}/`);

const expectedMeta = new Map([
  ['og:type', 'website'],
  ['og:title', 'Joseph Tabalon | Senior Data Scientist'],
  ['og:description', description],
  ['og:url', `${canonicalUrl}/`],
  ['og:image', `${canonicalUrl}/social-preview.png`],
  ['og:image:width', '1200'],
  ['og:image:height', '630'],
  ['og:image:alt', 'Joseph Tabalon, Senior Data Scientist'],
]);

for (const [property, content] of expectedMeta) {
  const tag = findTag('meta', 'property', property);
  assert.equal(readAttribute(tag, 'content'), content, `${property} must be exported.`);
}

const expectedTwitterMeta = new Map([
  ['twitter:card', 'summary_large_image'],
  ['twitter:title', 'Joseph Tabalon | Senior Data Scientist'],
  ['twitter:description', description],
  ['twitter:image', `${canonicalUrl}/social-preview.png`],
  ['twitter:image:alt', 'Joseph Tabalon, Senior Data Scientist'],
]);

for (const [name, content] of expectedTwitterMeta) {
  const tag = findTag('meta', 'name', name);
  assert.equal(readAttribute(tag, 'content'), content, `${name} must be exported.`);
}

const structuredDataMatch = indexHtml.match(
  /<script\b[^>]*type="application\/ld\+json"[^>]*>([^<]+)<\/script>/,
);
assert.ok(structuredDataMatch, 'ProfilePage structured data must be exported.');

const structuredData = JSON.parse(structuredDataMatch[1]);
assert.deepEqual(structuredData, {
  '@context': 'https://schema.org',
  '@type': 'ProfilePage',
  url: `${canonicalUrl}/`,
  name: 'Joseph Tabalon | Senior Data Scientist',
  description,
  mainEntity: {
    '@type': 'Person',
    name: 'Joseph Tabalon',
    url: `${canonicalUrl}/`,
    jobTitle: 'Senior Data Scientist',
    image: `${canonicalUrl}/joseph-tabalon.png`,
    sameAs: [
      'https://www.linkedin.com/in/josephtabalonjr',
      'https://github.com/jtabalon',
    ],
  },
});

const robotsTxt = await readFile(new URL('../dist/robots.txt', import.meta.url), 'utf8');
assert.equal(
  robotsTxt,
  `User-agent: *\nAllow: /\n\nSitemap: ${canonicalUrl}/sitemap.xml\n`,
);

const sitemapXml = await readFile(new URL('../dist/sitemap.xml', import.meta.url), 'utf8');
assert.match(sitemapXml, /<urlset xmlns="http:\/\/www\.sitemaps\.org\/schemas\/sitemap\/0\.9">/);
assert.match(sitemapXml, new RegExp(`<loc>${canonicalUrl}/</loc>`));
assert.equal(sitemapXml.match(/<loc>/g)?.length, 1, 'Only the homepage is currently Indexable.');
assert.doesNotMatch(sitemapXml, /<lastmod>|_sitemap/);

await assert.rejects(
  access(new URL('../dist/_sitemap.html', import.meta.url)),
  'Expo’s diagnostic sitemap must not be published.',
);

function readPngSize(image) {
  assert.deepEqual(
    [...image.subarray(0, 8)],
    [137, 80, 78, 71, 13, 10, 26, 10],
    'The public image must be a PNG.',
  );

  return {
    width: image.readUInt32BE(16),
    height: image.readUInt32BE(20),
  };
}

const socialPreview = await readFile(
  new URL('../dist/social-preview.png', import.meta.url),
);
assert.deepEqual(readPngSize(socialPreview), { width: 1200, height: 630 });

const portrait = await readFile(new URL('../dist/joseph-tabalon.png', import.meta.url));
assert.deepEqual(readPngSize(portrait), { width: 1024, height: 1024 });

function readWebpSize(image) {
  assert.equal(image.toString('ascii', 0, 4), 'RIFF');
  assert.equal(image.toString('ascii', 8, 12), 'WEBP');
  for (let offset = 12; offset + 8 <= image.length;) {
    const chunk = image.toString('ascii', offset, offset + 4);
    const length = image.readUInt32LE(offset + 4);
    const data = offset + 8;
    assert.ok(data + length <= image.length, 'WebP chunks must fit in the file.');
    if (chunk === 'VP8 ') {
      assert.equal(image.toString('hex', data + 3, data + 6), '9d012a');
      return {
        width: image.readUInt16LE(data + 6) & 0x3fff,
        height: image.readUInt16LE(data + 8) & 0x3fff,
      };
    }
    if (chunk === 'VP8L') {
      assert.equal(image[data], 0x2f);
      const bits = image.readUInt32LE(data + 1);
      return { width: (bits & 0x3fff) + 1, height: ((bits >>> 14) & 0x3fff) + 1 };
    }
    if (chunk === 'VP8X') {
      return { width: image.readUIntLE(data + 4, 3) + 1, height: image.readUIntLE(data + 7, 3) + 1 };
    }
    offset = data + length + (length % 2);
  }
  assert.fail('The responsive portrait must contain WebP image dimensions.');
}

for (const width of [320, 640, 960]) {
  const image = await readFile(
    new URL(`../dist/portraits/joseph-tabalon-${width}.webp`, import.meta.url),
  );
  assert.deepEqual(readWebpSize(image), { width, height: width });
  assert.ok(image.length < 200 * 1024, 'Responsive portrait resources must stay below 200 KiB.');
}

const vercelConfig = JSON.parse(
  await readFile(new URL('../vercel.json', import.meta.url), 'utf8'),
);
assert.deepEqual(vercelConfig.redirects, [
  {
    source: '/:path*',
    destination: `${canonicalUrl}/:path*`,
    permanent: true,
    has: [{ type: 'host', value: 'josephtabalonjr.com' }],
  },
]);

console.log(
  'Verified initial HTML, metadata, public identity, discovery files, images, and canonical redirect configuration.',
);
