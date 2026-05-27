<script lang="ts">
  import { Button } from '@cio/ui/base/button';
  import { BlurFade } from '@cio/ui/custom/animation/blurfade';
  import Briefcase from '@lucide/svelte/icons/briefcase';
  import Heart from '@lucide/svelte/icons/heart';
  import Mail from '@lucide/svelte/icons/mail';
  import { PageSignupCTA } from '$lib/components';

  const reassurances = [
    {
      icon: Briefcase,
      title: 'What they will learn',
      description:
        'Real work-readiness skills: finding a job, communicating at work, asking for help, using digital tools, and advocating for what they need. Each module is built around a job-life moment they will actually face.'
    },
    {
      icon: Heart,
      title: 'How they will learn',
      description:
        'Lessons are untimed. There are no surprise tests. They can pause anytime and pick up exactly where they left off. Content warnings appear before sensitive topics. They are always in control.'
    },
    {
      icon: Mail,
      title: 'What you will see',
      description:
        'You set them up with a seat. They sign in to their own account. You get a confirmation email when they finish a module — no peeking at their work in progress, no pressure on either of you.'
    }
  ];

  const steps = [
    {
      number: '1',
      title: 'Pick a Solo seat',
      description: 'One participant seat, $39 per month or $390 per year. Cancel anytime — no contract.'
    },
    {
      number: '2',
      title: 'Invite your student',
      description:
        'After checkout, we email an invite to your student. They use it to set up their own sign-in. Their progress is theirs.'
    },
    {
      number: '3',
      title: 'They start when ready',
      description:
        'No deadline. No homework reminders. They open PathWorks when they want to. The modules wait for them, not the other way around.'
    }
  ];
</script>

<svelte:head>
  <title>For Parents | PathWorks</title>
  <meta
    name="description"
    content="Help your student build the skills to start work — at their own pace. PathWorks is a vocational rehabilitation learning platform with untimed lessons, content warnings, and a safe exit at every step."
  />
</svelte:head>

<section class="bg-[#f7fafc] px-6 pt-32 pb-16 lg:px-12 lg:pt-40 lg:pb-24">
  <div class="mx-auto flex max-w-[1100px] flex-col items-center text-center">
    <p class="text-xs font-medium tracking-wide text-blue-700 uppercase">For Parents</p>
    <h1
      class="mt-3 max-w-[820px] text-[clamp(2rem,4vw,3.25rem)] leading-[1.1] font-medium tracking-tight text-gray-950"
    >
      Help your student build the skills <em class="text-blue-700 not-italic">to start work.</em>
    </h1>
    <p class="mt-5 max-w-[640px] text-sm leading-relaxed text-gray-600 lg:text-base">
      No timers. No surprise tests. They pause and come back when they're ready. PathWorks teaches job readiness,
      digital literacy, and self-advocacy at a human pace.
    </p>
    <div class="mt-7 flex flex-wrap items-center justify-center gap-3">
      <Button href="/demo">Try a sample lesson</Button>
      <Button href="/pricing" variant="outline">See pricing</Button>
    </div>
  </div>
</section>

<section class="bg-white px-6 py-16 lg:px-12 lg:py-20">
  <div class="mx-auto max-w-[1100px]">
    <BlurFade once>
      <h2 class="text-[clamp(1.5rem,2.4vw,2rem)] font-medium tracking-tight text-gray-950">What to expect.</h2>
    </BlurFade>

    <div class="mt-8 grid grid-cols-1 gap-4 md:grid-cols-3">
      {#each reassurances as item, i}
        <BlurFade delay={0.05 + i * 0.05} once>
          <div class="flex h-full flex-col rounded-2xl border border-gray-200/80 bg-[#f7fafc] p-6 lg:p-7">
            <div
              class="flex h-10 w-10 items-center justify-center rounded-lg bg-blue-100 text-blue-700 [&_svg]:stroke-blue-700"
            >
              <item.icon size={20} />
            </div>
            <h3 class="mt-4 text-base font-medium tracking-tight text-gray-950 lg:text-lg">
              {item.title}
            </h3>
            <p class="mt-2 text-sm leading-relaxed text-gray-600">
              {item.description}
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
      <h2 class="text-[clamp(1.5rem,2.4vw,2rem)] font-medium tracking-tight text-gray-950">How it works.</h2>
      <p class="mt-3 max-w-[620px] text-sm leading-relaxed text-gray-500">
        Three short steps. No paperwork, no waiting list.
      </p>
    </BlurFade>

    <div class="mt-8 grid grid-cols-1 gap-4 md:grid-cols-3">
      {#each steps as step, i}
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
  header="Want to see what your student will see?"
  subText="Try a sample lesson before you commit. No signup, no credit card — just one module so you can feel the pace."
  btnLabel="Try a sample lesson"
  link="/demo"
  demo={false}
/>
