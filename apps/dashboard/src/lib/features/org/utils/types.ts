import { pathworks, type InferRequestType, type InferResponseType } from '$lib/utils/services/api';

export type GetOrganizationRequest = typeof pathworks.organization.$get;
export type GetOrganizationResponse = InferResponseType<GetOrganizationRequest> | null;
export type GetOrganizationSuccess = Extract<InferResponseType<GetOrganizationRequest>, { success: true }>;
export type OrganizationRecord = GetOrganizationSuccess['data'][number];

export type GetFirstOrganizationRequest = typeof pathworks.organization.first.$get;
export type GetFirstOrganizationResponse = InferResponseType<GetFirstOrganizationRequest> | null;
export type GetFirstOrganizationSuccess = Extract<InferResponseType<GetFirstOrganizationRequest>, { success: true }>;
export type FirstOrganizationRecord = GetFirstOrganizationSuccess['data'][number];

// Team member types
export type GetTeamRequest = (typeof pathworks.organization)['team']['$get'];
export type OrganizationTeamResponse = InferResponseType<GetTeamRequest> | null;
export type OrganizationTeamSuccess = Extract<InferResponseType<GetTeamRequest>, { success: true }>;

export type OrganizationTeamMembersRaw = OrganizationTeamSuccess['data'];

// Mapped team members with role and isAdmin (mapped in API layer)
export type OrganizationTeamMembers = Array<
  OrganizationTeamMembersRaw[number] & {
    role: string;
    isAdmin: boolean;
    verified: boolean;
  }
>;

// Audience types
export type GetAudienceRequest = (typeof pathworks.organization)['audience']['$get'];
export type OrganizationAudienceResponse = InferResponseType<GetAudienceRequest> | null;
export type OrganizationAudienceSuccess = Extract<InferResponseType<GetAudienceRequest>, { success: true }>;
export type OrganizationAudienceRequestQuery = NonNullable<InferRequestType<GetAudienceRequest>['query']>;
export type OrganizationAudienceSortBy = 'createdAt' | 'name' | 'email';
export type OrganizationAudienceSortOrder = 'asc' | 'desc';
export type OrganizationAudienceQuery = {
  page: number;
  limit: number;
  search?: string;
  sortBy: OrganizationAudienceSortBy;
  sortOrder: OrganizationAudienceSortOrder;
};

export type OrganizationAudience = OrganizationAudienceSuccess['data'];
export type OrganizationAudiencePagination = OrganizationAudienceSuccess['pagination'];
export type OrganizationAudienceMember = OrganizationAudience[number];

// Org Public Courses  types
export type GetOrgPublicCoursesRequest = typeof pathworks.organization.courses.public.$get;
export type OrgPublicCoursesResponse = InferResponseType<GetOrgPublicCoursesRequest> | null;
export type OrgPublicCoursesSuccess = Extract<InferResponseType<GetOrgPublicCoursesRequest>, { success: true }>;
export type OrgPublicCoursesData = OrgPublicCoursesSuccess['data'];
export type OrgPublicCourses = OrgPublicCoursesData['courses'];

// dashboard analytics types
export type GetDashStatsRequest = typeof pathworks.dash.stats.$get;
export type DashStatsResponse = InferResponseType<GetDashStatsRequest> | null;
export type DashStatsSuccess = Extract<InferResponseType<GetDashStatsRequest>, { success: true }>;

export type GetLoginActivityRequest = (typeof pathworks.dash)['login-activity']['$get'];
export type LoginActivitySuccess = Extract<InferResponseType<GetLoginActivityRequest>, { success: true }>;
export type LoginActivityData = LoginActivitySuccess['data'];

// invite team types
export type InviteTeamRequest = (typeof pathworks.organization)['team']['invite']['$post'];
export type InviteTeamSuccess = Extract<InferResponseType<InviteTeamRequest>, { success: true }>;
export type InviteTeamData = InviteTeamSuccess['data'];

export type DeleteTeamRequest = (typeof pathworks.organization)['team'][':memberId']['$delete'];
export type DeleteTeamSuccess = Extract<InferResponseType<DeleteTeamRequest>, { success: true }>;
export type DeleteAudienceMemberRequest = (typeof pathworks.organization)['audience'][':memberId']['$delete'];
export type DeleteAudienceMemberSuccess = Extract<InferResponseType<DeleteAudienceMemberRequest>, { success: true }>;

