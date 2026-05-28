import type { MetaTagsProps } from 'svelte-meta-tags';

export const prerender = true;

export async function load({ url }) {
  return {
    baseMetaTags: getBaseMetaTags(url),
    url: url.pathname
  };
}

function getBaseMetaTags(url: URL) {
  const metatags = Object.freeze({
    title: 'PathWorks | Work Readiness Training That Meets You Where You Are',
    description:
      'Online work-readiness training built around the learner. For students, adults, and the counselors and advisors who support them.',
    canonical: new URL(url.pathname, url.origin).href,
    openGraph: {
      type: 'website',
      url: new URL(url.pathname, url.origin).href,
      locale: 'en_US',
      title: 'PathWorks | Work Readiness Training That Meets You Where You Are',
      description:
        'Online work-readiness training built around the learner. For students, adults, and the counselors and advisors who support them.',
      siteName: 'PathWorks',
      images: [
        {
          url: '/pathworks-og.png',
          alt: 'PathWorks preview image',
          width: 1920,
          height: 1080,
          secureUrl: '/pathworks-og.png',
          type: 'image/jpeg'
        }
      ]
    },
    twitter: {
      handle: '@neur3dev',
      site: '@neur3dev',
      cardType: 'summary_large_image' as const,
      title: 'PathWorks | Work Readiness Training That Meets You Where You Are',
      description:
        'Online work-readiness training built around the learner. For students, adults, and the counselors and advisors who support them.',
      image: '/pathworks-og.png',
      imageAlt: 'PathWorks preview image'
    }
  }) satisfies MetaTagsProps;

  return metatags;
}
