<script lang="ts">
  import { Button } from '@cio/ui/base/button';
  import { BlurFade } from '@cio/ui/custom/animation/blurfade';
  import ClipboardCheck from '@lucide/svelte/icons/clipboard-check';
  import FileChartColumn from '@lucide/svelte/icons/file-chart-column';
  import ShieldCheck from '@lucide/svelte/icons/shield-check';
  import Users from '@lucide/svelte/icons/users';
  import { PageSignupCTA } from '$lib/components';

  const capabilities = [
    {
      icon: ClipboardCheck,
      title: 'Progress against IPE goals, or referral outcomes',
      description:
        'Counselor dashboard maps each VR participant to their Individualized Plan for Employment goals. For workforce dev referrals, track module completion and skill demonstrations against the referral target. One dashboard, two reporting modes.'
    },
    {
      icon: FileChartColumn,
      title: 'WIOA Pre-ETS + workforce reporting',
      description:
        'Export VR completion evidence aligned with WIOA Pre-Employment Transition Services categories (job exploration, work-based learning, post-secondary prep, workplace readiness, self-advocacy). For workforce dev caseloads, export general completion + skill-demonstration evidence.'
    },
    {
      icon: ShieldCheck,
      title: 'Procurement-ready accessibility',
      description:
        'WCAG 2.1 AA conformance, Section 508 compliance, and a downloadable VPAT for your agency procurement file. Designed with input from VR participants across psychiatric, learning, and physical disability backgrounds, and used by general workforce-readiness learners every day.'
    },
    {
      icon: Users,
      title: 'Industry-aligned curriculum',
      description:
        'Modules tagged by high-growth industry sectors: advanced manufacturing, IT and AI, energy, transportation, life sciences, and more. Match participants to sectors hiring in their region.'
    }
  ];

  const steps = [
    {
      number: '1',
      title: 'Sign up and add your caseload',
      description:
        'Create your counselor or advisor account. For VR participants: upload IPE or other VR approval documentation per participant. For workforce dev referrals: complete a short referral form. We provision the seat once we verify.'
    },
    {
      number: '2',
      title: 'Add participant contact information',
      description:
        "Provide each participant's contact info. We send them an invite to set up their own sign-in. Their progress lives in their own account, no shared logins, no credential drift."
    },
    {
      number: '3',
      title: 'Pull progress reports for IPE or referral tracking',
      description:
        'See per-participant progress in the counselor view. Export module completion, time on task, and skill demonstrations as IPE-aligned evidence (VR caseload) or general workforce-readiness evidence (referral caseload).'
    }
  ];
</script>

<svelte:head>
  <title>For Counselors & Advisors | PathWorks</title>
  <meta
    name="description"
    content="For VR counselors and workforce development advisors. Enroll participants on IPE plans or general referral. Monitor progress, export completion evidence, align modules to Texas Target Industries."
  />
</svelte:head>

<section class="bg-[#f7fafc] px-6 pt-32 pb-16 lg:px-12 lg:pt-40 lg:pb-24">
  <div class="mx-auto flex max-w-[1100px] flex-col items-center text-center">
    <p class="text-xs font-medium tracking-wide text-blue-700 uppercase">For Counselors &amp; Advisors</p>
    <h1
      class="mt-3 max-w-[820px] text-[clamp(2rem,4vw,3.25rem)] leading-[1.1] font-medium tracking-tight text-gray-950"
    >
      Work readiness, <em class="text-blue-700 not-italic">for your caseload.</em>
    </h1>
    <p class="mt-5 max-w-[640px] text-sm leading-relaxed text-gray-600 lg:text-base">
      VR counselors and workforce development advisors enroll participants on the same platform. VR flow includes IPE
      documentation; workforce dev flow uses a simpler referral. Same dashboard, same accessibility, same reporting.
    </p>
    <div class="mt-7 flex flex-wrap items-center justify-center gap-3">
      <Button href="/signup?role=counselor">Sign up as a counselor or advisor</Button>
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

    <div class="mt-8 grid grid-cols-1 gap-4 md:grid-cols-2">
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
        Three steps from procurement to documented outcomes, VR or general workforce.
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
  subText="Schedule a 20-minute walkthrough. We'll show you the counselor dashboard, the IPE / referral flows, the reporting export, and answer procurement questions."
  btnLabel="Schedule a walkthrough"
  link="/demo"
  demo={false}
/>
