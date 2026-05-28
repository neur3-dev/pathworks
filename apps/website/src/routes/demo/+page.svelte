<script lang="ts">
  import { Button } from '@cio/ui/base/button';
  import { BlurFade } from '@cio/ui/custom/animation/blurfade';
  import AlertTriangle from '@lucide/svelte/icons/alert-triangle';
  import Check from '@lucide/svelte/icons/check';
  import Clock from '@lucide/svelte/icons/clock';
  import FileText from '@lucide/svelte/icons/file-text';
  import Headphones from '@lucide/svelte/icons/headphones';
  import MessageCircle from '@lucide/svelte/icons/message-circle';
  import Pause from '@lucide/svelte/icons/pause';
  import Save from '@lucide/svelte/icons/save';
  import Sparkles from '@lucide/svelte/icons/sparkles';
  import Video from '@lucide/svelte/icons/video';
  import { PageSignupCTA } from '$lib/components';

  type DemoStep = 'preview' | 'warning' | 'modality' | 'lesson' | 'pause' | 'complete';

  let step: DemoStep = $state('preview');
  let selectedModality: 'read' | 'watch' | 'interactive' = $state('read');
  let secondsRead = $state(0);

  function startLesson() {
    step = 'warning';
  }

  function dismissWarning() {
    step = 'modality';
  }

  function chooseModality(mode: 'read' | 'watch' | 'interactive') {
    selectedModality = mode;
    step = 'lesson';
    secondsRead = 0;
  }

  function pauseLesson() {
    step = 'pause';
  }

  function resumeLesson() {
    step = 'lesson';
  }

  function completeLesson() {
    step = 'complete';
  }

  function restart() {
    step = 'preview';
    selectedModality = 'read';
    secondsRead = 0;
  }
</script>

<svelte:head>
  <title>Try PathWorks | Sample Lesson + Walkthrough</title>
  <meta
    name="description"
    content="Try a sample PathWorks lesson with no signup, or schedule a walkthrough with our team. Untimed, no autoplay, content warnings, save and resume."
  />
</svelte:head>

<section class="bg-[#f7fafc] px-6 pt-32 pb-12 lg:px-12 lg:pt-40 lg:pb-16">
  <div class="mx-auto flex max-w-[1100px] flex-col items-center text-center">
    <p class="text-xs font-medium tracking-wide text-blue-700 uppercase">Try PathWorks</p>
    <h1
      class="mt-3 max-w-[820px] text-[clamp(2rem,4vw,3.25rem)] leading-[1.1] font-medium tracking-tight text-gray-950"
    >
      Two ways to take <em class="text-blue-700 not-italic">a look around.</em>
    </h1>
    <p class="mt-5 max-w-[640px] text-sm leading-relaxed text-gray-600 lg:text-base">
      Try a sample lesson right here, no signup. Or book a walkthrough if you want one of us to show you the counselor
      view, the reporting export, or answer procurement questions.
    </p>
  </div>
</section>

<section class="bg-white px-6 py-12 lg:px-12 lg:py-16">
  <div class="mx-auto grid max-w-[1100px] grid-cols-1 gap-6 lg:grid-cols-2">
    <BlurFade once>
      <a
        href="#sample-lesson"
        class="group flex h-full flex-col rounded-2xl border border-gray-200/80 bg-[#f7fafc] p-6 no-underline transition-all duration-200 hover:border-blue-200 hover:bg-blue-50/30 hover:shadow-sm lg:p-8"
      >
        <div
          class="flex h-12 w-12 items-center justify-center rounded-xl bg-blue-100 text-blue-700 [&_svg]:stroke-blue-700"
        >
          <Sparkles size={24} />
        </div>
        <h2 class="mt-4 text-xl font-medium tracking-tight text-gray-950">Try a sample lesson</h2>
        <p class="mt-2 flex-1 text-sm leading-relaxed text-gray-600">
          One unlocked module, no signup, no payment, no email. Step through the experience: module overview, content
          warnings, modality choice, untimed pacing, save and resume.
        </p>
        <span
          class="mt-6 inline-flex items-center gap-1.5 text-sm font-medium text-blue-700 transition-transform duration-200 group-hover:translate-x-1"
        >
          Jump to the sample, below &rarr;
        </span>
      </a>
    </BlurFade>

    <BlurFade delay={0.05} once>
      <div class="flex h-full flex-col rounded-2xl border border-gray-200/80 bg-[#f7fafc] p-6 lg:p-8">
        <div
          class="flex h-12 w-12 items-center justify-center rounded-xl bg-blue-100 text-blue-700 [&_svg]:stroke-blue-700"
        >
          <MessageCircle size={24} />
        </div>
        <h2 class="mt-4 text-xl font-medium tracking-tight text-gray-950">Schedule a walkthrough</h2>
        <p class="mt-2 flex-1 text-sm leading-relaxed text-gray-600">
          Twenty minutes with our team. We will show you the counselor dashboard, the reporting export, and answer
          procurement questions for your agency or workforce development center.
        </p>
        <Button
          variant="outline"
          data-cal-link="pathworks/demo"
          data-cal-config="'layout':'month_view'"
          class="ui:mt-6 ui:w-full"
        >
          Book a 20-minute walkthrough
        </Button>
      </div>
    </BlurFade>
  </div>
