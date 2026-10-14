import { describe, expect, it } from 'vitest';
import {
  waterEdges,
  waterJourneys,
  waterMove,
  readWaterRoute,
  rainBudget,
  ocean,
  nzQuakes,
  nzSegments,
  currentCases,
  quakeDepthBand,
  heatParcel,
  waterEarthFinished,
} from './waterEarthModels';
import { activityFinished } from './Activities';
import {
  newLandformReport,
  readLandformReport,
  reportChecklist,
  reportFinished,
  reportHtml,
  reportMarkdown,
  reportMapSvg,
  safeSourceUrl,
} from './landformReport';
import { newAtlas } from './atlasModel';
import {
  emptyProgress,
  newActivity,
  patchSession,
  readProgress,
} from './progress';
const missions = (): Record<string, Record<string, string>> => ({
  'GEO-029': {
    ...Object.fromEntries(
      waterJourneys.map((j) => [`water-path-${j.id}`, 'yes']),
    ),
    ...Object.fromEntries(
      ['runoff', 'infiltrate', 'evaporate', 'condense', 'rain'].map((e) => [
        `water-name-${e}`,
        e,
      ]),
    ),
    'rain-seen-open': 'yes',
    'rain-seen-sealed': 'yes',
    'rain-claim': 'conditional',
    'cloud-state': 'drops',
    'water-driver': 'energy-gravity',
  },
  'GEO-030': {
    ...Object.fromEntries(
      currentCases.flatMap((c) => [
        [`current-seen-${c.id}`, 'yes'],
        [`current-kind-${c.id}`, c.kind],
      ]),
    ),
    ...Object.fromEntries(
      ['jan', 'jul'].flatMap((m) =>
        ['A', 'B'].map((p) => [`sst-${m}-${p}`, 'yes']),
      ),
    ),
    ...Object.fromEntries(
      ['warm', 'cool'].flatMap((k) =>
        [0, 4].map((f) => [`heat-${k}-${f}`, 'yes']),
      ),
    ),
    'sst-compare': 'A',
    'sst-variable': 'surface',
    'current-driver': 'multiple',
    'climate-limit': 'multiple',
  },
  'GEO-031': {
    ...Object.fromEntries(
      ['boundary', 'relief', 'quakes'].map((l) => [`nz-layer-${l}`, 'yes']),
    ),
    ...Object.fromEntries(
      nzSegments.flatMap((s) => [
        [`nz-seen-${s.id}`, 'yes'],
        [`nz-motion-${s.id}`, s.motion],
      ]),
    ),
    'nz-evidence': 'combined',
    'nz-quakes-limit': 'sample',
    'nz-mountain-time': 'both',
  },
});
const completeReport = () => {
  const d = newLandformReport();
  d.mapChecked = d.stepsChecked = d.evidenceChecked = true;
  d.steps = d.steps.map((s, i) => ({ ...s, zh: `验收实例：解释过程${i + 1}` }));
  d.evidence = d.evidence.map((e) => ({
    ...e,
    observation: '验收实例观察'.repeat(40),
    inference: '推论，需要机制',
    limit: '一张图不能决定历史',
  }));
  d.explanationZh = '验收实例：抬升与侵蚀共同塑造山地。';
  d.explanationEn = 'Acceptance example: uplift and erosion shape mountains.';
  return d;
};
describe('water, ocean and NZ evidence', () => {
  it('requires real route connections and recognises three different journeys', () => {
    for (const j of waterJourneys) {
      let route = ['surface'];
      for (let i = 1; i < j.route.length; i++) {
        const edge = waterEdges.find(
          (e) => e.from === route.at(-1) && e.to === j.route[i],
        )!;
        const result = waterMove(route, edge.id);
        expect(result.valid).toBe(true);
        route = result.route;
        expect(result.completed).toEqual(
          i === j.route.length - 1 ? [j.id] : [],
        );
      }
    }
    expect(waterMove(['surface'], 'condense').valid).toBe(false);
    expect(readWaterRoute(['sea', 'vapour'])).toEqual(['surface']);
    expect(readWaterRoute(['surface', 'soil', 'sea', 'cloud'])).toEqual([
      'surface',
      'soil',
    ]);
    const long = [
      'surface',
      ...Array.from({ length: 8 }, () => [
        'river',
        'sea',
        'vapour',
        'cloud',
        'surface',
      ]).flat(),
    ];
    expect(readWaterRoute(long)).toHaveLength(30);
    expect(waterMove(readWaterRoute(long), 'rain').valid).toBe(false);
  });
  it('conserves the same invented rain without claiming a real flood model', () => {
    for (const sealed of [false, true]) {
      const b = rainBudget(sealed);
      expect(b.runoff + b.infiltration + b.retained).toBe(10);
    }
    expect(rainBudget(true).runoff).toBeGreaterThan(rainBudget(false).runoff);
    expect(heatParcel(999, 'warm').x).toBe(heatParcel(4, 'cool').x);
    expect(heatParcel(NaN, 'cool').x).toBe(heatParcel(0, 'warm').x);
  });
  it('retains source SST variable, period, mask and same-latitude readings', () => {
    expect(ocean.shape).toEqual([12, 180, 360]);
    expect(ocean.months).toEqual([1, 7]);
    expect(ocean.sourcePeriod).toBe('1991/01/01 - 2020/12/31');
    expect(ocean.variable).toBe('sea_surface_temperature');
    expect(ocean.units).toBe('°C');
    expect(ocean.maskUrl).toContain('lsmask.nc');
    expect(ocean.maskSha256).toMatch(/^[a-f0-9]{64}$/);
    expect(ocean.points.map((p) => p.lat)).toEqual([34.5, 34.5]);
    expect(ocean.points.map((p) => [p.jan, p.jul])).toEqual([
      [20.3, 26.4],
      [17.9, 21.4],
    ]);
  });
  it('retains 190 unique selected GeoNet events with exact time/location fields', () => {
    expect(nzQuakes.records).toHaveLength(nzQuakes.count);
    expect(nzQuakes.count).toBe(190);
    expect(new Set(nzQuakes.records.map((r) => r.id)).size).toBe(190);
    let previous = 0;
    for (const r of nzQuakes.records) {
      const date = Date.parse(r.time);
      expect(date).toBeGreaterThanOrEqual(Date.UTC(2020, 0, 1));
      expect(date).toBeLessThan(Date.UTC(2021, 0, 1));
      expect(date).toBeGreaterThanOrEqual(previous);
      previous = date;
      expect(r.magnitude).toBeGreaterThanOrEqual(4);
      expect(r.lon).toBeGreaterThanOrEqual(164);
      expect(r.lon).toBeLessThanOrEqual(180);
      expect(r.lat).toBeGreaterThanOrEqual(-48);
      expect(r.lat).toBeLessThanOrEqual(-33);
      expect(Number.isFinite(r.depthKm)).toBe(true);
    }
    expect(quakeDepthBand(39.9)).toBe('shallow');
    expect(quakeDepthBand(40)).toBe('middle');
    expect(quakeDepthBand(100)).toBe('deep');
    expect(nzSegments.map((s) => s.motion)).toEqual([
      'pacific-under',
      'oblique',
      'australian-under',
    ]);
  });
  it('requires every observation and reasoning record rather than a click total', () => {
    for (const [id, d] of Object.entries(missions())) {
      expect(waterEarthFinished(id, d)).toBe(true);
      expect(activityFinished(id, { ...newActivity(), decisions: d })).toBe(
        true,
      );
      for (const key of Object.keys(d)) {
        const missing = { ...d };
        delete missing[key];
        expect(waterEarthFinished(id, missing), key).toBe(false);
      }
    }
    expect(
      waterEarthFinished('GEO-030', {
        ...missions()['GEO-030'],
        'sst-variable': 'speed',
      }),
    ).toBe(false);
  });
});
describe('landscape report records and exports', () => {
  it('requires four independently complete parts and accepts honest bilingual oral records', () => {
    const d = completeReport();
    expect(reportFinished(d)).toBe(true);
    expect(
      activityFinished('GEO-032', { ...newActivity(), landformReport: d }),
    ).toBe(true);
    for (const key of [
      'mapChecked',
      'stepsChecked',
      'evidenceChecked',
    ] as const) {
      expect(reportFinished({ ...d, [key]: false })).toBe(false);
    }
    expect(reportChecklist({ ...d, explanationEn: '' }).bilingual).toBe(false);
    expect(
      reportChecklist({ ...d, explanationEn: '', spokenEn: true }).bilingual,
    ).toBe(true);
    expect(
      reportChecklist({
        ...d,
        evidence: [{ ...d.evidence[0]!, limit: '' }, d.evidence[1]!],
      }).evidence,
    ).toBe(false);
    expect(
      reportChecklist({
        ...d,
        steps: [{ ...d.steps[0]!, zh: '', en: '' }, ...d.steps.slice(1)],
      }).process,
    ).toBe(false);
  });
  it('repairs invalid locations, sources and steps while preserving long learner text', () => {
    const d = readLandformReport({
      ...completeReport(),
      caseId: 'custom',
      lat: 999,
      lon: NaN,
      steps: [{ process: 'bogus', zh: 'x'.repeat(900) }],
      evidence: [
        {
          lessonId: 'GEO-001',
          url: 'javascript:alert(1)',
          observation: 'y'.repeat(1600),
        },
      ],
    });
    expect(d.lat).toBe(0);
    expect(d.lon).toBe(0);
    expect(d.steps).toHaveLength(3);
    expect(d.steps[0]!.process).toBe('compression');
    expect(d.steps[0]!.zh).toHaveLength(700);
    expect(d.evidence[0]!.lessonId).toBe('GEO-021');
    expect(d.evidence[0]!.url).toBe('');
    expect(d.evidence[0]!.observation).toHaveLength(1500);
    expect(safeSourceUrl('https://name:password@example.org/')).toBe('');
    expect(safeSourceUrl('javascript:alert(1)')).toBe('');
    expect(safeSourceUrl('https://example.org/source')).toBe(
      'https://example.org/source',
    );
    expect(
      readLandformReport({ ...completeReport(), lat: 0, lon: 0 }).lat,
    ).toBe(-43.3);
  });
  it('escapes HTML/SVG and does not invent oral completion in empty drafts', () => {
    const d = completeReport();
    d.caseId = 'custom';
    d.placeZh = '<script>alert(1)</script>';
    d.placeEn = 'Long custom place '.repeat(5);
    d.titleZh = '<img src=x onerror=alert(1)>';
    d.evidence[0] = {
      ...d.evidence[0]!,
      lessonId: 'custom',
      sourceTitle: 'Example',
      url: 'javascript:alert(1)',
    };
    const html = reportHtml(d, []);
    expect(html).not.toContain('<script>');
    expect(html).not.toContain('<img');
    expect(html).not.toContain('href="javascript:');
    expect(html).toContain('&lt;img');
    expect(html).toContain(d.evidence[1]!.observation);
    expect(reportMapSvg(d)).toContain('&lt;script&gt;');
    expect(reportMapSvg(d)).toContain('Equirectangular');
    const draft = newLandformReport();
    expect(reportMarkdown(draft, [])).not.toContain(
      'oral explanation recorded',
    );
    expect(reportHtml(draft, [])).not.toContain('oral explanation recorded');
    draft.spokenZh = true;
    expect(reportHtml(draft, [])).toContain(
      'Chinese oral explanation recorded',
    );
  });
  it('keeps S1 atlas, S2 report, old notes and eighth family feedback independent through v1 reload', () => {
    let p = emptyProgress();
    p = patchSession(p, 'GEO-016', {
      note: '原先的地图记录',
      activity: { ...newActivity(), atlas: newAtlas() },
    });
    p = patchSession(p, 'GEO-029', {
      activity: {
        ...newActivity(),
        route: ['surface', 'soil', 'plant'],
        decisions: missions()['GEO-029']!,
      },
    });
    p = patchSession(p, 'GEO-032', {
      activity: { ...newActivity(), landformReport: completeReport() },
    });
    p.feedbackByBlock['GEO-029'] = {
      interest: 4,
      independence: 3,
      useful: '证据和推论',
      difficult: '气候归因',
    };
    const restored = readProgress(JSON.stringify(p));
    expect(restored.sessions['GEO-016']!.note).toBe('原先的地图记录');
    expect(restored.sessions['GEO-016']!.activity.atlas).toEqual(
      p.sessions['GEO-016']!.activity.atlas,
    );
    expect(restored.sessions['GEO-032']!.activity.landformReport).toEqual(
      completeReport(),
    );
    expect(restored.sessions['GEO-029']!.activity.route).toEqual([
      'surface',
      'soil',
      'plant',
    ]);
    expect(restored.feedbackByBlock['GEO-029']).toEqual(
      p.feedbackByBlock['GEO-029'],
    );
  });
});
