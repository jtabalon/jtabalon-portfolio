import { spawnSync } from 'node:child_process';
import { fileURLToPath } from 'node:url';

function run(command, args) {
  const result = spawnSync(command, args, { stdio: 'inherit' });
  if (result.error) throw result.error;
  if (result.status !== 0) process.exit(result.status ?? 1);
}

console.log(`Browser verification: Bun ${process.versions.bun ?? 'unknown'} on ${process.platform}/${process.arch}`);
run('node', ['--version']);

// Vercel's Amazon Linux build image has GTK, but omits Chromium's NSS/NSPR
// libraries. Install them in the build container, never on a developer's machine.
if (process.platform === 'linux' && process.env.VERCEL === '1') {
  run('dnf', ['install', '-y', 'nss', 'nspr']);
}

run(process.execPath, [
  '--no-env-file',
  fileURLToPath(new URL('../node_modules/playwright/cli.js', import.meta.url)),
  'install', '--only-shell', 'chromium',
]);