// update organization types
export type UpdateOrganizationRequest = (typeof pathworks.organization)['$put'];
export type UpdateOrganizationResponse = InferResponseType<UpdateOrganizationRequest>;
export type UpdateOrganizationSuccess = Extract<UpdateOrganizationResponse, { success: true }>;

// domain request types
export type DomainRequestRequest = typeof pathworks.domain.$post;
export type DomainRequestResponse = InferResponseType<DomainRequestRequest>;
export type DomainRequestSuccess = Extract<DomainRequestResponse, { success: true }>;
export type DomainRequestData = DomainRequestSuccess['data'];
export type DomainRequestStatus = DomainRequestData['status'];

// SSO types
export type GetSsoConfigRequest = (typeof pathworks.organization)['sso']['$get'];
export type CreateSsoConnectionRequest = (typeof pathworks.organization)['sso']['$post'];
export type UpdateSsoConnectionRequest = (typeof pathworks.organization)['sso']['$put'];
export type DeleteSsoConnectionRequest = (typeof pathworks.organization)['sso']['$delete'];
export type ActivateSsoConnectionRequest = (typeof pathworks.organization)['sso']['activate']['$post'];
export type GetSsoPolicyRequest = (typeof pathworks.organization)['sso']['policy']['$get'];
export type UpdateSsoPolicyRequest = (typeof pathworks.organization)['sso']['policy']['$put'];

export type SsoDiscoveryRequest = typeof pathworks.sso.discover.$get;
export type GetOrgSsoInfoRequest = (typeof pathworks.sso)['org'][':orgId']['$get'];

export type GetSsoConfigSuccess = Extract<InferResponseType<GetSsoConfigRequest>, { success: true }>;
type SsoConfigData = NonNullable<GetSsoConfigSuccess['data']>;
type NormalizedPolicy = SsoConfigData extends { policy: infer P }
  ? P extends object
    ? Omit<P, 'roleMapping'> & { roleMapping: Record<string, number> }
    : null
  : null;
/** Normalized SSO config: API returns policy.roleMapping as JSONValue; this uses Record<string, number>. */
export type SsoConfig = {
  config: SsoConfigData['config'] | null;
  policy: NormalizedPolicy;
};

export type GetSsoDiscoverySuccess = Extract<InferResponseType<SsoDiscoveryRequest>, { success: true }>;
export type SsoDiscoveryResult = GetSsoDiscoverySuccess['data'];

export type GetOrgSsoInfoSuccess = Extract<InferResponseType<GetOrgSsoInfoRequest>, { success: true }>;
export type OrgSsoInfo = GetOrgSsoInfoSuccess['data'];

// Audience import types
export type ImportAudienceRequest = (typeof pathworks.organization)['audience']['import']['$post'];
export type ImportAudienceSuccess = Extract<InferResponseType<ImportAudienceRequest>, { success: true }>;
export type ImportAudienceData = ImportAudienceSuccess['data'];

// Audience assign courses types
export type AssignAudienceCoursesRequest = (typeof pathworks.organization)['audience']['assign-courses']['$post'];
export type AssignAudienceCoursesSuccess = Extract<InferResponseType<AssignAudienceCoursesRequest>, { success: true }>;
export type AssignAudienceCoursesData = AssignAudienceCoursesSuccess['data'];

// Audience invite actions
export type ResendAudienceInviteRequest = (typeof pathworks.organization)['audience']['resend-invite']['$post'];
export type RevokeAudienceInviteRequest = (typeof pathworks.organization)['audience']['revoke-invite']['$post'];

// Token auth types
export type CreateTokenAuthRequest = (typeof pathworks.organization)['token-auth']['$post'];
export type GetTokenAuthRequest = (typeof pathworks.organization)['token-auth']['$get'];
export type RotateTokenAuthRequest = (typeof pathworks.organization)['token-auth']['rotate']['$post'];
export type DeleteTokenAuthRequest = (typeof pathworks.organization)['token-auth']['$delete'];
export type ActivateTokenAuthRequest = (typeof pathworks.organization)['token-auth']['activate']['$put'];
