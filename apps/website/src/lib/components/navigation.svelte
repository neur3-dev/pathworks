<script lang="ts">
  import ChevronDown from '@lucide/svelte/icons/chevron-down';
  import ClipboardList from '@lucide/svelte/icons/clipboard-list';
  import Gamepad from '@lucide/svelte/icons/gamepad';
  import Heart from '@lucide/svelte/icons/heart';
  import Hourglass from '@lucide/svelte/icons/hourglass';
  import LoaderCircle from '@lucide/svelte/icons/loader-circle';
  import Menu from '@lucide/svelte/icons/menu';
  import MousePointerClick from '@lucide/svelte/icons/mouse-pointer-click';
  import Sparkles from '@lucide/svelte/icons/sparkles';
  import Timer from '@lucide/svelte/icons/timer';
  import X from '@lucide/svelte/icons/x';
  import { page } from '$app/state';
  import { fly } from 'svelte/transition';
  import type { HTMLAttributes } from 'svelte/elements';
  import * as NavigationMenu from '@cio/ui/base/navigation-menu';
  import { cn } from '@cio/ui/tools';

  type ListItemProps = HTMLAttributes<HTMLAnchorElement> & {
    title: string;
    href: string;
    subtitle: string;
    key: string;
  };

  type NavCollectionItem = {
    key: string;
    title: string;
    subtitle: string;
    href: string;
  };

  type NavItem = {
    key: string;
    title: string;
    href?: string;
    items?: NavCollectionItem[];
  };

  let expandedMobileGroup = $state<string | null>(null);
  let showSolutions = $state(false);
  let activeLink = $derived(page.url.pathname);

  function handleMobileGroupToggle(groupKey: string) {
    expandedMobileGroup = expandedMobileGroup === groupKey ? null : groupKey;
  }

  function handleShowSolutions() {
    showSolutions = !showSolutions;

    if (!showSolutions) {
      expandedMobileGroup = null;
    }
  }

  function closeMobileMenu() {
    showSolutions = false;
    expandedMobileGroup = null;
  }

  const audiences: NavCollectionItem[] = [
    {
      key: 'for-counselors',
      title: 'For Counselors',
      subtitle: 'WIOA-aligned reporting for your caseload.',
      href: '/for-counselors'
    },
    {
      key: 'for-parents',
      title: 'For Parents',
      subtitle: 'Set up your student. Watch them grow.',
      href: '/for-parents'
    },
    {
      key: 'for-participants',
      title: 'For Participants',
      subtitle: 'Work skills, at your own pace.',
      href: '/for-participants'
    }
  ];

  const freeTools: NavCollectionItem[] = [
    {
      key: 'progress',
      title: 'Progress Tracker',
      subtitle: 'Monitor learning journeys.',
      href: '/tools/progress'
    },
    {
      key: 'pomodoro',
      title: 'Pomodoro Timer',
      subtitle: 'Boost focus and productivity.',
      href: '/tools/pomodoro'
    },
    {
      key: 'name-picker',
      title: 'Name Picker',
      subtitle: 'Randomly select names.',
      href: '/tools/name-picker'
    },
    {
      key: 'stopwatch',
      title: 'Activity Stopwatch',
      subtitle: 'Track time accurately.',
      href: '/tools/stopwatch'
    },
    {
      key: 'tic-tac-toe',
      title: 'Tic Tac Toe',
      subtitle: 'Play the classic game.',
      href: '/tools/tic-tac-toe'
    }
  ];

  const navItems: NavItem[] = [
    {
      key: 'audiences',
      title: 'Who PathWorks is for',
      href: '/',
      items: audiences
    },
    {
      key: 'free-tools',
      title: 'Free Tools',
      href: '/tools',
      items: freeTools
    },
    {
      key: 'pricing',
      title: 'Pricing',
      href: '/pricing'
    }
  ];

  let isAudiencesActive = $derived(!!audiences.some((a) => activeLink.startsWith(a.href)));
  let isFreeToolsActive = $derived(activeLink.startsWith('/tools'));

  function isNavItemActive(navItem: NavItem) {
    if (navItem.key === 'audiences') {
      return isAudiencesActive;
    }

    if (navItem.key === 'free-tools') {
      return isFreeToolsActive;
    }

    return navItem.href ? activeLink.startsWith(navItem.href) : false;
  }
</script>

