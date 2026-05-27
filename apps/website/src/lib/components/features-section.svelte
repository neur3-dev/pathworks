<script lang="ts">
  import { BlurFade } from '@cio/ui/custom/animation/blurfade';
  import Check from '@lucide/svelte/icons/check';
  import Lock from '@lucide/svelte/icons/lock';
  import { onDestroy } from 'svelte';

  const ROTATION_INTERVAL_MS = 3000;
  let selectedTheme = $state('blue');
  let intervalId = $state<NodeJS.Timeout | null>(null);

  const themes = [
    { id: 'blue', color: '#1d4ee2', bgClass: 'bg-blue-700/20', activeBorder: 'border-[#1d4ee2]' },
    { id: 'rose', color: '#be1241', bgClass: 'bg-red-600/20', activeBorder: 'border-[#be1241]' },
    { id: 'green', color: '#0c891b', bgClass: 'bg-green-600/20', activeBorder: 'border-[#0c891b]' },
    { id: 'orange', color: '#cc4902', bgClass: 'bg-orange-600/20', activeBorder: 'border-[#cc4902]' },
    { id: 'purple', color: '#9333ea', bgClass: 'bg-purple-600/20', activeBorder: 'border-purple-600' }
  ];

  function startRotation() {
    if (intervalId) return;

    intervalId = setInterval(() => {
      const currentIndex = themes.findIndex((t) => t.id === selectedTheme);
      const nextIndex = (currentIndex + 1) % themes.length;
      selectedTheme = themes[nextIndex].id;
    }, ROTATION_INTERVAL_MS);
  }

  function stopRotation() {
    if (intervalId) {
      clearInterval(intervalId);
      intervalId = null;
    }
  }

  function selectTheme(themeId: string) {
    selectedTheme = themeId;
    stopRotation();
  }

  startRotation();

  onDestroy(() => {
    stopRotation();
  });
</script>

