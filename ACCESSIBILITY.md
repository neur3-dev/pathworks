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

Attempted automated axe coverage against the public counselor dashboard at `http://127.0.0.1:4173/counselor` using `@axe-core/cli` and an equivalent Playwright + `axe-core` runner. The dashboard preview server started successfully, but the server environment blocked browser launch: `@axe-core/cli` could not find a Chrome binary, and the downloaded Playwright Chromium could not start because `libasound.so.2` is missing. Installing the missing system package requires interactive sudo on this server.

Report artifact: `audits/axe-2026-05-26.json` records the blocked run details.

Phase 2 fixes already included before this audit attempt:

- Content warning interstitials require explicit acknowledgement before sensitive lessons render.
- Resume prompts and saved position behavior reduce forced restarts after breaks.
- Media players no longer grant autoplay permission in iframe allow lists.
- Participant accessibility preferences are captured in onboarding and editable later in LMS settings.
- Counselor progress is read-only and exposes only participant-shared progress context.

Follow-up required once server browser dependencies are available:

- Install Chromium runtime dependencies, including `libasound2` or the distribution equivalent.
- Rerun axe against `/counselor`, `/lms/mylearning`, onboarding, and an authenticated lesson page.
- Triage any critical or serious violations before Phase 2 merge.
