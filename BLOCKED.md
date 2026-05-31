# Phase 4 Live Deploy Blocker

Date: 2026-05-26
Branch: codex/pathworks-phase-4

Goal 1 asks for a real production deploy to these URLs:

- https://pathworks.neur3.dev
- https://api.pathworks.neur3.dev
- https://media.pathworks.neur3.dev

The user confirmed that hosting and DNS are not available yet. We are testing locally first.

## Exact Human Inputs Needed Before Live Deploy

1. Hosting account access
   - Render account or another approved app host.
   - Permission to create two Docker web services: API and dashboard.

2. Managed database
   - Neon project or equivalent managed Postgres.
   - Production `DATABASE_URL` and `PRIVATE_DATABASE_URL`.

3. Redis
   - Upstash Redis or equivalent managed Redis.
   - Production `REDIS_URL`.

4. Object storage
   - Cloudflare R2 account or equivalent S3-compatible storage.
   - Buckets for videos, documents, and media, or one approved shared bucket.
   - S3 endpoint, access key id, secret access key, bucket names, and public media base URL.

5. DNS control
   - Ability to point `pathworks.neur3.dev` at the dashboard host.
   - Ability to point `api.pathworks.neur3.dev` at the API host.
   - Ability to point `media.pathworks.neur3.dev` at the public media bucket or CDN.

6. Email provider
   - SMTP or Zoho credentials for login links, invites, and counselor links.
   - Production sender address.

7. Production secrets
   - `BETTER_AUTH_SECRET`
   - `PRIVATE_SERVER_KEY`
   - `AUTH_BEARER_TOKEN` if the bearer fallback remains enabled
   - Optional provider keys for Google OAuth, AI features, and Sentry

## Current Local-First Plan

Continue Phase 4 locally until production access is ready:

1. Verify CI workflow behavior from `codex/pathworks-phase-4`.
2. Run authenticated axe against the local Docker stack.
3. Build and test lesson exercise authoring locally.
4. Build and test counselor workflow polish locally.
5. Return to live deploy once hosting, DNS, and production secrets are available.

---

# CI Followups (filed 2026-05-31)

Surfaced after admin-merging PR #4 (`codex/pathworks-marketing-rebrand` → `main`,
squash commit `ca62bdc`). These checks failed on the PR but were bypassed via
`--admin` because they are pre-existing, not introduced by the seat/onboarding
fixes that PR shipped.

## CI-1: Typecheck job missing workspace build order

**Workflow:** `.github/workflows/pathworks-ci.yml` → `Typecheck + build` job
**Failing run example:** https://github.com/neur3-dev/pathworks/actions/runs/26703732170/job/78701074017

The "Typecheck core packages" step runs `tsc` against `@cio/db`, `@cio/api`,
etc. without first building their workspace dependencies. Result: dozens of
`TS2307: Cannot find module '@cio/email'` / `'@cio/utils/constants'` /
`'@cio/utils/validation/organization'` errors that don't reproduce locally
(local builds resolve them through `dist/`).

**Fix direction:** prepend a `pnpm -r --filter ./packages/* build` (or a
turbo-aware `pnpm turbo run build --filter=...^...`) before the typecheck
step so dependent packages' `dist/` outputs exist when downstream `tsc`
runs. Alternative: use TS project references / `tsc -b` from the repo root
so the build order is implicit.

## CI-2: Two real Svelte lint errors

**Workflow:** `.github/workflows/pathworks-ci.yml` → `Format + PathWorks lint` job
**Failing run example:** https://github.com/neur3-dev/pathworks/actions/runs/26703732170/job/78701074022

ESLint reports two violations in dashboard svelte files (not the seat work):

- `svelte/prefer-svelte-reactivity` — "Found a mutable instance of the
  built-in URL class. Use SvelteURL instead" (line 77:17)
- `svelte/require-each-key` — "Each block should have a key" (line 107:23)

The exact files are in the job log. Fix is mechanical: swap `new URL(...)`
for `SvelteURL` from `svelte/reactivity`, and add a stable key to the
`{#each}` block.
