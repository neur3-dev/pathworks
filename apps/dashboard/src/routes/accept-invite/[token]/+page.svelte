<script lang="ts">
  import { enhance } from '$app/forms';
  import * as Field from '@cio/ui/base/field';
  import { Input } from '@cio/ui/base/input';
  import { Password } from '@cio/ui/custom/password';
  import { Button } from '@cio/ui/base/button';

  let { data, form } = $props();

  let name = $state(data.invite?.participantName ?? '');
  let password = $state('');
  let confirmPassword = $state('');
  let submitting = $state(false);
</script>

<svelte:head>
  <title>Accept your PathWorks invite</title>
</svelte:head>

<div class="ui:mx-auto ui:max-w-xl ui:px-6 ui:py-16">
  <h1 class="ui:text-2xl ui:font-medium ui:tracking-tight ui:text-gray-950">Accept your PathWorks invite</h1>

  {#if !data.invite}
    <div class="ui:mt-6 ui:rounded-lg ui:border ui:border-amber-200 ui:bg-amber-50 ui:p-4 ui:text-sm ui:text-amber-900">
      {#if data.reason === 'not_found'}
        We could not find an invite for that link. Double-check the link in your email or ask whoever invited you.
      {:else if data.reason === 'already_accepted'}
        This invite has already been accepted. If that was you, sign in to continue.
      {:else if data.reason === 'cancelled'}
        This invite has been cancelled by whoever sent it.
      {:else if data.reason === 'expired'}
        This invite has expired. Ask whoever invited you to send a new one.
      {:else}
        We could not load this invite.
      {/if}
    </div>
    <div class="ui:mt-6">
      <Button href="/login">Sign in</Button>
    </div>
  {:else}
    <p class="ui:mt-3 ui:text-sm ui:leading-relaxed ui:text-gray-600">
      Someone enrolled you on PathWorks. Set up your account so you can start learning at your own pace.
    </p>

    <form
      method="POST"
      use:enhance={() => {
        submitting = true;
        return ({ update }) => update().finally(() => (submitting = false));
      }}
      class="ui:mt-8 ui:flex ui:flex-col ui:gap-6"
    >
      <div class="ui:rounded-lg ui:bg-blue-50 ui:px-4 ui:py-3 ui:text-sm ui:text-blue-900">
        Inviting your email: <strong>{data.invite.participantEmail}</strong>
      </div>

      <Field.Field>
        <Field.Label for="name">Your name</Field.Label>
        <Field.Content>
          <Input
            id="name"
            name="name"
            type="text"
            bind:value={name}
            placeholder="How should we address you"
            disabled={submitting}
            required
            autocomplete="name"
          />
          {#if form?.fieldError?.name}
            <Field.Error>{form.fieldError.name}</Field.Error>
          {/if}
        </Field.Content>
      </Field.Field>

      <Field.Field>
        <Field.Label for="password">Pick a password</Field.Label>
        <Field.Content>
          <Password
            id="password"
            name="password"
            bind:value={password}
            placeholder="At least 8 characters"
            disabled={submitting}
            autocomplete="new-password"
          />
          {#if form?.fieldError?.password}
            <Field.Error>{form.fieldError.password}</Field.Error>
          {/if}
        </Field.Content>
      </Field.Field>

      <Field.Field>
        <Field.Label for="confirmPassword">Confirm password</Field.Label>
        <Field.Content>
          <Password
            id="confirmPassword"
            name="confirmPassword"
            bind:value={confirmPassword}
            placeholder="Re-enter your password"
            disabled={submitting}
            autocomplete="new-password"
          />
          {#if form?.fieldError?.confirmPassword}
            <Field.Error>{form.fieldError.confirmPassword}</Field.Error>
          {/if}
        </Field.Content>
      </Field.Field>

      {#if form?.error}
        <p class="ui:text-sm ui:text-destructive">{form.error}</p>
      {/if}

      <Button type="submit" disabled={submitting} loading={submitting} class="ui:w-full">
        Accept invite and start
      </Button>
    </form>
  {/if}
</div>
