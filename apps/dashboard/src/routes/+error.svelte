<script>
  import { page } from '$app/state';
  import { Button } from '@cio/ui/base/button';
  import { Empty } from '@cio/ui/custom/empty';
  import { HomeIcon, HoverableItem } from '@cio/ui/custom/moving-icons';
  import AlertCircle from '@lucide/svelte/icons/alert-circle';

  const isNotFound = $derived(page.status === 404);

  console.error('Error message:', page.error?.message);
  console.error('Error page:', page.url);

  function goHome() {
    window.location.href = '/';
  }
</script>

<svelte:head>
  <title>{isNotFound ? 'Page not found' : 'Something went wrong'}</title>
</svelte:head>

{#if isNotFound}
  <Empty
    title="Page not found"
    description="We could not find that page, or your account may not have access to it."
    icon={AlertCircle}
    variant="page"
    layout="full-page"
    showLogo={true}
  >
    <div class="flex gap-2">
      <HoverableItem>
        {#snippet children(isHovered)}
          <Button onclick={goHome}>
            <HomeIcon {isHovered} size={16} ariaHidden={true} />
            Go Home
          </Button>
        {/snippet}
      </HoverableItem>
    </div>
  </Empty>
{:else}
  <Empty
    title="Something went wrong"
    description="Your progress is safe. Try returning home and reopening the lesson. If the issue continues, your PathWorks team can review it."
    icon={AlertCircle}
    variant="page"
    layout="full-page"
    showLogo={true}
  >
    <div class="flex gap-2">
      <HoverableItem>
        {#snippet children(isHovered)}
          <Button onclick={goHome}>
            <HomeIcon {isHovered} size={16} ariaHidden={true} />
            Go Home
          </Button>
        {/snippet}
      </HoverableItem>
    </div>
  </Empty>
{/if}
