export const terrainLessonIds = ['GEO-009', 'GEO-010', 'GEO-011', 'GEO-012'];
/** One oblique cone: every contour and section uses exactly the same geometry. */
export function contourAt(height: number) {
  const h = Math.max(0, Math.min(400, height));
  const left = 80 + (340 * h) / 400;
  const right = 560 - (140 * h) / 400;
  return {
    left,
    right,
    cx: (left + right) / 2,
    rx: (right - left) / 2,
    ry: (1 - h / 400) * 125,
  };
}
export function contourSlope(side: 'west' | 'east') {
  return { rise: 100, run: side === 'west' ? 425 : 175 };
}
export const riverNodes = [
  { id: 'source', x: 90, y: 285, height: 400, zh: '源头', en: 'Source' },
  { id: 'tributary', x: 125, y: 90, height: 300, zh: '支流', en: 'Tributary' },
  { id: 'join', x: 265, y: 215, height: 150, zh: '汇合处', en: 'Confluence' },
  { id: 'bend', x: 335, y: 135, height: 50, zh: '弯道', en: 'Bend' },
  { id: 'mouth', x: 455, y: 65, height: 0, zh: '河口', en: 'Mouth' },
  { id: 'lake', x: 540, y: 280, height: 100, zh: '内流湖', en: 'Closed lake' },
] as const;
export const riverEdges = [
  ['source', 'join'],
  ['tributary', 'join'],
  ['join', 'bend'],
  ['bend', 'mouth'],
] as const;
export function riverNext(from: string, to: string) {
  return riverEdges.some(([a, b]) => a === from && b === to);
}
export const flowPath = ['source', 'join', 'bend', 'mouth'];
export function terrainFinished(id: string, d: Record<string, string>) {
  if (id === 'GEO-009')
    return (
      ['mountain', 'plain', 'basin'].every((k) => d[`landform-${k}`] === k) &&
      d['relief-evidence'] === 'shape'
    );
  if (id === 'GEO-010')
    return (
      d['contour-map'] === 'seen' &&
      d['contour-section'] === 'seen' &&
      d['contour-steep'] === 'east' &&
      d['contour-gentle'] === 'west' &&
      d['contour-height'] === '200'
    );
  if (id === 'GEO-011')
    return (
      d['river-path'] === flowPath.join(',') &&
      d['river-divide'] === 'ridge' &&
      d['river-exception'] === 'closed'
    );
  if (id === 'GEO-012')
    return (
      ['tropical', 'temperate', 'polar', 'plateau', 'lowland'].every(
        (k) => d[`climate-seen-${k}`] === 'yes',
      ) &&
      d['climate-trend'] === 'latitude' &&
      d['climate-exception'] === 'height' &&
      d['climate-period'] === 'climate'
    );
  return false;
}
