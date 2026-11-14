import {
  actualEvidenceCaption,
  evidenceAssumptions,
  evidenceProtocol,
  evidenceQuestions,
  evidenceSummary,
  evidenceTextFields,
  potatoRecords,
  percentChange,
  validEvidenceTimestamp,
  zeroEstimate,
  type EvidenceDraft,
} from './evidenceProject';
export const escapeEvidence = (s: string) =>
  [...s]
    .map((c) => {
      const code = c.codePointAt(0)!;
      return code === 9 ||
        code === 10 ||
        code === 13 ||
        (code >= 32 && code <= 0xd7ff) ||
        (code >= 0xe000 && code <= 0xfffd) ||
        code >= 0x10000
        ? c
        : '�';
    })
    .join('')
    .replace(
      /[&<>"']/g,
      (c) =>
        ({
          '&': '&amp;',
          '<': '&lt;',
          '>': '&gt;',
          '"': '&quot;',
          "'": '&apos;',
        })[c]!,
    );
const text = (x: number, y: number, s: string, size = 14) =>
  `<text x="${x}" y="${y}" font-size="${size}">${escapeEvidence(s)}</text>`;
export function evidenceGraphSvg(d: EvidenceDraft) {
  const caption = actualEvidenceCaption(d);
  const top = 85,
    bottom = 385,
    left = 85,
    right = 650;
  const x = (v: number) => left + (v / 0.8) * (right - left),
    y = (v: number) => top + ((16 - v) / 40) * (bottom - top);
  const factor = d.yAxis === 0 ? 1 : 0.03;
  const ticks = [-20, -10, 0, 10];
  const items = evidenceSummary
    .map((s) => {
      const pos = x(s.concentration);
      const rows = potatoRecords.filter(
        (r) => r.concentration === s.concentration,
      );
      const vals = rows.map((r) =>
        d.yAxis === 0
          ? percentChange(r.before, r.after)
          : (r.after - r.before) / factor,
      );
      const mean = vals.reduce((a, b) => a + b, 0) / 4;
      return `${d.display === 0 ? `<line x1="${pos}" x2="${pos}" y1="${y(Math.min(...vals))}" y2="${y(Math.max(...vals))}" stroke="#256b68" stroke-width="2"/>${rows.map((r, i) => `<circle cx="${pos + (i - 1.5) * 7}" cy="${y(vals[i]!)}" r="4" fill="${['#977949', '#276d68', '#b05761', '#5668a3'][i]}"><title>${r.id}: ${(d.yAxis === 0 ? percentChange(r.before, r.after) : r.after - r.before).toFixed(2)}</title></circle>`).join('')}` : ''}<rect x="${pos - 4}" y="${y(mean) - 4}" width="8" height="8" fill="#183f3a"/>`;
    })
    .join('');
  const labels =
    d.xAxis === 0
      ? concentrationsLabels
      : ['Cup 1', 'Cup 2', 'Cup 3', 'Cup 4', 'Cup 5'];
  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 760 505" role="img" aria-labelledby="evtitle evdesc"><title id="evtitle">${escapeEvidence(d.title)}</title><desc id="evdesc">${escapeEvidence(caption.en)}</desc><rect width="760" height="505" fill="#fcfaf5"/><g font-family="Arial, sans-serif" fill="#203e3a">${text(30, 25, 'External sucrose concentration and', 17)}${text(30, 48, 'potato mass change after 60 min', 17)}${ticks.map((v) => `<line x1="${left}" x2="${right}" y1="${y(v)}" y2="${y(v)}" stroke="${v === 0 ? '#183f3a' : '#d8dfd9'}" stroke-dasharray="${v === 0 ? '6 3' : 'none'}"/>${text(35, y(v) + 5, (v * factor).toFixed(d.yAxis === 0 ? 0 : 2))}`).join('')}<line x1="${left}" x2="${left}" y1="${top}" y2="${bottom}" stroke="#203e3a"/>${labels.map((v, i) => text(x(i * 0.2) - 14, 410, v)).join('')}${items}${text(85, 447, d.xAxis === 0 ? 'External sucrose concentration (mol/L)' : 'Cup category (incorrect for this question)')}${text(85, 70, d.yAxis === 0 ? 'Mass change (%)' : 'Raw mass difference (g) — starting mass not normalized')}${text(85, 477, d.display === 0 ? 'Circles: strips A–D | Square: mean | Bar: min–max' : 'Mean only — spread and individual strips hidden', 13)}</g></svg>`;
}
const concentrationsLabels = ['0.0', '0.2', '0.4', '0.6', '0.8'];
export const evidenceDataUrl = (svg: string) =>
  `data:image/svg+xml;charset=utf-8,${encodeURIComponent(svg)}`;
// SVG contains only generated geometry and escaped text, never student HTML.
export function evidenceSvg(d: EvidenceDraft) {
  let cursor = 40;
  const parts: string[] = [];
  const line = (s: string) => {
    let row = '',
      weight = 0;
    for (const char of s) {
      const w = char.charCodeAt(0) > 255 ? 2 : 1.6;
      if (weight + w > 88) {
        parts.push(text(32, cursor, row));
        cursor += 23;
        row = '';
        weight = 0;
      }
      row += char;
      weight += w;
    }
    parts.push(text(32, cursor, row));
    cursor += 23;
  };
  const paragraph = (label: string, s: string) => {
    line(label);
    for (const raw of s.split(/\r?\n/)) {
      let row = '',
        weight = 0;
      for (const char of raw) {
        const w = char.charCodeAt(0) > 255 ? 2 : 1.6;
        if (weight + w > 88) {
          line(row);
          row = '';
          weight = 0;
        }
        row += char;
        weight += w;
      }
      line(row);
    }
    cursor += 10;
  };
  paragraph('S05 Biology evidence report / 生物学证据报告', d.title);
  parts.push(
    `<svg x="25" y="${cursor}" width="850" height="565" viewBox="0 0 760 505">${evidenceGraphSvg(d).replace(/^<svg[^>]*>|<\/svg>$/g, '')}</svg>`,
  );
  cursor += 590;
  const caption = actualEvidenceCaption(d);
  paragraph('中文图注', caption.zh);
  paragraph('English caption', caption.en);
  paragraph(
    'Protocol / 实验设定',
    evidenceProtocol.zh + '\n' + evidenceProtocol.en,
  );
  paragraph(
    'Assumptions and limits / 假设和边界',
    evidenceAssumptions.zh + '\n' + evidenceAssumptions.en,
  );
  line('Raw paired records / 全部原始配对记录 — resolution 0.01 g');
  line(
    'ID | tuber block | external sucrose mol/L | before g | after g | change %',
  );
  for (const r of potatoRecords)
    line(
      `${r.id} | ${r.block} | ${r.concentration.toFixed(1)} | ${r.before.toFixed(2)} | ${r.after.toFixed(2)} | ${percentChange(r.before, r.after).toFixed(2)}`,
    );
  line('Summary: external mol/L | mean % | min % | max % | n');
  for (const r of evidenceSummary)
    line(
      `${r.concentration.toFixed(1)} | ${r.mean.toFixed(2)} | ${r.min.toFixed(2)} | ${r.max.toFixed(2)} | ${r.n}`,
    );
  paragraph(
    'Zero-change estimate / 零交点',
    `${zeroEstimate.toFixed(3)} mol/L, interpolation between 0.2 and 0.4 mol/L at 60 min; not an exact intracellular concentration or proof of equilibrium.`,
  );
  paragraph(
    'Percentage practice / 计算练习',
    d.calculations.map((v, i) => `${['A-2', 'A-3'][i]}: ${v}%`).join('\n'),
  );
  paragraph(
    'Citations / 两条引用',
    d.citations
      .map((id) => {
        const r = potatoRecords.find((r) => r.id === id),
          s = evidenceSummary.find((r) => r.id === id);
        return r
          ? `${id}: ${r.before.toFixed(2)} to ${r.after.toFixed(2)} g; ${percentChange(r.before, r.after).toFixed(2)}% at ${r.concentration} mol/L`
          : s
            ? `${id}: mean ${s.mean.toFixed(2)}%, range ${s.min.toFixed(2)} to ${s.max.toFixed(2)}%, n=${s.n}`
            : id;
      })
      .join('\n'),
  );
  for (const key of evidenceTextFields) paragraph(key, d[key]);
  paragraph(
    'Optional language practice / 可选第二语言练习',
    d.languagePractice,
  );
  for (const q of evidenceQuestions)
    paragraph(
      q.id + ' ' + q.prompt.en,
      `Answer: ${q.options[d.answers[q.id] ?? -1]?.en ?? 'unanswered'}\nExplanation: ${q.feedback.en}\n中文解释：${q.feedback.zh}`,
    );
  paragraph(
    'Self-review / 人工自核',
    String(d.reviewed) +
      '; automated checks validate structure, calculations, graph settings and citation IDs, not scientific prose quality.',
  );
  paragraph(
    'Graph settings / 图设置',
    JSON.stringify({ xAxis: d.xAxis, yAxis: d.yAxis, display: d.display }),
  );
  line(
    'Saved at / 保存时间: ' +
      (validEvidenceTimestamp(d.savedAt)
        ? new Date(d.savedAt).toISOString()
        : 'Draft / 草稿'),
  );
  line('END OF REPORT / 报告结束');
  return `<svg xmlns="http://www.w3.org/2000/svg" width="900" height="${cursor + 25}" viewBox="0 0 900 ${cursor + 25}" role="img"><title>Biology evidence report / 生物学证据报告</title><rect width="900" height="${cursor + 25}" fill="#fcfaf5"/><g font-family="Arial, Microsoft YaHei, sans-serif" fill="#203e3a">${parts.join('')}</g></svg>`;
}
