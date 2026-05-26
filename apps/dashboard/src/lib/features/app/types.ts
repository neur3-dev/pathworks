import { pathworks, type InferResponseType } from '$lib/utils/services/api';

export type AccountResponse = InferResponseType<typeof pathworks.account.$get> | null;

export type AccountSuccess = Extract<InferResponseType<typeof pathworks.account.$get>, { success: true }>;

export type AccountOrg = AccountSuccess['organizations'][number];
