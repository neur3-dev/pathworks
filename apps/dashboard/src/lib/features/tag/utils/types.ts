import { pathworks, type InferResponseType } from '$lib/utils/services/api';

export type GetTagGroupsRequest = (typeof pathworks.organization)['tags']['$get'];
export type GetTagGroupsResponse = InferResponseType<GetTagGroupsRequest>;
export type GetTagGroupsSuccess = Extract<GetTagGroupsResponse, { success: true }>;
export type OrganizationTagGroups = GetTagGroupsSuccess['data'];
export type OrganizationTagGroup = OrganizationTagGroups[number];
export type OrganizationTag = OrganizationTagGroup['tags'][number];

export type CreateTagGroupRequest = (typeof pathworks.organization)['tags']['groups']['$post'];
export type UpdateTagGroupRequest = (typeof pathworks.organization)['tags']['groups'][':groupId']['$put'];
export type CreateTagRequest = (typeof pathworks.organization)['tags']['$post'];
export type UpdateTagRequest = (typeof pathworks.organization)['tags'][':tagId']['$put'];

export type GetCourseTagsRequest = (typeof pathworks.course)[':courseId']['tags']['$get'];
export type UpdateCourseTagsRequest = (typeof pathworks.course)[':courseId']['tags']['$put'];
export type GetCourseTagsResponse = InferResponseType<GetCourseTagsRequest>;
export type GetCourseTagsSuccess = Extract<GetCourseTagsResponse, { success: true }>;
export type OrganizationCourseTags = GetCourseTagsSuccess['data'];
