import { env } from '$env/dynamic/public';

/**
 * Origin of the PathWorks dashboard / app (sign-in, signup, account).
 *
 * The marketing site is served from the apex (e.g. pathworkslearning.com);
 * the dashboard app lives on its own subdomain. Override at build time with
 * PUBLIC_DASHBOARD_URL; defaults to the production app subdomain.
 */
export const DASHBOARD_URL = (env.PUBLIC_DASHBOARD_URL || 'https://app.pathworkslearning.com').replace(/\/+$/, '');

/** Build an absolute URL into the dashboard app, e.g. dashboardUrl('/login'). */
export function dashboardUrl(path = ''): string {
  const suffix = path ? (path.startsWith('/') ? path : `/${path}`) : '';

  return `${DASHBOARD_URL}${suffix}`;
}
