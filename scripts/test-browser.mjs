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

// The shared release gate must test this checkout's export. Hosted recovery
// checks opt in by running tests/errors.mjs directly with their target origins.
const localEnvironment = { ...process.env };
delete localEnvironment.SITE_BASE_URL;
delete localEnvironment.SITE_APEX_URL;

for (const test of tests) {
  console.log(`\nRunning ${test}`);
  const result = spawnSync(process.execPath, ['--no-env-file', fileURLToPath(new URL(test, testsDirectory))], {
    stdio: 'inherit',
    timeout: 180_000,
    env: localEnvironment,
  });
  if (result.error) throw result.error;
  if (result.status !== 0) {
    console.error(`${test} failed${result.signal ? ` (${result.signal})` : ''}.`);
    process.exit(result.status ?? 1);
  }
}

console.log(`Passed ${tests.length} exported-site browser suites.`);
