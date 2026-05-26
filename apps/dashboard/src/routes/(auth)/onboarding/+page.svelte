<script lang="ts">
  import { goto } from '$app/navigation';
  import { resolve } from '$app/paths';
  import { Button } from '@cio/ui/base/button';
  import { Input } from '@cio/ui/base/input';
  import * as Field from '@cio/ui/base/field';
  import { profile } from '$lib/utils/store/user';
  import { pathworksApi } from '$features/pathworks/api.svelte';
  import { ParticipantProfileForm, type ParticipantProfileFormValue } from '$features/pathworks/components';

  const goalOptions = [
    'Healthcare support',
    'Office / admin',
    'Retail / customer service',
    'Skilled trades',
    'Technology',
    'Food service',
    "I'm not sure yet"
  ];

  let step = $state(1);
  let fullname = $state('');
  let goal = $state('');
  let selectedGoal = $state('');
  let preferences = $state<ParticipantProfileFormValue>({
    disabilityCategory: null,
    counselorName: '',
    counselorEmail: '',
    prefExtendedTime: true,
    prefNoAutoplay: true,
    prefContentWarnings: true,
    prefMicrolearning: true,
    saveProgress: true
  });
  let nameError = $state('');

  const totalSteps = 5;
  const progress = $derived(Math.round((step / totalSteps) * 100));
  const vocationalGoal = $derived(goal.trim() || selectedGoal || null);

  async function finish() {
    nameError = '';
    if (!fullname.trim()) {
      nameError = 'Enter your name so PathWorks can personalize your learning space.';
      step = 1;
      return;
    }

    await pathworksApi.saveParticipantProfile({
      fullname: fullname.trim(),
      ipeVocationalGoal: vocationalGoal,
      disabilityCategory: preferences.disabilityCategory,
      counselorName: preferences.counselorName.trim() || null,
      counselorEmail: preferences.counselorEmail.trim() || null,
      prefExtendedTime: preferences.prefExtendedTime,
      prefNoAutoplay: preferences.prefNoAutoplay,
      prefContentWarnings: preferences.prefContentWarnings,
      prefMicrolearning: preferences.prefMicrolearning
    });

    await goto(resolve('/lms/mylearning', {}));
  }
</script>

{#if $profile.id}
  <main
    class="flex min-h-screen w-full items-center justify-center bg-slate-50 px-4 py-8 text-slate-950 dark:bg-slate-950 dark:text-white"
  >
    <section class="w-full max-w-2xl" aria-labelledby="pathworks-onboarding-title">
      <div class="mb-8 flex items-center gap-3">
        <img src="/logo-192.png" alt="PathWorks logo" height="48" width="48" />
        <div>
          <p class="text-sm text-slate-600 dark:text-slate-300">{$profile.email}</p>
          <h1 id="pathworks-onboarding-title" class="text-2xl font-semibold tracking-normal">PathWorks</h1>
        </div>
      </div>

      <div
        class="mb-8 h-2 overflow-hidden rounded-full bg-slate-200 dark:bg-slate-800"
        aria-label={`Step ${step} of ${totalSteps}`}
      >
        <div class="h-full bg-[linear-gradient(135deg,#1A5AD7_0%,#00F5A0_100%)]" style={`width: ${progress}%;`}></div>
      </div>

      {#if step === 1}
        <div class="space-y-6">
          <div class="space-y-3">
            <h2 class="text-3xl font-semibold tracking-normal">Welcome to PathWorks.</h2>
            <p class="text-lg leading-8 text-slate-700 dark:text-slate-200">
              This is your personal learning space for building work skills at your own pace. Everything here is
              designed to work with you, not against you.
            </p>
          </div>
          <Field.Field>
            <Field.Label>Name</Field.Label>
            <Input
              bind:value={fullname}
              name="fullname"
              autocomplete="name"
              aria-invalid={nameError ? 'true' : undefined}
            />
            {#if nameError}
              <Field.Error>{nameError}</Field.Error>
            {/if}
          </Field.Field>
        </div>
      {:else if step === 2}
        <div class="space-y-6">
          <h2 class="text-3xl font-semibold tracking-normal">What kind of work are you aiming for?</h2>
          <p class="text-slate-700 dark:text-slate-300">This is optional. You can change it later.</p>
          <div class="grid gap-2 sm:grid-cols-2">
            {#each goalOptions as option}
              <label class="flex items-center gap-2 rounded-md border border-slate-300 p-3 dark:border-slate-700">
                <input type="radio" bind:group={selectedGoal} value={option} />
                <span>{option}</span>
              </label>
            {/each}
          </div>
          <Field.Field>
            <Field.Label>Another goal</Field.Label>
            <Input
              bind:value={goal}
              name="vocational_goal"
              placeholder="Certified nursing assistant, office admin..."
            />
          </Field.Field>
        </div>
      {:else if step === 3}
        <div class="space-y-6">
          <h2 class="text-3xl font-semibold tracking-normal">How you learn best</h2>
          <p class="text-slate-700 dark:text-slate-300">All supports start on. Change anything that does not fit.</p>
          <ParticipantProfileForm bind:value={preferences} showCounselor={false} />
        </div>
      {:else if step === 4}
        <div class="space-y-6">
          <h2 class="text-3xl font-semibold tracking-normal">Counselor connection</h2>
          <p class="text-slate-700 dark:text-slate-300">
            Optional. Add a counselor if you want them to receive read-only progress access.
          </p>
          <ParticipantProfileForm bind:value={preferences} showProfilePreferences={false} />
        </div>
      {:else}
        <div class="space-y-4">
          <h2 class="text-3xl font-semibold tracking-normal">You're all set.</h2>
          <p class="text-lg leading-8 text-slate-700 dark:text-slate-200">
            Your learning paths are ready. Start whenever you like. There are no deadlines here.
          </p>
        </div>
      {/if}

      <div class="mt-10 flex justify-between gap-3">
        <Button variant="ghost" disabled={step === 1} onclick={() => (step = Math.max(1, step - 1))}>Back</Button>
        {#if step < totalSteps}
          <Button onclick={() => (step = Math.min(totalSteps, step + 1))}
            >{step === 1 ? "Let's get started" : 'Continue'}</Button
          >
        {:else}
          <Button loading={pathworksApi.isLoading} onclick={finish}>Take me to my learning paths</Button>
        {/if}
      </div>
    </section>
  </main>
{/if}
