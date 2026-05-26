<script lang="ts">
  import { page } from '$app/stores';
  import { Button } from '@cio/ui/base/button';
  import { Input } from '@cio/ui/base/input';
  import * as Field from '@cio/ui/base/field';
  import { pathworksApi } from '$features/pathworks/api.svelte';

  let email = $state('');
  let requested = $state(false);
  const token = $derived($page.url.searchParams.get('token') ?? '');

  $effect(() => {
    if (token) {
      pathworksApi.getCounselorProgress(token);
    }
  });

  async function requestLink() {
    requested = false;
    await pathworksApi.requestCounselorLogin(email);
    requested = true;
  }
</script>

<svelte:head>
  <title>Counselor Dashboard - PathWorks</title>
</svelte:head>

<main class="min-h-screen bg-slate-50 px-4 py-10 text-slate-950 dark:bg-slate-950 dark:text-white">
  <section class="mx-auto w-full max-w-5xl space-y-8">
    <div class="flex items-center gap-3">
      <img src="/logo-192.png" alt="PathWorks logo" height="44" width="44" />
      <div>
        <p class="text-sm text-slate-600 dark:text-slate-300">Read-only progress</p>
        <h1 class="text-3xl font-semibold tracking-normal">Counselor dashboard</h1>
      </div>
    </div>

    {#if !token}
      <div class="max-w-lg rounded-md border border-slate-200 bg-white p-5 dark:border-slate-800 dark:bg-slate-900">
        <div class="space-y-4">
          <Field.Field>
            <Field.Label>Counselor email</Field.Label>
            <Input bind:value={email} type="email" autocomplete="email" />
            <Field.Description
              >We will send a secure link if participants have shared this counselor email.</Field.Description
            >
          </Field.Field>
          <Button loading={pathworksApi.isLoading} onclick={requestLink}>Send secure link</Button>
          {#if requested}
            <p class="text-sm text-emerald-700 dark:text-emerald-300">
              Check your inbox for the PathWorks counselor link.
            </p>
          {/if}
        </div>
      </div>
    {:else if pathworksApi.counselorProgress}
      <div class="overflow-hidden rounded-md border border-slate-200 bg-white dark:border-slate-800 dark:bg-slate-900">
        <table class="w-full text-left text-sm">
          <thead class="bg-slate-100 text-slate-700 dark:bg-slate-800 dark:text-slate-200">
            <tr>
              <th class="px-4 py-3 font-medium">Participant</th>
              <th class="px-4 py-3 font-medium">Current module</th>
              <th class="px-4 py-3 font-medium">Complete</th>
              <th class="px-4 py-3 font-medium">Last activity</th>
            </tr>
          </thead>
          <tbody>
            {#each pathworksApi.counselorProgress.participants as participant (participant.participantId + (participant.courseId || none))}
              <tr class="border-t border-slate-200 dark:border-slate-800">
                <td class="px-4 py-3">
                  <div class="font-medium">{participant.fullname || 'Participant'}</div>
                  <div class="text-xs text-slate-500">{participant.email}</div>
                </td>
                <td class="px-4 py-3">{participant.currentModule || 'Not started yet'}</td>
                <td class="px-4 py-3">{participant.percentComplete ?? 0}%</td>
                <td class="px-4 py-3"
                  >{participant.lastActivity
                    ? new Date(participant.lastActivity as string).toLocaleDateString()
                    : 'No activity yet'}</td
                >
              </tr>
            {:else}
              <tr>
                <td class="px-4 py-6 text-slate-600 dark:text-slate-300" colspan="4"
                  >No participants are connected to this counselor email yet.</td
                >
              </tr>
            {/each}
          </tbody>
        </table>
      </div>
    {:else if pathworksApi.error}
      <div
        class="rounded-md border border-red-200 bg-red-50 p-4 text-sm text-red-900 dark:border-red-900 dark:bg-red-950 dark:text-red-100"
      >
        {pathworksApi.error}
      </div>
    {:else}
      <p class="text-slate-600 dark:text-slate-300">Loading counselor dashboard...</p>
    {/if}
  </section>
</main>
