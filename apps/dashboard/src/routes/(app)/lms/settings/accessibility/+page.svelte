<script lang="ts">
  import { Button } from '@cio/ui/base/button';
  import * as Page from '@cio/ui/base/page';
  import { pathworksApi } from '$features/pathworks/api.svelte';
  import { ParticipantProfileForm, type ParticipantProfileFormValue } from '$features/pathworks/components';

  let saved = $state(false);
  let form = $state<ParticipantProfileFormValue>({
    disabilityCategory: null,
    counselorName: '',
    counselorEmail: '',
    prefExtendedTime: true,
    prefNoAutoplay: true,
    prefContentWarnings: true,
    prefMicrolearning: true,
    saveProgress: true
  });

  $effect(() => {
    if (!pathworksApi.participantProfile.data) return;

    const profile = pathworksApi.participantProfile.data;
    form = {
      disabilityCategory: profile.disabilityCategory ?? null,
      counselorName: profile.counselorName ?? '',
      counselorEmail: profile.counselorEmail ?? '',
      prefExtendedTime: profile.prefExtendedTime ?? true,
      prefNoAutoplay: profile.prefNoAutoplay ?? true,
      prefContentWarnings: profile.prefContentWarnings ?? true,
      prefMicrolearning: profile.prefMicrolearning ?? true,
      saveProgress: true
    };
  });

  $effect(() => {
    pathworksApi.getParticipantProfile();
  });

  async function handleSave() {
    saved = false;
    await pathworksApi.saveParticipantProfile({
      disabilityCategory: form.disabilityCategory,
      counselorName: form.counselorName.trim() || null,
      counselorEmail: form.counselorEmail.trim() || null,
      prefExtendedTime: form.prefExtendedTime,
      prefNoAutoplay: form.prefNoAutoplay,
      prefContentWarnings: form.prefContentWarnings,
      prefMicrolearning: form.prefMicrolearning
    });
    saved = true;
  }
</script>

<svelte:head>
  <title>Accessibility - PathWorks</title>
</svelte:head>

<Page.Header isSticky>
  <Page.HeaderContent>
    <Page.Title>Accessibility</Page.Title>
    <Page.Subtitle>Learning supports and counselor connection</Page.Subtitle>
  </Page.HeaderContent>
  <Page.Action>
    <Button variant="secondary" loading={pathworksApi.isLoading} onclick={handleSave}>Save preferences</Button>
  </Page.Action>
</Page.Header>

<Page.Body>
  <div class="space-y-6">
    {#if saved}
      <div
        class="rounded-md border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm text-emerald-900 dark:border-emerald-900 dark:bg-emerald-950 dark:text-emerald-100"
      >
        Preferences saved.
      </div>
    {/if}

    <ParticipantProfileForm bind:value={form} />
  </div>
</Page.Body>
