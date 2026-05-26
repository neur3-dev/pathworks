import { redirect } from '@sveltejs/kit';

export const prerender = false;

export const load = async () => {
  redirect(307, 'https://www.producthunt.com/posts/pathworks-2');
};
