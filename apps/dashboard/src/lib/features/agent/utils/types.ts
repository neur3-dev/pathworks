import { pathworks, type InferResponseType } from '$lib/utils/services/api';

export type GenerateTextRequest = (typeof pathworks.agent)['generate-text']['$post'];
export type GenerateTextSuccess = Extract<InferResponseType<GenerateTextRequest>, { success: true }>;
