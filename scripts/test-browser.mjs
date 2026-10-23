import assert from 'node:assert/strict';
import { spawnSync } from 'node:child_process';
import { readdir } from 'node:fs/promises';
import { fileURLToPath } from 'node:url';

const testsDirectory = new URL('../tests/', import.meta.url);
const tests = (await readdir(testsDirectory, { withFileTypes: true }))
  .filter((entry) => entry.isFile() && entry.name.endsWith('.mjs'))
  .map((entry) => entry.name)
  .sort();

assert(tests.length > 0, 'No exported-site browser regressions were found.');

for (const test of tests) {
  console.log(`\nRunning ${test}`);
  const result = spawnSync(process.execPath, [fileURLToPath(new URL(test, testsDirectory))], {
    stdio: 'inherit',
    timeout: 180_000,
  });
  if (result.error) throw result.error;
  if (result.status !== 0) {
    console.error(`${test} failed${result.signal ? ` (${result.signal})` : ''}.`);
    process.exit(result.status ?? 1);
  }
}

console.log(`Passed ${tests.length} exported-site browser suites.`);
