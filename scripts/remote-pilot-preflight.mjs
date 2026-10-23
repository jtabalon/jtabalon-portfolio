import { spawnSync } from 'node:child_process';
import { createHash } from 'node:crypto';
import { lstat, readFile } from 'node:fs/promises';
import { resolve } from 'node:path';

const args = process.argv.slice(2);
let hostRole = 'unspecified';
let timeoutMs = 3000;
for (let index = 0; index < args.length; index++) {
  const argument = args[index];
  if (argument === '--host-role') hostRole = args[++index];
  else if (argument === '--timeout-ms') timeoutMs = Number(args[++index]);
  else if (argument === '--help') {
    console.log('Run from the checkout root: node scripts/remote-pilot-preflight.mjs [--host-role access-client|execution-host] [--timeout-ms 100..5000]');
    process.exit(0);
  } else {
    console.error(JSON.stringify({ error: 'unsupported-argument' }));
    process.exit(2);
  }
}
if (!['unspecified', 'access-client', 'execution-host'].includes(hostRole)
  || !Number.isInteger(timeoutMs) || timeoutMs < 100 || timeoutMs > 5000) {
  console.error(JSON.stringify({ error: 'invalid-option' }));
  process.exit(2);
}

// Fixed local version commands only. Never surface their raw output or errors.
const tools = [
  ['git', ['--version'], /^git version (\d+\.\d+(?:\.\d+)?)/im],
  ['node', ['--version'], /^v(\d+\.\d+\.\d+)/m],
  ['bun', ['--version'], /^(\d+\.\d+\.\d+)/m],
  ['codex', ['--version'], /^codex-cli (\d+\.\d+\.\d+)/im],
  ['herdr', ['--version'], /^herdr(?: version)? v?(\d+\.\d+(?:\.\d+)?)/im],
  ['grok', ['--version'], /^grok (\d+\.\d+\.\d+)/im],
  ['ssh', ['-V'], /OpenSSH_(\d+\.\d+(?:p\d+)?)/m],
  ['tailscale', ['version'], /^(\d+\.\d+\.\d+)/m],
];
function run(command, arguments_) {
  return spawnSync(command, arguments_, {
    encoding: 'utf8', timeout: timeoutMs, maxBuffer: 8192,
    stdio: ['ignore', 'pipe', 'pipe'],
  });
}
const cli = Object.fromEntries(tools.map(([command, arguments_, versionPattern]) => {
  const result = run(command, arguments_);
  const status = result.error?.code === 'ENOENT' ? 'missing'
    : result.error?.code === 'ETIMEDOUT' ? 'timeout'
      : result.error || result.status !== 0 ? 'failed' : 'available';
  const version = status === 'available'
    ? `${result.stdout ?? ''}\n${result.stderr ?? ''}`.match(versionPattern)?.[1] ?? null : null;
  return [command, { status, version }];
}));

const repositoryRoot = resolve('.');
function git(arguments_) { return run('git', ['-C', repositoryRoot, ...arguments_]); }
const revisionResult = git(['rev-parse', '--verify', 'HEAD']);
const revision = revisionResult.status === 0
  && /^[a-f0-9]{40,64}$/.test(revisionResult.stdout.trim()) ? revisionResult.stdout.trim() : null;
const statusResult = git(['status', '--porcelain', '--untracked-files=no']);
const trackedClean = statusResult.status === 0 ? statusResult.stdout.trim() === '' : null;

const paths = [
  'AGENTS.md', 'CONTEXT.md', 'docs/site-direction.md',
  'docs/agents/issue-tracker.md', 'docs/agents/triage-labels.md',
  'docs/adr/0001-use-www-as-canonical-host.md', 'tests/contact.mjs',
];
const documents = await Promise.all(paths.map(async path => {
  try {
    if (!(await lstat(resolve(repositoryRoot, path))).isFile()) return { path, present: false };
    const content = await readFile(resolve(repositoryRoot, path));
    return { path, present: true, sha256: createHash('sha256').update(content).digest('hex') };
  } catch { return { path, present: false }; }
}));
let verificationEntryPoints = {};
try {
  const manifest = JSON.parse(await readFile(resolve(repositoryRoot, 'package.json'), 'utf8'));
  verificationEntryPoints = Object.fromEntries(['check', 'build:web', 'verify:web', 'test:browser', 'verify:release']
    .map(name => [name, typeof manifest.scripts?.[name] === 'string']));
} catch { /* Missing or malformed project metadata is reported, never repaired. */ }

console.log(JSON.stringify({
  schemaVersion: 1,
  scope: 'This machine only; the host role is caller-declared, not hardware verification.',
  hostRole, pilotVerified: false,
  cli, repository: { revision, trackedClean, documents, verificationEntryPoints },
  unverified: [
    'Studio identity, resources, access policy and client reachability',
    'Provider subscription entitlement, authentication route and billing',
    'Herdr continuity across client disconnect and actual Codex-to-Grok delegation',
    'Reviewer read-only enforcement, fixed revision, findings and corrections',
    'Issue #9 implementation checks and matching final-candidate review',
    'Private preview from laptop and phone, independent of Termius foreground',
    'Git-triggered preview protection and existing-plan coverage before push',
    'Validated portable skills, private checkpoint, deliberate recovery and single-writer handoff',
    'Tested draft PR attached to the originating chat',
  ],
}, null, 2));
