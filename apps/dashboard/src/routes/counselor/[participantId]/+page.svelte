<script lang="ts">
  import { page } from '$app/stores';
  import { resolve } from '$app/paths';
  import { pathworksApi } from '$features/pathworks/api.svelte';

  const token = $derived($page.url.searchParams.get('token') ?? '');
  const participantId = $derived($page.params.participantId ?? '');

  $effect(() => {
    if (token && participantId) {
      pathworksApi.getCounselorParticipant(token, participantId);
    }
  });
</script>

<svelte:head>
  <title>Participant Progress - PathWorks</title>
</svelte:head>

<main class="min-h-screen bg-slate-50 px-4 py-10 text-slate-950 dark:bg-slate-950 dark:text-white">
  <section class="mx-auto w-full max-w-4xl space-y-8">
    <div class="space-y-3">
      <a
        class="text-sm font-medium text-blue-700 hover:underline dark:text-blue-300"
        href={resolve('/counselor?token=[token]', { token })}>Back to counselor dashboard</a
      >
      <div>
        <p class="text-sm text-slate-600 dark:text-slate-300">Read-only progress</p>
        <h1 class="text-3xl font-semibold tracking-normal">Participant detail</h1>
      </div>
    </div>

    {#if pathworksApi.counselorParticipant}
      {@const detail = pathworksApi.counselorParticipant}
      {@const participant = detail.participant}
      <div class="rounded-md border border-slate-200 bg-white p-5 dark:border-slate-800 dark:bg-slate-900">
        <h2 class="text-xl font-semibold tracking-normal">{participant.fullname || 'Participant'}</h2>
        <p class="text-sm text-slate-600 dark:text-slate-300">{participant.email}</p>
        <dl class="mt-4 grid gap-4 text-sm sm:grid-cols-2">
          <div>
            <dt class="font-medium">Vocational goal</dt>
            <dd class="text-slate-600 dark:text-slate-300">{participant.ipeVocationalGoal || 'Not shared yet'}</dd>
          </div>
          <div>
            <dt class="font-medium">Learning supports</dt>
            <dd class="text-slate-600 dark:text-slate-300">
              {participant.prefExtendedTime ? 'Extended time' : 'Standard timing'} - {participant.prefMicrolearning
                ? 'Microlearning'
                : 'Standard lessons'}
            </dd>
          </div>
        </dl>
      </div>

      <div class="space-y-4">
        {#each detail.courses as course (course.courseId)}
          <article class="rounded-md border border-slate-200 bg-white p-5 dark:border-slate-800 dark:bg-slate-900">
            <div class="flex flex-col gap-2 sm:flex-row sm:items-start sm:justify-between">
              <div>
                <h2 class="text-lg font-semibold tracking-normal">{course.courseTitle}</h2>
                <p class="text-sm text-slate-600 dark:text-slate-300">
                  {course.completedCount ?? 0} of {course.lessonCount ?? 0} lessons complete
                </p>
              </div>
              <p class="text-sm text-slate-600 dark:text-slate-300">
                {course.lastActivity ? new Date(course.lastActivity as string).toLocaleDateString() : 'No activity yet'}
              </p>
            </div>
            <ul class="mt-4 divide-y divide-slate-200 text-sm dark:divide-slate-800">
              {#each course.lessons as lesson (lesson.lessonId)}
                <li class="flex items-center justify-between gap-4 py-3">
                  <span>{lesson.title}</span>
                  <span class="text-slate-600 capitalize dark:text-slate-300">{lesson.status || 'not_started'}</span>
                </li>
              {/each}
            </ul>
          </article>
        {:else}
          <div class="rounded-md border border-slate-200 bg-white p-5 text-sm dark:border-slate-800 dark:bg-slate-900">
            No course progress has been recorded yet.
          </div>
        {/each}
      </div>
    {:else if pathworksApi.error}
      <div
        class="rounded-md border border-red-200 bg-red-50 p-4 text-sm text-red-900 dark:border-red-900 dark:bg-red-950 dark:text-red-100"
      >
        {pathworksApi.error}
      </div>
    {:else}
      <p class="text-slate-600 dark:text-slate-300">Loading participant detail...</p>
    {/if}
  </section>
</main>
