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
