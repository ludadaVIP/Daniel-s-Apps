import mapData from '../../../content/map-data.json';
import { worldPoint } from './models';
import { escapeMarkup } from './atlasModel';
export const landscapeCases = [
  {
    id: 'alps',
    zh: '南阿尔卑斯山脉，新西兰',
    en: 'Southern Alps, New Zealand',
    lat: -43.3,
    lon: 170.5,
    asset: 'south-island-modis',
    lesson: 'GEO-021',
  },
  {
    id: 'ruapehu',
    zh: '鲁阿佩胡，新西兰',
    en: 'Ruapehu, New Zealand',
    lat: -39.3,
    lon: 175.6,
    asset: 'ruapehu-iss',
    lesson: 'GEO-020',
  },
  {
    id: 'valley',
    zh: 'Avalanche Lake山谷，美国',
    en: 'Avalanche Lake valley, USA',
    lat: 48.7,
    lon: -113.8,
    asset: 'glacier-u-valley',
    lesson: 'GEO-026',
  },
  {
    id: 'coast',
    zh: 'Third Beach海岸，美国',
    en: 'Third Beach coast, USA',
    lat: 47.9,
    lon: -124.6,
    asset: 'coast-stacks',
    lesson: 'GEO-027',
  },
  {
    id: 'custom',
    zh: '我选择的其他地貌',
    en: 'Another landform I choose',
    lat: 0,
    lon: 0,
    asset: 'apollo17-earth',
    lesson: 'GEO-024',
  },
] as const;
export const reportProcesses = [
  {
    id: 'compression',
    zh: '挤压与抬升',
    en: 'Compression/uplift',
    path: 'M15 68L43 28L73 68M3 47H25M19 41L25 47L19 53M86 47H65M71 41L65 47L71 53',
  },
  {
    id: 'fault',
    zh: '断层滑动',
    en: 'Fault slip',
    path: 'M5 27H42V70H5ZM49 17H86V60H49ZM35 35V58M29 52L35 58L41 52M57 50V28M51 34L57 28L63 34',
  },
  {
    id: 'melt',
    zh: '局部熔融与喷出',
    en: 'Local melt/eruption',
    path: 'M8 70L34 33L57 34L83 70M44 63V20M37 28L44 20L51 28M30 11L21 5M58 11L67 5',
  },
  {
    id: 'glacier',
    zh: '冰川磨蚀与拔蚀',
    en: 'Glacial erosion',
    path: 'M8 20Q15 65 44 68Q75 65 82 20M18 26Q27 52 44 53Q65 51 74 26M31 38H59M51 31L59 38L51 45',
  },
  {
    id: 'weather',
    zh: '原地风化',
    en: 'In-place weathering',
    path: 'M14 15H75V70H14ZM40 15L48 30L33 44L45 57L39 70M53 35L67 25M32 45L14 50',
  },
  {
    id: 'erode',
    zh: '侵蚀与搬运',
    en: 'Erosion/transport',
    path: 'M8 24L25 47L47 36L76 68M14 8L24 16M45 47L59 56M51 48L59 56L48 58',
  },
  {
    id: 'deposit',
    zh: '沉积',
    en: 'Deposition',
    path: 'M8 68H83M14 52H28M29 45H40M41 59H54M58 51H72M44 12V35M37 28L44 35L51 28',
  },
] as const;
export type ReportStep = { process: string; zh: string; en: string };
export type ReportEvidence = {
  lessonId: string;
  url: string;
  sourceTitle: string;
  observation: string;
  inference: string;
  limit: string;
};
export type LandformReport = {
  caseId: string;
  titleZh: string;
  titleEn: string;
  placeZh: string;
  placeEn: string;
  lat: number;
  lon: number;
  mapChecked: boolean;
  steps: ReportStep[];
  stepsChecked: boolean;
  evidence: ReportEvidence[];
  evidenceChecked: boolean;
  explanationZh: string;
  explanationEn: string;
  spokenZh: boolean;
  spokenEn: boolean;
};
export const newLandformReport = (): LandformReport => ({
  caseId: 'alps',
  titleZh: '我的地貌侦探报告',
  titleEn: 'My Landscape Detective Report',
  placeZh: '',
  placeEn: '',
  lat: -43.3,
  lon: 170.5,
  mapChecked: false,
  steps: Array.from({ length: 3 }, (_, i) => ({
    process: ['compression', 'erode', 'deposit'][i]!,
    zh: '',
    en: '',
  })),
  stepsChecked: false,
  evidence: Array.from({ length: 2 }, () => ({
    lessonId: 'GEO-021',
    url: '',
    sourceTitle: '',
    observation: '',
    inference: '',
    limit: '',
  })),
  evidenceChecked: false,
  explanationZh: '',
  explanationEn: '',
  spokenZh: false,
  spokenEn: false,
});
const object = (v: unknown): Record<string, unknown> =>
  v !== null && typeof v === 'object' && !Array.isArray(v)
    ? (v as Record<string, unknown>)
    : {};
