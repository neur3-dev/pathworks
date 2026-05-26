<script lang="ts">
  import { Button } from '@cio/ui/base/button';

  interface Props {
    title: string;
    description: string;
    estimatedTime: string;
    lessonCount: number;
    whatYouWillLearn: string[];
    onStart: () => void;
  }

  let { title, description, estimatedTime, lessonCount, whatYouWillLearn, onStart }: Props = $props();
</script>

<section class="rounded-lg border border-slate-200 bg-white p-6 shadow-sm dark:border-slate-700 dark:bg-slate-950">
  <p class="mb-2 text-sm font-medium text-blue-800 dark:text-blue-200">Module overview</p>
  <h2 class="text-2xl font-semibold tracking-normal text-slate-950 dark:text-white">{title}</h2>
  <p class="mt-3 text-slate-700 dark:text-slate-300">{description}</p>
  <dl class="mt-5 grid gap-3 text-sm sm:grid-cols-2">
    <div>
      <dt class="font-medium text-slate-950 dark:text-white">Estimated time</dt>
      <dd class="text-slate-700 dark:text-slate-300">{estimatedTime}</dd>
    </div>
    <div>
      <dt class="font-medium text-slate-950 dark:text-white">Lessons in this course</dt>
      <dd class="text-slate-700 dark:text-slate-300">{lessonCount}</dd>
    </div>
  </dl>
  <h3 class="mt-5 text-base font-semibold text-slate-950 dark:text-white">What you'll learn</h3>
  <ul class="mt-2 list-disc space-y-1 pl-5 text-sm text-slate-700 dark:text-slate-300">
    {#each whatYouWillLearn as item}
      <li>{item}</li>
    {/each}
  </ul>
  <Button class="mt-6" onclick={onStart}>Start</Button>
</section>
