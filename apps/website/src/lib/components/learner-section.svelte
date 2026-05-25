<script>
  import { BlurFade } from '@cio/ui/custom/animation/blurfade';

  const learnerModes = [
    {
      icon: '1',
      title: 'Preview it',
      description: 'Each module starts with a plain-language overview so learners know what is coming.'
    },
    {
      icon: '2',
      title: 'Take breaks',
      description: 'Progress saves as learners pause, answer, or move through lessons.'
    },
    {
      icon: '3',
      title: 'Try again',
      description: 'Assessments are untimed by default with warm feedback and room to retry.'
    }
  ];

  const summaryItems = [
    'Practice professional communication',
    'Build time management routines',
    'Prepare for interviews and applications',
    'Understand workplace rights',
    'Ask for accommodations when needed'
  ];
</script>

<section class="bg-white px-6 py-16 lg:px-12 lg:py-24">
  <div class="mx-auto max-w-[1100px]">
    <div class="grid grid-cols-1 items-center gap-12 lg:grid-cols-2 lg:gap-20">
      <div>
        <BlurFade once>
          <div class="mb-3.5 text-xs font-medium tracking-widest text-blue-700 uppercase">
            Built for learners, not just admins
          </div>
          <h2 class="mb-4 text-[clamp(2rem,3vw,2.8rem)] leading-[1.15] font-medium tracking-tight">
            Every student learns differently.<br />We support <em class="text-blue-700 italic">all of them.</em>
          </h2>
          <p class="mb-10 max-w-[520px] text-base leading-relaxed text-gray-500 lg:text-lg">
            Most LMS platforms assume one path through a lesson. PathWorks is designed for participants who need
            structure, flexibility, and permission to move at a human pace.
          </p>
        </BlurFade>

        <div class="flex flex-col gap-4">
          {#each learnerModes as mode, i}
            <BlurFade delay={0.1 * i} once>
              <div class="flex items-start gap-3.5">
                <div class="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-blue-50 text-lg">
                  {mode.icon}
                </div>
                <div>
                  <h4 class="mb-1 text-sm font-medium">
                    {mode.title}
                    {#if mode.comingSoon}
                      <span
                        class="ml-1 rounded-full bg-blue-700 px-1.5 py-0.5 align-middle text-[0.6rem] tracking-wide text-white uppercase"
                        >Soon</span
                      >
                    {/if}
                  </h4>
                  <p class="text-sm leading-relaxed text-gray-500">{mode.description}</p>
                </div>
              </div>
            </BlurFade>
          {/each}
        </div>
      </div>

      <!-- Lesson Mock UI -->
      <BlurFade delay={0.2} once>
        <div class="relative overflow-hidden rounded-2xl border border-gray-200 bg-gray-50 shadow-2xl/5">
          <div class="flex items-center justify-between border-b border-gray-200 bg-white px-5 py-4">
            <div class="text-sm font-medium">Workplace Communication</div>
            <div class="rounded-full border border-gray-200 bg-gray-50 px-2.5 py-0.5 text-xs text-gray-500">
              Lesson 3 of 8
            </div>
          </div>
          <div class="p-6">
            <div class="mb-5 text-sm leading-relaxed text-gray-500">
              This lesson practices clear workplace messages, asking follow-up questions, and confirming next steps with
              a supervisor or teammate.
            </div>

            <div class="mb-5 flex flex-wrap gap-2.5">
              <button
                class="flex items-center gap-1.5 rounded-lg border-none bg-gray-950 px-4 py-2 text-xs font-medium text-white"
              >
                Resume
              </button>
              <button
                class="flex items-center gap-1.5 rounded-lg border-[1.5px] border-gray-200 bg-white px-4 py-2 text-xs font-medium text-gray-950"
              >
                Start over
              </button>
            </div>

            <div class="rounded-xl border border-gray-200 bg-white p-4">
              <div class="mb-3 text-xs font-medium tracking-wider text-blue-700 uppercase">What you'll learn</div>
              <div class="flex flex-col gap-2.5">
                {#each summaryItems as item}
                  <div class="flex gap-2.5 text-xs leading-relaxed">
                    <span class="shrink-0 font-medium text-blue-700">•</span>
                    <span>{item}</span>
                  </div>
                {/each}
              </div>
            </div>
          </div>
        </div>
      </BlurFade>
    </div>
  </div>
</section>