const text = (v: unknown, max = 1500) =>
  typeof v === 'string' ? v.slice(0, max) : '';
export function safeSourceUrl(value: string) {
  try {
    const u = new URL(value);
    return ['https:', 'http:'].includes(u.protocol) &&
      !u.username &&
      !u.password
      ? u.href
      : '';
  } catch {
    return '';
  }
}
export function reportCourseId(v: unknown) {
  return typeof v === 'string' && /^GEO-0(1[7-9]|2[0-9]|3[01])$/.test(v)
    ? v
    : 'GEO-021';
}
export function readLandformReport(value: unknown): LandformReport {
  const r = object(value),
    base = newLandformReport(),
    caseId = landscapeCases.some((c) => c.id === r.caseId)
      ? String(r.caseId)
      : 'alps',
    item = landscapeCases.find((c) => c.id === caseId)!;
  const coord = (v: unknown, min: number, max: number, fallback: number) =>
    typeof v === 'number' && Number.isFinite(v) && v >= min && v <= max
      ? Math.round(v * 10) / 10
      : fallback;
  return {
    ...base,
    caseId,
    titleZh:
      typeof r.titleZh === 'string' ? text(r.titleZh, 100) : base.titleZh,
    titleEn:
      typeof r.titleEn === 'string' ? text(r.titleEn, 100) : base.titleEn,
    placeZh: text(r.placeZh, 100),
    placeEn: text(r.placeEn, 100),
    lat: caseId === 'custom' ? coord(r.lat, -80, 80, 0) : item.lat,
    lon: caseId === 'custom' ? coord(r.lon, -180, 180, 0) : item.lon,
    mapChecked: r.mapChecked === true,
    stepsChecked: r.stepsChecked === true,
    evidenceChecked: r.evidenceChecked === true,
    spokenZh: r.spokenZh === true,
    spokenEn: r.spokenEn === true,
    explanationZh: text(r.explanationZh),
    explanationEn: text(r.explanationEn),
    steps: base.steps.map((s, i) => {
      const v = object(Array.isArray(r.steps) ? r.steps[i] : undefined);
      return {
        process: reportProcesses.some((p) => p.id === v.process)
          ? String(v.process)
          : s.process,
        zh: text(v.zh, 700),
        en: text(v.en, 700),
      };
    }),
    evidence: base.evidence.map((s, i) => {
      const v = object(Array.isArray(r.evidence) ? r.evidence[i] : undefined);
      return {
        lessonId:
          v.lessonId === 'custom' ? 'custom' : reportCourseId(v.lessonId),
        url: safeSourceUrl(text(v.url, 1000)),
        sourceTitle: text(v.sourceTitle, 150),
        observation: text(v.observation),
        inference: text(v.inference),
        limit: text(v.limit),
      };
    }),
  };
}
export function reportPlace(d: LandformReport) {
  const c = landscapeCases.find((c) => c.id === d.caseId) ?? landscapeCases[0];
  return {
    zh: d.caseId === 'custom' ? d.placeZh : c.zh,
    en: d.caseId === 'custom' ? d.placeEn : c.en,
  };
}
export function reportChecklist(d: LandformReport) {
  const p = reportPlace(d);
  return {
    map:
      !!d.titleZh.trim() &&
      !!d.titleEn.trim() &&
      !!p.zh.trim() &&
      !!p.en.trim() &&
      Number.isFinite(d.lat) &&
      Number.isFinite(d.lon) &&
      d.lat >= -80 &&
      d.lat <= 80 &&
      d.lon >= -180 &&
      d.lon <= 180 &&
      d.mapChecked,
    process:
      d.steps.length === 3 &&
      d.steps.every(
        (s) =>
          reportProcesses.some((p) => p.id === s.process) &&
          !!(s.zh.trim() || s.en.trim()),
      ) &&
      d.stepsChecked,
    evidence:
      d.evidence.length === 2 &&
      d.evidence.every(
        (e) =>
          !!e.observation.trim() &&
          !!e.inference.trim() &&
          !!e.limit.trim() &&
          (e.lessonId === 'custom'
            ? !!e.sourceTitle.trim() && !!safeSourceUrl(e.url)
            : reportCourseId(e.lessonId) === e.lessonId),
      ) &&
      d.evidenceChecked,
    bilingual:
      !!(d.explanationZh.trim() || d.spokenZh) &&
      !!(d.explanationEn.trim() || d.spokenEn),
  };
}
export const reportFinished = (d: LandformReport) =>
  Object.values(reportChecklist(d)).every(Boolean);
