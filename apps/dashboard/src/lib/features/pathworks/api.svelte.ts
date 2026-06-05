import { BaseApiWithErrors, getRequestBaseUrl, pathworks, type InferResponseType } from '$lib/utils/services/api';
import { SvelteURL } from 'svelte/reactivity';

type LearningPathsRequest = (typeof pathworks.pathworks)['learning-paths']['$get'];
type LearningPathsResponse = Extract<InferResponseType<LearningPathsRequest>, { success: true }>;
type ParticipantProfileRequest = (typeof pathworks.pathworks)['participant-profile']['$get'];
type ParticipantProfileResponse = Extract<InferResponseType<ParticipantProfileRequest>, { success: true }>;
type ParticipantProgressRequest = (typeof pathworks.pathworks)['participant-progress']['$get'];
type ParticipantProgressResponse = Extract<InferResponseType<ParticipantProgressRequest>, { success: true }>;
type CounselorLoginRequest = (typeof pathworks.pathworks)['counselor-login']['$post'];
type CounselorProgressRequest = (typeof pathworks.pathworks)['counselor-progress']['$get'];
type CounselorProgressResponse = Extract<InferResponseType<CounselorProgressRequest>, { success: true }>;
type CounselorParticipantRequest = (typeof pathworks.pathworks)['counselor-participant']['$get'];
type CounselorParticipantResponse = Extract<InferResponseType<CounselorParticipantRequest>, { success: true }>;
type CounselorNoteRequest = (typeof pathworks.pathworks)['counselor-note']['$post'];

export type LearningPath = LearningPathsResponse['data'][number];
export type ParticipantProfile = ParticipantProfileResponse['data'];
export type ParticipantProgress = ParticipantProgressResponse['data'];
export type CounselorProgress = CounselorProgressResponse['data'];
export type CounselorParticipant = CounselorParticipantResponse['data'];

export class PathWorksApi extends BaseApiWithErrors {
  learningPaths = $state<LearningPath[]>([]);
  participantProfile = $state<ParticipantProfile | null>(null);
  participantProgress = $state<ParticipantProgress | null>(null);
  counselorProgress = $state<CounselorProgress | null>(null);
  counselorParticipant = $state<CounselorParticipant | null>(null);

  async requestCounselorLogin(email: string) {
    return this.execute<CounselorLoginRequest>({
      requestFn: () =>
        pathworks.pathworks['counselor-login'].$post({
          json: { email }
        }),
      logContext: 'requesting PathWorks counselor login link'
    });
  }

  async getCounselorProgress(token: string) {
    return this.execute<CounselorProgressRequest>({
      requestFn: () =>
        pathworks.pathworks['counselor-progress'].$get({
          query: { token }
        }),
      logContext: 'fetching PathWorks counselor progress',
      onSuccess: (response) => {
        this.counselorProgress = response.data;
      }
    });
  }

  async getCounselorParticipant(token: string, participantId: string) {
    return this.execute<CounselorParticipantRequest>({
      requestFn: () =>
        pathworks.pathworks['counselor-participant'].$get({
          query: { token, participantId }
        }),
      logContext: 'fetching PathWorks counselor participant detail',
      onSuccess: (response) => {
        this.counselorParticipant = response.data;
      }
    });
  }

  async saveCounselorNote(token: string, participantId: string, note: string) {
    return this.execute<CounselorNoteRequest>({
      requestFn: () =>
        pathworks.pathworks['counselor-note'].$post({
          json: { token, participantId, note }
        }),
      logContext: 'saving PathWorks counselor note'
    });
  }

  getCounselorProgressExportUrl(token: string, participantId: string) {
    const baseUrl = getRequestBaseUrl();
    const url = new SvelteURL('/pathworks/counselor-progress-export', baseUrl || window.location.origin);
    url.searchParams.set('token', token);
    url.searchParams.set('participantId', participantId);
    return url.toString();
  }

  async getLearningPaths(orgId?: string) {
    return this.execute<LearningPathsRequest>({
      requestFn: () =>
        pathworks.pathworks['learning-paths'].$get({
          query: orgId ? { orgId } : {}
        }),
      logContext: 'fetching PathWorks learning paths',
      onSuccess: (response) => {
        this.learningPaths = response.data ?? [];
      }
    });
  }

  async getParticipantProfile() {
    return this.execute<ParticipantProfileRequest>({
      requestFn: () => pathworks.pathworks['participant-profile'].$get(),
      logContext: 'fetching PathWorks participant profile',
      onSuccess: (response) => {
        this.participantProfile = response.data;
      }
    });
  }

  async saveParticipantProfile(data: {
    fullname?: string;
    disabilityCategory?:
      | 'physical'
      | 'sensory_visual'
      | 'sensory_hearing'
      | 'cognitive'
      | 'psychiatric'
      | 'tbi'
      | 'substance_use'
      | 'other'
      | null;
    ipeVocationalGoal?: string | null;
    counselorName?: string | null;
    counselorEmail?: string | null;
    prefExtendedTime: boolean;
    prefNoAutoplay: boolean;
    prefContentWarnings: boolean;
    prefMicrolearning: boolean;
  }) {
    return this.execute<(typeof pathworks.pathworks)['participant-profile']['$post']>({
      requestFn: () =>
        pathworks.pathworks['participant-profile'].$post({
          json: data
        }),
      logContext: 'saving PathWorks participant profile'
    });
  }

  async getParticipantProgress(courseId: string, lessonId?: string | null) {
    return this.execute<ParticipantProgressRequest>({
      requestFn: () =>
        pathworks.pathworks['participant-progress'].$get({
          query: {
            courseId,
            ...(lessonId ? { lessonId } : {})
          }
        }),
      logContext: 'fetching PathWorks participant progress',
      onSuccess: (response) => {
        this.participantProgress = response.data;
      }
    });
  }

  async saveParticipantProgress(data: {
    courseId: string;
    lessonId?: string | null;
    status?: 'not_started' | 'in_progress' | 'completed';
    lastPosition?: number;
    score?: number | null;
    attempts?: number;
  }) {
    return this.execute<(typeof pathworks.pathworks)['participant-progress']['$post']>({
      requestFn: () =>
        pathworks.pathworks['participant-progress'].$post({
          json: {
            status: 'in_progress',
            lastPosition: 0,
            attempts: 0,
            ...data
          }
        }),
      logContext: 'saving PathWorks participant progress'
    });
  }
}

export const pathworksApi = new PathWorksApi();
