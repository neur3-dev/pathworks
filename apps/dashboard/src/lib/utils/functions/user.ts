import type { TProfile } from '@cio/db/types';
import { pathworks } from '$lib/utils/services/api';

export async function getProfile(email: string): Promise<TProfile | null> {
  try {
    const response = await pathworks.account.profile.$get({
      query: { email }
    });

    const result = await response.json();

    if (result.success && result.profile) {
      return result.profile;
    }

    return null;
  } catch (error) {
    console.error('Error fetching profile by email:', error);
    return null;
  }
}
