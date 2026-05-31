# PathWorks Self-Hosted Production Deploy

This is the on-prem alternative to `docs/DEPLOY.md` (which targets managed cloud services). Use this track to run PathWorks on a single Proxmox host until you have signed customers and a reason to migrate to managed cloud.

> Neur3 owns `neur3.com`. A dedicated PathWorks domain is TBD. Throughout this doc, `<PATHWORKS_DOMAIN>` is the placeholder; the running example uses `pathworks.example.com`.

## Why Self-Host First

You wanted to "build it right" without spending on cloud until you have approved customers. This setup gives you:

- A true production posture (TLS, backups, separate data tier, single-replica rolling restarts) at zero recurring cost
- One-command migration path to the cloud spec in `docs/DEPLOY.md` later — env vars are the same, only the values change
- Proxmox snapshots as a free "point-in-time restore" while you stabilize

## Topology

Two LXCs on one Proxmox host, joined by a private bridge (`vmbr1` in this doc; substitute your own).

```
                    Internet
                       │
                  (ports 80/443)
                       │
   ┌───────────────────▼─────────────────────┐
   │  LXC-B: pathworks-app                   │
   │  10.0.0.20                              │
   │  ┌─────────┐  ┌─────────┐  ┌─────────┐  │
   │  │  Caddy  │──▶│   api   │  │dashboard│  │
   │  │ 80/443  │  │  :3081  │  │  :3082  │  │
   │  └─────────┘  └─────────┘  └─────────┘  │
   └─────────┬─────────┬─────────┬───────────┘
             │         │         │
        vmbr1 private network (10.0.0.0/24)
             │         │         │
   ┌─────────▼─────────▼─────────▼───────────┐
   │  LXC-A: pathworks-data                  │
   │  10.0.0.10                              │
   │  ┌────────┐  ┌───────┐  ┌────────────┐  │
   │  │postgres│  │ redis │  │   minio    │  │
   │  │ :5432  │  │ :6379 │  │ :9000/9001 │  │
   │  └────────┘  └───────┘  └────────────┘  │
   │  /srv/pathworks-data (zfs/lvm volume)   │
   └─────────────────────────────────────────┘
```

LXC-A has no public IP. Only LXC-B is reachable from the internet, and only on 443 (and 80 for ACME challenges if you ever drop DNS-01).

## Sizing

| LXC | RAM | vCPU | Disk | Notes |
|---|---|---|---|---|
| LXC-A `pathworks-data` | 4 GB | 2 | 60 GB | Postgres needs most of it. MinIO storage grows with uploads — bump disk later. |
| LXC-B `pathworks-app` | 2 GB | 2 | 20 GB | Containers + a few logs. No persistent data. |

Pre-launch totals: **6 GB RAM, 4 vCPU, 80 GB disk** on the Proxmox host. Comfortably runs alongside other LXCs on a modest box.

## DNS

Buy a domain (TBD), set Cloudflare as nameserver, then add four records:

| Host | Type | Value | Why |
|---|---|---|---|
| `<PATHWORKS_DOMAIN>` | A | LXC-B public IP | Apex (optional — for redirect to www or app) |
| `pathworks.<PATHWORKS_DOMAIN>` or `app.<PATHWORKS_DOMAIN>` | A | LXC-B public IP | Dashboard (SvelteKit) |
| `api.<PATHWORKS_DOMAIN>` | A | LXC-B public IP | API (Hono + Better Auth) |
| `media.<PATHWORKS_DOMAIN>` | A | LXC-B public IP | Public media (Caddy proxies to MinIO) |

Set Cloudflare proxy status to **DNS only** (grey cloud) for all four — Caddy needs to terminate TLS itself for Let's Encrypt's certificate to be valid. Migrate to ZonDNS later by swapping nameservers; the records and Caddy config stay the same.

Set the dashboard cookie domain to `.<PATHWORKS_DOMAIN>` so auth cookies work across `pathworks.<PATHWORKS_DOMAIN>` and `api.<PATHWORKS_DOMAIN>`.

