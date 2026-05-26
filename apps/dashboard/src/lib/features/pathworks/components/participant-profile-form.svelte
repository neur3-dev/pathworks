<script lang="ts">
  import { Input } from '@cio/ui/base/input';
  import * as Field from '@cio/ui/base/field';

  type DisabilityCategory =
    | 'physical'
    | 'sensory_visual'
    | 'sensory_hearing'
    | 'cognitive'
    | 'psychiatric'
    | 'tbi'
    | 'substance_use'
    | 'other';

  type PreferenceKey =
    | 'prefExtendedTime'
    | 'prefNoAutoplay'
    | 'prefContentWarnings'
    | 'prefMicrolearning'
    | 'saveProgress';

  export type ParticipantProfileFormValue = {
    disabilityCategory: DisabilityCategory | null;
    counselorName: string;
    counselorEmail: string;
    prefExtendedTime: boolean;
    prefNoAutoplay: boolean;
    prefContentWarnings: boolean;
    prefMicrolearning: boolean;
    saveProgress: boolean;
  };

  type Props = {
    value: ParticipantProfileFormValue;
    showCounselor?: boolean;
    showProfilePreferences?: boolean;
  };

  let { value = $bindable(), showCounselor = true, showProfilePreferences = true }: Props = $props();

  const disabilityOptions: Array<{ value: DisabilityCategory; label: string }> = [
    { value: 'physical', label: 'Physical disability' },
    { value: 'sensory_visual', label: 'Vision-related disability' },
    { value: 'sensory_hearing', label: 'Hearing-related disability' },
    { value: 'cognitive', label: 'Learning, intellectual, or cognitive disability' },
    { value: 'psychiatric', label: 'Mental health disability' },
    { value: 'tbi', label: 'Traumatic brain injury' },
    { value: 'substance_use', label: 'Substance use recovery support' },
    { value: 'other', label: 'Something else' }
  ];

  const preferenceItems: Array<{ key: PreferenceKey; label: string; description: string }> = [
    {
      key: 'prefExtendedTime',
      label: 'Extra time by default',
      description: 'Checks and activities stay untimed unless a facilitator changes them.'
    },
    { key: 'prefNoAutoplay', label: 'No autoplay', description: 'Videos wait for you to press play.' },
    {
      key: 'prefContentWarnings',
      label: 'Content warnings',
      description: 'Sensitive topics show a short heads-up before the lesson opens.'
    },
    {
      key: 'prefMicrolearning',
      label: 'Short lessons',
      description: 'PathWorks keeps activities compact and removes pressure from timers.'
    },
    {
      key: 'saveProgress',
      label: 'Save my place',
      description: 'You can leave a lesson and come back where you stopped.'
    }
  ];
</script>

<div class="space-y-7">
  {#if showProfilePreferences}
    <Field.Field>
      <Field.Label>Disability category</Field.Label>
      <select
        class="border-input bg-background focus-visible:ring-ring h-10 w-full rounded-md border px-3 py-2 text-sm shadow-sm focus-visible:ring-2 focus-visible:outline-none"
        bind:value={value.disabilityCategory}
        name="disability_category"
      >
        <option value={null}>Prefer not to say</option>
        {#each disabilityOptions as option}
          <option value={option.value}>{option.label}</option>
        {/each}
      </select>
      <Field.Description>If you'd like to share, this helps us tailor your experience.</Field.Description>
    </Field.Field>

    <div class="space-y-3">
      {#each preferenceItems as item}
        <label class="flex gap-3 rounded-md border border-slate-200 p-3 dark:border-slate-800">
          <input
            class="mt-1 h-4 w-4"
            type="checkbox"
            bind:checked={value[item.key]}
            disabled={item.key === 'saveProgress'}
          />
          <span class="space-y-1">
            <span class="block text-sm font-medium text-slate-950 dark:text-white">{item.label}</span>
            <span class="block text-sm leading-6 text-slate-600 dark:text-slate-300">{item.description}</span>
          </span>
        </label>
      {/each}
    </div>
  {/if}

  {#if showCounselor}
    <div class="grid gap-4 sm:grid-cols-2">
      <Field.Field>
        <Field.Label>Counselor name</Field.Label>
        <Input bind:value={value.counselorName} name="counselor_name" autocomplete="off" />
      </Field.Field>
      <Field.Field>
        <Field.Label>Counselor email</Field.Label>
        <Input bind:value={value.counselorEmail} name="counselor_email" type="email" autocomplete="email" />
      </Field.Field>
    </div>
  {/if}
</div>
