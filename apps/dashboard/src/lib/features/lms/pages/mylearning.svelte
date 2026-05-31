<script lang="ts">
  import * as UnderlineTabs from '@cio/ui/custom/underline-tabs';
  import { CoursesPage } from '$features/course/pages';
  import { profile } from '$lib/utils/store/user';
  import { currentOrg } from '$lib/utils/store/org';
  import { t } from '$lib/utils/functions/translations';
  import { coursesApi } from '$features/course/api';
  import { isStudentCourseComplete } from '$features/course/utils/compliance-utils';
  import { pathworksApi } from '$features/pathworks/api.svelte';
  import { goto } from '$app/navigation';
  import { resolve } from '$app/paths';
  import CheckCircle from '@lucide/svelte/icons/check-circle';
  import Lock from '@lucide/svelte/icons/lock';

  let searchValue = $state('');

  function isCourseComplete(course: (typeof coursesApi.enrolledCourses)[number]): boolean {
    return isStudentCourseComplete(course);
  }

  const coursesInProgress = $derived(coursesApi.enrolledCourses.filter((course) => !isCourseComplete(course)));
  const coursesComplete = $derived(coursesApi.enrolledCourses.filter((course) => isCourseComplete(course)));

  $effect(() => {
    if (!$profile.id || !$currentOrg.id) return;

    coursesApi.getEnrolledCourses();
    pathworksApi.getLearningPaths($currentOrg.id);
  });

  let tabs = $derived([
    {
      label: `${$t('my_learning.progress')} (${coursesInProgress.length})`,
      value: '1'
    },
    {
      label: `${$t('my_learning.complete')} (${coursesComplete.length})`,
      value: '2'
    }
  ]);
  let currentTab = $state('1');
</script>

<section class="mb-8 space-y-4" aria-labelledby="learning-paths-heading">
  <div class="flex flex-col gap-1">
    <h2 id="learning-paths-heading" class="text-2xl font-semibold tracking-normal text-slate-950 dark:text-white">
      Learning Paths
    </h2>
    <p class="max-w-3xl text-sm text-slate-700 dark:text-slate-300">
      Follow an ordered work-readiness path at your own pace. You can open any path and self-enroll when you are ready.
    </p>
  </div>

  <div class="grid gap-4 md:grid-cols-2">
    {#each pathworksApi.learningPaths as path (path.id)}
      {@const totalCourses = path.courses.length}
      {@const completedCourses = path.courses.filter((course) => course.isComplete).length}
      {@const percent = totalCourses ? Math.round((completedCourses / totalCourses) * 100) : 0}
      <article
        class="rounded-lg border border-slate-200 bg-white p-4 shadow-sm dark:border-slate-700 dark:bg-slate-950"
      >
        <div class="mb-3 flex flex-wrap items-start justify-between gap-3">
          <div class="min-w-0">
            <h3 class="text-lg font-semibold text-slate-950 dark:text-white">{path.title}</h3>
            <p class="mt-1 text-sm text-slate-700 dark:text-slate-300">{path.description}</p>
          </div>
          <span
            class="rounded-full bg-blue-50 px-3 py-1 text-xs font-medium text-blue-800 dark:bg-blue-950 dark:text-blue-100"
          >
            {path.preEtsDomain?.replaceAll('_', ' ') ?? 'mixed'}
          </span>
        </div>

        <div class="mb-4 flex items-center justify-between gap-3 text-sm text-slate-700 dark:text-slate-300">
          <span>{path.estimatedHours ?? 'Self-paced'} hours</span>
          <span>{completedCourses} of {totalCourses} courses complete</span>
        </div>
        <div class="mb-4 h-2 overflow-hidden rounded-full bg-slate-200 dark:bg-slate-800" aria-hidden="true">
          <div class="h-full bg-[linear-gradient(135deg,#1A5AD7_0%,#00F5A0_100%)]" style={`width: ${percent}%;`}></div>
        </div>

        <ol class="mb-4 space-y-2">
          {#each path.courses as course, index (course.id)}
            <li class="flex items-center gap-2 text-sm text-slate-800 dark:text-slate-200">
              {#if course.isComplete}
                <CheckCircle size={16} class="text-emerald-600" aria-hidden="true" />
              {:else if index > completedCourses}
                <Lock size={16} class="text-slate-500" aria-hidden="true" />
              {:else}
                <span class="h-4 w-4 rounded-full border border-blue-700" aria-hidden="true"></span>
              {/if}
              <span>{course.title}</span>
            </li>
          {/each}
        </ol>

        {#if path.courses[0]}
          <button
            type="button"
            class="rounded-md bg-blue-700 px-4 py-2 text-sm font-medium text-white outline-offset-2 hover:bg-blue-800 focus-visible:outline focus-visible:outline-2 focus-visible:outline-blue-700"
            onclick={() => goto(resolve(`/courses/${path.courses[0].id}/lessons`, {}))}
          >
            Open path
          </button>
        {/if}
      </article>
    {:else}
      <div
        class="rounded-lg border border-dashed border-slate-300 p-6 text-sm text-slate-700 dark:border-slate-700 dark:text-slate-300"
      >
        Your learning paths are being prepared. Reload this page in a moment.
      </div>
    {/each}
  </div>
</section>

<UnderlineTabs.Root bind:value={currentTab}>
  <UnderlineTabs.List>
    {#each tabs as tab (tab.value)}
      <UnderlineTabs.Trigger value={tab.value}>
        {$t(tab.label)}
      </UnderlineTabs.Trigger>
    {/each}
  </UnderlineTabs.List>
  <UnderlineTabs.Content value={tabs[0].value}>
    <CoursesPage
      bind:searchValue
      courses={coursesInProgress}
      emptyDescription={$t('my_learning.any_progress')}
      emptyTitle={$t('my_learning.not_in_progress')}
      isLMS={true}
      isLoading={coursesApi.isLoading}
    />
  </UnderlineTabs.Content>
  <UnderlineTabs.Content value={tabs[1].value}>
    <CoursesPage
      bind:searchValue
      courses={coursesComplete}
      emptyDescription={$t('my_learning.any_course')}
      emptyTitle={$t('my_learning.not_completed')}
      isLMS={true}
      isLoading={coursesApi.isLoading}
    />
  </UnderlineTabs.Content>
</UnderlineTabs.Root>
