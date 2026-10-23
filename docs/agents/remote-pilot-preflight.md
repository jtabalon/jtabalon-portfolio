# Remote-pilot preflight

Use this when preparing [issue #16](https://github.com/jtabalon/jtabalon-portfolio/issues/16), comparing access-client and execution-host prerequisites, or checkpointing its unfinished work. The issue owns the complete pilot acceptance criteria; this inventory does not establish readiness or complete the pilot.

## Collect a local inventory

Run from the checkout root on each machine separately:

```sh
node scripts/remote-pilot-preflight.mjs --host-role access-client
node scripts/remote-pilot-preflight.mjs --host-role execution-host
```

Use the role for the machine actually running the command. Declaring `execution-host` does not identify or audit a Mac Studio. Exit 0 means inventory collection completed; missing tools and unknown prerequisites remain in JSON. `pilotVerified` is always false.

The script executes only fixed local version probes and Git reads, hashes the listed instruction/test files, and checks verification-entry-point presence. The collector reads no authentication, SSH or Tailscale configuration and issues no remote, authentication, installation, setup or model-request command. Installed CLIs still execute their own version-command startup code under the current user; that behavior is not audited by this inventory. Version output is reduced to known numeric forms; raw command output, paths, addresses and account details are omitted. Unrecognized version formats report null. Use a trusted local PATH: executing an arbitrary program named like a CLI is not an operating-system isolation guarantee.

Completion: retain a separate private inventory for each declared role, inspect every missing/failed/timed-out probe, and verify project instructions and test commands at the intended revision. An app installed outside PATH, a CLI version, or existing site test results do not establish provider entitlement, Studio setup or remote continuity. This branch is preparation separate from the site implementation PR.

## Checkpoint privately

Keep the checkpoint outside Git, `public` and exported files. Record no credentials or host/network identifiers. Complete these fields before disconnecting, restarting, or transferring a writer:

```text
Task / scope: issue #16 pilot using issue #9
Declared execution role:
Active branch and immutable revision:
Writer state: active / paused / blocked
Last completed action and observed result:
Pending action: not started / running / outcome unknown
Verification: command, result, revision
Review: provider, fixed revision, read-only control, findings reference
Next action and unresolved question:
Handoff: source writer paused, transferred revision, destination verified
```

Completion: another session can identify the exact revision, distinguish an unfinished action from a completed one, and choose one next action without replaying a prompt or starting a second writer. After a restart, inspect actual work and reconcile unknown outcomes before manually resuming; local recovery remains an allowed fallback.

## Finish the pilot

Before calling #16 complete, retain actual evidence for both clients reaching the Studio; eligible existing provider access/billing; progress while the client is disconnected; Codex prompting Grok and collecting fixed-revision findings with no reviewer edits; corrections and issue #9 checks; private preview access from laptop and phone; verified hosting side effects; and the tested, attached draft PR. Validate selected portable skills in each CLI. Record restart behavior as untested unless exercised without interrupting personal work. Keep one writer and at most one reviewer during the pilot. Merge, production release and issue #9 closure retain their separate acceptance boundaries.
