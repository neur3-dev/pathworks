import { error } from '@sveltejs/kit';
import { getIndustryBySlug, industries } from '$lib/utils/constants/industries';

export const prerender = true;

export function entries() {
  return industries.map((i) => ({ slug: i.slug }));
}

export function load({ params }) {
  const industry = getIndustryBySlug(params.slug);

  if (!industry) {
    error(404, `Industry "${params.slug}" not found`);
  }

  return { industry };
}
