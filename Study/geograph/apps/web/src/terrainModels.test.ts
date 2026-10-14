import { describe, expect, it } from 'vitest';
import { readFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import {
  contourAt,
  contourSlope,
  flowPath,
  riverEdges,
  riverNext,
  riverNodes,
  terrainFinished,
  terrainLessonIds,
} from './terrainModels';
import climate from '../../../content/climate-data.json';
import { activityFinished } from './Activities';
import {
  emptyProgress,
  newActivity,
  patchSession,
  readProgress,
} from './progress';

describe('one mountain, multiple representations', () => {
  it('keeps every contour intersection on the same section for both intervals', () => {
    for (const interval of [50, 100])
      for (let h = interval; h < 400; h += interval) {
        const c = contourAt(h);
        expect(((c.left - 80) / 340) * 400).toBeCloseTo(h);
        expect(((560 - c.right) / 140) * 400).toBeCloseTo(h);
        expect(c.cx - c.rx).toBeCloseTo(c.left);
        expect(c.cx + c.rx).toBeCloseTo(c.right);
      }
    expect(contourAt(400)).toMatchObject({ cx: 420, rx: 0, ry: 0 });
    expect(contourAt(0)).toMatchObject({ left: 80, right: 560 });
  });
  it('compares equal rise and actual ground run, independent of drawn vertical exaggeration', () => {
    const west = contourSlope('west'),
      east = contourSlope('east');
    expect(west.rise).toBe(east.rise);
    expect(east.rise / east.run).toBeGreaterThan(west.rise / west.run);
    expect((contourAt(200).left - contourAt(100).left) * 5).toBe(west.run);
    expect((contourAt(100).right - contourAt(200).right) * 5).toBe(east.run);
  });
});
describe('connected drainage rather than screen direction', () => {
  it('allows only connected downstream steps and isolates the closed lake', () => {
    for (const [a, b] of riverEdges) {
      expect(riverNext(a, b)).toBe(true);
      expect(riverNext(b, a)).toBe(false);
      expect(riverNodes.find((p) => p.id === a)!.height).toBeGreaterThan(
        riverNodes.find((p) => p.id === b)!.height,
      );
    }
    expect(riverNext('source', 'mouth')).toBe(false);
    expect(riverNext('join', 'lake')).toBe(false);
    expect(riverNext('mouth', 'lake')).toBe(false);
    expect(riverNodes.find((p) => p.id === 'mouth')!.y).toBeLessThan(
      riverNodes.find((p) => p.id === 'source')!.y,
    );
  });
});
describe('traceable climate data', () => {
  it('uses an explicit 30-year air-temperature climatology and preserves altitude exceptions', () => {
    expect(climate.period).toBe('1991–2020');
    expect(climate.units).toBe('°C');
    expect(climate.sourcePeriod).toBe('1991/01/01 - 2020/12/31');
    expect(climate.monthWeights[1]).toBeCloseTo(28 + 8 / 30);
    expect(climate.monthWeights.reduce((a, b) => a + b, 0)).toBeCloseTo(
      365 + 8 / 30,
    );
    expect(climate.level).toMatch(/2 m/);
    expect(climate.shape).toEqual([12, 94, 192]);
    expect(climate.sha256).toMatch(/^[a-f0-9]{64}$/);
    const [t, m, p, h, l] = climate.points;
    expect(t!.celsius).toBeGreaterThan(m!.celsius);
    expect(m!.celsius).toBeGreaterThan(p!.celsius);
    expect(h!.lat).toBe(l!.lat);
    expect(h!.terrain).toBe('high');
    expect(h!.celsius).toBeLessThan(l!.celsius);
    const svg = readFileSync(
      fileURLToPath(
        new URL(
          '../../../../public/geography/maps/climate-1991-2020.svg',
          import.meta.url,
        ),
      ),
      'utf8',
    );
    expect(svg).toContain('1991–2020');
    expect(svg).toContain('2 m air temperature');
    expect(svg.match(/<rect /g)!.length).toBe(94 * 193);
  });
});
describe('complete and persistent terrain mission evidence', () => {
  it('requires actual multi-part reasoning, not a view preference or one correct label', () => {
    for (const id of terrainLessonIds)
      expect(activityFinished(id, newActivity())).toBe(false);
    const completed: Record<string, Record<string, string>> = {
      'GEO-009': {
        'landform-mountain': 'mountain',
        'landform-plain': 'plain',
        'landform-basin': 'basin',
        'relief-evidence': 'shape',
      },
      'GEO-010': {
        'contour-map': 'seen',
        'contour-section': 'seen',
        'contour-steep': 'east',
        'contour-gentle': 'west',
        'contour-height': '200',
      },
      'GEO-011': {
        'river-path': flowPath.join(','),
        'river-divide': 'ridge',
        'river-exception': 'closed',
      },
      'GEO-012': {
        ...Object.fromEntries(
          climate.points.map((p) => [`climate-seen-${p.id}`, 'yes']),
        ),
        'climate-trend': 'latitude',
        'climate-exception': 'height',
        'climate-period': 'climate',
      },
    };
    for (const [id, decisions] of Object.entries(completed)) {
      expect(activityFinished(id, { ...newActivity(), decisions })).toBe(true);
      for (const key of Object.keys(decisions)) {
        const partial = { ...decisions };
        delete partial[key];
        expect(terrainFinished(id, partial)).toBe(false);
      }
    }
    expect(
      terrainFinished('GEO-011', {
        ...completed['GEO-011'],
        'river-path': 'source,lake,mouth',
      }),
    ).toBe(false);
    expect(terrainFinished('GEO-096', {})).toBe(false);
  });
  it('restores the new course evidence and third feedback group alongside old notes', () => {
    let p = patchSession(emptyProgress(), 'GEO-001', { note: '首课旧记录' });
    p = patchSession(p, 'GEO-012', {
      note: '气候不是今天预报',
      step: 4,
      activity: {
        ...newActivity(),
        decisions: { 'climate-seen-plateau': 'yes' },
      },
    });
    p.feedbackByBlock['GEO-009'] = {
      interest: 4,
      independence: 3,
      useful: '对比',
      difficult: '等高距',
    };
    expect(readProgress(JSON.stringify(p))).toEqual(p);
  });
});
