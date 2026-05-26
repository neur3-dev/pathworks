import type { GetExerciseSuccess, ListExerciseSubmissionsSuccess } from '$features/course/utils/types';
import { pathworks, getApiHeaders } from '$lib/utils/services/api';
import { safeServerApi } from '$lib/utils/services/api/server';

export const load = async ({ params, cookies }) => {
  const courseId = params.id || '';
  const exerciseId = params.exerciseId || '';

  if (!courseId || !exerciseId) {
    return { courseId, exerciseId, exercise: null, submissions: [], mySubmissions: [] };
  }

  const headers = getApiHeaders(cookies);

  const [exerciseResult, overviewResult] = await Promise.all([
    safeServerApi<GetExerciseSuccess>(() =>
      pathworks.course[':courseId'].exercise[':exerciseId'].$get({ param: { courseId, exerciseId } }, headers)
    ),
    safeServerApi<ListExerciseSubmissionsSuccess>(() =>
      pathworks.course[':courseId'].exercise[':exerciseId']['submissions'].$get(
        { param: { courseId, exerciseId } },
        headers
      )
    )
  ]);
  const exercise = exerciseResult.ok && exerciseResult.body.data ? exerciseResult.body.data : null;
  const overview =
    overviewResult.ok && overviewResult.body.data ? overviewResult.body.data : { mySubmission: [], allSubmissions: [] };

  const mySubmissionData = Array.isArray(overview.mySubmission) ? overview.mySubmission : [];
  const mySubmissions = mySubmissionData;

  const submissions = Array.isArray(overview.allSubmissions) ? overview.allSubmissions : [];

  return {
    courseId,
    exerciseId,
    exercise,
    submissions,
    mySubmissions
  };
};