export function reportMapSvg(d: LandformReport) {
  const pos = worldPoint(d.lon, d.lat, 0),
    p = reportPlace(d);
  const wrap = (value: string, size: number) => {
    const chars = Array.from(value),
      lines: string[] = [];
    for (let i = 0; i < chars.length; i += size)
      lines.push(chars.slice(i, i + size).join(''));
    return lines;
  };
  const lines = [...wrap(`1: ${p.zh}`, 40), ...wrap(p.en, 78)];
  const end = 470 + lines.length * 24;
  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 900 ${end + 80}" role="img"><title>位置地图 / Location map: ${escapeMarkup(p.zh)} / ${escapeMarkup(p.en)}</title><rect width="900" height="450" fill="#dcebed"/><path d="${mapData.world}" fill="#cbd4b1" stroke="#7f9381" stroke-width=".6"/><path d="M0 225H900" stroke="#608289" stroke-dasharray="5 5"/><path d="M860 65V20M852 30L860 20L868 30" fill="none" stroke="#315f69" stroke-width="3"/><text x="856" y="15">N</text><circle cx="${pos.x}" cy="${pos.y}" r="9" fill="#b96450" stroke="#fff" stroke-width="3"/><text x="${pos.x}" y="${pos.y + 5}" text-anchor="middle" font-size="12" fill="#fff">1</text>${lines.map((line, i) => `<text x="20" y="${470 + i * 24}" font-size="16">${escapeMarkup(line)}</text>`).join('')}<text x="20" y="${end}" font-size="15">${d.lat.toFixed(1)}°, ${d.lon.toFixed(1)}° · 大致位置 / Approximate location</text><text x="20" y="${end + 26}" font-size="13">圆点=介绍区域 / Dot=chosen region; approximate. 赤道虚线 / Dashed equator.</text><text x="20" y="${end + 52}" font-size="12">Natural Earth v5.1.2 · Public domain · 等距圆柱投影：形状、面积失真 / Equirectangular: distorted shape/area.</text></svg>`;
}
export function reportProcessSvg(d: LandformReport) {
  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 900 220" role="img"><title>我选择的过程示意 / My selected process diagram</title>${d.steps
    .map((s, i) => {
      const p = reportProcesses.find((p) => p.id === s.process)!;
      return `<g transform="translate(${15 + i * 300},10)"><rect width="270" height="190" rx="12" fill="#eef2e8" stroke="#7f9381"/><text x="14" y="27">${i + 1}</text><path d="${p.path}" transform="translate(90,15)" fill="none" stroke="#315f69" stroke-width="3"/><text x="135" y="125" text-anchor="middle" font-size="18">${p.zh}</text><text x="135" y="152" text-anchor="middle" font-size="15">${p.en}</text></g>${i < 2 ? `<path d="M288 103h24m-8-8l8 8-8 8" fill="none" stroke="#b96450" stroke-width="3"/>` : ''}`;
    })
    .join('')}</svg>`;
}
export type ReportSource = {
  id: string;
  titleZh: string;
  titleEn: string;
  sources: { title: string; url: string }[];
};
function evidenceSources(e: ReportEvidence, courses: ReportSource[]) {
  return e.lessonId === 'custom'
    ? [{ title: e.sourceTitle, url: safeSourceUrl(e.url) }]
    : (courses.find((c) => c.id === e.lessonId)?.sources ?? []);
}
export function reportMarkdown(d: LandformReport, courses: ReportSource[]) {
  const p = reportPlace(d);
  return `# ${d.titleZh} / ${d.titleEn}\n\n${reportFinished(d) ? '过程记录齐全；解释质量由本人/家人核对 / Process records complete; explanation quality is self/family assessed' : '草稿 / Draft'}\n\n地点 / Place: ${p.zh} / ${p.en}; approximate ${d.lat.toFixed(1)}°, ${d.lon.toFixed(1)}°.\n\n## 我选择的过程 / Selected processes\n\n${d.steps
    .map((s, i) => {
      const p = reportProcesses.find((p) => p.id === s.process)!;
      return `${i + 1}. ${p.zh} / ${p.en}\n\n${s.zh}\n\n${s.en}`;
    })
    .join(
      '\n\n',
    )}\n\n这些是我的解释步骤，不代表等长时间或实际先后已获证实；过程也可能同时发生。 / These are explanation steps, not proven chronology or equal time intervals; processes may overlap.\n\n## 证据与局限 / Evidence and limits\n\n${d.evidence
    .map(
      (e, i) =>
        `### ${i + 1}\n\n观察 / Observation: ${e.observation}\n\n推论 / Inference: ${e.inference}\n\n局限 / Limit: ${e.limit}\n\n${evidenceSources(
          e,
          courses,
        )
          .map((s) => `${s.title}: ${s.url}`)
          .join('\n\n')}`,
    )
    .join(
      '\n\n',
    )}\n\n## 双语讲解 / Bilingual explanation\n\n${d.explanationZh || (d.spokenZh ? '中文口头讲解已记录 / Chinese oral explanation recorded' : '中文尚未填写 / Chinese not yet written')}\n\n${d.explanationEn || (d.spokenEn ? '英文口头讲解已记录 / English oral explanation recorded' : '英文尚未填写 / English not yet written')}\n\n## 图例与来源 / Legend and sources\n\nNatural Earth v5.1.2 public-domain base; Study selected location/process illustrations. Dots and process cards are conceptual, not measured dimensions or hazard predictions.\n`;
}
export function reportHtml(d: LandformReport, courses: ReportSource[]) {
  const p = reportPlace(d),
    e = escapeMarkup;
  return `<!doctype html><html lang="zh"><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><title>${e(d.titleZh)} / ${e(d.titleEn)}</title><style>body{max-width:960px;margin:32px auto;padding:0 20px;font:17px/1.7 system-ui;overflow-wrap:anywhere;color:#294e52;background:#fafbf5}svg{width:100%;height:auto}section{border:1px solid #d0d9c8;border-radius:12px;padding:20px;margin:20px 0}p{white-space:pre-wrap;overflow-wrap:anywhere}a{color:#315f69}h1{font-size:30px}@media print{body{margin:0}section{break-inside:avoid}}</style><h1>${e(d.titleZh)}<br>${e(d.titleEn)}</h1><p>${reportFinished(d) ? '过程记录齐全 / Process records complete' : '草稿 / Draft'} · 内容质量由本人/家人核对 / Quality is self/family reviewed.</p><section><h2>地点 / Place</h2><p>${e(p.zh)} / ${e(p.en)}</p>${reportMapSvg(d)}</section><section><h2>我选择的过程 / Selected processes</h2>${reportProcessSvg(d)}${d.steps.map((s, i) => `<h3>${i + 1}</h3><p>${e(s.zh)}</p><p>${e(s.en)}</p>`).join('')}<p>解释步骤不代表已证实的先后或等长时间；过程可同时发生。 / Explanation order is not proven chronology/equal time; processes may overlap.</p></section>${d.evidence
    .map(
      (v, i) =>
        `<section><h2>证据 / Evidence ${i + 1}</h2><h3>观察 / Observation</h3><p>${e(v.observation)}</p><h3>推论 / Inference</h3><p>${e(v.inference)}</p><h3>局限 / Limit</h3><p>${e(v.limit)}</p>${evidenceSources(
          v,
          courses,
        )
          .map(
            (s) =>
              `<p><a href="${e(safeSourceUrl(s.url))}" rel="noreferrer">${e(s.title)}</a></p>`,
          )
          .join('')}</section>`,
    )
    .join(
      '',
    )}<section><h2>双语讲解 / Bilingual explanation</h2><p>${e(d.explanationZh || (d.spokenZh ? '中文口头讲解已记录 / Chinese oral explanation recorded' : '中文尚未填写 / Chinese not yet written'))}</p><p>${e(d.explanationEn || (d.spokenEn ? '英文口头讲解已记录 / English oral explanation recorded' : '英文尚未填写 / English not yet written'))}</p></section><p>Natural Earth v5.1.2 public-domain base; original Study illustrations. No measured process scale or hazard prediction. Report remains editable; process completion does not automatically grade explanation quality.</p></html>`;
}
