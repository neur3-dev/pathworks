import type { MetaTagsProps } from 'svelte-meta-tags';

export const prerender = true;

export async function load({ url }) {
  const stars = await getStars();

  return {
    baseMetaTags: getBaseMetaTags(url),
    url: url.pathname,
    stars
  };
}

const starsCache = new Map<string, { stars: number; lastUpdated: number }>();
const CACHE_TIME = 1000 * 60 * 60 * 48; // 48 hours
const CACHE_KEY = 'github-stars';

async function getStars() {
  const now = Date.now();

  const cacheData = starsCache.get(CACHE_KEY);
  if (cacheData && now - cacheData.lastUpdated < CACHE_TIME) {
    console.log('Returning cached stars');
    return cacheData.stars;
  }

  console.log('Fetching stars from GitHub');

  let stars = 0;

  try {
    const response = await fetch('https://api.github.com/repos/neur3-dev/pathworks');
    const data = await response.json();
    stars = data?.stargazers_count || 0;
  } catch (error) {
    console.log('error fetching stars', error);
  }

  starsCache.set(CACHE_KEY, { stars, lastUpdated: now });

  return stars;
}

function getBaseMetaTags(url: URL) {
  const metatags = Object.freeze({
    title: 'PathWorks | Work Readiness Learning for VR Participants',
    description:
      'A vocational rehabilitation learning platform for building work readiness skills at a participant-friendly pace.',
    canonical: new URL(url.pathname, url.origin).href,
    openGraph: {
      type: 'website',
      url: new URL(url.pathname, url.origin).href,
      locale: 'en_IE',
      title: 'PathWorks | Work Readiness Learning for VR Participants',
      description:
        'A vocational rehabilitation learning platform for building work readiness skills at a participant-friendly pace.',
      siteName: 'PathWorks',
      images: [
        {
          url: 'https://brand.cdn.clsrio.com/og/pathworks-og.png',
          alt: 'PathWorks preview image',
          width: 1920,
          height: 1080,
          secureUrl: 'https://brand.cdn.clsrio.com/og/pathworks-og.png',
          type: 'image/jpeg'
        }
      ]
    },
    twitter: {
      handle: '@neur3dev',
      site: '@neur3dev',
      cardType: 'summary_large_image' as const,
      title: 'PathWorks | Work Readiness Learning for VR Participants',
      description:
        'A vocational rehabilitation learning platform for building work readiness skills at a participant-friendly pace.',
      image: 'https://brand.cdn.clsrio.com/og/pathworks-og.png',
      imageAlt: 'PathWorks preview image'
    }
  }) satisfies MetaTagsProps;

  return metatags;
}
