import { describe, expect, it } from 'vitest';
import { activityFinished } from './Activities';
import {
  livingPlanetAnswers,
  livingPlanetEvidence,
  livingPlanetFinished,
  livingPlanetLessonIds,
} from './livingPlanetModels';
import { newActivity } from './progress';

describe('living-planet lesson evidence', () => {
  it('keeps the four lessons in curriculum order with complete, retryable evidence', () => {
    expect(livingPlanetLessonIds).toEqual([
      'GEO-041',
      'GEO-042',
      'GEO-043',
      'GEO-044',
    ]);
    for (const id of livingPlanetLessonIds) {
      const decisions = {
        ...livingPlanetAnswers[id]!,
        ...Object.fromEntries(
          livingPlanetEvidence[id]!.map((key) => [key, 'yes']),
        ),
      };
      expect(livingPlanetFinished(id, decisions)).toBe(true);
      expect(
        activityFinished(id, { ...newActivity(), decisions }),
      ).toBe(true);
      for (const key of Object.keys(decisions)) {
        const missing = { ...decisions };
        delete missing[key];
        expect(livingPlanetFinished(id, missing), `${id} missing ${key}`).toBe(
          false,
        );
      }
      const answer = Object.keys(livingPlanetAnswers[id]!)[0]!;
      expect(
        livingPlanetFinished(id, { ...decisions, [answer]: 'wrong' }),
      ).toBe(false);
    }
  });
});
