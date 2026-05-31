# PathWorks Production Deploy Spec

This is a deploy plan only. Do not deploy from this PR.

## Recommended Target

Use Render for the API and dashboard Docker web services, Neon for managed Postgres, Upstash for Redis, and Cloudflare R2 for S3-compatible object storage. This keeps operations simple: each production dependency has a managed console, automated backups or retention controls, clear environment-variable management, and no server patching burden. The existing Dockerfiles already fit Render-style web services, and Neon/R2 map cleanly to the current `DATABASE_URL` and `OBJECT_STORAGE_*` configuration.

## DNS

| Host | Target | Notes |
| --- | --- | --- |
| `<PATHWORKS_DOMAIN>` | Render dashboard service | User-facing SvelteKit app. Set dashboard `ORIGIN=https://<PATHWORKS_DOMAIN>`. |
| `api.<PATHWORKS_DOMAIN>` | Render API service | Hono API and Better Auth endpoints. Set API `PUBLIC_SERVER_URL=https://api.<PATHWORKS_DOMAIN>`. |
| `media.<PATHWORKS_DOMAIN>` | Cloudflare R2 public/custom domain | Public media bucket base, used by `OBJECT_STORAGE_MEDIA_PUBLIC_BASE_URL`. |

Set `AUTH_COOKIE_DOMAIN=.<PATHWORKS_DOMAIN>` so auth cookies work across dashboard and API subdomains.

## Services

| Service | Runtime | Command/Build | Public URL |
| --- | --- | --- | --- |
| API | Render Docker web service | `docker/Dockerfile.api` | `https://api.<PATHWORKS_DOMAIN>` |
| Dashboard | Render Docker web service | `docker/Dockerfile.dashboard` with `PUBLIC_IS_SELFHOSTED=true` build arg | `https://<PATHWORKS_DOMAIN>` |
| Postgres | Neon managed Postgres | Managed | Private connection string in `DATABASE_URL` |
| Redis | Upstash Redis | Managed | `REDIS_URL` |
| Object storage | Cloudflare R2 | Managed buckets | S3-compatible endpoint plus public media domain |

## Required Secrets

| Name | Why Needed | Source | Tier |
| --- | --- | --- | --- |
| `DATABASE_URL` | API and migration DB access | Neon pooled or direct Postgres URL | High |
| `PRIVATE_DATABASE_URL` | DB scripts that use private connection fallback | Same Neon direct URL as `DATABASE_URL` unless separate direct URL is preferred | High |
| `REDIS_URL` | Queue/cache backend for API workers and jobs | Upstash Redis URL | High |
| `BETTER_AUTH_SECRET` | Better Auth session and magic-link signing | Generate with `openssl rand -base64 48` | Critical |
| `AUTH_COOKIE_DOMAIN` | Cross-subdomain auth cookies | Literal `.<PATHWORKS_DOMAIN>` | Low |
| `PUBLIC_SERVER_URL` | Browser-visible API base URL | `https://api.<PATHWORKS_DOMAIN>` | Low |
| `PRIVATE_SERVER_URL` | Dashboard SSR-to-API calls | Render internal API URL if available, otherwise `https://api.<PATHWORKS_DOMAIN>` | Low |
| `TRUSTED_ORIGINS` | API CORS and auth origin checks | `https://<PATHWORKS_DOMAIN>` | Low |
| `DASHBOARD_ORIGIN` | Invite and counselor magic-link destinations | `https://<PATHWORKS_DOMAIN>` | Low |
| `ORIGIN` | SvelteKit CSRF/origin checks for dashboard | `https://<PATHWORKS_DOMAIN>` | Low |
| `PRIVATE_SERVER_KEY` | Dashboard-to-API trusted server key | Generate with `openssl rand -base64 48`; same value in API and dashboard | Critical |
| `AUTH_BEARER_TOKEN` | Internal API bearer fallback | Generate with `openssl rand -base64 48`; same value in API and dashboard if enabled | Critical |
| `PUBLIC_IS_SELFHOSTED` | Enables self-hosted PathWorks behavior | `true` | Low |
| `OBJECT_STORAGE_ENDPOINT` | Server-side S3/R2 endpoint | Cloudflare R2 S3 endpoint | Medium |
| `OBJECT_STORAGE_PUBLIC_ENDPOINT` | Browser-reachable presigned URL endpoint when different | R2 public/S3 endpoint as needed | Medium |
| `OBJECT_STORAGE_ACCESS_KEY_ID` | R2 write/read credentials | Cloudflare R2 access key | High |
| `OBJECT_STORAGE_SECRET_ACCESS_KEY` | R2 write/read credentials | Cloudflare R2 secret key | Critical |
| `OBJECT_STORAGE_FORCE_PATH_STYLE` | S3 client compatibility | `true` for R2-style endpoints unless tested otherwise | Low |
| `OBJECT_STORAGE_BUCKET_VIDEOS` | Lesson video uploads | R2 bucket name | Low |
| `OBJECT_STORAGE_BUCKET_DOCUMENTS` | Lesson document uploads | R2 bucket name | Low |
| `OBJECT_STORAGE_BUCKET_MEDIA` | Images/thumbnails/media uploads | R2 bucket name | Low |
| `OBJECT_STORAGE_MEDIA_PUBLIC_BASE_URL` | Public image/media delivery | `https://media.<PATHWORKS_DOMAIN>` | Low |
| `SMTP_HOST`, `SMTP_PORT`, `SMTP_USER`, `SMTP_PASSWORD`, `SMTP_SENDER` | Email delivery for login, invites, and notifications | Chosen SMTP provider | High for password, medium otherwise |
| `GOOGLE_CLIENT_ID`, `GOOGLE_CLIENT_SECRET` | Optional Google OAuth | Google Cloud OAuth app | High |
| `OPENAI_API_KEY`, `GOOGLE_API_KEY`, `ANTHROPIC_API_KEY` | Optional AI assistant/provider access | Provider consoles | Critical |
| `SENTRY_DSN`, `SENTRY_ENVIRONMENT`, `SENTRY_TRACES_SAMPLE_RATE` | Optional server observability | Sentry project | Medium |
| `PUBLIC_SENTRY_DSN`, `PUBLIC_SENTRY_ENVIRONMENT` | Optional dashboard observability | Sentry browser project | Low |
| `LICENSE_KEY` | Optional enterprise features | Vendor/license store | High |

