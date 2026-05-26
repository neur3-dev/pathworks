<script lang="ts">
  import { Button } from '@cio/ui/base/button';

  interface Props {
    warning: string;
    onContinue: () => void;
    onSkip: () => void;
  }

  let { warning, onContinue, onSkip }: Props = $props();
</script>

<section
  class="rounded-lg border border-amber-300 bg-amber-50 p-6 text-amber-950 dark:border-amber-700 dark:bg-amber-950 dark:text-amber-50"
>
  <p class="mb-2 text-sm font-medium">Content warning</p>
  <h2 class="text-xl font-semibold tracking-normal">Take care before continuing</h2>
  <p class="mt-3">{warning}</p>
  <div class="mt-6 flex flex-wrap gap-3">
    <Button onclick={onContinue}>Continue</Button>
    <Button variant="outline" onclick={onSkip}>Skip this lesson</Button>
  </div>
</section>
