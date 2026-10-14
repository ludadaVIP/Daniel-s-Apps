import { worldPoint, worldTargets } from './models';
import mapData from '../../../content/map-data.json';
export const atlasRegions = [
  { id: 'nz', zh: '新西兰附近', en: 'Near New Zealand', lat: -40, lon: 175 },
  {
    id: 'china',
    zh: '中国中部附近',
    en: 'Near central China',
    lat: 35,
    lon: 105,
  },
  { id: 'uk', zh: '英国附近', en: 'Near the United Kingdom', lat: 55, lon: -5 },
  { id: 'kenya', zh: '肯尼亚附近', en: 'Near Kenya', lat: 0, lon: 40 },
] as const;
export type AtlasFinding = {
  zh: string;
  en: string;
  evidence: string;
  lessonId: string;
};
export type AtlasDraft = {
  titleZh: string;
  titleEn: string;
  centre: 0 | 180;
  palette: 'sage' | 'sand';
  region: string;
  labels: string[];
  locationChecked: boolean;
  legendChecked: boolean;
  findings: AtlasFinding[];
  spokenZh: boolean;
  spokenEn: boolean;
};
export const newAtlas = (): AtlasDraft => ({
  titleZh: '我的地球探险地图',
  titleEn: 'My Explorer Atlas',
  centre: 180,
  palette: 'sage',
  region: 'nz',
  labels: [],
  locationChecked: false,
  legendChecked: false,
  findings: Array.from({ length: 3 }, () => ({
    zh: '',
    en: '',
    evidence: '',
    lessonId: 'GEO-001',
  })),
  spokenZh: false,
  spokenEn: false,
});
const record = (v: unknown): Record<string, unknown> =>
  v !== null && typeof v === 'object' && !Array.isArray(v)
    ? (v as Record<string, unknown>)
    : {};
const text = (v: unknown, max = 700) =>
  typeof v === 'string' ? v.slice(0, max) : '';
export function readAtlas(raw: unknown): AtlasDraft {
  const r = record(raw),
    base = newAtlas();
  return {
    ...base,
    titleZh:
      typeof r.titleZh === 'string' ? text(r.titleZh, 100) : base.titleZh,
    titleEn:
      typeof r.titleEn === 'string' ? text(r.titleEn, 100) : base.titleEn,
    centre: r.centre === 0 ? 0 : 180,
    palette: r.palette === 'sand' ? 'sand' : 'sage',
    region: atlasRegions.some((p) => p.id === r.region)
      ? String(r.region)
      : 'nz',
    labels: Array.isArray(r.labels)
      ? worldTargets
          .filter((p) => r.labels instanceof Array && r.labels.includes(p.id))
          .map((p) => p.id)
      : [],
    locationChecked: r.locationChecked === true,
    legendChecked: r.legendChecked === true,
    spokenZh: r.spokenZh === true,
    spokenEn: r.spokenEn === true,
    findings: base.findings.map((f, i) => {
      const v = record(Array.isArray(r.findings) ? r.findings[i] : undefined);
      return {
        zh: text(v.zh),
        en: text(v.en),
        evidence: text(v.evidence),
        lessonId:
          typeof v.lessonId === 'string' &&
          /^GEO-00[1-9]$|^GEO-01[0-5]$/.test(v.lessonId)
            ? v.lessonId
            : f.lessonId,
      };
    }),
  };
}
export function atlasChecklist(d: AtlasDraft) {
  return {
    labels:
      !!d.titleZh.trim() &&
      !!d.titleEn.trim() &&
      worldTargets.every((p) => d.labels.includes(p.id)),
    location: d.locationChecked && atlasRegions.some((p) => p.id === d.region),
    legend: d.legendChecked,
    findings:
      d.findings.length === 3 &&
      d.findings.every(
        (f) => (f.zh.trim() || f.en.trim()) && f.evidence.trim(),
      ),
    introduction: d.spokenZh && d.spokenEn,
  };
}
export const atlasFinished = (d: AtlasDraft) =>
  Object.values(atlasChecklist(d)).every(Boolean);
export const escapeMarkup = (s: string) =>
  s.replace(
    /[&<>"']/g,
    (c) =>
      ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' })[
        c
      ]!,
  );
