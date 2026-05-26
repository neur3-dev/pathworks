import { pathworks, getApiHeaders, type InferResponseType } from '$lib/utils/services/api';
import { safeServerApi } from '$lib/utils/services/api/server';

type GetOrganizationCoursesRequest = typeof pathworks.organization.courses.$get;
type GetOrganizationCoursesSuccess = Extract<InferResponseType<GetOrganizationCoursesRequest>, { success: true }>;

type GetProgramsRequest = typeof pathworks.program.$get;
type GetProgramsSuccess = Extract<InferResponseType<GetProgramsRequest>, { success: true }>;

export const load = async ({ parent, cookies }) => {
  const { orgId } = await parent();

  if (!orgId) {
    return {
      courses: [],
      programs: []
    };
  }

  const [coursesResult, programsResult] = await Promise.all([
    safeServerApi<GetOrganizationCoursesSuccess>(() =>
      pathworks.organization.courses.$get({ query: {} }, getApiHeaders(cookies, orgId))
    ),
    safeServerApi<GetProgramsSuccess>(() =>
      pathworks.program.$get({ query: { organizationId: orgId } }, getApiHeaders(cookies, orgId))
    )
  ]);

  return {
    courses: coursesResult.ok ? coursesResult.body.data : [],
    programs: programsResult.ok ? programsResult.body.data : []
  };
};
