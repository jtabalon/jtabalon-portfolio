import assert from 'node:assert/strict';
import { mkdir, realpath } from 'node:fs/promises';
import { basename, dirname, resolve, sep } from 'node:path';

function isWithin(directory, root) {
  return directory === root || directory.startsWith(root + sep);
}

async function physicalPath(directory) {
  try {
    return await realpath(directory);
  } catch (error) {
    if (error.code !== 'ENOENT' || dirname(directory) === directory) throw error;
    return resolve(await physicalPath(dirname(directory)), basename(directory));
  }
}

export async function prepareArtifactDirectory(value) {
  if (!value) return undefined;
  const directory = resolve(value);
  const roots = ['dist', 'public'].map(root => resolve(root));
  for (const root of roots) {
    assert(!isWithin(directory, root), 'Screenshots must stay outside dist/public');
  }
  // Resolve the nearest existing ancestor before creating new subdirectories,
  // so a symlink alias cannot put artifacts inside either published root.
  const physicalDirectory = await physicalPath(directory);
  for (const root of roots) {
    assert(!isWithin(physicalDirectory, await physicalPath(root)),
      'Screenshots must stay outside dist/public, including symlink aliases');
  }
  await mkdir(directory, { recursive: true });
  return directory;
}