<section id="learning-design" class="bg-[#f7fafc] px-6 py-12 lg:px-12 lg:py-16">
  <div class="mx-auto max-w-[1100px]">
    <BlurFade once>
      <h2
        class="max-w-[820px] text-[clamp(1.75rem,2.8vw,2.4rem)] leading-[1.1] font-medium tracking-tight text-gray-950"
      >
        Built around access,<br />not pressure.
      </h2>
      <p class="mt-3 max-w-[620px] text-sm leading-relaxed text-gray-500">
        PathWorks keeps the learning experience predictable, flexible, and safe for participants with different support
        needs.
      </p>
    </BlurFade>

    <div class="mt-8 grid grid-cols-1 gap-4 md:grid-cols-2">
      <!-- Theme + branding -->
      <BlurFade delay={0.05} once>
        <div
          class="flex h-full flex-col rounded-2xl border border-gray-200/80 p-6 transition-colors duration-500 lg:p-7 {themes.find(
            (t) => t.id === selectedTheme
          )?.bgClass}"
        >
          <h3 class="text-base font-medium tracking-tight text-gray-950 lg:text-lg">Path-first learning</h3>
          <p class="mt-2 max-w-[420px] text-sm leading-relaxed text-gray-500">
            Courses are grouped into clear work readiness paths so participants always know where they are headed.
          </p>

          <!-- Visual: actual theme swatches from the app -->
          <div class="mt-8 flex flex-1 flex-col justify-end">
            <div class="flex flex-wrap items-center gap-2.5">
              {#each themes as theme (theme.id)}
                <button
                  type="button"
                  class="flex size-8 cursor-pointer items-center justify-center rounded-full border-2 bg-white transition-all {selectedTheme ===
                  theme.id
                    ? theme.activeBorder
                    : 'border-transparent'}"
                  aria-label="{theme.id} theme"
                  onclick={() => selectTheme(theme.id)}
                >
                  <span class="size-5 rounded-full" style="background-color: {theme.color}"></span>
                </button>
              {/each}
              <div
                class="flex h-9 w-9 items-center justify-center rounded-full border-2 border-dashed border-gray-400 text-gray-500"
                aria-label="Custom hex"
              >
                +
              </div>
            </div>
          </div>
        </div>
      </BlurFade>

      <!-- Custom domain -->
      <BlurFade delay={0.1} once>
        <div class="flex h-full flex-col rounded-2xl border border-gray-200/80 bg-[#ecebe6] p-6 lg:p-7">
          <h3 class="text-base font-medium tracking-tight text-gray-950 lg:text-lg">No autoplay</h3>
          <p class="mt-2 max-w-[420px] text-sm leading-relaxed text-gray-500">
            Media waits for the learner to press play. Content warnings appear before sensitive topics.
          </p>

          <!-- Visual: browser bar mock -->
          <div class="mt-8 flex flex-1 flex-col justify-end">
            <div class="overflow-hidden rounded-xl border border-gray-200 bg-white shadow-sm">
              <div class="flex items-center gap-2 border-b border-gray-100 bg-white px-3 py-2.5">
                <div class="h-2 w-2 rounded-full bg-red-400"></div>
                <div class="h-2 w-2 rounded-full bg-yellow-400"></div>
                <div class="h-2 w-2 rounded-full bg-green-500"></div>
                <div
                  class="ml-2 flex flex-1 items-center gap-1.5 rounded-md bg-gray-50 px-2.5 py-1 text-[11px] text-gray-600"
                >
                  <Lock size={10} class="text-green-600" />
                  <span class="font-mono">learning.pathworks.local</span>
                </div>
              </div>
              <div class="grid grid-cols-3 gap-1.5 p-3">
                <div class="h-12 rounded-md bg-gradient-to-br from-blue-200 to-blue-400"></div>
                <div class="h-12 rounded-md bg-gradient-to-br from-indigo-200 to-blue-500"></div>
                <div class="h-12 rounded-md bg-gradient-to-br from-sky-200 to-cyan-400"></div>
              </div>
            </div>
          </div>
        </div>
      </BlurFade>

      <!-- Resume anytime -->
      <BlurFade delay={0.15} once>
        <div class="flex h-full flex-col rounded-2xl border border-gray-200/80 bg-[#ecebe6] p-6 lg:p-7">
          <h3 class="text-base font-medium tracking-tight text-gray-950 lg:text-lg">Resume anytime</h3>
          <p class="mt-2 max-w-[420px] text-sm leading-relaxed text-gray-500">
            Stop in the middle of a lesson and come back tomorrow. Progress saves automatically — no warnings, no "are
            you sure," no lost work.
          </p>

          <!-- Visual: resumable module card -->
          <div class="mt-8 flex flex-1 flex-col justify-end">
            <div class="overflow-hidden rounded-xl border border-gray-200 bg-white p-4 shadow-sm">
              <div class="flex items-start justify-between">
                <div>
                  <p class="text-[11px] font-medium tracking-wide text-blue-700 uppercase">Module 3</p>
                  <p class="mt-0.5 text-sm font-medium text-gray-950">Workplace communication</p>
                </div>
                <span
                  class="rounded-full bg-blue-100 px-2 py-0.5 text-[10px] font-medium tracking-wide text-blue-700 uppercase"
                  >In progress</span
                >
              </div>
              <div class="mt-3 h-1.5 w-full overflow-hidden rounded-full bg-gray-100">
                <div class="h-full w-[58%] rounded-full bg-blue-600"></div>
              </div>
              <div class="mt-2 flex items-center justify-between text-[11px] text-gray-500">
                <span>8 of 14 minutes</span>
                <span>Last open Tuesday</span>
              </div>
              <button
                type="button"
                class="mt-3 w-full rounded-md bg-blue-600 px-3 py-1.5 text-[11px] font-medium text-white"
                tabindex="-1"
                aria-hidden="true"
              >
                Resume where you left off
              </button>
            </div>
          </div>
        </div>
      </BlurFade>

      <!-- Accessibility -->
      <BlurFade delay={0.2} once>
        <div class="flex h-full flex-col rounded-2xl border border-gray-200/80 bg-[#ecebe6] p-6 lg:p-7">
          <h3 class="text-base font-medium tracking-tight text-gray-950 lg:text-lg">Accessibility first</h3>
          <p class="mt-2 max-w-[420px] text-sm leading-relaxed text-gray-500">
            Built for WCAG 2.1 AA and Section 508. Designed with the realities of psychiatric, learning, and physical
            disability in mind — not retrofitted to them.
          </p>

          <!-- Visual: accessibility checklist -->
          <div class="mt-8 flex flex-1 flex-col justify-end">
            <div class="space-y-1.5">
              <div
                class="flex items-center gap-2 rounded-md bg-white/70 px-3 py-2 text-[11px] font-medium text-gray-700 ring-1 ring-gray-200"
              >
                <Check size={12} class="text-emerald-600" />
                <span>Screen reader announcements</span>
                <span class="ml-auto font-mono text-gray-400">aria-live</span>
              </div>
              <div
                class="flex items-center gap-2 rounded-md bg-white/70 px-3 py-2 text-[11px] font-medium text-gray-700 ring-1 ring-gray-200"
              >
                <Check size={12} class="text-emerald-600" />
                <span>Full keyboard navigation</span>
                <span class="ml-auto font-mono text-gray-400">tab order</span>
              </div>
              <div
                class="flex items-center gap-2 rounded-md bg-white/70 px-3 py-2 text-[11px] font-medium text-gray-700 ring-1 ring-gray-200"
              >
                <Check size={12} class="text-emerald-600" />
                <span>Untimed assessments</span>
                <span class="ml-auto font-mono text-gray-400">no countdowns</span>
              </div>
              <div
                class="flex items-center gap-2 rounded-md bg-white/70 px-3 py-2 text-[11px] font-medium text-gray-700 ring-1 ring-gray-200"
              >
                <Check size={12} class="text-emerald-600" />
                <span>Content warnings</span>
                <span class="ml-auto font-mono text-gray-400">opt-in only</span>
              </div>
            </div>
          </div>
        </div>
      </BlurFade>
    </div>
  </div>
</section>
