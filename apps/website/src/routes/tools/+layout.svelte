<script>
  import { PageSignupCTA } from '$lib/components';
  /**
   * @typedef {Object} Props
   * @property {import('svelte').Snippet} [children]
   */

  /** @type {Props} */
  let { children } = $props();
</script>

<svelte:head>
  <title>Free Focus Tools | PathWorks</title>
  <meta property="og:title" content="PathWorks Free Focus Tools" />
  <meta
    property="og:description"
    content="Small ADHD-friendly utilities — pomodoro, stopwatch, name picker, and more. Free, no signup."
  />
  <meta name="twitter:title" content="PathWorks Free Focus Tools" />
  <meta
    name="twitter:description"
    content="Small ADHD-friendly utilities — pomodoro, stopwatch, name picker, and more. Free, no signup."
  />
</svelte:head>

{@render children?.()}

<PageSignupCTA
  header="Free tools are the start."
  subText="When you are ready for full work-readiness training — VR-aligned or general — sign up for an account."
  btnLabel="See sign-up options"
  link="/signup"
  demo={false}
/>
