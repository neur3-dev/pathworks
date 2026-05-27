<script lang="ts">
  import { BlurFade } from '@cio/ui/custom/animation/blurfade';
  import ArrowRight from '@lucide/svelte/icons/arrow-right';

  type Audience = {
    key: string;
    title: string;
    subtitle: string;
    description: string;
    href: string;
  };

  const audiences: Audience[] = [
    {
      key: 'counselors',
      title: 'For Counselors',
      subtitle: 'WIOA-aligned reporting',
      description:
        'Buy seats for a caseload, monitor progress against IPE goals, and export WCAG-conformant completion evidence for your agency.',
      href: '/for-counselors'
    },
    {
      key: 'parents',
      title: 'For Parents',
      subtitle: 'Set them up, watch them grow',
      description:
        'Buy a seat for your student. They learn at their own pace — no timers, no autoplay, no surprise tests. You see when they finish each module.',
      href: '/for-parents'
    },
    {
      key: 'participants',
      title: 'For Participants',
      subtitle: 'Work skills, your pace',
      description:
        'Build job readiness, digital literacy, and self-advocacy with untimed lessons, content warnings before sensitive topics, and a safe exit at every step.',
      href: '/for-participants'
    }
  ];
</script>

<section class="bg-white px-6 py-16 lg:px-12 lg:py-20">
  <div class="mx-auto max-w-[1100px]">
    <BlurFade once>
      <h2
        class="max-w-[820px] text-[clamp(1.75rem,2.8vw,2.4rem)] leading-[1.1] font-medium tracking-tight text-gray-950"
      >
        One platform.<br />Three ways in.
      </h2>
      <p class="mt-3 max-w-[620px] text-sm leading-relaxed text-gray-500">
        Counselors and parents purchase seats. Participants learn at their own pace. Everyone sees the same evidence of
        progress.
      </p>
    </BlurFade>

    <div class="mt-8 grid grid-cols-1 gap-4 md:grid-cols-3">
      {#each audiences as audience, i}
        <BlurFade delay={0.05 + i * 0.05} once>
          <a
            href={audience.href}
            class="group flex h-full flex-col rounded-2xl border border-gray-200/80 bg-[#f7fafc] p-6 no-underline transition-all duration-200 hover:border-blue-200 hover:bg-blue-50/30 hover:shadow-sm lg:p-7"
          >
            <p class="text-xs font-medium tracking-wide text-blue-700 uppercase">
              {audience.subtitle}
            </p>
            <h3 class="mt-2 text-lg font-medium tracking-tight text-gray-950">
              {audience.title}
            </h3>
            <p class="mt-3 flex-1 text-sm leading-relaxed text-gray-600">
              {audience.description}
            </p>
            <div
              class="mt-6 flex items-center gap-1.5 text-sm font-medium text-blue-700 transition-transform duration-200 group-hover:translate-x-1"
            >
              Learn more
              <ArrowRight size={14} />
            </div>
          </a>
        </BlurFade>
      {/each}
    </div>
  </div>
</section>
