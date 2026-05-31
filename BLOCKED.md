# Phase 4 Live Deploy Blocker

Date: 2026-05-26
Branch: codex/pathworks-phase-4

Goal 1 asks for a real production deploy to these URLs:

- https://<PATHWORKS_DOMAIN>
- https://api.<PATHWORKS_DOMAIN>
- https://media.<PATHWORKS_DOMAIN>

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
   - Ability to point `<PATHWORKS_DOMAIN>` at the dashboard host.
   - Ability to point `api.<PATHWORKS_DOMAIN>` at the API host.
   - Ability to point `media.<PATHWORKS_DOMAIN>` at the public media bucket or CDN.

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

# Provisioning Status (2026-05-31)

Updated when the user asked to deploy to production. The 2026-05-26 blocker list
above still applies. What changed since then:

## Resolved

- **Email provider** — Postmark transport landed (`packages/email/src/utils/services/postmark.ts`). Reuses the shared `noreply@neur3.com` server; only `POSTMARK_API_KEY` is required. The SMTP slots (`SMTP_HOST`/`SMTP_USER`/`SMTP_PASSWORD`/`SMTP_SENDER`) are no longer required if Postmark is used.

## Still Blocking

- **Hosting** — no Render (or equivalent) account / web services exist yet
- **Managed Postgres** — no Neon project yet (`DATABASE_URL` empty)
- **Managed Redis** — no Upstash instance yet (`REDIS_URL` empty)
- **Object storage** — no Cloudflare R2 buckets or keys yet (`OBJECT_STORAGE_*` empty)
- **DNS** — `<PATHWORKS_DOMAIN>`, `api.<PATHWORKS_DOMAIN>`, `media.<PATHWORKS_DOMAIN>` not pointed
- **Secrets** — `BETTER_AUTH_SECRET`, `PRIVATE_SERVER_KEY`, `AUTH_BEARER_TOKEN` not generated for prod

## Provisioning Checklist (Do These Before Touching `docs/DEPLOY.md`)

Recommended order. Each step is something the human must do — agents cannot create accounts or hold payment methods.

1. **Postmark sender domain** (~10 min, free tier)
   - Confirm `neur3.com` is verified in the existing Postmark account
   - Create or reuse an API token; save as `POSTMARK_API_KEY`
   - Set `POSTMARK_FROM='"PathWorks" <noreply@neur3.com>'`

2. **Neon Postgres** (~10 min, https://console.neon.tech)
   - Create project `pathworks-prod` (region close to Render region)
   - Create `main` database; copy pooled URL → `DATABASE_URL`, direct URL → `PRIVATE_DATABASE_URL`
   - Take a manual branch/snapshot before first migration

3. **Upstash Redis** (~5 min, https://console.upstash.com)
   - Create Redis database in same region as Neon
   - Copy connection URL → `REDIS_URL`

4. **Cloudflare R2** (~20 min, https://dash.cloudflare.com)
   - Create three buckets: `pathworks-videos`, `pathworks-documents`, `pathworks-media`
   - Generate an R2 API token with read/write on all three; copy keys → `OBJECT_STORAGE_ACCESS_KEY_ID` / `OBJECT_STORAGE_SECRET_ACCESS_KEY`
   - On the `pathworks-media` bucket, enable a custom public domain `media.<PATHWORKS_DOMAIN>`
   - S3 endpoint → `OBJECT_STORAGE_ENDPOINT`; set `OBJECT_STORAGE_FORCE_PATH_STYLE=true`
   - `OBJECT_STORAGE_MEDIA_PUBLIC_BASE_URL=https://media.<PATHWORKS_DOMAIN>`

5. **DNS** (~5 min, wherever `<PATHWORKS_DOMAIN>` is hosted)
   - `<PATHWORKS_DOMAIN>` → CNAME → Render dashboard service
   - `api.<PATHWORKS_DOMAIN>` → CNAME → Render API service
   - `media.<PATHWORKS_DOMAIN>` → CNAME → R2 custom-domain target

6. **Generate prod secrets** (~1 min, local terminal)
   ```bash
   openssl rand -base64 48  # → BETTER_AUTH_SECRET
   openssl rand -base64 48  # → PRIVATE_SERVER_KEY
   openssl rand -base64 48  # → AUTH_BEARER_TOKEN
   ```
   Set `AUTH_COOKIE_DOMAIN=.<PATHWORKS_DOMAIN>`, `PUBLIC_IS_SELFHOSTED=true`.

7. **Render web services** (~20 min, https://dashboard.render.com)
   - Create API service from `docker/Dockerfile.api`; paste all API env vars
   - Create dashboard service from `docker/Dockerfile.dashboard` with build arg `PUBLIC_IS_SELFHOSTED=true`; paste all dashboard env vars
   - Defer first auto-deploy until DNS and migrations are done

8. **Run migrations once** (against Neon direct URL — see DEPLOY.md migration runbook)

9. **Deploy API → smoke test → deploy dashboard → smoke test** (see DEPLOY.md smoke test list)

Once steps 1–9 are done, `docs/DEPLOY.md` becomes executable instead of aspirational.

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

## CI-3: Community feature broken by `pathworks.neur3.devmunity` typo

Surfaced while cleaning up stale `neur3.dev` references on 2026-05-31. The
community module's RPC calls reference `pathworks.neur3.devmunity` instead of
`pathworks.community`. This is the residue of an earlier sloppy `classroomio`
→ `pathworks` rename that did `s|classroomio.com|pathworks.neur3.dev|g` and
turned `classroomio.community` into `pathworks.neur3.devmunity`.

**Affected files:**

- `apps/dashboard/src/routes/(app)/org/[slug]/community/+page.server.ts` (1 ref)
- `apps/dashboard/src/routes/(app)/org/[slug]/community/[cslug]/+page.server.ts` (1 ref)
- `apps/dashboard/src/lib/features/community/utils/types.ts` (6 refs)
- `apps/dashboard/src/lib/features/community/api/community.svelte.ts` (~14 refs)

**Impact:** the entire community feature is broken — types don't resolve and
runtime calls go to a nonexistent RPC path. This is one of the major drivers
of CI-1's `Cannot find module` cascade.

**Fix direction:** `sed -i 's|pathworks\.neur3\.devmunity|pathworks.community|g'`
across the four files above, then verify the resulting `pathworks.community.*`
RPC paths exist in the API schema. If the API never had a `community` endpoint
group, the wiring needs to be either restored or removed from the dashboard.

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
