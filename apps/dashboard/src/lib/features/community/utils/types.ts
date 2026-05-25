import { classroomio, type InferResponseType } from '$lib/utils/services/api';

export type GetCommunityQuestionsRequest = typeof pathworks.neur3.devmunity.$get;
export type CommunityQuestionsResponse = InferResponseType<GetCommunityQuestionsRequest> | null;
export type CommunityQuestionsSuccess = Extract<InferResponseType<GetCommunityQuestionsRequest>, { success: true }>;
export type CommunityQuestionData = CommunityQuestionsSuccess['data'];

export type GetCommunityQuestionRequest = (typeof pathworks.neur3.devmunity)[':slug']['$get'];
export type CommunityQuestionResponse = InferResponseType<GetCommunityQuestionRequest> | null;
export type CommunityQuestionSuccess = Extract<InferResponseType<GetCommunityQuestionRequest>, { success: true }>;

export type CreateCommentRequest = typeof pathworks.neur3.devmunity.$post;
export type CreateCommentSuccess = Extract<InferResponseType<CreateCommentRequest>, { success: true }>;
export type CreateCommentData = CreateCommentSuccess['data'];

export type UpvotePostRequest = (typeof pathworks.neur3.devmunity)[':id']['upvote']['$post'];
export type UpvotePostSuccess = Extract<InferResponseType<UpvotePostRequest>, { success: true }>;
export type UpvotePostData = UpvotePostSuccess['data'];

export type CreateCommunityQuestionRequest = typeof pathworks.neur3.devmunity.$post;
export type CreateCommunityQuestionSuccess = Extract<
  InferResponseType<CreateCommunityQuestionRequest>,
  { success: true }
>;
export type UpdateQuestionRequest = (typeof pathworks.neur3.devmunity)[':id']['$put'];
export type UpdateQuestionSuccess = Extract<InferResponseType<UpdateQuestionRequest>, { success: true }>;
export type UpdateQuestionData = UpdateQuestionSuccess['data'];
