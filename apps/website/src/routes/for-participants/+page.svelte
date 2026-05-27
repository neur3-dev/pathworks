<script lang="ts">
  import { Button } from '@cio/ui/base/button';
  import { BlurFade } from '@cio/ui/custom/animation/blurfade';
  import Clock from '@lucide/svelte/icons/clock';
  import Eye from '@lucide/svelte/icons/eye';
  import Wrench from '@lucide/svelte/icons/wrench';
  import { PageSignupCTA } from '$lib/components';

  const promises = [
    {
      icon: Clock,
      title: 'Take your time',
      description:
        'No timers. No countdowns. No "time is up." You can pause in the middle of a lesson, come back tomorrow, and pick up right where you stopped.'
    },
    {
      icon: Eye,
      title: 'Know what is coming',
      description:
        'Every module starts with a preview: how long it is, what you will read or watch, and a content warning if anything in it might be hard. You decide if you are ready.'
    },
    {
      icon: Wrench,
      title: 'Real work skills',
      description:
        'Finding a job. Talking to a manager. Asking for accommodations. Using digital tools at work. Reading a paycheck. These are the things the lessons are about.'
    }
  ];

  const lessonShape = [
    {
      number: '1',
      title: 'Preview the module',
      description:
        'See how long it is, what it covers, and any content warnings. You can skip a module that is not for you.'
    },
    {
      number: '2',
      title: 'Read, watch, or do',
      description:
        'Each lesson has more than one way in: read it, watch it, or work through an example. Pick what fits you today.'
    },
    {
      number: '3',
      title: 'Save and come back',
      description:
        'Stop anytime. Your progress saves automatically. You will land exactly where you left when you sign back in.'
    },
    {
      number: '4',
      title: 'Finish when you are ready',
      description:
        'No grade. No fail. When you have shown what the module is asking for, it marks complete. You can come back to revisit it.'
    }
  ];
</script>

<svelte:head>
  <title>For Participants | PathWorks</title>
  <meta
    name="description"
    content="Work skills, at your pace. PathWorks is a learning platform for getting ready to start work — untimed, with content warnings, save-and-resume, and real skills."
  />
</svelte:head>

<section class="bg-[#f7fafc] px-6 pt-32 pb-16 lg:px-12 lg:pt-40 lg:pb-24">
  <div class="mx-auto flex max-w-[1100px] flex-col items-center text-center">
    <p class="text-xs font-medium tracking-wide text-blue-700 uppercase">For Participants</p>
    <h1
      class="mt-3 max-w-[820px] text-[clamp(2rem,4vw,3.25rem)] leading-[1.1] font-medium tracking-tight text-gray-950"
    >
      Work skills, <em class="text-blue-700 not-italic">at your pace.</em>
    </h1>
    <p class="mt-5 max-w-[640px] text-sm leading-relaxed text-gray-600 lg:text-base">
      PathWorks is a learning platform for people getting ready to start work. No timers. No surprises. You can stop and
      come back whenever you want.
    </p>
    <div class="mt-7 flex flex-wrap items-center justify-center gap-3">
      <Button href="/demo">Try a sample lesson</Button>
    </div>
  </div>
</section>

<section class="bg-white px-6 py-16 lg:px-12 lg:py-20">
  <div class="mx-auto max-w-[1100px]">
    <BlurFade once>
      <h2 class="text-[clamp(1.5rem,2.4vw,2rem)] font-medium tracking-tight text-gray-950">What you get.</h2>
    </BlurFade>

    <div class="mt-8 grid grid-cols-1 gap-4 md:grid-cols-3">
      {#each promises as promise, i}
        <BlurFade delay={0.05 + i * 0.05} once>
          <div class="flex h-full flex-col rounded-2xl border border-gray-200/80 bg-[#f7fafc] p-6 lg:p-7">
            <div
              class="flex h-10 w-10 items-center justify-center rounded-lg bg-blue-100 text-blue-700 [&_svg]:stroke-blue-700"
            >
              <promise.icon size={20} />
            </div>
            <h3 class="mt-4 text-base font-medium tracking-tight text-gray-950 lg:text-lg">
              {promise.title}
            </h3>
            <p class="mt-2 text-sm leading-relaxed text-gray-600">
              {promise.description}
            </p>
          </div>
        </BlurFade>
      {/each}
    </div>
  </div>
</section>

<section class="bg-[#f7fafc] px-6 py-16 lg:px-12 lg:py-20">
  <div class="mx-auto max-w-[1100px]">
    <BlurFade once>
      <h2 class="text-[clamp(1.5rem,2.4vw,2rem)] font-medium tracking-tight text-gray-950">
        What a lesson looks like.
      </h2>
      <p class="mt-3 max-w-[620px] text-sm leading-relaxed text-gray-500">
        Four steps. You are in charge of all of them.
      </p>
    </BlurFade>

    <div class="mt-8 grid grid-cols-1 gap-4 md:grid-cols-2">
      {#each lessonShape as step, i}
        <BlurFade delay={0.05 + i * 0.05} once>
          <div class="flex h-full flex-col rounded-2xl border border-gray-200/80 bg-white p-6 lg:p-7">
            <span class="font-mono text-3xl font-medium text-blue-700">{step.number}</span>
            <h3 class="mt-3 text-base font-medium tracking-tight text-gray-950 lg:text-lg">
              {step.title}
            </h3>
            <p class="mt-2 text-sm leading-relaxed text-gray-600">
              {step.description}
            </p>
          </div>
        </BlurFade>
      {/each}
    </div>
  </div>
</section>

<PageSignupCTA
  header="Try a lesson. No signup."
  subText="One free module so you can see how it feels. No email, no account, no commitment. If you like it, ask whoever bought your seat to send you the invite."
  btnLabel="Try a sample lesson"
  link="/demo"
  demo={false}
/>
