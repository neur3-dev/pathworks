<script lang="ts">
  import { Button } from '@cio/ui/base/button';
  import { BlurFade } from '@cio/ui/custom/animation/blurfade';
  import ArrowRight from '@lucide/svelte/icons/arrow-right';
  import ClipboardList from '@lucide/svelte/icons/clipboard-list';
  import Heart from '@lucide/svelte/icons/heart';
  import User from '@lucide/svelte/icons/user';

  const DASHBOARD_SIGNUP = 'https://pathworks.neur3.dev/signup';

  type SignupPath = {
    key: string;
    icon: typeof Heart;
    title: string;
    audience: string;
    description: string;
    requirements: string[];
    ctaLabel: string;
    href: string;
  };

  const paths: SignupPath[] = [
    {
      key: 'parent',
      icon: Heart,
      title: 'I am a parent or guardian',
      audience: 'Signing up a student ages 13 to 17',
      description:
        'You create the account and stay the billing contact. Your student gets their own sign-in once you finish setup.',
      requirements: [
        'Your name and email',
        "Your student's name and age (13 to 17)",
        'Payment method (Student plan, $19.99 per month)'
      ],
      ctaLabel: 'Continue as parent',
      href: `${DASHBOARD_SIGNUP}?role=parent`
    },
    {
      key: 'adult',
      icon: User,
      title: 'I am 18 or older, signing up for myself',
      audience: 'Adult self-directed learner',
      description: 'No parent or counselor required. You manage the account, the billing, and the learning.',
      requirements: ['Your name and email', 'A password', 'Payment method (Adult plan, $39.99 per month)'],
      ctaLabel: 'Continue as adult',
      href: `${DASHBOARD_SIGNUP}?role=adult`
    },
    {
      key: 'counselor',
      icon: ClipboardList,
      title: 'I am a vocational rehabilitation counselor',
      audience: 'Enrolling participants from a VR caseload',
      description:
        'You sign up first, then enroll participants with their IPE documentation. We provision a seat once we verify approval.',
      requirements: [
        'Your name, agency, and work email',
        'IPE or other VR approval documentation for each participant you plan to enroll',
        'Contact information for each participant',
        'Agency billing details (per-seat pricing — contact us for a quote)'
      ],
      ctaLabel: 'Continue as counselor',
      href: `${DASHBOARD_SIGNUP}?role=counselor`
    }
  ];
</script>

<svelte:head>
  <title>Sign up | PathWorks</title>
  <meta
    name="description"
    content="Sign up for PathWorks. Three paths: parent signing up a student, adult signing up for themselves, or VR counselor enrolling participants on IPE plans."
  />
</svelte:head>

<section class="bg-[#f7fafc] px-6 pt-32 pb-12 lg:px-12 lg:pt-40 lg:pb-16">
  <div class="mx-auto flex max-w-[1100px] flex-col items-center text-center">
    <h1 class="max-w-[820px] text-[clamp(2rem,4vw,3.25rem)] leading-[1.1] font-medium tracking-tight text-gray-950">
      Welcome to PathWorks. <br /><em class="text-blue-700 not-italic">Tell us who you are.</em>
    </h1>
    <p class="mt-5 max-w-[640px] text-sm leading-relaxed text-gray-600 lg:text-base">
      Three sign-up paths. Pick the one that matches you. Students under 18 sign up through a parent. Adults 18 and over
      sign up directly. VR counselors enroll participants on IPE plans.
    </p>
  </div>
</section>

<section class="bg-white px-6 py-12 lg:px-12 lg:py-16">
  <div class="mx-auto max-w-[1100px]">
    <div class="grid grid-cols-1 gap-4 md:grid-cols-3">
      {#each paths as path, i}
        <BlurFade delay={0.05 + i * 0.05} once>
          <div class="flex h-full flex-col rounded-2xl border border-gray-200/80 bg-[#f7fafc] p-6 lg:p-7">
            <div
              class="flex h-10 w-10 items-center justify-center rounded-lg bg-blue-100 text-blue-700 [&_svg]:stroke-blue-700"
            >
              <path.icon size={20} />
            </div>
            <p class="mt-4 text-xs font-medium tracking-wide text-blue-700 uppercase">
              {path.audience}
            </p>
            <h2 class="mt-1 text-base font-medium tracking-tight text-gray-950 lg:text-lg">
              {path.title}
            </h2>
            <p class="mt-2 text-sm leading-relaxed text-gray-600">
              {path.description}
            </p>

            <div class="mt-4 border-t border-gray-200 pt-4">
              <p class="text-xs font-semibold tracking-wide text-gray-700 uppercase">You will need</p>
              <ul class="mt-2 space-y-1.5 text-sm text-gray-600">
                {#each path.requirements as req}
                  <li class="flex gap-2">
                    <span class="mt-1 h-1 w-1 shrink-0 rounded-full bg-blue-700"></span>
                    <span>{req}</span>
                  </li>
                {/each}
              </ul>
            </div>

            <div class="mt-6 flex-1"></div>

            <Button href={path.href} class="mt-2 w-full justify-center">
              {path.ctaLabel}
              <ArrowRight size={14} class="ml-2" />
            </Button>
          </div>
        </BlurFade>
      {/each}
    </div>
  </div>
</section>

<section class="bg-[#f7fafc] px-6 py-10 lg:px-12 lg:py-14">
  <div class="mx-auto max-w-[1100px] text-center">
    <p class="text-sm text-gray-600">
      Already have an account?
      <a href={DASHBOARD_SIGNUP.replace('/signup', '/login')} class="font-medium text-blue-700 hover:underline">
        Sign in &rarr;
      </a>
    </p>
  </div>
</section>
