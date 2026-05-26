<script lang="ts">
  import { browser } from '$app/environment';
  import { page } from '$app/stores';
  import { goto } from '$app/navigation';
  import { SvelteURLSearchParams } from 'svelte/reactivity';
  import { resolve } from '$app/paths';
  import { onMount, untrack } from 'svelte';
  import isEmpty from 'lodash/isEmpty';
  import { writable } from 'svelte/store';
  import { fade } from 'svelte/transition';
  import Save from '@lucide/svelte/icons/save';
  import Pencil from '@lucide/svelte/icons/pencil';
  import HistoryIcon from '@lucide/svelte/icons/history';
  import VideoIcon from '@lucide/svelte/icons/video';

  import MODES from '$lib/utils/constants/mode';
  import { profile } from '$lib/utils/store/user';
  import { isOrgStudent } from '$lib/utils/store/app';
  import { currentOrg } from '$lib/utils/store/org';
  import { snackbar } from '$features/ui/snackbar/store';
  import { RefreshPageData } from '$features/ui';
  import LessonVersionHistory from '$features/course/components/lesson/lesson-version-history.svelte';
  import { courseApi, lessonApi } from '$features/course/api';
  import { pathworksApi } from '$features/pathworks/api.svelte';
  import { ContentWarningInterstitial, ModuleOverview, ResumeLessonPrompt } from '$features/pathworks/components';
  import { isHtmlValueEmpty } from '$lib/utils/functions/toHtml';
  import { lessonVideoUpload, lessonDocUpload } from '$features/course/components/lesson/store';
  import { t } from '$lib/utils/functions/translations';
  import { ContentType } from '@cio/utils/constants/content';

  import { IconButton } from '@cio/ui/custom/icon-button';
  import { Button } from '@cio/ui/base/button';
  import { Chip } from '@cio/ui/custom/chip';
  import * as Page from '@cio/ui/base/page';
  import * as UnderlineTabs from '@cio/ui/custom/underline-tabs';
  import { Empty } from '@cio/ui/custom/empty';
  import { Label } from '@cio/ui/base/label';
  import { RoleBasedSecurity } from '$features/ui';

  import {
    ContentNavigationActions,
    LanguageSelector,
    LessonPageEditHeader,
    Comments,
    Note,
    Slide,
    Video,
    Document,
    AddVideoModal,
    AddDocumentModal
  } from '$features/course/components/lesson';

  import type { TLocale } from '@cio/db/types';
  import { orderedTabs, tabs as materialTabs } from '$features/course/components/lesson/constants';
  import { getViewModeComponents } from '$features/course/components/lesson/utils';
  import { loadDraft, clearDraft } from '$features/course/utils/lesson-draft';
  import { lessonVideoBus } from '$features/course/components/lesson/video/lesson-video-bus.svelte';

  interface Props {
    courseId: string;
    lessonId: string;
    forceEdit?: boolean;
  }

  let { courseId, lessonId, forceEdit = false }: Props = $props();

  const mode = $derived(forceEdit || $page.url.searchParams.get('mode') === 'edit' ? MODES.edit : MODES.view);

  let prevModeParam = $state<string | null>(null);
  let isDeletingLesson = $state(false);
  let isVersionDrawerOpen = $state(false);
  // eslint-disable-next-line svelte/prefer-writable-derived -- must be writable: cleared before intentional navigations and bound to UnsavedChanges
  let hasUnsavedChanges = $state(false);

  $effect(() => {
    hasUnsavedChanges = lessonApi.isDirty && mode === MODES.edit;
  });

  const lessonTitle = $derived(lessonApi.lesson?.title || 'Lesson');
  const isLessonUnlocked = $derived(lessonApi.lesson?.isUnlocked ?? false);
  const lessonSlug = $derived(lessonApi.lesson?.slug ?? '');
  const isPublicCourse = $derived(courseApi.course?.type === 'PUBLIC');

  const canEditLesson = $derived(!$isOrgStudent);
  const publishStateLabel = $derived(lessonApi.lesson?.public ? 'Published' : 'Draft');

  function setModeQueryParam(value: (typeof MODES)[keyof typeof MODES]) {
    const params = new SvelteURLSearchParams($page.url.searchParams);
    params.set('mode', value);
    goto(resolve(`${$page.url.pathname}?${params.toString()}`, {}), { replaceState: false });
  }
  function setTabQueryParam(value: string) {
    const params = new SvelteURLSearchParams($page.url.searchParams);
    params.set('tab', value);
    goto(resolve(`${$page.url.pathname}?${params.toString()}`, {}), { replaceState: false });
  }

  async function toggleMode() {
    if (mode === MODES.edit && lessonApi.isDirty) {
      if (timeoutId) clearTimeout(timeoutId);
      timeoutId = undefined;
      await saveLesson();
    }

    hasUnsavedChanges = false;

    if (forceEdit && mode === MODES.edit) {
      await goto(resolve(`/courses/${courseId}/lessons/${lessonId}`, {}));
      return;
    }

    setModeQueryParam(mode === MODES.edit ? MODES.view : MODES.edit);
  }

  const refetchDataAfterVersionRestore = async () => {
    isVersionDrawerOpen = false;
    if (courseId && browser) {
      setModeQueryParam('view');

      // Refetch lesson data after version restore
      lessonApi.isLoading = true;
      await lessonApi.get(courseId, lessonId);

      if (lessonApi.success && lessonApi.lesson) {
        if ($profile.locale) {
          lessonApi.currentLocale = $profile.locale;
        }
      }

      lessonApi.isLoading = false;
    }

    snackbar.success('snackbar.lessons.success.version_restored');
  };

  let tabs = $derived.by(() => {
    if (lessonApi.lesson?.id !== lessonId) return [];
    const ordered = orderedTabs(materialTabs, courseApi.course?.metadata?.lessonTabsOrder);
    const content = lessonApi.translations[lessonId]?.[lessonApi.currentLocale] || '';

    const slideUrl = lessonApi.lesson?.slideUrl || '';
    const videos = lessonApi.lesson?.videos || [];
    const documents = lessonApi.lesson?.documents || [];

    return ordered.map((tab) => {
      if (tab.value === 1) {
        tab.badgeValue = isHtmlValueEmpty(content) ? 0 : 1;
      } else if (tab.value === 2) {
        tab.badgeValue = slideUrl ? 1 : 0;
      } else if (tab.value === 3) {
        tab.badgeValue = !isEmpty(videos) ? videos.length : 0;
      } else if (tab.value === 4) {
        tab.badgeValue = !isEmpty(documents) ? documents.length : 0;
      }

      return tab;
    });
  });

  let currentTabValue = $state('');
  $effect(() => {
    if (!tabs.length || currentTabValue) return;
    const urlTab = $page.url.searchParams.get('tab');
    currentTabValue = urlTab ?? String(tabs[0].value);
  });

  const viewModeComponents = $derived(getViewModeComponents(tabs));

  const isMaterialsEmpty = $derived(tabs.every((tab) => tab.badgeValue === 0));
  const courseContentItems = $derived.by(() => {
    const content = courseApi.course?.content;
    if (!content) return [];

    if (content.grouped) {
      return content.sections.flatMap((section) => section.items);
    }

    return content.items ?? [];
  });
  const lessonItems = $derived(courseContentItems.filter((item) => item.type === ContentType.Lesson));
  const lessonIndex = $derived(
    Math.max(
      0,
      lessonItems.findIndex((item) => item.id === lessonId)
    )
  );
  const lessonCount = $derived(Math.max(lessonItems.length, 1));
  const lessonProgressPercent = $derived(Math.round(((lessonIndex + 1) / lessonCount) * 100));
  const estimatedTime = $derived(lessonApi.lesson?.videos?.[0]?.metadata?.duration ? 'About 10 minutes' : 'Self-paced');
  const whatYouWillLearn = $derived([
    `Review ${lessonTitle}`,
    'Move through the material without autoplay',
    'Pause, leave, and come back without losing your place'
  ]);
  const contentWarning = $derived(
    (lessonApi.lesson as { contentWarning?: string | null } | null)?.contentWarning ?? ''
  );
  const participantProfile = $derived(pathworksApi.participantProfile);
  const savedLastPosition = $derived(Number(pathworksApi.participantProgress?.lastPosition ?? 0));
  const hasLessonVideo = $derived(Boolean(lessonApi.lesson?.videos?.length));
  const shouldShowModuleOverview = $derived(lessonIndex === 0 && !overviewAccepted);
  const shouldShowContentWarning = $derived(
    Boolean(contentWarning) && participantProfile?.prefContentWarnings !== false && !warningDismissed && !contentSkipped
  );
  const shouldShowResumePrompt = $derived(
    mode === MODES.view &&
      $isOrgStudent &&
      lessonApi.lesson &&
      savedLastPosition > 0 &&
      !resumePromptHandled &&
      !contentSkipped
  );
  const resumePositionLabel = $derived(
    hasLessonVideo
      ? `${Math.floor(savedLastPosition / 60)}:${String(savedLastPosition % 60).padStart(2, '0')}`
      : `${Math.min(100, Math.round(savedLastPosition / 100))}% down the page`
  );

  let overviewAccepted = $state(false);
  let warningDismissed = $state(false);
  let contentSkipped = $state(false);
  let resumePromptHandled = $state(false);
  let loadedProgressKey = $state('');

  let timeoutId: NodeJS.Timeout | undefined;

  let isLoading = writable(false);

  function callAI(_type = '') {}

  const getValue = (label: string) => {
    const tabValue = tabs.find((tab) => tab.label === label)?.value;
    return tabValue;
  };

  async function saveOrUpdateTranslation(locale: TLocale, lessonId: string) {
    const content = lessonApi.translations[lessonId]?.[locale] || '';

    if (!courseApi.course?.id) return;

    // Use API to upsert lesson language (creates if doesn't exist, updates if exists)
    await lessonApi.upsertLanguage(courseApi.course.id, lessonId, locale, content);
  }

  function hasLessonNoteContent(targetLessonId: string) {
    const rawNote = lessonApi.lesson?.note;
    const hasLegacyNote = typeof rawNote === 'string' && rawNote.trim().length > 0;
    if (hasLegacyNote) return true;

    const translations = Object.values(lessonApi.translations[targetLessonId] || {});
    return translations.some((content) => typeof content === 'string' && !isHtmlValueEmpty(content));
  }

  function patchLessonListItemLocally() {
    if (!lessonApi.lesson) return;

    courseApi.updateContentItem(lessonApi.lesson.id, ContentType.Lesson, {
      title: lessonApi.lesson.title ?? '',
      isUnlocked: lessonApi.lesson.isUnlocked ?? null,
      hasNoteContent: hasLessonNoteContent(lessonApi.lesson.id),
      hasSlideContent: Boolean(lessonApi.lesson.slideUrl?.trim()),
      videosCount: Array.isArray(lessonApi.lesson.videos) ? lessonApi.lesson.videos.length : 0,
      documentsCount: Array.isArray(lessonApi.lesson.documents) ? lessonApi.lesson.documents.length : 0,
      isPublished: lessonApi.lesson.public ?? false
    });
  }

  async function saveLesson() {
    if (!lessonApi.lesson) return false;

    const [isLessonUpdated] = await Promise.all([
      lessonApi.update(courseApi.course?.id || '', lessonId, {
        title: lessonApi.lesson.title || undefined,
        isUnlocked: lessonApi.lesson.isUnlocked ?? undefined,
        slideUrl: lessonApi.lesson.slideUrl || undefined,
        videos: lessonApi.lesson.videos || [],
        documents: lessonApi.lesson.documents || [],
        public: lessonApi.lesson.public ?? false,
        contentWarning: lessonApi.lesson.contentWarning || undefined,
        slug: isPublicCourse && lessonApi.lesson.slug ? lessonApi.lesson.slug : undefined
      }),
      saveOrUpdateTranslation(lessonApi.currentLocale, lessonId)
    ]);

    if (isLessonUpdated) {
      patchLessonListItemLocally();
      clearDraft(lessonId, lessonApi.currentLocale);
      lessonApi.isDirty = false;
    }
  }

  function handleLessonTitleChange(value: string) {
    lessonApi.updateLessonState('title', value);
  }

  function handleLessonSlugChange(value: string) {
    lessonApi.updateLessonState('slug', value);
  }

  function handleContentWarningChange(value: string) {
    lessonApi.updateLessonState('contentWarning', value);
  }

  function handlePublishChange(checked: boolean) {
    lessonApi.updateLessonState('public', checked);
  }

  function handleToggleLessonLock() {
    const currentValue = lessonApi.lesson?.isUnlocked ?? false;
    lessonApi.updateLessonState('isUnlocked', !currentValue);
  }

  async function handleDeleteLesson() {
    if (!courseId || !lessonId || isDeletingLesson) return;

    isDeletingLesson = true;
    await lessonApi.delete(courseId, lessonId);

    if (lessonApi.success) {
      hasUnsavedChanges = false;
      await goto(resolve(`/courses/${courseId}/lessons`, {}));
    }

    isDeletingLesson = false;
  }

  function handleSave(prevMode: string) {
    untrack(() => {
      if (prevMode === MODES.edit) {
        if (timeoutId) clearTimeout(timeoutId);
        timeoutId = undefined;
        saveLesson();
      }
    });
  }

  function autoSave() {
    if (mode === MODES.view) return;
    if (!lessonApi.isDirty) return;

    if (timeoutId) clearTimeout(timeoutId);

    untrack(() => {
      timeoutId = setTimeout(async () => {
        await saveLesson();
      }, 2000);
    });
  }

  const triggerAutoSave = () => {
    if (!lessonApi.lesson) return;

    autoSave();
  };

  // Check for an unsaved localStorage draft when the lesson first loads.
  let draftCheckedForLesson = '';
  $effect(() => {
    if (!browser) return;
    if (!lessonApi.lesson || !lessonId) return;
    if (draftCheckedForLesson === lessonId) return;
    draftCheckedForLesson = lessonId;

    const draft = loadDraft(lessonId, lessonApi.currentLocale);
    if (!draft) return;

    const serverContent = lessonApi.translations[lessonId]?.[lessonApi.currentLocale] || '';
    if (draft.content === serverContent) {
      clearDraft(lessonId, lessonApi.currentLocale);
      return;
    }

    if (!lessonApi.translations[lessonId]) {
      lessonApi.translations[lessonId] = {} as Record<TLocale, string>;
    }
    lessonApi.translations[lessonId][lessonApi.currentLocale] = draft.content;
    lessonApi.isDirty = true;
  });

  $effect(() => {
    if (!lessonId) return;
    overviewAccepted = false;
    warningDismissed = false;
    contentSkipped = false;
    resumePromptHandled = false;
    loadedProgressKey = '';
    lessonVideoBus.setResumeSeconds(0);
  });

  $effect(() => {
    if (!$isOrgStudent || !courseId || !lessonId) return;
    const progressKey = `${courseId}:${lessonId}`;
    if (loadedProgressKey === progressKey) return;

    loadedProgressKey = progressKey;
    void pathworksApi.getParticipantProfile();
    void pathworksApi.getParticipantProgress(courseId, lessonId);
  });

  function getCurrentLessonPosition() {
    if (!browser) return 0;

    if (hasLessonVideo && lessonVideoBus.currentTimeSeconds > 0) {
      return Math.round(lessonVideoBus.currentTimeSeconds);
    }

    const maxScroll = document.documentElement.scrollHeight - window.innerHeight;
    if (maxScroll <= 0) return 0;

    return Math.max(0, Math.min(10000, Math.round((window.scrollY / maxScroll) * 10000)));
  }

  function saveParticipantProgress(status: 'in_progress' | 'completed', lastPosition = getCurrentLessonPosition()) {
    if (!$isOrgStudent || !courseId || !lessonId) return;

    pathworksApi.saveParticipantProgress({
      courseId,
      lessonId,
      status,
      lastPosition
    });
  }

  function resumeLesson() {
    resumePromptHandled = true;

    if (hasLessonVideo) {
      lessonVideoBus.setResumeSeconds(savedLastPosition);
      lessonVideoBus.seek(savedLastPosition);
    } else if (browser) {
      window.requestAnimationFrame(() => {
        const maxScroll = document.documentElement.scrollHeight - window.innerHeight;
        window.scrollTo({ top: Math.max(0, (savedLastPosition / 10000) * maxScroll), behavior: 'smooth' });
      });
    }

    saveParticipantProgress('in_progress', savedLastPosition);
  }

  function startLessonOver() {
    resumePromptHandled = true;
    lessonVideoBus.setResumeSeconds(0);

    if (browser) {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }

    saveParticipantProgress('in_progress', 0);
  }

  function skipLesson() {
    contentSkipped = true;
    saveParticipantProgress('completed');
  }

  onMount(() => {
    if (!browser) return;

    let scrollSaveTimer: ReturnType<typeof setTimeout> | undefined;
    const handleBlur = () => saveParticipantProgress('in_progress');
    const handleScroll = () => {
      if (mode !== MODES.view || !$isOrgStudent || hasLessonVideo) return;
      if (scrollSaveTimer) clearTimeout(scrollSaveTimer);
      scrollSaveTimer = setTimeout(() => saveParticipantProgress('in_progress'), 800);
    };

    window.addEventListener('blur', handleBlur);
    window.addEventListener('scroll', handleScroll, { passive: true });

    return () => {
      if (scrollSaveTimer) clearTimeout(scrollSaveTimer);
      handleBlur();
      window.removeEventListener('blur', handleBlur);
      window.removeEventListener('scroll', handleScroll);
    };
  });

  // Only autosave after real edits, not on every reactive update.
  $effect(() => {
    if (mode !== MODES.edit) return;
    if (!lessonApi.lesson || !lessonId) return;
    if (!lessonApi.isDirty) return;
    if ($isLoading) return;

    autoSave();
  });

  // Only save once when leaving edit mode (e.g. Save button or browser back).
  let didHandleExitEdit = false;
  $effect(() => {
    if (!lessonId) return;

    const currentParam = $page.url.searchParams.get('mode');
    const prev = prevModeParam;
    prevModeParam = currentParam;

    const isExitEdit = prev === 'edit' && currentParam !== 'edit';

    if (!isExitEdit) {
      didHandleExitEdit = false;
      return;
    }

    if (didHandleExitEdit) return;
    didHandleExitEdit = true;

    handleSave(MODES.edit);
  });