{#snippet list_item({ title, subtitle, href, key, class: className, ...restProps }: ListItemProps)}
  <li>
    <NavigationMenu.Link>
      {#snippet child()}
        <a
          {href}
          class="flex w-full flex-row items-center rounded-lg p-2 no-underline transition-colors duration-200 hover:bg-gray-100 focus:bg-gray-100 focus:outline-none {className} [&_svg]:stroke-blue-600"
          {...restProps}
        >
          <div class="shrink-0">
            {#if key === 'for-counselors'}
              <ClipboardList size={24} />
            {:else if key === 'for-parents'}
              <Heart size={24} />
            {:else if key === 'for-participants'}
              <Sparkles size={24} />
            {:else if key === 'progress'}
              <LoaderCircle size={24} />
            {:else if key === 'pomodoro'}
              <Hourglass size={24} />
            {:else if key === 'name-picker'}
              <MousePointerClick size={24} />
            {:else if key === 'stopwatch'}
              <Timer size={24} />
            {:else if key === 'tic-tac-toe'}
              <Gamepad size={24} />
            {/if}
          </div>
          <div class="ml-3 text-start">
            <p class="text-sm">
              {title}
            </p>
            <p class="ui:text-muted-foreground mt-1 text-xs">
              {subtitle}
            </p>
          </div>
        </a>
      {/snippet}
    </NavigationMenu.Link>
  </li>
{/snippet}

<section class="fixed top-0 z-50 w-full border-b bg-white">
  <div class="mx-auto flex w-full items-center justify-between gap-20 px-4 py-1 lg:w-[90%] lg:px-0">
    <a href="/" class="w-[10%]">
      <div class="flex w-full items-center">
        <img loading="lazy" width="28" height="28" src="/logo-512.png" alt="PathWorks logo" class="w-7" />
        <h1 class="ml-2 text-base font-medium">PathWorks</h1>
      </div>
    </a>

    <section class="hidden! lg:block!">
      <NavigationMenu.Root class="p-1">
        <NavigationMenu.List class="flex w-full items-center justify-center gap-1">
          {#each navItems as navItem}
            <NavigationMenu.Item>
              {#if navItem.items}
                <NavigationMenu.Trigger
                  class={cn(
                    'flex cursor-pointer items-center rounded-md px-4 py-2 text-sm font-medium text-gray-800 transition-all duration-200 hover:bg-gray-100 data-[state=open]:bg-gray-100',
                    isNavItemActive(navItem) && 'bg-gray-100!'
                  )}
                >
                  <a href={navItem.href} class="no-underline">{navItem.title}</a>
                </NavigationMenu.Trigger>
                <NavigationMenu.Content>
                  <ul class="grid w-[560px] grid-cols-2 gap-2 p-2">
                    {#each navItem.items as item}
                      {@render list_item({
                        href: item.href,
                        title: item.title,
                        subtitle: item.subtitle,
                        key: item.key
                      })}
                    {/each}
                  </ul>
                </NavigationMenu.Content>
              {:else}
                <NavigationMenu.Link>
                  {#snippet child()}
                    <a
                      href={navItem.href}
                      class={cn(
                        'cursor-pointer rounded-md px-4 py-2 text-sm font-medium text-gray-800 no-underline transition-all duration-200 hover:bg-gray-100',
                        isNavItemActive(navItem) && 'bg-gray-100'
                      )}
                    >
                      {navItem.title}
                    </a>
                  {/snippet}
                </NavigationMenu.Link>
              {/if}
            </NavigationMenu.Item>
          {/each}
        </NavigationMenu.List>
      </NavigationMenu.Root>
    </section>

    <div class="hidden! flex-row items-center justify-between gap-3 lg:flex!">
      <a
        class="text-sm font-medium transition-opacity duration-200 after:ml-2 after:content-['→'] hover:opacity-80"
        href="/signup"
      >
        Dashboard
      </a>
    </div>

    <button type="button" aria-label="Hamburger Menu" class="shrink-0 lg:hidden!" onclick={handleShowSolutions}>
      <Menu size={24} />
    </button>

    {#if showSolutions}
      <div
        in:fly={{ x: 20, duration: 700 }}
        out:fly={{ x: 20, duration: 400 }}
        class="absolute top-0 right-0 h-screen w-[60%] border-2 bg-white px-3 pt-3 pb-2 sm:block md:w-[40%] md:p-7 lg:hidden"
      >
        <div class="mb-5 flex justify-between py-2">
          <img loading="lazy" width="20" height="20" src="/logo-512.png" alt="PathWorks logo" class="w-[15%]" />
          <button class="mr-5" onclick={handleShowSolutions}>
            <X size={24} />
          </button>
        </div>
        <nav>
          <ul class="flex w-full flex-col items-center justify-between lg:flex-row">
            {#each navItems as navItem}
              <li class="w-full cursor-pointer text-sm font-semibold text-gray-800 md:text-lg">
                {#if navItem.items}
                  <button
                    class={cn(
                      'flex w-full items-center justify-between rounded-lg px-4 py-3 transition-all duration-200 hover:bg-gray-100',
                      isNavItemActive(navItem) && 'bg-gray-100'
                    )}
                    onclick={() => {
                      handleMobileGroupToggle(navItem.key);
                    }}
                  >
                    {navItem.title}
                    <ChevronDown />
                  </button>
                  {#if expandedMobileGroup === navItem.key}
                    <div in:fly={{ y: -20, duration: 700 }} out:fly={{ y: 20, duration: 400 }}>
                      {#each navItem.items as item}
                        <a href={item.href} onclick={closeMobileMenu}>
                          <p
                            class="rounded-lg py-2.5 pl-5 text-xs font-normal text-gray-700 transition-colors duration-200 hover:bg-gray-100"
                          >
                            {item.title}
                          </p>
                        </a>
                      {/each}
                    </div>
                  {/if}
                {:else}
                  <a
                    class={cn(
                      'block w-full rounded-md px-4 py-3 text-sm font-semibold text-gray-800 transition-all duration-200 hover:bg-gray-100 md:text-lg',
                      isNavItemActive(navItem) && 'bg-gray-100'
                    )}
                    onclick={closeMobileMenu}
                    href={navItem.href}
                  >
                    {navItem.title}
                  </a>
                {/if}
              </li>
            {/each}
          </ul>
        </nav>
        <div class="mt-5 flex flex-col items-start gap-y-2 border-t pt-5">
          <a
            class="w-full rounded-md px-4 py-4 text-left text-sm font-semibold transition-all duration-200 after:ml-2 after:content-['→'] hover:bg-gray-100 md:text-lg"
            href="/signup"
          >
            Dashboard
          </a>
        </div>
      </div>
    {/if}
  </div>
</section>

<style>
  .active {
    background-color: #f3f4f6;
    border-radius: 6px;
  }
</style>
