import { describe, expect, it } from 'vitest';
import {
  atlasChecklist,
  atlasFinished,
  atlasHtml,
  atlasMarkdown,
  atlasRegions,
  atlasSvg,
  newAtlas,
  readAtlas,
} from './atlasModel';
import {
  detectiveFinished,
  detectiveScenes,
  landUseScenes,
  nzFeatures,
  nzPoint,
  placeFinished,
} from './placeModels';
import { worldTargets } from './models';
import { activityFinished } from './Activities';
import {
  emptyProgress,
  newActivity,
  patchSession,
  readProgress,
} from './progress';
import { lessons } from './content';
const completeAtlas = () => ({
  ...newAtlas(),
  labels: worldTargets.map((p) => p.id),
  locationChecked: true,
  legendChecked: true,
  spokenZh: true,
  spokenEn: true,
  findings: Array.from({ length: 3 }, (_, i) => ({
    zh: `我的发现${i + 1}：温度与地形要一起读。`,
    en: '',
    evidence: '我查看了长期均值与同纬度高原／低地网格，保留其他因素的限制。',
    lessonId: 'GEO-012',
  })),
});
describe('land use and New Zealand positions', () => {
  it('requires all three evidence cases and a limit on social inference', () => {
    const d = Object.fromEntries(
      landUseScenes.map((p) => [`landuse-${p.id}`, p.expected]),
    );
    expect(placeFinished('GEO-013', d)).toBe(false);
    expect(placeFinished('GEO-013', { ...d, 'landuse-limit': 'limited' })).toBe(
      true,
    );
    expect(
      placeFinished('GEO-013', {
        ...d,
        'landuse-suburbs': 'built',
        'landuse-limit': 'limited',
      }),
    ).toBe(false);
  });
  it('keeps northern and southern features geographically ordered and requires the diverse-terrain comparison', () => {
    const a = nzFeatures.find((p) => p.id === 'auckland')!,
      w = nzFeatures.find((p) => p.id === 'wellington')!,
      c = nzFeatures.find((p) => p.id === 'christchurch')!;
    expect(nzPoint(a.lon, a.lat).y).toBeLessThan(nzPoint(w.lon, w.lat).y);
    expect(nzPoint(w.lon, w.lat).y).toBeLessThan(nzPoint(c.lon, c.lat).y);
    expect(nzPoint(175, -40).x).toBeGreaterThan(nzPoint(170, -40).x);
    const d = Object.fromEntries(nzFeatures.map((p) => [`nz-${p.id}`, p.id]));
    expect(placeFinished('GEO-014', d)).toBe(false);
    expect(placeFinished('GEO-014', { ...d, 'nz-comparison': 'varied' })).toBe(
      true,
    );
  });
});
describe('observation, inference and checking', () => {
  it('requires two distinct clues, uncertainty and source checking for every case', () => {
    const all: Record<string, string> = {};
    for (const s of detectiveScenes) {
      const d = {
        ...Object.fromEntries(
          s.evidence.map((k) => [`evidence-${s.id}-${k}`, 'yes']),
        ),
        [`guess-${s.id}`]: s.id,
        [`confidence-${s.id}`]: 'likely',
        [`revealed-${s.id}`]: 'yes',
        [`checked-${s.id}`]: 'source',
      };
      expect(detectiveFinished(s.id, d)).toBe(true);
      for (const key of Object.keys(d)) {
        const partial = { ...d };
        delete partial[key];
        expect(detectiveFinished(s.id, partial)).toBe(false);
      }
      expect(
        detectiveFinished(s.id, { ...d, [`confidence-${s.id}`]: 'certain' }),
      ).toBe(false);
      Object.assign(all, d);
    }
    expect(placeFinished('GEO-015', all)).toBe(true);
    delete all['checked-sand'];
    expect(placeFinished('GEO-015', all)).toBe(false);
  });
});
describe('a locally saved, family-reviewed stage atlas', () => {
  it('needs a complete map, three discoveries/evidence statements and both spoken introductions', () => {
    expect(atlasFinished(newAtlas())).toBe(false);
    expect(activityFinished('GEO-016', newActivity())).toBe(false);
    const a = completeAtlas();
    expect(atlasFinished(a)).toBe(true);
    expect(activityFinished('GEO-016', { ...newActivity(), atlas: a })).toBe(
      true,
    );
    expect(atlasChecklist({ ...a, labels: a.labels.slice(1) }).labels).toBe(
      false,
    );
    expect(atlasFinished({ ...a, titleZh: '' })).toBe(false);
    expect(atlasFinished({ ...a, locationChecked: false })).toBe(false);
    expect(atlasFinished({ ...a, legendChecked: false })).toBe(false);
    expect(atlasFinished({ ...a, spokenEn: false })).toBe(false);
    expect(
      atlasFinished({
        ...a,
        findings: a.findings.map((f, i) =>
          i === 1 ? { ...f, evidence: '' } : f,
        ),
      }),
    ).toBe(false);
    expect(
      atlasFinished({
        ...a,
        findings: a.findings.map((f, i) => (i === 1 ? { ...f, zh: '' } : f)),
      }),
    ).toBe(false);
  });
  it('sanitizes malformed drafts without inventing a completed project', () => {
    const a = readAtlas({
      centre: 42,
      palette: 'url(javascript:evil)',
      region: 'precise-address',
      labels: ['asia', 'asia', 'fake'],
      findings: [
        {
          zh: 42,
          en: 'x'.repeat(1000),
          evidence: 'y'.repeat(1000),
          lessonId: 'GEO-096',
        },
      ],
      spokenZh: 'yes',
    });
    expect(a.centre).toBe(180);
    expect(a.palette).toBe('sage');
    expect(a.region).toBe('nz');
    expect(a.labels).toEqual(['asia']);
    expect(a.findings).toHaveLength(3);
    expect(a.findings[0]!.en).toHaveLength(700);
    expect(a.findings[0]!.lessonId).toBe('GEO-001');
    expect(atlasFinished(a)).toBe(false);
    expect(readAtlas({ titleZh: '', titleEn: '' }).titleZh).toBe('');
  });
  it('preserves full evidence paragraphs and old v1 notes on reload', () => {
    const draft = completeAtlas();
    draft.findings[0]!.evidence =
      '证据段落很长，超过旧决策字段五十字限制。'.repeat(12);
    draft.findings[0]!.en =
      'This evidence paragraph must survive reload rather than disappearing from a short dictionary.';
    let p = patchSession(emptyProgress(), 'GEO-001', {
      note: '保留首课旧记录',
    });
    p = patchSession(p, 'GEO-016', {
      step: 3,
      activity: { ...newActivity(), atlas: draft },
    });
    expect(readProgress(JSON.stringify(p))).toEqual(p);
  });
  it('escapes personal text in standalone HTML and SVG, keeping exports script-free', () => {
    const a = completeAtlas();
    a.titleZh = '<script>alert(1)</script>';
    a.titleEn = 'A & B';
    a.findings[0]!.zh = '<img src=x onerror="bad()">';
    const courses = lessons.map((l) => ({
      id: l.id,
      titleZh: l.title.zh,
      titleEn: l.title.en,
      sources: l.sources,
    }));
    const svg = atlasSvg(a),
      html = atlasHtml(a, courses);
    expect(svg).not.toContain('<script>');
    expect(html).not.toContain('<img src=x');
    expect(html).not.toContain('<script');
    expect(html).toContain('&lt;img');
    expect(svg).toContain('A &amp; B');
    expect(html).toContain('GEO-012');
    expect(html).toContain('1991');
    expect(html).toContain(
      'https://www.naturalearthdata.com/about/terms-of-use/',
    );
    expect(svg).toContain('<path d="M');
    expect(svg).not.toContain('<image');
    expect(html).not.toContain('<iframe');
  });
  it('exports the actual chosen region, labels, evidence and draft state rather than template findings', () => {
    const a = completeAtlas();
    a.region = 'kenya';
    a.centre = 0;
    const report = atlasMarkdown(
      a,
      lessons.map((l) => ({
        id: l.id,
        titleZh: l.title.zh,
        titleEn: l.title.en,
        sources: l.sources,
      })),
    );
    expect(report).toContain(atlasRegions.find((p) => p.id === 'kenya')!.en);
    expect(report).toContain(a.findings[0]!.evidence);
    expect(report).toContain('Centre 0°');
    expect(report).toContain('GEO-012');
    expect(atlasMarkdown(newAtlas(), [])).toContain('草稿 / Draft');
  });
});
