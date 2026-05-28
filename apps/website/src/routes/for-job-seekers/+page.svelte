<script lang="ts">
  import { Button } from '@cio/ui/base/button';
  import { BlurFade } from '@cio/ui/custom/animation/blurfade';
  import Briefcase from '@lucide/svelte/icons/briefcase';
  import Factory from '@lucide/svelte/icons/factory';
  import Target from '@lucide/svelte/icons/target';
  import { PageSignupCTA } from '$lib/components';

  const benefits = [
    {
      icon: Briefcase,
      title: 'Job-ready skills, not theory',
      description:
        'Resume building. Interview practice. Workplace communication. Digital tools you will actually use. Reading a paycheck. Every module is built around a real moment you will face on the way back to work.'
    },
    {
      icon: Factory,
      title: 'Industry-aligned curriculum',
      description:
        'Modules cover the sectors hiring through 2026 and beyond: advanced manufacturing, IT and AI, energy, transportation and logistics, life sciences, hospitality, and more. Pick a sector, get the path.'
    },
    {
      icon: Target,
      title: 'Built for adults rebuilding',
      description:
        'Untimed. No autoplay. Save and come back. Designed by accessibility experts and available to anyone who needs the training, no disability requirement, no doctor note, no counselor referral.'
    }
  ];

  const steps = [
    {
      number: '1',
      title: 'Sign up as an adult',
      description:
        '$39.99 a month. Cancel anytime. No counselor, no parent, no IPE. Just an email, a password, and a payment method.'
    },
    {
      number: '2',
      title: 'Pick your sector',
      description:
        'Pick the industry you want to work in, or stay general. We surface the modules that map to that path so you are not wasting time on the wrong curriculum.'
    },
    {
      number: '3',
      title: 'Build your work-ready portfolio',
      description:
        'A current resume. Interview practice. Sample workplace communication. Real evidence to show employers when you walk into the interview.'
    }
  ];
</script>

<svelte:head>
  <title>For Job Seekers | PathWorks</title>
  <meta
    name="description"
    content="Get back to work with skills today's employers are hiring for. Online work-readiness training for adults: laid off, unemployed, or switching careers. Industry-aligned curriculum."
  />
</svelte:head>

<section class="bg-[#f7fafc] px-6 pt-32 pb-16 lg:px-12 lg:pt-40 lg:pb-24">
  <div class="mx-auto flex max-w-[1100px] flex-col items-center text-center">
    <p class="text-xs font-medium tracking-wide text-blue-700 uppercase">For Job Seekers</p>
    <h1
      class="mt-3 max-w-[820px] text-[clamp(2rem,4vw,3.25rem)] leading-[1.1] font-medium tracking-tight text-gray-950"
    >
      Get back to work <em class="text-blue-700 not-italic">with the right skills.</em>
    </h1>
    <p class="mt-5 max-w-[640px] text-sm leading-relaxed text-gray-600 lg:text-base">
      If you have been laid off, you are switching careers, or you walked into a workforce development center today,
      PathWorks meets you where you are. Same accessibility-first design we use across the platform. Available to anyone
      who needs the training.
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
      <h2 class="text-[clamp(1.5rem,2.4vw,2rem)] font-medium tracking-tight text-gray-950">What you get.</h2>
    </BlurFade>

    <div class="mt-8 grid grid-cols-1 gap-4 md:grid-cols-3">
      {#each benefits as benefit, i}
        <BlurFade delay={0.05 + i * 0.05} once>
          <div class="flex h-full flex-col rounded-2xl border border-gray-200/80 bg-[#f7fafc] p-6 lg:p-7">
            <div
              class="flex h-10 w-10 items-center justify-center rounded-lg bg-blue-100 text-blue-700 [&_svg]:stroke-blue-700"
            >
              <benefit.icon size={20} />
            </div>
            <h3 class="mt-4 text-base font-medium tracking-tight text-gray-950 lg:text-lg">
              {benefit.title}
            </h3>
            <p class="mt-2 text-sm leading-relaxed text-gray-600">
              {benefit.description}
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
        Three steps from "I need a job" to "I have the skills employers are paying for."
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

    <div class="mt-8 text-center">
      <Button href="/industries" variant="outline">Browse industries</Button>
    </div>
  </div>
</section>

<PageSignupCTA
  header="Ready to work? Start with a free sample."
  subText="One module unlocked, no signup, no payment. Take a look. If it fits, sign up for full access at $39.99 a month."
  btnLabel="Try a sample lesson"
  link="/demo"
  demo={false}
/>