</script>

<AddVideoModal
  {lessonId}
  onClose={() => {
    if ($lessonVideoUpload.isUploading) return;

    $lessonVideoUpload.isModalOpen = false;

    triggerAutoSave();
  }}
/>

<AddDocumentModal
  {lessonId}
  onClose={() => {
    if ($lessonDocUpload.isUploading) return;

    $lessonDocUpload.isModalOpen = false;
    $lessonDocUpload.error = null;

    triggerAutoSave();
  }}
/>

<Page.Header>
  <Page.HeaderContent>
    <LessonPageEditHeader
      {mode}
      title={lessonTitle}
      isUnlocked={isLessonUnlocked}
      {isDeletingLesson}
      onTitleChange={handleLessonTitleChange}
      onToggleLock={handleToggleLessonLock}
      onDeleteLesson={handleDeleteLesson}
      slug={lessonSlug}
      showSlugEditor={isPublicCourse}
      slugError={lessonApi.errors.slug}
      onSlugChange={handleLessonSlugChange}
    />
  </Page.HeaderContent>
  <Page.Action>
    <div class="flex items-center gap-2">
      {#if mode === MODES.view && $isOrgStudent}
        <ContentNavigationActions {lessonId} {courseId} />
      {/if}

      <RoleBasedSecurity allowedRoles={[1, 2]}>
        {#if mode === MODES.edit && window.innerWidth >= 1024}
          <IconButton onclick={() => (isVersionDrawerOpen = true)}>
            <HistoryIcon size={20} />
          </IconButton>
        {/if}

        <div class="flex flex-row items-center gap-2 lg:flex">
          {#if mode === MODES.edit}
            <span class="ui:text-muted-foreground text-sm" aria-live="polite">
              {#if lessonApi.isSaving}
                {$t('course.navItem.lessons.saving')}
              {:else if !lessonApi.isDirty}
                {$t('course.navItem.lessons.saved')}
              {/if}
            </span>
          {/if}
          <IconButton onclick={toggleMode} disabled={lessonApi.isSaving}>
            {#if mode === MODES.edit}
              <Save size={20} />
            {:else}
              <Pencil size={20} />
            {/if}
          </IconButton>
        </div>

        <RefreshPageData onRefresh={() => lessonApi.get(courseId, lessonId)} />
      </RoleBasedSecurity>

      <LanguageSelector />
    </div>
  </Page.Action>
</Page.Header>

<Page.Body>
  {#snippet child()}
    <div class={`overflow-x-hidden py-6 ${mode === MODES.edit ? 'lg:w-full xl:w-11/12' : 'mx-auto w-full max-w-3xl'}`}>
      {#if mode === MODES.edit && !canEditLesson}
        <Empty
          title="Lesson editor unavailable"
          description="Only PathWorks operators and administrators can edit lessons."
          icon={Pencil}
          variant="page"
          class="text-center"
        />
      {:else if mode === MODES.view && $isOrgStudent}
        <div
          class="sticky top-0 z-10 mb-6 rounded-lg border border-slate-200 bg-white/95 p-4 shadow-sm backdrop-blur dark:border-slate-700 dark:bg-slate-950/95"
        >
          <div
            class="mb-2 flex items-center justify-between gap-3 text-sm font-medium text-slate-800 dark:text-slate-100"
          >
            <span>Lesson {lessonIndex + 1} of {lessonCount}</span>
            <span>{lessonProgressPercent}%</span>
          </div>
          <div class="h-2 overflow-hidden rounded-full bg-slate-200 dark:bg-slate-800" aria-hidden="true">
            <div
              class="h-full bg-[linear-gradient(135deg,#1A5AD7_0%,#00F5A0_100%)]"
              style={`width: ${lessonProgressPercent}%;`}
            ></div>
          </div>
        </div>
      {/if}

      {#if $isOrgStudent && lessonApi.lesson && !isLessonUnlocked}
        <Empty
          title={$t('course.navItem.lessons.content_locked_title')}
          description={$t('course.navItem.lessons.content_locked_description')}
          icon={VideoIcon}
          variant="page"
          class="text-center"
        />
      {:else if mode === MODES.view && $isOrgStudent && lessonApi.lesson && shouldShowModuleOverview}
        <ModuleOverview
          title={lessonTitle}
          description={courseApi.course?.description ??
            'Take this lesson at your own pace. You can pause and return anytime.'}
          {estimatedTime}
          {lessonCount}
          {whatYouWillLearn}
          onStart={() => {
            overviewAccepted = true;
            saveParticipantProgress('in_progress');
          }}
        />
      {:else if shouldShowContentWarning}
        <ContentWarningInterstitial
          warning={contentWarning}
          onContinue={() => (warningDismissed = true)}
          onSkip={skipLesson}
        />
      {:else if shouldShowResumePrompt}
        <ResumeLessonPrompt label={resumePositionLabel} onResume={resumeLesson} onStartOver={startLessonOver} />
      {:else if contentSkipped}
        <section
          class="rounded-lg border border-slate-200 bg-white p-6 text-slate-800 shadow-sm dark:border-slate-700 dark:bg-slate-950 dark:text-slate-200"
        >
          <h2 class="text-xl font-semibold tracking-normal">Lesson skipped</h2>
          <p class="mt-2">This lesson was marked complete. You can return to it later if you want.</p>
        </section>
      {:else if mode === MODES.edit && canEditLesson}
        <section
          class="mb-6 rounded-lg border border-slate-200 bg-white p-4 shadow-sm dark:border-slate-700 dark:bg-slate-950"
        >
          <div class="flex flex-col gap-4 md:flex-row md:items-start md:justify-between">
            <div class="flex-1">
              <Label for="lesson-content-warning">Content warning</Label>
              <textarea
                id="lesson-content-warning"
                class="mt-2 min-h-24 w-full rounded-md border border-slate-300 bg-white px-3 py-2 text-sm text-slate-900 shadow-sm focus:border-slate-500 focus:outline-none dark:border-slate-700 dark:bg-slate-900 dark:text-slate-100"
                value={lessonApi.lesson?.contentWarning ?? ''}
                oninput={(event) => handleContentWarningChange(event.currentTarget.value)}
                placeholder="Optional note shown before participants open this lesson"
              ></textarea>
            </div>
            <div class="min-w-48 rounded-md border border-slate-200 p-3 dark:border-slate-700">
              <Label for="lesson-publish-toggle">Publish state</Label>
              <label
                class="mt-3 flex cursor-pointer items-center gap-3 text-sm font-medium"
                for="lesson-publish-toggle"
              >
                <input
                  id="lesson-publish-toggle"
                  type="checkbox"
                  class="size-4 rounded border-slate-300"
                  checked={lessonApi.lesson?.public ?? false}
                  onchange={(event) => handlePublishChange(event.currentTarget.checked)}
                />
                {publishStateLabel}
              </label>
            </div>
          </div>
        </section>

        <UnderlineTabs.Root
          bind:value={currentTabValue}
          onValueChange={(e) => {
            setTabQueryParam(e);
          }}
        >
          <!-- Tabs List -->
          <UnderlineTabs.List>
            {#each tabs as tab (tab.value)}
              <UnderlineTabs.Trigger value={String(tab.value)}>
                {#if tab.icon}
                  <tab.icon size={16} />
                {/if}
                {$t(tab.label)}
                {#if typeof tab.badgeValue === 'number' && tab.badgeValue > 0}
                  <Chip value={`${tab.badgeValue}`} className="ml-1" />
                {/if}
              </UnderlineTabs.Trigger>
            {/each}
          </UnderlineTabs.List>
          <!-- End Tabs List -->

          <!-- Note Tab -->
          <UnderlineTabs.Content value={String(getValue('course.navItem.lessons.materials.tabs.note.title') || '')}>
            <Note {mode} {lessonId} {isLoading} {callAI} />
          </UnderlineTabs.Content>
          <!-- End Note Tab -->

          <!-- Slide Tab -->
          <UnderlineTabs.Content value={String(getValue('course.navItem.lessons.materials.tabs.slide.title') || '')}>
            <Slide {mode} />
          </UnderlineTabs.Content>
          <!-- End Slide Tab -->

          <!-- Video Tab -->
          <UnderlineTabs.Content value={String(getValue('course.navItem.lessons.materials.tabs.video.title') || '')}>
            <Video {mode} />
          </UnderlineTabs.Content>
          <!-- End Video Tab -->

          <!-- Document Tab -->
          <UnderlineTabs.Content value={String(getValue('course.navItem.lessons.materials.tabs.document.title') || '')}>
            <Document {mode} />
          </UnderlineTabs.Content>
          <!-- End Document Tab -->
        </UnderlineTabs.Root>
      {:else if lessonApi.lesson && !isMaterialsEmpty}
        {#key lessonId}
          <div class="mb-20 flex w-full flex-col gap-2" in:fade={{ delay: 500 }} out:fade>
            {#each viewModeComponents as Component, index (index)}
              <Component {mode} {lessonId} />
            {/each}

            {#if $currentOrg.customization?.apps?.comments}
              <hr class="my-2" />

              <Comments {lessonId} />
            {/if}
          </div>
        {/key}
      {:else}
        <Empty
          title={$t('course.navItem.lessons.materials.body_heading')}
          description={$t('course.navItem.lessons.materials.body_content') +
            ' ' +
            $t('course.navItem.lessons.materials.get_started') +
            ' ' +
            $t('course.navItem.lessons.materials.button') +
            '.'}
          icon={VideoIcon}
          variant="page"
          class="text-center"
        >
          {#if !$isOrgStudent}
            <Button onclick={toggleMode}>
              {$t('course.navItem.lessons.materials.get_started')}
            </Button>
          {/if}
        </Empty>
      {/if}
    </div>
  {/snippet}
</Page.Body>

{#if isVersionDrawerOpen && window.innerWidth >= 1024}
  <LessonVersionHistory
    open={isVersionDrawerOpen}
    on:close={() => (isVersionDrawerOpen = false)}
    on:restore={refetchDataAfterVersionRestore}
  />
{/if}
