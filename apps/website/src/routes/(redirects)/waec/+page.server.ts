import { redirect } from '@sveltejs/kit';

export const prerender = false;

export const load = async () => {
  redirect(307, 'https://form.pathworks.neur3.dev/f/1v25DtmN');
};
