<script lang="ts">
  import { page } from '$app/stores';
  import { resolve } from '$app/paths';
  import { pathworksApi } from '$features/pathworks/api.svelte';
  import { Button } from '@cio/ui/base/button';

  const token = $derived($page.url.searchParams.get('token') ?? '');
  const participantId = $derived($page.params.participantId ?? '');
  const exportUrl = $derived(
    token && participantId ? pathworksApi.getCounselorProgressExportUrl(token, participantId) : ''
  );
  let note = $state('');
  let noteSaved = $state(false);

  async function saveNote() {
    const trimmed = note.trim();
    if (!trimmed || !token || !participantId) return;

    noteSaved = false;
    await pathworksApi.saveCounselorNote(token, participantId, trimmed);

    if (pathworksApi.success) {
      note = '';
      noteSaved = true;
      await pathworksApi.getCounselorParticipant(token, participantId);
    }
  }

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
        <div class="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
          <div>
            <h2 class="text-xl font-semibold tracking-normal">{participant.fullname || 'Participant'}</h2>
            <p class="text-sm text-slate-600 dark:text-slate-300">{participant.email}</p>
          </div>
          {#if exportUrl}
            <a
              class="inline-flex items-center justify-center rounded-md border border-slate-300 px-3 py-2 text-sm font-medium text-slate-900 hover:bg-slate-100 dark:border-slate-700 dark:text-slate-100 dark:hover:bg-slate-800"
              href={exportUrl}>Download participant progress</a
            >
          {/if}
        </div>
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

      <div class="rounded-md border border-slate-200 bg-white p-5 dark:border-slate-800 dark:bg-slate-900">
        <h2 class="text-lg font-semibold tracking-normal">Counselor notes</h2>
        <div class="mt-4 space-y-3">
          <textarea
            class="min-h-28 w-full rounded-md border border-slate-300 bg-white px-3 py-2 text-sm text-slate-900 shadow-sm focus:border-slate-500 focus:outline-none dark:border-slate-700 dark:bg-slate-950 dark:text-slate-100"
            bind:value={note}
            placeholder="Write a private counselor note"
          ></textarea>
          <div class="flex items-center gap-3">
            <Button loading={pathworksApi.isLoading} disabled={!note.trim()} onclick={saveNote}>Save note</Button>
            {#if noteSaved}
              <p class="text-sm text-emerald-700 dark:text-emerald-300">Note saved</p>
            {/if}
          </div>
        </div>
        <ul class="mt-5 divide-y divide-slate-200 text-sm dark:divide-slate-800">
          {#each detail.notes ?? [] as item (item.id)}
            <li class="py-3">
              <p class="whitespace-pre-wrap text-slate-800 dark:text-slate-200">{item.note}</p>
              <p class="mt-1 text-xs text-slate-500">{new Date(item.createdAt as string).toLocaleString()}</p>
            </li>
          {:else}
            <li class="py-3 text-slate-600 dark:text-slate-300">No private notes yet.</li>
          {/each}
        </ul>
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