## Database

Use Neon managed Postgres. It gives branching, backups, connection pooling, and a direct connection URL for migrations without running database operations on the app host. Keep one production database for launch, then add a staging branch before Phase 4 deployment work.

Use the direct Neon URL for migrations and backups. Use the pooled URL for normal app runtime if connection counts become a concern.

## Object Storage

Use Cloudflare R2 instead of self-hosted MinIO for production. MinIO is excellent locally, but R2 removes disk management and backup work, has S3-compatible credentials for the current code, and can expose media through `media.<PATHWORKS_DOMAIN>` without routing through the API.

Create three buckets or prefixes: videos, documents, and media. If using a single bucket, set all three bucket vars to that bucket name and use folder prefixes in application code only after a follow-up confirms prefix support end-to-end.

## Migration Runbook

Run these from the repository root after production secrets are available. Use the direct production Postgres URL, not a local Docker URL.

```bash
pnpm install --frozen-lockfile
pnpm --filter @cio/db build
DATABASE_URL="$PROD_DATABASE_URL" pnpm --filter @cio/db db migrate --config drizzle.config.ts
DATABASE_URL="$PROD_DATABASE_URL" pnpm --filter @cio/db db check --config drizzle.config.ts
```

Before first production launch, take a schema backup:

```bash
PGDUMP_URL="$PROD_DATABASE_URL" pnpm --filter @cio/db exec tsx src/scripts/pg-dump-backup.ts
```

For Render deploys, do not run migrations automatically inside every web-service start unless the platform guarantees a single release command. Prefer a one-off Render job or local CI-controlled release step using the commands above.

## Deploy Order

1. Create Neon Postgres and Upstash Redis.
2. Create R2 buckets and access keys; attach `media.<PATHWORKS_DOMAIN>` to the media bucket.
3. Create Render API service from `docker/Dockerfile.api`; set all API secrets.
4. Create Render dashboard service from `docker/Dockerfile.dashboard`; set build arg `PUBLIC_IS_SELFHOSTED=true` and dashboard env vars.
5. Add DNS records for `<PATHWORKS_DOMAIN>`, `api.<PATHWORKS_DOMAIN>`, and `media.<PATHWORKS_DOMAIN>`.
6. Run migrations once against Neon.
7. Deploy API, then dashboard.
8. Run smoke tests before inviting real users.

## Post-Deploy Smoke Tests

1. Visit `https://api.<PATHWORKS_DOMAIN>/health` and confirm HTTP 200.
2. Visit `https://<PATHWORKS_DOMAIN>/login`, request a login link, and confirm email delivery.
3. Complete onboarding as an operator/admin and verify the Work Readiness Foundations course exists.
4. Create a draft lesson, add body content and a content warning, publish it, and confirm it appears in the course lesson list.
5. Open a participant magic link, visit `/lms/mylearning`, open the published lesson, and confirm draft lessons are hidden.
6. Open `/counselor`, then an individual participant progress page, and confirm progress data loads.
7. Upload one media/document asset and confirm it loads from the R2 public media domain.

## Rollback Plan

If the dashboard deploy is bad but the API is healthy, roll back only the dashboard service to the previous Render deploy. If the API deploy is bad, roll back the API first, then the dashboard if its client code expects the newer API shape.

If a migration has already run, do not blindly revert the database. First classify the migration:

- Additive migration: roll back app services, leave schema in place, and open a follow-up fix.
- Destructive or data-changing migration: restore from the pre-deploy backup into a new Neon branch, point staging at it, verify, then promote the restored branch or perform a targeted repair script.

Keep the previous container image tags for both API and dashboard until smoke tests pass. Freeze user invites during rollback, and announce maintenance if auth, lessons, or participant progress are affected.
