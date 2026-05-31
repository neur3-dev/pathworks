# PathWorks Accessibility Notes

PathWorks is being shaped for vocational rehabilitation learners, including people who use assistive technology, keyboard navigation, captions, flexible pacing, and plain-language support.

## Completed in This Build

- Added global `:focus-visible` outlines in the dashboard and shared UI package.
- Added a `prefers-reduced-motion: reduce` rule to minimize transitions and animations.
- Replaced blocking unsaved-change dialogs in the lesson player with automatic draft restoration.
- Added lesson overview, progress position, content-warning acknowledgement, and skip support.
- Kept lesson media user-initiated; no new autoplay behavior was introduced.
- Reworked the main error page with calmer recovery language.

## Manual QA Checklist

- Navigate onboarding, My Learning, and lesson pages using only the keyboard.
- Confirm focus order moves predictably through lesson overview, warning, content, and navigation controls.
- Verify content warning and skip states are announced clearly by screen readers.
- Confirm videos have captions or transcripts before publishing PathWorks starter content.
- Check color contrast for any organization theme overrides before launch.

## Deferred Follow-Up

- Run a full axe pass against authenticated dashboard flows.
- Add automated accessibility checks to CI after the PathWorks product flow stabilizes.

## Phase 2 Audit - 2026-05-26

### Audit run

Ran axe-core via Playwright's bundled Chromium (after installing `libasound2t64`, `libnss3`, `libgbm1`, `libxshmfence1`, `libxkbcommon0`) against the dashboard preview at `http://127.0.0.1:4173` for the following routes:

- `/`
- `/login`
- `/signin` (redirects to `/login?redirect=%2Fsignin`)
- `/counselor` (redirects to `/login?redirect=%2Fcounselor`)
- `/onboarding` (redirects to `/login?redirect=%2Fonboarding`)

**Scope caveat:** Without the API running, every route landed on the same custom 500 error page after the SSR auth-client init failed. The audit therefore covered only the error-page template (`apps/dashboard/src/error.html`), repeated across the 5 entry points. Authenticated routes (real `/counselor`, `/lms/mylearning`, lesson player) still need a follow-up audit once the full local stack is up via `./run-docker-full-stack.sh`.

### Findings on first run

Five violations, each present on all 5 URLs (because all 5 hit the same error page):

| ID | Impact | Help |
|---|---|---|
| `document-title` | serious | Documents must have a `<title>` element |
| `html-has-lang` | serious | `<html>` element must have a `lang` attribute |
| `landmark-one-main` | moderate | Document should have one main landmark |
| `page-has-heading-one` | moderate | Page should contain a level-one heading |
| `region` | moderate | All page content should be contained by landmarks |

Root cause: `apps/dashboard/src/error.html` was rendered standalone by SvelteKit (it's the fallback when the app itself fails to render) but only contained a body fragment - no `<html>`, `<head>`, `<title>`, `<main>`, `<h1>`.

### Fix applied this PR

`apps/dashboard/src/error.html` rewritten as a complete HTML document:

- `<!DOCTYPE html>` + `<html lang="en">`
- `<head>` with `<title>Something unexpected happened - PathWorks</title>` and viewport meta
- `<main>` landmark with `aria-labelledby`
- Promoted the heading from `<h2>` to `<h1>` (only one heading on the page; styling kept identical)
- Decorative 500-error icon marked `aria-hidden="true"` with empty `alt`
- Logo `alt` simplified from "PathWorks - Logo" to "PathWorks"

### Re-audit

After the fix and a fresh `pnpm --filter @cio/dashboard build && preview`, axe re-ran against the same 5 URLs and reported **0 violations · 0 incomplete · 10 passes per page**. Report artifact: `audits/axe-2026-05-26.json` now contains the clean run.

### Still deferred to a follow-up PR

- Audit authenticated dashboard routes (real `/counselor`, `/lms/mylearning`, lesson player) against a running API. Bring up the stack with `./run-docker-full-stack.sh` first.
- Add `@axe-core/playwright` to a CI job once routes stabilize, so regressions are caught on every PR.

## Phase 4 Audit - 2026-05-26

### Audit run

Ran the authenticated Playwright axe runner against the local Docker full stack:

- API: `http://127.0.0.1:3081`
- Dashboard: `http://127.0.0.1:3082`
- Fixture seed: `node audits/seed-a11y-fixtures.mjs audits/axe-phase4-fixtures.json`
- Report: `audits/axe-2026-05-26-auth.json`

Routes covered:

- `/lms/settings/accessibility`
- `/counselor`
- `/counselor/[participantId]`

### Result

The run completed with 0 axe violations across all 3 authenticated URLs. Critical and serious violation counts are 0.

One `color-contrast` item was reported as incomplete on `/lms/settings/accessibility`, meaning axe could not determine the contrast automatically. It was not a violation. Keep this on the manual QA checklist for the next visual pass.

### Local stack note

The first Phase 4 Docker build exposed a duplicate `contentWarning` key in `ZLessonUpdate`. That was fixed in `d3af2775f`, after which `./run-docker-full-stack.sh` built and started the API and dashboard successfully.

