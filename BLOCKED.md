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
