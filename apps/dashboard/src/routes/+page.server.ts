import { pathworks, type InferResponseType } from '$lib/utils/services/api';
import { safeServerApi } from '$lib/utils/services/api/server';
import { redirect } from '@sveltejs/kit';

type GetPublicCoursesRequest = typeof pathworks.organization.courses.public.$get;
type GetPublicCoursesSuccess = Extract<InferResponseType<GetPublicCoursesRequest>, { success: true }>;

export const load = async ({ parent, url }) => {
  const { isOrgSite, orgSiteName, org, locals } = await parent();
  const isLocalAccess = url.hostname === 'localhost' || /^\d{1,3}(\.\d{1,3}){3}$/.test(url.hostname);

  if (!locals?.user && !isOrgSite && isLocalAccess) {
    redirect(303, '/login');
  }

  if (!isOrgSite || !org) {
    return {
      isOrgSite: false as const,
      org: null,
      orgSiteName: '',
      courses: [],
      hasMoreCourses: false
    };
  }

  const siteName = orgSiteName || org.siteName;
  if (!siteName) {
    return {
      isOrgSite: true as const,
      org,
      orgSiteName,
      courses: [],
      hasMoreCourses: false
    };
  }

  const coursesResult = await safeServerApi<GetPublicCoursesSuccess>(() =>
    pathworks.organization.courses.public.$get({
      query: { siteName }
    })
  );

  const courseData = coursesResult.ok ? coursesResult.body.data : { courses: [], hasMoreCourses: false };

  return {
    isOrgSite: true as const,
    org,
    orgSiteName,
    courses: courseData.courses,
    hasMoreCourses: courseData.hasMoreCourses
  };
};
