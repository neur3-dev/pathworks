<script lang="ts">
  import { Button } from '@cio/ui/base/button';
  import { BlurFade } from '@cio/ui/custom/animation/blurfade';
  import ArrowLeft from '@lucide/svelte/icons/arrow-left';
  import Briefcase from '@lucide/svelte/icons/briefcase';
  import Camera from '@lucide/svelte/icons/camera';
  import Cpu from '@lucide/svelte/icons/cpu';
  import Factory from '@lucide/svelte/icons/factory';
  import Flame from '@lucide/svelte/icons/flame';
  import MapPin from '@lucide/svelte/icons/map-pin';
  import Microscope from '@lucide/svelte/icons/microscope';
  import Pickaxe from '@lucide/svelte/icons/pickaxe';
  import Truck from '@lucide/svelte/icons/truck';
  import Wheat from '@lucide/svelte/icons/wheat';
  import Zap from '@lucide/svelte/icons/zap';
  import { PageSignupCTA } from '$lib/components';

  let { data } = $props();
  const industry = $derived(data.industry);

  const iconMap = {
    factory: Factory,
    zap: Zap,
    wheat: Wheat,
    camera: Camera,
    cpu: Cpu,
    microscope: Microscope,
    flame: Flame,
    briefcase: Briefcase,
    pickaxe: Pickaxe,
    truck: Truck
  };

  const Icon = $derived(iconMap[industry.iconKey as keyof typeof iconMap]);
</script>

<svelte:head>
  <title>{industry.name} | PathWorks</title>
  <meta name="description" content={industry.shortDesc} />
</svelte:head>

<section class="bg-[#f7fafc] px-6 pt-32 pb-16 lg:px-12 lg:pt-40 lg:pb-20">
  <div class="mx-auto max-w-[1100px]">
    <a
      href="/industries"
      class="inline-flex items-center gap-1.5 text-sm font-medium text-blue-700 no-underline hover:underline"
    >
      <ArrowLeft size={14} />
      All Texas Target Industries
    </a>

    <div class="mt-6 flex items-start gap-4">
      <div
        class="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-blue-100 text-blue-700 [&_svg]:stroke-blue-700"
      >
        {#if Icon}
          <Icon size={24} />
        {/if}
      </div>
      <div>
        <p class="text-xs font-medium tracking-wide text-blue-700 uppercase">Texas Target Industry</p>
        <h1 class="mt-1 text-[clamp(1.75rem,3.4vw,2.75rem)] leading-[1.1] font-medium tracking-tight text-gray-950">
          {industry.name}
        </h1>
      </div>
    </div>

    <p class="mt-6 max-w-[760px] text-base leading-relaxed text-gray-700">
      {industry.description}
    </p>
  </div>
</section>

<section class="bg-white px-6 py-12 lg:px-12 lg:py-16">
  <div class="mx-auto grid max-w-[1100px] grid-cols-1 gap-8 md:grid-cols-2">
    <BlurFade once>
      <div>
        <h2 class="text-lg font-medium tracking-tight text-gray-950">Target clusters</h2>
        <p class="mt-2 text-sm leading-relaxed text-gray-500">
          The state has identified these clusters within {industry.name}.
        </p>
        <ul class="mt-4 space-y-2">
          {#each industry.clusters as cluster}
            <li class="flex gap-2 text-sm text-gray-700">
              <span class="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-blue-700"></span>
              <span>{cluster}</span>
            </li>
          {/each}
        </ul>
      </div>
    </BlurFade>

    <BlurFade delay={0.05} once>
      <div>
        <h2 class="text-lg font-medium tracking-tight text-gray-950">Why Texas</h2>
        <p class="mt-4 text-sm leading-relaxed text-gray-700">
          {industry.whyTexas}
        </p>
      </div>
    </BlurFade>
  </div>
</section>

<section class="bg-[#f7fafc] px-6 py-12 lg:px-12 lg:py-16">
  <div class="mx-auto max-w-[1100px]">
    <BlurFade once>
      <h2 class="text-[clamp(1.5rem,2.4vw,2rem)] font-medium tracking-tight text-gray-950">
        Sample roles to train for.
      </h2>
      <p class="mt-3 max-w-[620px] text-sm leading-relaxed text-gray-500">
        Entry-level and growth-track positions PathWorks curriculum supports. Sector-specific modules expand on the
        universal work-readiness foundation (resume, interviewing, workplace communication, self-advocacy).
      </p>
    </BlurFade>

    <div class="mt-8 grid grid-cols-1 gap-3 md:grid-cols-2 lg:grid-cols-3">
      {#each industry.sampleRoles as role, i}
        <BlurFade delay={0.03 + i * 0.03} once>
          <div class="rounded-xl border border-gray-200/80 bg-white p-4">
            <p class="text-sm font-medium text-gray-950">{role}</p>
          </div>
        </BlurFade>
      {/each}
    </div>
  </div>
</section>

<section class="bg-white px-6 py-12 lg:px-12 lg:py-16">
  <div class="mx-auto max-w-[1100px]">
    <BlurFade once>
      <div class="flex items-center gap-2 text-sm font-medium tracking-wide text-blue-700 uppercase">
        <MapPin size={14} />
        Where in Texas
      </div>
      <p class="mt-3 max-w-[760px] text-base leading-relaxed text-gray-700">
        {industry.name} clusters in these Texas metros and regions:
      </p>
      <div class="mt-4 flex flex-wrap gap-2">
        {#each industry.metros as metro}
          <span class="rounded-full bg-blue-50 px-3 py-1 text-sm font-medium text-blue-700">{metro}</span>
        {/each}
      </div>
    </BlurFade>
  </div>
</section>

<PageSignupCTA
  header="Train for {industry.name}."
  subText="PathWorks modules cover the universal work-readiness skills every role needs, with sector-specific paths layered on top. Pick your sector at signup. We surface the curriculum that matters."
  btnLabel="Sign up"
  link="/signup?role=adult"
  demo={false}
/>
