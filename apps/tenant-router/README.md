# @cio/tenant-router

Cloudflare Worker that fronts every browser-facing PathWorks host:

- `*.mypathworks.com/*` — free-tier tenant sites
- `mypathworks.com/*` — apex (301 → `pathworks.com`)
- `app.pathworks.com/*` — admin dashboard
- BYOD customer domains via Approximated (their proxy forwards to `cio-api.onrender.com` directly, not through this Worker)

The Worker forwards each request to one of two Render services based on path:

| Path | Upstream |
|---|---|
| `/proxy/*` | API service (`/proxy` prefix stripped, rest forwarded as-is) |
| anything else | Dashboard service |

The `/proxy` prefix is the same-origin escape hatch the dashboard's
browser code uses so its auth cookies stay host-only while still reaching
the API. Example: a browser request to
`https://app.pathworks.com/proxy/api/auth/sign-in/email` becomes
`/api/auth/sign-in/email` on the API service (where Better Auth lives).

It preserves the original host as `X-Forwarded-Host` so:

- The dashboard's SvelteKit adapter-node reads it via `HOST_HEADER=x-forwarded-host` and `event.url.host` becomes the tenant/admin/BYOD host.
- Better Auth on the API emits session cookies without a `Domain` attribute (see `packages/db/src/auth.ts` — `crossSubDomainCookies: { enabled: false }`), so the browser scopes each session to the exact host it called. Tenants on `acme.mypathworks.com`, the admin app on `app.pathworks.com`, and BYOD `learn.acme.com` each get host-only sessions.

## Deploy

```bash
pnpm --filter @cio/tenant-router deploy
```

Live tail:

```bash
pnpm --filter @cio/tenant-router tail
```

## Env vars (wrangler.toml `[vars]`)

| Var | Value |
|---|---|
| `DASHBOARD_UPSTREAM_HOST` | `.onrender.com` host of the dashboard service (no scheme) |
| `API_UPSTREAM_HOST` | `.onrender.com` host of the API service |
| `APEX_REDIRECT_TARGET` | URL to redirect `mypathworks.com` apex to (default `https://pathworks.com`) |

Update the values in `wrangler.toml` after looking them up in the Render dashboard.

## Cloudflare DNS expected setup

`mypathworks.com` zone:

- `*` CNAME → any valid target, **Proxied**
- `@` CNAME → any valid target, **Proxied** (Worker serves the 301)

`pathworks.com` zone:

- `app` CNAME → **Proxied** so the route binds
- `api` CNAME → **DNS only** (server-to-server callers and webhooks bypass the Worker)

## BYOD custom domains

Handled by [Approximated](https://approximated.app/), not this Worker. Cloudflare for SaaS can't front a Render origin (Render itself runs on Cloudflare), so we use Approximated's dedicated edge cluster instead. See `apps/api/src/services/org/domain.ts` for the integration. Customers point an A record at the IP Approximated returns; the proxy forwards directly to `cio-api.onrender.com`.