## TLS

Caddy obtains certificates automatically via Let's Encrypt's **DNS-01 challenge** using your Cloudflare API token. This avoids needing port 80 open on day one and works for the `media` subdomain even if MinIO doesn't speak ACME natively.

Create a Cloudflare API token scoped to: `Zone:DNS:Edit` on your PathWorks zone only. Save as `CLOUDFLARE_API_TOKEN` for Caddy.

## Required Secrets

The same secrets as `docs/DEPLOY.md`, just with on-prem values. Generate critical ones with `openssl rand -base64 48`:

| Name | Value source | Tier |
|---|---|---|
| `POSTGRES_DB` / `POSTGRES_USER` / `POSTGRES_PASSWORD` | Choose (used inside LXC-A only) | Critical |
| `DATABASE_URL` / `PRIVATE_DATABASE_URL` | `postgres://USER:PASS@10.0.0.10:5432/pathworks` | Critical |
| `REDIS_URL` | `redis://10.0.0.10:6379` | High |
| `MINIO_ROOT_USER` / `MINIO_ROOT_PASSWORD` | Choose strong values | Critical |
| `OBJECT_STORAGE_ENDPOINT` | `http://10.0.0.10:9000` (server-side, never browser) | Medium |
| `OBJECT_STORAGE_PUBLIC_ENDPOINT` | `https://media.<PATHWORKS_DOMAIN>` | Low |
| `OBJECT_STORAGE_ACCESS_KEY_ID` / `OBJECT_STORAGE_SECRET_ACCESS_KEY` | Same as MinIO root or a scoped MinIO user | High |
| `OBJECT_STORAGE_FORCE_PATH_STYLE` | `true` | Low |
| `OBJECT_STORAGE_BUCKET_VIDEOS` / `_DOCUMENTS` / `_MEDIA` | `pathworks-videos` / `-documents` / `-media` | Low |
| `OBJECT_STORAGE_MEDIA_PUBLIC_BASE_URL` | `https://media.<PATHWORKS_DOMAIN>` | Low |
| `BETTER_AUTH_SECRET` | `openssl rand -base64 48` | Critical |
| `PRIVATE_SERVER_KEY` | `openssl rand -base64 48` (same value in api and dashboard) | Critical |
| `AUTH_BEARER_TOKEN` | `openssl rand -base64 48` (same value in api and dashboard) | Critical |
| `AUTH_COOKIE_DOMAIN` | `.<PATHWORKS_DOMAIN>` | Low |
| `PUBLIC_IS_SELFHOSTED` | `true` | Low |
| `PUBLIC_SERVER_URL` | `https://api.<PATHWORKS_DOMAIN>` | Low |
| `PRIVATE_SERVER_URL` | `http://api:3081` (Docker internal) | Low |
| `TRUSTED_ORIGINS` | `https://pathworks.<PATHWORKS_DOMAIN>` | Low |
| `DASHBOARD_ORIGIN` | `https://pathworks.<PATHWORKS_DOMAIN>` | Low |
| `ORIGIN` | `https://pathworks.<PATHWORKS_DOMAIN>` | Low |
| `POSTMARK_API_KEY` | Postmark token (shared neur3.com server) | High |
| `POSTMARK_FROM` | `"PathWorks" <noreply@neur3.com>` | Low |
| `CLOUDFLARE_API_TOKEN` | Scoped token for Caddy DNS-01 | High |

A starter file lives at `docker/.env.prod.example` — copy to `/etc/pathworks/.env` on the LXC, fill in real values, and `chmod 600`.

## Provisioning Steps

### 1. Create the Proxmox bridge (one time)

On the Proxmox host, add a private bridge with no uplink so LXC-to-LXC traffic stays internal:

```bash
# /etc/network/interfaces snippet
auto vmbr1
iface vmbr1 inet manual
  bridge-ports none
  bridge-stp off
  bridge-fd 0
```

`systemctl restart networking` (or reboot). Pick a subnet, e.g. `10.0.0.0/24`.

