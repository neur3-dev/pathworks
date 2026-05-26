import { pathworks, type InferResponseType } from '$lib/utils/services/api';

export type GetOrgAiTutorRequest = (typeof pathworks.organization)['ai-tutor']['$get'];
export type UpdateOrgAiTutorRequest = (typeof pathworks.organization)['ai-tutor']['$put'];

export type GetCourseAiTutorRequest = (typeof pathworks.course)[':courseId']['ai-tutor']['$get'];
export type UpdateCourseAiTutorRequest = (typeof pathworks.course)[':courseId']['ai-tutor']['$put'];

export type GetOrgAiTutorSuccess = Extract<InferResponseType<GetOrgAiTutorRequest>, { success: true }>;
export type OrgAiTutorSettings = GetOrgAiTutorSuccess['data'];

export type GetCourseAiTutorSuccess = Extract<InferResponseType<GetCourseAiTutorRequest>, { success: true }>;
export type CourseAiTutorView = GetCourseAiTutorSuccess['data'];
export type CourseAiTutorOverride = CourseAiTutorView['override'];

export type GetTutorLeaderboardRequest = (typeof pathworks.agent)['tutor-usage']['leaderboard']['$get'];
export type GetTutorSummaryRequest = (typeof pathworks.agent)['tutor-usage']['summary']['$get'];
export type GetTutorLearnerDetailRequest = (typeof pathworks.agent)['tutor-usage'][':userId']['$get'];

export type TutorLeaderboardSuccess = Extract<InferResponseType<GetTutorLeaderboardRequest>, { success: true }>;
export type TutorLeaderboardData = TutorLeaderboardSuccess['data'];

export type TutorSummarySuccess = Extract<InferResponseType<GetTutorSummaryRequest>, { success: true }>;
export type TutorSummaryData = TutorSummarySuccess['data'];

export type TutorLearnerDetailSuccess = Extract<InferResponseType<GetTutorLearnerDetailRequest>, { success: true }>;
export type TutorLearnerDetailData = TutorLearnerDetailSuccess['data'];
