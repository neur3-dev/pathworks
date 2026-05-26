import { pathworks, type InferResponseType } from '$lib/utils/services/api';

export type ListAccountWorkspacesRequest = typeof pathworks.account.workspaces.$get;
export type CreateAccountWorkspaceRequest = typeof pathworks.account.workspaces.$post;
export type DeleteAccountWorkspaceRequest = (typeof pathworks.account.workspaces)[':workspaceId']['$delete'];
export type GetAccountUsageRequest = typeof pathworks.account.usage.$get;

type ListSuccess = Extract<InferResponseType<ListAccountWorkspacesRequest>, { success: true }>;
type UsageSuccess = Extract<InferResponseType<GetAccountUsageRequest>, { success: true }>;

export type AccountWorkspaceList = ListSuccess['data']['workspaces'];
export type AccountWorkspaceLimits = ListSuccess['data']['limits'];
export type AccountWorkspace = AccountWorkspaceList[number];
export type AccountUsage = UsageSuccess['data'];