export function atlasSvg(d: AtlasDraft) {
  const land = d.palette === 'sand' ? '#dfcaa1' : '#cbd4b1',
    ocean = '#dcebed',
    region = atlasRegions.find((p) => p.id === d.region) ?? atlasRegions[0],
    pos = worldPoint(region.lon, region.lat, d.centre);
  const labels = worldTargets
    .filter((p) => d.labels.includes(p.id))
    .map((p) => {
      const q = worldPoint(p.lon, p.lat, d.centre);
      return `<g><circle cx="${q.x}" cy="${q.y}" r="3" fill="#315f69"/><text x="${Math.max(95, Math.min(805, q.x))}" y="${q.y - 7}" text-anchor="middle" font-size="14" fill="#244951" stroke="#f8faf5" stroke-width="3" paint-order="stroke">${escapeMarkup(p.name.zh)} / ${escapeMarkup(p.name.en)}</text></g>`;
    })
    .join('');
  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 900 560" role="img"><title>${escapeMarkup(d.titleZh)} / ${escapeMarkup(d.titleEn)}</title><desc>Personal teaching atlas: continent/ocean labels, a coarse chosen region, north arrow, equator and legend. Equirectangular projection; no precise home location.</desc><rect width="900" height="560" fill="#fafbf5"/><text x="20" y="30" font-size="20" fill="#315f69">${escapeMarkup(d.titleZh.slice(0, 28))}${d.titleZh.length > 28 ? '…' : ''}</text><text x="20" y="47" font-size="14" fill="#315f69">${escapeMarkup(d.titleEn.slice(0, 75))}${d.titleEn.length > 75 ? '…' : ''}</text><svg x="0" y="50" width="900" height="450" viewBox="0 0 900 450"><rect width="900" height="450" fill="${ocean}"/>${[-900, 0, 900].map((offset) => `<path d="${mapData.world}" transform="translate(${offset - d.centre * 2.5} 0)" fill="${land}" stroke="#7f9381" stroke-width=".7"/>`).join('')}<path d="M0 225H900" stroke="#718d8e" stroke-dasharray="5 6"/><text x="10" y="218" font-size="13">赤道 / Equator 0°</text><path d="M868 63V20M861 29L868 20L875 29" fill="none" stroke="#315f69" stroke-width="2"/><text x="863" y="15" font-size="15">N</text>${labels}<path d="M${pos.x} ${pos.y - 10}l10 20h-20Z" fill="#b96450" stroke="#fff" stroke-width="2"/></svg><rect x="20" y="514" width="18" height="12" fill="${land}"/><text x="44" y="525" font-size="13">陆地 / Land</text><rect x="155" y="514" width="18" height="12" fill="${ocean}" stroke="#7f9381"/><text x="179" y="525" font-size="13">海洋 / Ocean</text><path d="M306 513l8 14h-16Z" fill="#b96450"/><text x="320" y="525" font-size="13">介绍区域 / Chosen region: ${escapeMarkup(region.zh)} / ${region.en}</text><text x="20" y="548" font-size="11" fill="#526e6e">Natural Earth v5.1.2 · public domain · Study styling. 等距圆柱 / Equirectangular: shape/area distorted; regional marker is approximate.</text></svg>`;
}
export type AtlasSource = {
  id: string;
  titleZh: string;
  titleEn: string;
  sources: { title: string; url: string }[];
};
export function atlasMarkdown(d: AtlasDraft, courses: AtlasSource[]) {
  const region = atlasRegions.find((p) => p.id === d.region) ?? atlasRegions[0];
  return `# ${d.titleZh} / ${d.titleEn}\n\n${atlasFinished(d) ? '家庭核对记录齐全 / Family review records complete' : '草稿 / Draft'}\n\n介绍区域 / Chosen region: ${region.zh} / ${region.en}; approximate ${region.lat}°, ${region.lon}°. No precise location collected.\n\n图例 / Legend: land, ocean, chosen region; north up. Centre ${d.centre}°. Equirectangular projection: area/shape distortion, no global distance ruler.\n\n洲洋标签 / Labels: ${worldTargets
    .filter((p) => d.labels.includes(p.id))
    .map((p) => `${p.name.zh} / ${p.name.en}`)
    .join(
      '; ',
    )}\n\n${d.findings.map((f, i) => `## 发现 ${i + 1} / Discovery ${i + 1}\n\n中文: ${f.zh || '已口头介绍或待补充 / Oral or pending'}\n\nEnglish: ${f.en || 'Oral or pending / 已口头介绍或待补充'}\n\n证据 / Evidence: ${f.evidence || '待补充 / Pending'}\n\n课程 / Lesson: ${f.lessonId}\n`).join('\n')}\n## 双语介绍 / Bilingual introduction\n\n中文 / Chinese: ${d.spokenZh ? '已口头介绍 / Recorded' : '待完成 / Pending'}\nEnglish: ${d.spokenEn ? 'Recorded / 已口头介绍' : 'Pending / 待完成'}\n\n## 资料来源 / Sources\n\nBase: Natural Earth v5.1.2, public domain. https://www.naturalearthdata.com/about/terms-of-use/\n${courses
    .filter((c) => d.findings.some((f) => f.lessonId === c.id))
    .flatMap((c) => c.sources.map((s) => `- ${c.id}: ${s.title} — ${s.url}`))
    .join(
      '\n',
    )}\n\n这是个人教学作品；自由解释由家长核对，未由机器评分。 / Personal teaching work; free explanations are family-reviewed, not automatically graded.\n`;
}
export function atlasHtml(d: AtlasDraft, courses: AtlasSource[]) {
  const findings = d.findings
    .map(
      (f, i) =>
        `<article><h2>我发现了 ${i + 1} / Discovery ${i + 1}</h2><p lang="zh">${escapeMarkup(f.zh) || '中文口头介绍或待补充'}</p><p lang="en">${escapeMarkup(f.en) || 'English oral introduction or pending'}</p><p><b>证据 / Evidence:</b> ${escapeMarkup(f.evidence) || '待补充 / Pending'}</p><p>${escapeMarkup(f.lessonId)}</p></article>`,
    )
    .join('');
  const sources = courses
    .filter((c) => d.findings.some((f) => f.lessonId === c.id))
    .flatMap((c) =>
      c.sources.map(
        (s) =>
          `<li>${escapeMarkup(c.id)}: <a href="${escapeMarkup(s.url)}">${escapeMarkup(s.title)}</a></li>`,
      ),
    )
    .join('');
  return `<!doctype html><html lang="zh"><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><title>${escapeMarkup(d.titleZh)} / ${escapeMarkup(d.titleEn)}</title><style>body{font:17px/1.7 system-ui,sans-serif;background:#fafbf5;color:#294e52;max-width:1000px;margin:32px auto;padding:0 20px}svg{width:100%;height:auto}article{border:1px solid #d6ded1;border-radius:12px;padding:18px;margin:20px 0;break-inside:avoid}p{white-space:pre-wrap}a{color:#315f69;overflow-wrap:anywhere}@media print{body{font-size:12pt;margin:0;background:white}svg{max-width:100%}article{break-inside:avoid}}@page{margin:15mm}</style><body><h1>${escapeMarkup(d.titleZh)}<br><small>${escapeMarkup(d.titleEn)}</small></h1><p>${atlasFinished(d) ? '家庭核对记录齐全 / Family review records complete' : '草稿 / Draft'} · 手工教学地图 / Personal teaching atlas</p>${atlasSvg(d)}<p>所选区域为大致位置，无精确家庭地址或GPS。 / The chosen region is approximate; no precise address or GPS.</p>${findings}<h2>口头介绍 / Oral introduction</h2><p>中文 / Chinese: ${d.spokenZh ? '已记录 / Recorded' : '待完成 / Pending'}<br>English: ${d.spokenEn ? 'Recorded / 已记录' : 'Pending / 待完成'}</p><h2>资料来源 / Sources</h2><p>Base: <a href="https://www.naturalearthdata.com/about/terms-of-use/">Natural Earth v5.1.2 — public domain</a>, Study styling. Shapes/areas distorted by projection; no shared world-wide distance scale.</p><ul>${sources}</ul><p>自己的解释由家庭核对，未被机器自动评分。 / Free explanations are family-reviewed, not automatically graded.</p></body></html>`;
}
