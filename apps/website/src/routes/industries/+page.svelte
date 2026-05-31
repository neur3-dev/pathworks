<script lang="ts">
  import { Button } from '@cio/ui/base/button';
  import { BlurFade } from '@cio/ui/custom/animation/blurfade';
  import ArrowRight from '@lucide/svelte/icons/arrow-right';
  import Briefcase from '@lucide/svelte/icons/briefcase';
  import Camera from '@lucide/svelte/icons/camera';
  import Cpu from '@lucide/svelte/icons/cpu';
  import Factory from '@lucide/svelte/icons/factory';
  import Flame from '@lucide/svelte/icons/flame';
  import Microscope from '@lucide/svelte/icons/microscope';
  import Pickaxe from '@lucide/svelte/icons/pickaxe';
  import Truck from '@lucide/svelte/icons/truck';
  import Wheat from '@lucide/svelte/icons/wheat';
  import Zap from '@lucide/svelte/icons/zap';
  import { industries } from '$lib/utils/constants/industries';

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
</script>

<svelte:head>
  <title>Industries | PathWorks</title>
  <meta
    name="description"
    content="PathWorks curriculum aligns to high-growth industry sectors: advanced manufacturing, energy, IT and AI, transportation, life sciences, and more. Pick the sector you want to work in."
  />
</svelte:head>

<section class="bg-[#f7fafc] px-6 pt-32 pb-16 lg:px-12 lg:pt-40 lg:pb-24">
  <div class="mx-auto flex max-w-[1100px] flex-col items-center text-center">
    <p class="text-xs font-medium tracking-wide text-blue-700 uppercase">Industries</p>
    <h1
      class="mt-3 max-w-[820px] text-[clamp(2rem,4vw,3.25rem)] leading-[1.1] font-medium tracking-tight text-gray-950"
    >
      Train for sectors growing <em class="text-blue-700 not-italic">through 2026 and beyond.</em>
    </h1>
    <p class="mt-5 max-w-[640px] text-sm leading-relaxed text-gray-600 lg:text-base">
      PathWorks curriculum aligns to high-growth industry sectors. Pick a sector, sign up, and the modules that map to
      that path move to the top of your library.
    </p>
    <p class="mt-3 max-w-[640px] text-xs leading-relaxed text-gray-500">
      Sector growth claims align with the U.S. Bureau of Labor Statistics
      <a
        href="https://www.bls.gov/ooh/"
        target="_blank"
        rel="noopener noreferrer"
        class="text-blue-700 underline hover:text-blue-800">Occupational Outlook Handbook</a
      >.
    </p>
  </div>
</section>

<section class="bg-white px-6 py-16 lg:px-12 lg:py-20">
  <div class="mx-auto max-w-[1100px]">
    <div class="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
      {#each industries as industry, i}
        {@const Icon = iconMap[industry.iconKey as keyof typeof iconMap]}
        <BlurFade delay={0.03 + i * 0.03} once>
          <a
            href="/industries/{industry.slug}"
            class="group flex h-full flex-col rounded-2xl border border-gray-200/80 bg-[#f7fafc] p-6 no-underline transition-all duration-200 hover:border-blue-200 hover:bg-blue-50/30 hover:shadow-sm lg:p-7"
          >
            <div
              class="flex h-10 w-10 items-center justify-center rounded-lg bg-blue-100 text-blue-700 [&_svg]:stroke-blue-700"
            >
              {#if Icon}
                <Icon size={20} />
              {/if}
            </div>
            <h2 class="mt-4 text-base font-medium tracking-tight text-gray-950 lg:text-lg">
              {industry.name}
            </h2>
            <p class="mt-2 flex-1 text-sm leading-relaxed text-gray-600">
              {industry.shortDesc}
            </p>
            <div
              class="mt-6 flex items-center gap-1.5 text-sm font-medium text-blue-700 transition-transform duration-200 group-hover:translate-x-1"
            >
              See sector detail
              <ArrowRight size={14} />
            </div>
          </a>
        </BlurFade>
      {/each}
    </div>
  </div>
</section>

<section class="bg-[#f7fafc] px-6 py-12 lg:px-12 lg:py-16">
  <div class="mx-auto max-w-[1100px] text-center">
    <h2 class="text-[clamp(1.5rem,2.4vw,2rem)] font-medium tracking-tight text-gray-950">
      Pick a sector, get the path.
    </h2>
    <p class="mx-auto mt-3 max-w-[620px] text-sm leading-relaxed text-gray-500">
      PathWorks modules cover universal work-readiness skills and sector-specific paths. Pick your sector, sign up, and
      we surface the curriculum that maps to it.
    </p>
    <div class="mt-7 flex flex-wrap items-center justify-center gap-3">
      <Button href="/signup?role=adult">Sign up</Button>
      <Button href="/demo" variant="outline">Try a sample lesson</Button>
    </div>
  </div>
</section>