</section>

<section id="sample-lesson" class="bg-[#f7fafc] px-6 py-16 lg:px-12 lg:py-20">
  <div class="mx-auto max-w-[820px]">
    <BlurFade once>
      <p class="text-xs font-medium tracking-wide text-blue-700 uppercase">Sample lesson</p>
      <h2 class="mt-2 text-[clamp(1.75rem,3vw,2.4rem)] leading-[1.1] font-medium tracking-tight text-gray-950">
        Asking for help at work.
      </h2>
      <p class="mt-3 text-sm leading-relaxed text-gray-500">
        This is a real PathWorks module, stepped through one screen at a time. Step through it as a learner would. No
        timer is counting down. You can stop and come back without losing your place.
      </p>
    </BlurFade>

    <BlurFade delay={0.05} once>
      <div class="mt-8 overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-sm">
        {#if step === 'preview'}
          <div class="p-6 lg:p-8">
            <p class="text-[11px] font-medium tracking-wide text-blue-700 uppercase">Module 4 of 8</p>
            <h3 class="mt-1 text-lg font-medium text-gray-950">Asking for help at work</h3>
            <div class="mt-4 grid grid-cols-1 gap-3 sm:grid-cols-3">
              <div class="flex items-center gap-2 rounded-lg bg-gray-50 px-3 py-2.5 text-sm text-gray-700">
                <Clock size={16} class="text-gray-500" />
                <span>12 minutes</span>
              </div>
              <div class="flex items-center gap-2 rounded-lg bg-gray-50 px-3 py-2.5 text-sm text-gray-700">
                <FileText size={16} class="text-gray-500" />
                <span>Read or watch</span>
              </div>
              <div class="flex items-center gap-2 rounded-lg bg-gray-50 px-3 py-2.5 text-sm text-gray-700">
                <Save size={16} class="text-gray-500" />
                <span>Saves on exit</span>
              </div>
            </div>
            <div class="mt-6 rounded-lg border border-amber-200 bg-amber-50 p-4">
              <div class="flex items-start gap-3">
                <AlertTriangle size={18} class="mt-0.5 shrink-0 text-amber-700" />
                <div>
                  <p class="text-sm font-medium text-amber-900">Heads up</p>
                  <p class="mt-1 text-sm text-amber-800">
                    This module talks about asking a supervisor for accommodations. If that feels like a hard topic
                    today, you can skip this module and come back later.
                  </p>
                </div>
              </div>
            </div>
            <div class="mt-6 flex flex-wrap gap-3">
              <Button onclick={startLesson}>Start module</Button>
              <Button variant="outline" onclick={restart}>Skip for now</Button>
            </div>
          </div>
        {:else if step === 'warning'}
          <div class="p-6 lg:p-8">
            <div class="flex items-start gap-3 rounded-lg border border-amber-200 bg-amber-50 p-4">
              <AlertTriangle size={20} class="mt-0.5 shrink-0 text-amber-700" />
              <div>
                <p class="text-base font-medium text-amber-900">Content warning</p>
                <p class="mt-2 text-sm text-amber-800">
                  This module includes a scenario where a worker discloses a disability to ask for accommodations. If
                  this brings up something for you, you can stop the module at any time. Your progress saves
                  automatically.
                </p>
              </div>
            </div>
            <div class="mt-6 flex flex-wrap gap-3">
              <Button onclick={dismissWarning}>I am ready</Button>
              <Button variant="outline" onclick={restart}>Skip for now</Button>
            </div>
          </div>
        {:else if step === 'modality'}
          <div class="p-6 lg:p-8">
            <p class="text-sm text-gray-500">How would you like to take this module?</p>
            <div class="mt-4 grid grid-cols-1 gap-3 sm:grid-cols-3">
              <button
                type="button"
                onclick={() => chooseModality('read')}
                class="group flex flex-col items-start gap-2 rounded-xl border border-gray-200 bg-white p-4 text-left transition-all hover:border-blue-300 hover:bg-blue-50/30"
              >
                <FileText size={20} class="text-blue-700" />
                <p class="text-sm font-medium text-gray-950">Read it</p>
                <p class="text-xs text-gray-500">~12 minutes. Best for going at your own pace.</p>
              </button>
              <button
                type="button"
                onclick={() => chooseModality('watch')}
                class="group flex flex-col items-start gap-2 rounded-xl border border-gray-200 bg-white p-4 text-left transition-all hover:border-blue-300 hover:bg-blue-50/30"
              >
                <Video size={20} class="text-blue-700" />
                <p class="text-sm font-medium text-gray-950">Watch it</p>
                <p class="text-xs text-gray-500">~10 minutes. Captions on by default.</p>
              </button>
              <button
                type="button"
                onclick={() => chooseModality('interactive')}
                class="group flex flex-col items-start gap-2 rounded-xl border border-gray-200 bg-white p-4 text-left transition-all hover:border-blue-300 hover:bg-blue-50/30"
              >
                <Headphones size={20} class="text-blue-700" />
                <p class="text-sm font-medium text-gray-950">Practice a scenario</p>
                <p class="text-xs text-gray-500">~15 minutes. Short choices, no scores.</p>
              </button>
            </div>
            <p class="mt-4 text-xs text-gray-500">You can switch modes later without losing your progress.</p>
          </div>
        {:else if step === 'lesson'}
          <div class="p-6 lg:p-8">
            <div class="flex items-center justify-between text-[11px] text-gray-500">
              <span class="font-medium tracking-wide uppercase">
                {#if selectedModality === 'read'}Reading{:else if selectedModality === 'watch'}Watching{:else}
                  Practicing
                {/if}
              </span>
              <span class="flex items-center gap-1.5">
                <Save size={12} />
                Saved a moment ago
              </span>
            </div>
            <div class="mt-3 h-1.5 w-full overflow-hidden rounded-full bg-gray-100">
              <div class="h-full w-[34%] rounded-full bg-blue-600"></div>
            </div>
            <h3 class="mt-6 text-lg font-medium text-gray-950">Why asking for help is part of doing the job well.</h3>
            <p class="mt-3 text-sm leading-relaxed text-gray-700">
              At work, asking for help is not a weakness. It is how good workers stay good. A supervisor cannot read
              your mind. If you need a different tool, more time, written instructions, or a quieter spot to focus, you
              are allowed to say so.
            </p>
            <p class="mt-3 text-sm leading-relaxed text-gray-700">
              The skill is not the asking itself. The skill is asking <em
                class="not-italic underline decoration-blue-200 decoration-2 underline-offset-2"
                >in a way the supervisor can act on</em
              >. That is what the next section is about.
            </p>
            <div class="mt-6 flex flex-wrap gap-3">
              <Button onclick={completeLesson}>Continue</Button>
              <Button variant="outline" onclick={pauseLesson}>
                <Pause size={14} class="ui:mr-1.5" />
                Pause and save
              </Button>
            </div>
          </div>
        {:else if step === 'pause'}
          <div class="p-6 lg:p-8">
            <div class="flex items-start gap-3 rounded-lg border border-blue-200 bg-blue-50 p-4">
              <Save size={20} class="mt-0.5 shrink-0 text-blue-700" />
              <div>
                <p class="text-base font-medium text-blue-900">Saved.</p>
                <p class="mt-2 text-sm text-blue-800">
                  Your progress is saved. When you come back, this module will open right where you left off. No
                  warnings, no "are you sure," no lost work.
                </p>
              </div>
            </div>
            <div class="mt-6 flex flex-wrap gap-3">
              <Button onclick={resumeLesson}>Resume where I left off</Button>
              <Button variant="outline" onclick={restart}>Restart the demo</Button>
            </div>
          </div>
        {:else if step === 'complete'}
          <div class="p-6 lg:p-8">
            <div class="flex items-start gap-3 rounded-lg border border-emerald-200 bg-emerald-50 p-4">
              <Check size={20} class="mt-0.5 shrink-0 text-emerald-700" />
              <div>
                <p class="text-base font-medium text-emerald-900">That is what one module feels like.</p>
                <p class="mt-2 text-sm text-emerald-800">
                  No timer, no surprise test, no shame for taking a break. Every PathWorks module follows this same
                  shape: preview, warning if relevant, your choice of modality, untimed pacing, save and resume.
                </p>
              </div>
            </div>
            <div class="mt-6 flex flex-wrap gap-3">
              <Button href="/pricing">See pricing</Button>
              <Button variant="outline" onclick={restart}>Try the demo again</Button>
            </div>
          </div>
        {/if}
      </div>
    </BlurFade>

    <BlurFade delay={0.1} once>
      <div class="mt-6 grid grid-cols-2 gap-3 text-xs text-gray-500 sm:grid-cols-4">
        <div class="flex items-center gap-1.5">
          <Clock size={12} class="text-gray-400" />
          Untimed
        </div>
        <div class="flex items-center gap-1.5">
          <Save size={12} class="text-gray-400" />
          Save and resume
        </div>
        <div class="flex items-center gap-1.5">
          <AlertTriangle size={12} class="text-gray-400" />
          Content warnings
        </div>
        <div class="flex items-center gap-1.5">
          <Check size={12} class="text-gray-400" />
          No autoplay
        </div>
      </div>
    </BlurFade>
  </div>
</section>

<PageSignupCTA
  header="Like what you tried? Sign up."
  subText="Adults sign up for themselves. Parents sign up a student under 18. Counselors and workforce development advisors enroll participants on IPE plans or general referral."
  btnLabel="See sign-up options"
  link="/signup"
  demo={false}
/>
