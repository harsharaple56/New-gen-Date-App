import { Match } from '../types/models';
import { mockUsers } from './mockUsers';

/**
 * Mock mutual matches shown on the Matches tab. Each references a profile from
 * `mockUsers` so data stays consistent across screens.
 */
export const mockMatches: Match[] = mockUsers.map((profile, i) => ({
  id: `match_${profile.id}`,
  profile,
  matchedAt: new Date(Date.now() - i * 3600_000).toISOString(),
}));

export default mockMatches;
