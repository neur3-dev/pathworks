# PathWorks

PathWorks is a vocational rehabilitation learning and work readiness platform for participants building skills to enter
or re-enter the workforce.

This fork starts from an open source LMS and adapts it for a learning-first VR experience. Phase 0 focuses on branding,
self-host setup, and the first PathWorks marketing surfaces. Later phases add VR participant profiles, learning paths,
UDL lesson behavior, accessibility audit work, and onboarding.

## Product Scope

PathWorks is an LMS for participants. It is not a case management system, employer portal, or government reporting tool
in this phase.

Core learning areas:

- Workplace readiness
- Digital literacy for work
- Job search skills
- Self-advocacy and rights

## Design Principles

- No autoplay media
- Resume where the participant left off
- Module overview before a lesson starts
- Content warnings for sensitive topics
- Untimed assessments by default
- Warm, non-punitive feedback language
- WCAG 2.1 AA baseline

## Stack

- SvelteKit
- Hono
- PostgreSQL
- Better Auth
- Tailwind CSS
- Turborepo and pnpm

## Development

```bash
pnpm install
pnpm dev
```

## Docker Self-Host

```bash
cp .env.example .env
./run-docker-full-stack.sh
```

Default local database URL:

```text
postgresql://postgres:postgres@localhost:5432/pathworks
```

## Repository

Fork: `https://github.com/neur3-dev/pathworks`

Upstream source: `https://github.com/classroomio/classroomio`
