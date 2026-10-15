/** GEO-041–044 use original teaching diagrams.  The choices below are
 * deliberately small: each is an observation or relationship, not a
 * prediction of a real ecosystem or storm. */
export const livingPlanetLessonIds = [
  'GEO-041',
  'GEO-042',
  'GEO-043',
  'GEO-044',
];

export const livingPlanetEvidence: Record<string, string[]> = {
  'GEO-041': ['rainforest-layers', 'rainforest-light', 'rainforest-web'],
  'GEO-042': ['biome-wet-warm', 'biome-dry-warm', 'biome-cold-case'],
  'GEO-043': ['extreme-polar', 'extreme-alpine', 'extreme-tradeoff'],
  'GEO-044': ['storm-energy', 'storm-structure', 'storm-risk-view'],
};

export const livingPlanetAnswers: Record<string, Record<string, string>> = {
  'GEO-041': {
    'rainforest-layer': 'canopy',
    'rainforest-diversity': 'many-niches',
    'rainforest-limit': 'not-guarantee',
  },
  'GEO-042': {
    'biome-warm-wet': 'forest',
    'biome-warm-dry': 'grassland',
    'biome-cold': 'tundra',
    'biome-limit': 'not-label',
  },
  'GEO-043': {
    'extreme-cold': 'reduce-heat-loss',
    'extreme-high': 'oxygen-light',
    'extreme-limit': 'context',
  },
  'GEO-044': {
    'storm-fuel': 'warm-ocean',
    'storm-weakens': 'cool-or-shear',
    'storm-risk': 'hazard-exposure-vulnerability',
    'storm-limit': 'not-predict',
  },
};

export function livingPlanetFinished(id: string, d: Record<string, string>) {
  const answers = livingPlanetAnswers[id];
  const evidence = livingPlanetEvidence[id];
  return (
    !!answers &&
    !!evidence &&
    Object.entries(answers).every(([key, answer]) => d[key] === answer) &&
    evidence.every((key) => d[key] === 'yes')
  );
}
