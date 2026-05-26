import { BaseApiWithErrors, classroomio, type InferResponseType } from '$lib/utils/services/api';

type LearningPathsRequest = (typeof classroomio.pathworks)['learning-paths']['$get'];
type LearningPathsResponse = Extract<InferResponseType<LearningPathsRequest>, { success: true }>;
type ParticipantProfileRequest = (typeof classroomio.pathworks)['participant-profile']['$get'];
type ParticipantProfileResponse = Extract<InferResponseType<ParticipantProfileRequest>, { success: true }>;
type ParticipantProgressRequest = (typeof classroomio.pathworks)['participant-progress']['$get'];
type ParticipantProgressResponse = Extract<InferResponseType<ParticipantProgressRequest>, { success: true }>;

export type LearningPath = LearningPathsResponse['data'][number];
export type ParticipantProfile = ParticipantProfileResponse['data'];
export type ParticipantProgress = ParticipantProgressResponse['data'];

export class PathWorksApi extends BaseApiWithErrors {
  learningPaths = $state<LearningPath[]>([]);
  participantProfile = $state<ParticipantProfile | null>(null);
  participantProgress = $state<ParticipantProgress | null>(null);

  async getLearningPaths(orgId?: string) {
    return this.execute<LearningPathsRequest>({
      requestFn: () =>
        classroomio.pathworks['learning-paths'].$get({
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
      requestFn: () => classroomio.pathworks['participant-profile'].$get(),
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
    return this.execute<(typeof classroomio.pathworks)['participant-profile']['$post']>({
      requestFn: () =>
        classroomio.pathworks['participant-profile'].$post({
          json: data
        }),
      logContext: 'saving PathWorks participant profile'
    });
  }

  async getParticipantProgress(courseId: string, lessonId?: string | null) {
    return this.execute<ParticipantProgressRequest>({
      requestFn: () =>
        classroomio.pathworks['participant-progress'].$get({
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
    return this.execute<(typeof classroomio.pathworks)['participant-progress']['$post']>({
      requestFn: () =>
        classroomio.pathworks['participant-progress'].$post({
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
