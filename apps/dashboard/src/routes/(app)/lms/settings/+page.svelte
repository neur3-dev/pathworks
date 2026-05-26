<script lang="ts">
  import { ProfilePage } from '$features/settings/pages';
  import { t } from '$lib/utils/functions/translations';
  import { Button } from '@cio/ui/base/button';
  import * as Page from '@cio/ui/base/page';

  let profileComponent: ProfilePage | null = $state(null);
  let isLoading = $state(false);

  async function handleUpdate() {
    isLoading = true;
    try {
      await profileComponent?.handleUpdate();
    } finally {
      isLoading = false;
    }
  }
</script>

<svelte:head>
  <title>Settings - PathWorks</title>
</svelte:head>

<Page.Header isSticky>
  <Page.HeaderContent>
    <Page.Title>{$t('settings.profile.heading')}</Page.Title>
  </Page.HeaderContent>
  <Page.Action>
    <Button variant="secondary" loading={isLoading} onclick={handleUpdate}>
      {$t('settings.profile.update_profile')}
    </Button>
  </Page.Action>
</Page.Header>
<Page.Body>
  <div class="mb-6 rounded-md border border-slate-200 p-4 dark:border-slate-800">
    <a class="text-sm font-medium text-blue-700 hover:underline dark:text-blue-300" href="/lms/settings/accessibility"
      >Accessibility preferences</a
    >
    <p class="mt-1 text-sm text-slate-600 dark:text-slate-300">
      Adjust PathWorks learning supports, content warnings, autoplay, and counselor connection.
    </p>
  </div>
  {#snippet child()}
    <ProfilePage bind:this={profileComponent} />
  {/snippet}
</Page.Body>
