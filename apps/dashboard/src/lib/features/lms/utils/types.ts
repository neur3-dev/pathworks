import { pathworks, type InferResponseType } from '$lib/utils/services/api';

export type GetPendingOrgInviteRequest = (typeof pathworks.invite.organization)['pending']['$get'];
type GetPendingOrgInviteResponse = Extract<InferResponseType<GetPendingOrgInviteRequest>, { success: true }>;
export type PendingOrgInvite = NonNullable<GetPendingOrgInviteResponse['data']>;
