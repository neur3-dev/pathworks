<script lang="ts">
  import { Button } from '@cio/ui/base/button';

  interface Props {
    label: string;
    onResume: () => void;
    onStartOver: () => void;
  }

  let { label, onResume, onStartOver }: Props = $props();
</script>

<section
  class="rounded-lg border border-blue-200 bg-blue-50 p-6 text-blue-950 dark:border-blue-800 dark:bg-blue-950 dark:text-blue-50"
>
  <p class="mb-2 text-sm font-medium">Welcome back</p>
  <h2 class="text-xl font-semibold tracking-normal">Resume from where you left off?</h2>
  <p class="mt-3">Your last saved place was {label}. You can resume there or start this lesson over.</p>
  <div class="mt-6 flex flex-wrap gap-3">
    <Button onclick={onResume}>Resume</Button>
    <Button variant="outline" onclick={onStartOver}>Start over</Button>
  </div>
</section>
