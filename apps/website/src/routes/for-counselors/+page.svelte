<script lang="ts">
  import { Button } from '@cio/ui/base/button';
  import { BlurFade } from '@cio/ui/custom/animation/blurfade';
  import ClipboardCheck from '@lucide/svelte/icons/clipboard-check';
  import FileChartColumn from '@lucide/svelte/icons/file-chart-column';
  import ShieldCheck from '@lucide/svelte/icons/shield-check';
  import { PageSignupCTA } from '$lib/components';

  const capabilities = [
    {
      icon: ClipboardCheck,
      title: 'Progress against IPE goals',
      description:
        'Counselor dashboard maps each participant to their Individualized Plan for Employment goals. See module completion, time on task, and skill demonstrations in one view — without leaving your existing case management workflow.'
    },
    {
      icon: FileChartColumn,
      title: 'WIOA Pre-ETS reporting',
      description:
        'Export completion evidence aligned with WIOA Pre-Employment Transition Services categories: job exploration, work-based learning, post-secondary preparation, workplace readiness, and self-advocacy. Generate quarterly or per-IPE reports in three clicks.'
    },
    {
      icon: ShieldCheck,
      title: 'Procurement-ready accessibility',
      description:
        'WCAG 2.1 AA conformance, Section 508 compliance, and a downloadable VPAT for your agency procurement file. Designed with input from VR participants across psychiatric, learning, and physical disability backgrounds.'
    }
  ];

  const steps = [
    {
      number: '1',
      title: 'Choose your tier',
      description:
        'Cohort starts at five seats for caseload counselors. Agency tier handles state-wide deployments with SSO, BAA/DPA, and dedicated support.'
    },
    {
      number: '2',
      title: 'Invite each participant',
      description:
        'Email-invite each participant to their own seat. They sign in with their own credentials — no shared accounts, no credential drift.'
    },
    {
      number: '3',
      title: 'Monitor and report',
      description:
        'Watch progress in the counselor view. Export completion evidence on demand. Document outcomes for your agency, your supervisor, and the participant.'
    }
  ];
</script>

<svelte:head>
  <title>For Counselors | PathWorks</title>
  <meta
    name="description"
    content="WIOA-aligned work readiness for your VR caseload. Buy seats, monitor progress against IPE goals, and export completion evidence for your agency."
  />
</svelte:head>

<section class="bg-[#f7fafc] px-6 pt-32 pb-16 lg:px-12 lg:pt-40 lg:pb-24">
  <div class="mx-auto flex max-w-[1100px] flex-col items-center text-center">
    <p class="text-xs font-medium tracking-wide text-blue-700 uppercase">For Counselors</p>
    <h1
      class="mt-3 max-w-[820px] text-[clamp(2rem,4vw,3.25rem)] leading-[1.1] font-medium tracking-tight text-gray-950"
    >
      WIOA-aligned work readiness <em class="text-blue-700 not-italic">for your caseload.</em>
    </h1>
    <p class="mt-5 max-w-[640px] text-sm leading-relaxed text-gray-600 lg:text-base">
      Buy seats for the participants on your IPE plans. Monitor progress against goals. Export the completion evidence
      your agency needs for Pre-ETS reporting.
    </p>
    <div class="mt-7 flex flex-wrap items-center justify-center gap-3">
      <Button href="/pricing">See pricing</Button>
      <Button href="/demo" variant="outline">Schedule a walkthrough</Button>
    </div>
  </div>
</section>

<section class="bg-white px-6 py-16 lg:px-12 lg:py-20">
  <div class="mx-auto max-w-[1100px]">
    <BlurFade once>
      <h2 class="text-[clamp(1.5rem,2.4vw,2rem)] font-medium tracking-tight text-gray-950">
        What you get with PathWorks.
      </h2>
    </BlurFade>

    <div class="mt-8 grid grid-cols-1 gap-4 md:grid-cols-3">
      {#each capabilities as cap, i}
        <BlurFade delay={0.05 + i * 0.05} once>
          <div class="flex h-full flex-col rounded-2xl border border-gray-200/80 bg-[#f7fafc] p-6 lg:p-7">
            <div
              class="flex h-10 w-10 items-center justify-center rounded-lg bg-blue-100 text-blue-700 [&_svg]:stroke-blue-700"
            >
              <cap.icon size={20} />
            </div>
            <h3 class="mt-4 text-base font-medium tracking-tight text-gray-950 lg:text-lg">
              {cap.title}
            </h3>
            <p class="mt-2 text-sm leading-relaxed text-gray-600">
              {cap.description}
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
        Three steps from procurement to documented outcomes.
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
  header="Ready to bring PathWorks to your caseload?"
  subText="Schedule a 20-minute walkthrough with our team. We'll show you the counselor dashboard, the reporting export, and answer procurement questions."
  btnLabel="Schedule a walkthrough"
  link="/demo"
  demo={false}
/>