### 2. Create LXC-A (pathworks-data)

- Template: Debian 12 or Ubuntu 24.04
- Network: `vmbr0` (public for outbound updates) + `vmbr1` with static `10.0.0.10/24`
- Resources: 4 GB RAM, 2 vCPU, 60 GB disk on ZFS or LVM-thin
- Install Docker + docker-compose-v2
- Create `/srv/pathworks-data/{postgres,minio}`

### 3. Create LXC-B (pathworks-app)

- Same template
- Network: `vmbr0` with public IP + `vmbr1` with static `10.0.0.20/24`
- Resources: 2 GB RAM, 2 vCPU, 20 GB disk
- Install Docker + docker-compose-v2
- Open firewall: inbound TCP 443 only (and 80 if you ever want HTTP→HTTPS redirect)

### 4. Drop the configs in place

Copy these from the repo:

| Source in repo | Destination |
|---|---|
| `docker/docker-compose.data.yml` | LXC-A: `/opt/pathworks/docker-compose.yml` |
| `docker/.env.prod.example` (data section) | LXC-A: `/etc/pathworks/.env` (fill in, `chmod 600`) |
| `docker/systemd/pathworks-data.service` | LXC-A: `/etc/systemd/system/pathworks-data.service` |
| `scripts/pg-backup.sh` | LXC-A: `/opt/pathworks/pg-backup.sh` (`chmod +x`) |
| `docker/docker-compose.app.yml` | LXC-B: `/opt/pathworks/docker-compose.yml` |
| `docker/Caddyfile.prod` | LXC-B: `/opt/pathworks/Caddyfile` |
| `docker/.env.prod.example` (app section) | LXC-B: `/etc/pathworks/.env` (fill in, `chmod 600`) |
| `docker/systemd/pathworks-app.service` | LXC-B: `/etc/systemd/system/pathworks-app.service` |

### 5. Start the data tier

On LXC-A:

```bash
systemctl daemon-reload
systemctl enable --now pathworks-data
docker compose -f /opt/pathworks/docker-compose.yml logs -f postgres
# Wait for "database system is ready to accept connections"
```

Create the MinIO buckets (one-time):

```bash
docker compose -f /opt/pathworks/docker-compose.yml exec minio \
  sh -c 'mc alias set local http://localhost:9000 "$MINIO_ROOT_USER" "$MINIO_ROOT_PASSWORD" && \
         mc mb -p local/pathworks-videos local/pathworks-documents local/pathworks-media && \
         mc anonymous set download local/pathworks-media'
```

### 6. Run migrations from your laptop (or LXC-B)

```bash
git checkout main
pnpm install --frozen-lockfile
pnpm --filter @cio/db build
DATABASE_URL="postgres://USER:PASS@<DATA_LXC_IP>:5432/pathworks" \
  pnpm --filter @cio/db db migrate --config drizzle.config.ts
```

Only run migrations from a controlled environment, never auto-on-boot.

### 7. Start the app tier

On LXC-B:

```bash
systemctl daemon-reload
systemctl enable --now pathworks-app
docker compose -f /opt/pathworks/docker-compose.yml logs -f
```

Caddy will request certificates via DNS-01 on first boot. Watch for `certificate obtained successfully` in Caddy's logs.

### 8. Smoke tests

Same as `docs/DEPLOY.md`:

1. `curl https://api.<PATHWORKS_DOMAIN>/health` → 200
2. Visit `https://pathworks.<PATHWORKS_DOMAIN>/login`, request a login link, confirm email
3. Onboard as operator/admin, verify Work Readiness Foundations course exists
4. Create/publish a draft lesson, confirm it appears
5. Open participant magic link, visit `/lms/mylearning`
6. Upload media, confirm it loads from `https://media.<PATHWORKS_DOMAIN>`

## Redeploy Story

Content changes (new modules, edited lessons, content warnings) **never** trigger a deploy — they save through the dashboard UI directly to Postgres, live for users immediately.

When you do ship code:

