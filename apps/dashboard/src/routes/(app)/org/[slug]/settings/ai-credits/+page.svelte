<script lang="ts">
  import { resolve } from '$app/paths';

  interface Props {
    data: {
      orgSlug: string;
    };
  }

  let { data }: Props = $props();
</script>

<svelte:head>
  <title>AI Credits Disabled - PathWorks</title>
</svelte:head>

<div class="mx-auto flex min-h-[50vh] max-w-2xl flex-col justify-center px-6 py-12 text-center">
  <h1 class="text-2xl font-semibold">AI credits are disabled</h1>
  <p class="text-muted-foreground mt-3">PathWorks does not sell or consume AI generation credits in this build.</p>
  <a class="text-primary mt-6 font-medium underline underline-offset-4" href={resolve(`/org/${data.orgSlug}/settings`)}>
    Return to settings
  </a>
</div>
