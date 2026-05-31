<script module>
  import { defineMeta } from '@storybook/addon-svelte-csf';
  import { IconButton } from '@cio/ui/custom/icon-button';
  import { Settings as SettingsIcon } from '@lucide/svelte';
  import { Heart as HeartIcon } from '@lucide/svelte';
  import { Trash as TrashIcon } from '@lucide/svelte';
  import { Edit as EditIcon } from '@lucide/svelte';
  import { Save as SaveIcon } from '@lucide/svelte';
  import { Search as SearchIcon } from '@lucide/svelte';
  import { FIELDS } from './fields';

  const { Story } = defineMeta({
    title: 'Molecules/IconButton',
    component: IconButton,
    parameters: {
      layout: 'centered',
      controls: {
        include: FIELDS
      }
    },
    tags: ['autodocs']
  });
</script>

<Story name="Default">
  {#snippet template()}
    <IconButton>
      <SettingsIcon />
    </IconButton>
  {/snippet}
</Story>

<Story name="With Tooltip">
  {#snippet template()}
    <IconButton tooltip="Settings">
      <SettingsIcon />
    </IconButton>
  {/snippet}
</Story>

<Story name="Disabled">
  {#snippet template()}
    <IconButton disabled>
      <SettingsIcon />
    </IconButton>
  {/snippet}
</Story>

<Story name="Disabled With Tooltip">
  {#snippet template()}
    <IconButton tooltip="Settings" disabled>
      <SettingsIcon />
    </IconButton>
  {/snippet}
</Story>

<Story name="Multiple Icons">
  {#snippet template()}
    <div class="ui:flex ui:items-center ui:gap-4">
      <IconButton tooltip="Settings">
        <SettingsIcon />
      </IconButton>
      <IconButton tooltip="Like">
        <HeartIcon />
      </IconButton>
      <IconButton tooltip="Delete">
        <TrashIcon />
      </IconButton>
      <IconButton tooltip="Edit">
        <EditIcon />
      </IconButton>
      <IconButton tooltip="Save">
        <SaveIcon />
      </IconButton>
      <IconButton tooltip="Search">
        <SearchIcon />
      </IconButton>
    </div>
  {/snippet}
</Story>

<Story name="Tooltip Positions">
  {#snippet template()}
    <div class="ui:flex ui:flex-col ui:items-center ui:gap-8 ui:p-8">
      <IconButton tooltip="Top tooltip" tooltipSide="top">
        <SettingsIcon />
      </IconButton>
      <div class="ui:flex ui:items-center ui:gap-8">
        <IconButton tooltip="Left tooltip" tooltipSide="left">
          <SettingsIcon />
        </IconButton>
        <IconButton tooltip="Right tooltip" tooltipSide="right">
          <SettingsIcon />
        </IconButton>
      </div>
      <IconButton tooltip="Bottom tooltip" tooltipSide="bottom">
        <SettingsIcon />
      </IconButton>
    </div>
  {/snippet}
</Story>

<Story name="With Click Handler">
  {#snippet template()}
    <IconButton
      tooltip="Click me"
      onclick={() => {
        alert('IconButton clicked!');
      }}
    >
      <SettingsIcon />
    </IconButton>
  {/snippet}
</Story>