```bash
# On LXC-B
cd /opt/pathworks
docker compose pull
docker compose up -d
```

Expect a 30–60 second window where requests get 502 while api/dashboard restart. Schedule for low-traffic hours; add a banner in the dashboard if you want to warn active users.

When you have customers and that window stops being acceptable, upgrade the topology: add a second api + dashboard replica behind Caddy (Caddy already supports multiple upstreams; you just add a second container and a `lb_policy` line). That single change gets you to rolling-restart zero-downtime without re-architecting.

### Schema migrations

If a code deploy includes a schema migration, run the migration **before** pulling the new app image:

```bash
# From a controlled environment, against the production DB
pnpm --filter @cio/db build
DATABASE_URL="postgres://USER:PASS@<DATA_LXC_IP>:5432/pathworks" \
  pnpm --filter @cio/db db migrate
```

For breaking changes (drop column, rename, type change), use expand-and-contract:

1. Deploy A: additive migration + app code that reads both old and new shapes
2. Backfill data
3. Deploy B: app code that only uses the new shape + remove old shape migration

Or take a scheduled maintenance window (~5 min) for the breaking change.

## Backups

### Postgres (daily, automated)

`scripts/pg-backup.sh` runs `pg_dump` and keeps the last 14 days. Install as a cron on LXC-A:

```bash
(crontab -l 2>/dev/null; echo '0 3 * * * /opt/pathworks/pg-backup.sh >> /var/log/pathworks-backup.log 2>&1') | crontab -
```

Dumps land in `/srv/pathworks-data/backups/`. Rotate to offsite (rclone to B2, rsync to a second box, or just a USB drive copy) as you onboard real users.

### MinIO

Two options:

- **Snapshot the LXC** (simplest, free): Proxmox → LXC-A → Snapshot. Captures `/srv/pathworks-data` including MinIO data. Schedule weekly.
- **Mirror to second location** (when offsite matters): `mc mirror --overwrite local/pathworks-media offsite/pathworks-media` in a cron.

### Restore drill

You haven't tested a backup until you've restored it. Once a quarter:

1. Restore the most recent dump into a throwaway database on the same LXC
2. Diff row counts on a few critical tables (`profile`, `course`, `lesson`, `seat`)
3. Discard

## Migration Path to Managed Cloud

When you outgrow this:

1. Stand up Neon, Upstash, R2, Render per `docs/DEPLOY.md`
2. `pg_dump | psql` from on-prem Postgres to Neon (use a maintenance window)
3. `mc mirror` from on-prem MinIO to R2
4. Update the env vars on a fresh Render service to point at the managed URLs
5. Cut DNS over after smoke tests

All app code stays the same. Only `DATABASE_URL`, `REDIS_URL`, and `OBJECT_STORAGE_*` change. That's the payoff for "building it right" now.

## Rollback Plan

- **App-only bad deploy:** `docker compose down && docker tag pathworks-api:previous pathworks-api:latest && docker compose up -d`. Keep at least 3 previous image tags around.
- **Migration-related bad deploy (additive migration):** roll back app images, leave schema alone, open a fix.
- **Migration-related bad deploy (destructive):** restore Postgres from the most recent pre-deploy backup into a parallel database, validate, then promote. Take a hard maintenance window for the cutover.
- **Whole-LXC corruption:** Proxmox snapshot rollback. This is why ZFS snapshots are mandatory on LXC-A.

## Open Items Before Going Live

- [ ] Buy and verify the dedicated PathWorks domain
- [ ] Move DNS to Cloudflare; create the four A records (grey cloud)
- [ ] Generate the Cloudflare API token scoped to PathWorks zone, DNS:Edit only
- [ ] Confirm Postmark sender domain (neur3.com) is verified and the API token is alive
- [ ] Create LXC-A + LXC-B per the resource spec
- [ ] Fill in `/etc/pathworks/.env` on both LXCs
- [ ] Test restore from `pg-backup.sh` once before announcing
- [ ] Decide on offsite backup destination
