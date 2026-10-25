# Continued release-check review — 24 October 2026

This bounded continuation of [draft PR #18](https://github.com/jtabalon/jtabalon-portfolio/pull/18) starts from `454d86321888684de9439a4c3ad18b34511b430c`. It addresses the existing built-site, asset and tooling contracts in #8/#11/#13/#14. The same coordinator and two workers were retained; only the coordinator dispatched serialized checks. Production publication and production-dependent issue closure remain separate.

## Public image decoding

An isolated copy of the export replaced both `social-preview.png` and `joseph-tabalon.png` with 24-byte headers retaining their PNG signatures and dimensions. The old static verifier and all seven old asset scenarios still passed. This demonstrated a release-check false pass; the actual committed/public images were not corrupt and were not modified.

The standard-density asset case now asks the browser to decode both resources and requires their actual 1200×630 and 1024×1024 dimensions. The new suite rejects the truncated Social preview. After restoring that valid control, it independently rejects the truncated Public identity portrait. The checks run once inside the existing case; there are still seven asset scenarios and six discovered suites.

## Local versus hosted verification

`tests/errors.mjs` deliberately supports hosted origins. The shared release runner previously inherited `SITE_BASE_URL` and `SITE_APEX_URL`, allowing a local release to check another deployment's recovery instead of its newly built export. A copied-runner fixture confirmed those values reached a child.

The shared runner now removes only those two hosted-origin overrides from its child environment. The corrected fixture passes with both values absent while an unrelated explicit value and the artifact directory remain intact. Direct `tests/errors.mjs` hosted checks retain their supported behavior. The [production verification checklist](../seo-release-checklist.md) now consolidates the already-required revision, HTTP, Contact, navigation, asset and discovery acceptance. It does not add publication authority, physical-device requirements or Case study gates.

## Automatic environment-file loading

Earlier release commands set `EXPO_NO_DOTENV=1`, which disables Expo's loader. That flag alone did **not** disable Bun's automatic loading. A harmless private `.env.local` marker appeared in a nested Bun child under the old command; flagging only the entry still allowed the child to load it. These observations correct the broader isolation claim, without invalidating the recorded behavior checks or the separately recorded fresh-checkout runs without environment files.

The documented/Vercel release entry is now `bun --no-env-file run verify:release`; every nested Bun step also opts out. Expo's flag remains on check/export. Explicit shell and hosting environment values remain available. A fixture built from the actual package/browser scripts replaced expensive leaf checks with observers: all seven observed stages kept automatic marker loading disabled and preserved the explicit control value. No existing local environment file or credential was edited. [Bun's environment-loading documentation](https://bun.com/docs/runtime/environment-variables#disabling-automatic-env-loading) describes the opt-out; the recorded probe establishes its runtime behavior on Bun 1.3.10.

The frozen install remains `bun install --frozen-lockfile`. A separate harmless lifecycle fixture showed Bun 1.3.10's installer still loaded the marker with either position of `--no-env-file`; current documentation for newer Bun must not be treated as proof for that older installer. The verified isolation claim covers the release/check/export/browser processes, not dependency-installation environment loading.

## Supported Node verification

The existing documented runtime is stable Node 24.3+ within 24.x. `check` now verifies the actual `node` on PATH before type checking/lint, and `engines.node` states the same range. Actual Node 25.4.0 and 22.13.0 are rejected; Node 24.22.1 passes. Eight simulated boundary versions agree with the declared semver range, including rejection of a prerelease. This is an unsupported-use guard, not a newly discovered application or hosting failure. Vercel retains the supported major and manages its minor/patch selection. [Vercel's Node-version contract](https://vercel.com/docs/functions/runtimes/node-js/node-js-versions)

## Additional behavior observations

The current application passed six additional actual-text probes: normal 768-pixel layout and doubled text at 768/820/912/1024/1440 pixels, with no viewport or clipping-ancestor violations. A frame-by-frame Chromium probe retained one Hero node and opacity 1 through Contact, Back to top and repeated top activation after its initial arrival. Contact keyboard focus and next-Tab order survived all five font responses remaining pending beyond the observer timeout and then loading. These diagnostic results did not justify additional application changes or permanent tests.

## Integrated verification

The exact restored frozen-install command passes without a lockfile change. With Node 24.22.1/Bun 1.3.10, `CI=1 bun --no-env-file run verify:release` passes the runtime guard, type checking, lint, export/output checks, browser preparation and all six suites. Deliberately invalid `SITE_BASE_URL`/`SITE_APEX_URL` values were supplied during this run; recovery still checked the built local site. Both valid PNG controls decode successfully. All 39 exported files are byte-identical to the application at `454d863`; this continuation changes verification and documentation only.

The [focused evidence](evidence/2026-10-24-release-check-review.json) records the actual and simulated runtime boundaries, environment observations, negative-fixture results, source/log hashes and export comparison. Independent team review found no unresolved Standards or Spec findings in the implemented changes. The latest same-revision hosted gate is recorded on PR #18; a local pass does not establish hosted or production behavior.

Raw fixtures, controls, logs and screenshots are retained locally under `output/continued-review-2026-10-24/`, outside the public export. The evidence does not establish screen-reader, remote-device or production validation, and does not complete #7 or #16.
