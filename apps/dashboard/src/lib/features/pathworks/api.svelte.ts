import { BaseApiWithErrors, classroomio, type InferResponseType } from '$lib/utils/services/api';

type LearningPathsRequest = (typeof classroomio.pathworks)['learning-paths']['$get'];
type LearningPathsResponse = Extract<InferResponseType<LearningPathsRequest>, { success: true }>;
export type LearningPath = LearningPathsResponse['data'][number];

export class PathWorksApi extends BaseApiWithErrors {
  learningPaths = $state<LearningPath[]>([]);

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

  async saveParticipantProfile(data: {
    fullname?: string;
    ipeVocationalGoal?: string | null;
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
