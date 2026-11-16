import {
  actualGraduationCaption,
  datasetLimits,
  formatNumber,
  graduationQuestions,
  graduationUnderstanding,
  manualRubric,
  observationDate,
  observationLimits,
  plantAnalysis,
  ratioPercent,
  researchFields,
  scopedWolfRecords,
  speechSeconds,
  speechTitles,
  structuredAbstract,
  wolfRecords,
  wolfSource,
  wolfSourceTotals,
  wolfSummary,
  type GraduationCaseId,
  type GraduationDraft,
  type ResearchCase,
} from './graduationProject';
import { t } from './schema';

export const researchLabels = {
  question: t(
    '研究问题：什么可以用所选数据回答？',
    'Research question: what can the selected data answer?',
  ),
  method: t(
    '方法：资料如何收集，自己如何分析？',
    'Method: how were records collected and how did you analyse them?',
  ),
  conditions: t(
    '条件、时间与纳入范围',
    'Conditions, dates and inclusion scope',
  ),
  source: t(
    '资料出处或自录来源说明',
    'Provenance or self-reported source description',
  ),
  claim: t('主张：限定到这些数据', 'Claim: limited to these data'),
  reasoning: t(
    '证据与推理：引用记录ID、数值、单位和分母',
    'Evidence and reasoning: cite record IDs, values, units and denominators',
  ),
  mechanism: t(
    '机制假设：哪些变量没有测量？',
    'Mechanism hypothesis: which variables were not measured?',
  ),
  limitation: t('局限与不确定性', 'Limitations and uncertainty'),
  alternative: t(
    '替代解释与区分方法',
    'Alternative explanation and how to distinguish it',
  ),
  nextQuestion: t(
    '进一步研究：可检验的新问题',
    'Further investigation: a testable new question',
  ),
  variable: t(
    '所问变量、水平或观察比较',
    'Variable, levels or observational comparison',
  ),
  measured: t(
    '测量什么、单位、时间与方法',
    'Outcome, units, timing and measurement method',
  ),
  controls: t(
    '控制条件或观察性混杂因素',
    'Controlled conditions or observational confounders',
  ),
  sampling: t(
    '取样单位与独立重复：怎样避免伪重复？',
    'Sampling units and independent replication: how will you avoid pseudoreplication?',
  ),
  challenge: t(
    '什么结果会挑战你的主张？',
    'Which result would challenge your claim?',
  ),
  references: t(
    '参考来源：机构、题名、日期、页码或自录记录',
    'References: agency, title, dates, page or self-recorded log',
  ),
  revisionWhat: t('修订记录：改了什么？', 'Revision record: what changed?'),
  revisionWhy: t(
    '修订理由：哪条反馈或证据促使修改？',
    'Revision reason: which evidence or feedback prompted the change?',
  ),
  secondLanguage: t(
    '可选：另一语言的表达练习',
    'Optional: expression practice in another language',
  ),
};
export function escapeHtml(value: unknown): string {
  // Iterate complete code points, preserving valid surrogate pairs while making
  // lone surrogates and XML 1.0's forbidden characters visible as replacements.
  const xmlSafe = Array.from(String(value), (character) => {
    const point = character.codePointAt(0)!;
    const invalid =
      (point < 0x20 && point !== 0x09 && point !== 0x0a && point !== 0x0d) ||
      (point >= 0xd800 && point <= 0xdfff) ||
      point === 0xfffe ||
      point === 0xffff;
    return invalid ? '\uFFFD' : character;
  }).join('');
  return xmlSafe.replace(
    /[&<>"']/g,
    (c) =>
      ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' })[
        c
      ]!,
  );
}
const label = (x: number, y: number, text: unknown, anchor = 'start') =>
  `<text x="${x}" y="${y}" text-anchor="${anchor}" font-size="14" fill="#173b32">${escapeHtml(text)}</text>`;
export function graduationGraphSvg(
  id: GraduationCaseId,
  c: ResearchCase,
): string {
  let plot = '';
  const width = 820;
  let height = 320;
  if (id === 'official') {
    if (c.graph === 'counts') {
      const rows = scopedWolfRecords(c.scope);
      height = 150 + rows.length * 52;
      const x = 255,
        scale = 25;
      plot +=
        label(25, 30, 'Adults / 成年') +
        '<rect x="170" y="17" width="20" height="14" fill="#285e50" />' +
        label(350, 30, 'Pups / 幼狼') +
        '<rect x="475" y="17" width="20" height="14" fill="#bd772d" />';
      for (let tick = 0; tick <= 20; tick += 5) {
        const xx = x + tick * scale;
        plot +=
          `<path d="M${xx} 65V${height - 75}" stroke="#d7e2dc"/>` +
          label(xx, height - 50, tick, 'middle');
      }
      rows.forEach((row, index) => {
        const y = 78 + index * 52;
        plot +=
          label(15, y + 13, row.group) +
          label(
            15,
            y + 32,
            row.region === 'Interior' ? 'Interior / 内部' : 'Northern / 北部',
          );
        plot += `<rect x="${x}" y="${y}" width="${row.adults * scale}" height="16" fill="#285e50"/><rect x="${x}" y="${y + 19}" width="${row.pups * scale}" height="16" fill="#bd772d"/>`;
        plot +=
          label(x + row.adults * scale + 6, y + 13, row.adults) +
          label(x + row.pups * scale + 6, y + 32, row.pups);
      });
      plot += label(490, height - 17, 'Wolves / 狼（只）', 'middle');
    } else {
      const scopes =
        c.scope === 'all'
          ? (['Northern Range', 'Interior'] as const)
          : [c.scope];
      plot += label(20, 30, 'Pooled pup share / 地区合并幼狼比例');
      scopes.forEach((scope, index) => {
        const s = wolfSummary(scope),
          y = 80 + index * 70;
        plot +=
          label(20, y + 22, scope) +
          `<rect x="225" y="${y}" width="${(s.share ?? 0) * 5}" height="30" fill="#bd772d"/>` +
          label(
            235 + (s.share ?? 0) * 5,
            y + 22,
            `${s.pups}/${s.total} = ${formatNumber(s.share)}%`,
          );
      });
      for (let tick = 0; tick <= 100; tick += 20)
        plot += label(225 + tick * 5, 255, tick, 'middle');
      plot +=
        '<path d="M225 235H725" stroke="#173b32"/>' +
        label(475, 292, 'Pups / total wolves (%) · 幼狼/全部狼（%）', 'middle');
    }
  } else {
    height = 430;
    const a = plantAnalysis(c),
      rows = a.selected;
    if (!a.valid.length)
      plot += label(45, 80, 'No valid observations yet / 尚无有效观察');
    else {
      const minDay = Math.min(...rows.map((r) => r.day)),
        maxDay = Math.max(minDay + 1, ...rows.map((r) => r.day));
      const top = Math.max(1, ...a.valid.map((r) => r.value)) * 1.15;
      const x = (day: number) =>
        100 + ((day - minDay) / Math.max(1, maxDay - minDay)) * 620;
      const y = (value: number) => 335 - (value / top) * 260;
      for (let tick = 0; tick <= 4; tick++) {
        const value = (top * tick) / 4,
          yy = y(value);
        plot +=
          `<path d="M100 ${yy}H720" stroke="#d7e2dc"/>` +
          label(85, yy + 5, formatNumber(value), 'end');
      }
      let previous: (typeof rows)[number] | undefined;
      for (const row of rows) {
        if (row.value === null) {
          previous = undefined;
          plot += label(x(row.day), 358, 'NA', 'middle');
          continue;
        }
        if (previous?.value !== undefined && previous.value !== null)
          plot += `<path d="M${x(previous.day)} ${y(previous.value)}L${x(row.day)} ${y(row.value)}" stroke="#285e50" stroke-width="3" fill="none"/>`;
        plot += `<circle cx="${x(row.day)}" cy="${y(row.value)}" r="5" fill="#bd772d"><title>${escapeHtml(`${row.id}: day ${row.day}, ${row.value} cm`)}</title></circle>`;
        previous = row;
      }
      // Five evenly spaced numeric ticks keep a 100-record series legible.
      for (let tick = 0; tick <= 4; tick++) {
        const day = minDay + ((maxDay - minDay) * tick) / 4;
        plot += label(x(day), 382, formatNumber(day), 'middle');
      }
      plot += '<path d="M100 60V335H720" stroke="#173b32" fill="none"/>';
    }
    plot +=
      label(25, 30, 'Height (cm) / 高度（cm）') +
      label(410, 415, 'Elapsed days / 实际经过日', 'middle');
  }
  const caption = actualGraduationCaption(id, c);
  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${width} ${height}" width="${width}" height="${height}" role="img" aria-label="${escapeHtml(caption.en)}"><title>${escapeHtml(caption.zh)}</title><rect width="${width}" height="${height}" fill="#fffdf8"/>${plot}</svg>`;
}
function table(headers: string[], rows: unknown[][]) {
  return `<div class="table-scroll"><table><thead><tr>${headers.map((h) => `<th>${escapeHtml(h)}</th>`).join('')}</tr></thead><tbody>${rows.map((row) => `<tr>${row.map((cell) => `<td>${escapeHtml(cell)}</td>`).join('')}</tr>`).join('')}</tbody></table></div>`;
}
export function graduationReportHtml(
  draft: GraduationDraft,
  id: GraduationCaseId,
): string {
  const c = draft.cases[id],
    abstract = structuredAbstract(id, c),
    caption = actualGraduationCaption(id, c);
  const checks = graduationUnderstanding(draft);
  const paragraph = (title: string, text: unknown) =>
    `<h3>${escapeHtml(title)}</h3><p class="student">${escapeHtml(text || '（未填写 / not entered）')}</p>`;
  let data: string;
  if (id === 'official') {
    const s = wolfSummary(c.scope);
    data = paragraph(
      'Provenance / 来源',
      `${wolfSource.agency}\n${wolfSource.title}\nObservation / 观察日期: ${wolfSource.observationDate}; page / 页 ${wolfSource.page}; accessed / 查阅 ${wolfSource.accessDate}\nSHA256: ${wolfSource.sha256}\n${wolfSource.transcription}\n${wolfSource.method}`,
    );
    data += `<p><a href="${wolfSource.url}">NPS original annual report / 原始报告</a> · <a href="${wolfSource.mechanismSource}">NPS ecology background / 生态背景（不能证明本表未测原因）</a></p>`;
    data += paragraph(
      'Actual scope and computed summary / 实际纳入范围与计算摘要',
      `${c.scope}; ${s.rows} source rows; adults ${s.adults}, pups ${s.pups}, total ${s.total} wolves. Pooled pup share ${s.pups}/${s.total} ×100 = ${formatNumber(s.share)}%. Summed raw rows only; source totals not added again.`,
    );
    data += table(
      [
        'ID',
        'Region / 地区',
        'Group / 群体',
        'Kind / 类型',
        'Adults / 成年',
        'Pups / 幼狼',
        'Total / 总计',
        'Pup share / 幼狼份额',
        'Included / 纳入',
      ],
      wolfRecords.map((r) => [
        r.id,
        r.region,
        r.group,
        r.kind,
        r.adults,
        r.pups,
        r.total,
        `${formatNumber(ratioPercent(r.pups, r.total))}${r.total ? '%' : ''}`,
        c.scope === 'all' || c.scope === r.region
          ? 'yes / 是'
          : 'no: other region / 其他地区',
      ]),
    );
    data +=
      '<h3>Published totals: cross-checks only, never extra records / 原表汇总：仅校验，不是新增数据行</h3>';
    data += table(
      ['Scope / 范围', 'Adults / 成年', 'Pups / 幼狼', 'Total / 总计'],
      Object.entries(wolfSourceTotals).map(([scope, row]) => [
        scope,
        row.adults,
        row.pups,
        row.total,
      ]),
    );
    data += paragraph(
      'Assumptions and limits / 假设与局限',
      `${datasetLimits.zh}\n${datasetLimits.en}`,
    );
  } else {
    const a = plantAnalysis(c);
    data = paragraph(
      'Self-reported provenance / 自录来源',
      `Student-entered, not externally verified / 学生自录，未经外部核验\nStart date / 起始日: ${c.startDate || '—'}; active plant / 当前植株: ${c.activePlant || '—'}\nValid measurements / 有效测量: ${a.valid.length}; independent plant n=1; difference ${formatNumber(a.difference)} cm; relative change ${formatNumber(a.relative)}%.`,
    );
    data += table(
      [
        'ID',
        'Plant / 植株',
        'Elapsed day / 经过日',
        'Date / 日期',
        'Height / 高度 cm',
        'Inclusion / 纳入或排除理由',
      ],
      c.records.map((r) => [
        r.id,
        r.plant,
        r.day,
        observationDate(c, r.day),
        r.value === null ? 'NA / 缺失' : r.value,
        r.plant !== c.activePlant
          ? 'Excluded: other plant / 其他植株'
          : r.value === null
            ? 'Excluded from calculation: missing / 计算排除：缺失；图中断线'
            : 'Included / 纳入',
      ]),
    );
    data += paragraph(
      'Assumptions and limits / 假设与局限',
      `${observationLimits.zh}\n${observationLimits.en}`,
    );
  }
  const fields = researchFields
    .map((key) =>
      paragraph(
        `${researchLabels[key].zh} / ${researchLabels[key].en}`,
        c.text[key],
      ),
    )
    .join('');
  const speech = c.speech
    .map(
      (segment, index) =>
        `<section>${paragraph(`${index + 1}. ${speechTitles[index]!.zh} / ${speechTitles[index]!.en} — ${segment.seconds} s`, segment.notes)}${paragraph('Optional other language / 可选另一语言', segment.otherLanguage)}</section>`,
    )
    .join('');
  const questions = graduationQuestions
    .map((q, index) => {
      const answer = draft.answers[q.id],
        option = answer === undefined ? undefined : q.options[answer];
      return paragraph(
        `${q.id} · ${q.prompt.zh} / ${q.prompt.en}`,
        `Revisit / 回看 ${['L123', 'L127', 'L131', 'L134', 'L138', 'L143'][index]}\nLearner choice / 学生选择: ${option ? `${option.zh} / ${option.en}` : 'unanswered / 未答'}\n${answer === undefined ? 'Unanswered / 未答' : answer === q.correct ? 'Correct / 正确' : 'Needs revision / 需订正'}\nFeedback / 反馈: ${q.feedback.zh} / ${q.feedback.en}`,
      );
    })
    .join('');
  return `<!doctype html><html lang="en"><head><meta charset="UTF-8"><meta name="viewport" content="width=device-width,initial-scale=1"><title>My Biology Investigation / 我的生命科学研究</title><style>body{font:17px/1.65 system-ui,sans-serif;color:#173b32;background:#fffdf8;margin:0;padding:32px}main{max-width:1000px;margin:auto;min-width:0}h1,h2,h3,p,td,th{overflow-wrap:anywhere}h1{font-size:32px}h2{margin-top:36px;border-top:1px solid #cbd7cb;padding-top:20px}h3{font-size:18px}.student{white-space:pre-wrap}.graph,.table-scroll{overflow:auto;max-width:100%;border:1px solid #cbd7cb;padding:10px}.graph svg{display:block;max-width:none}table{border-collapse:collapse;min-width:720px}td,th{text-align:left;padding:8px;border-bottom:1px solid #d7e2dc;white-space:nowrap}a{color:#285e50}section{break-inside:avoid}small{font-size:14px}@media print{body{padding:0;font-size:11pt}.graph,.table-scroll{overflow:visible;border:0;padding:0}.graph svg{max-width:100%;height:auto}table{min-width:0;width:100%;font-size:8pt}td,th{white-space:normal;padding:4px}h2{break-after:avoid}section{break-inside:auto}}</style></head><body><main><h1>我的生命科学研究 / My Biology Investigation</h1><p>${escapeHtml(id === 'official' ? 'Official ecological monitoring / 官方生态监测' : 'Safe home plant observation / 安全家庭植物观察')} · ${c.savedAt ? `Saved / 已保存: ${escapeHtml(new Date(c.savedAt).toISOString())}` : 'DRAFT / 草稿，尚未保存为完整报告'}</p><p>自动检查只核对结构、计算与图表；文字的科学质量需要学生和读者审阅。 / Automated checks assess structure, calculations and graphs; they do not judge the scientific quality of the prose.</p><h2>辅助结构化摘要 / Assisted structured abstract</h2><p>按当前数据生成的双语支架，非自由文字的自动翻译，也不代替学生主张。 / This bilingual scaffold uses the current data; it is not a translation of free prose or a replacement for the learner's claim.</p><p>${escapeHtml(abstract.zh)}</p><p>${escapeHtml(abstract.en)}</p><h2>Actual graph / 实际图表</h2><div class="graph" tabindex="0" role="region" aria-label="Research graph; scroll horizontally / 研究图表，可横向滚动">${graduationGraphSvg(id, c)}</div><p>${escapeHtml(caption.zh)}</p><p>${escapeHtml(caption.en)}</p><h2>Source records, scope and calculations / 原始记录、范围与计算</h2>${data}${paragraph('Cited distinct records / 引用的不同记录（不等于不同独立来源）', c.citations.join(', '))}${paragraph('Quantitative practice: learner entries / 定量练习：学生填写', c.calculations.join(' ; '))}<h2>Student research report / 学生研究正文</h2>${fields}<h2>Five-part oral script / 五段口头稿或分镜</h2><p>Planned total / 计划总时长: ${speechSeconds(c)} s. 180–300 s is a planning target, not measured actual speaking time. / 180–300秒是计划目标，并非实测完成时长。</p>${speech}<h2>Manual rubric / 手动自核</h2>${manualRubric.map((r, index) => `<p>${c.rubric[index] ? '✓' : '□'} ${escapeHtml(r.zh)} / ${escapeHtml(r.en)}</p>`).join('')}<h2>Separate comprehension check / 独立综合理解检查</h2><p>Answered / 已答 ${checks.answered}/6; correct / 正确 ${checks.correct}/6. Report saving is separate from this check. / 报告保存与理解检查分开。</p>${questions}</main></body></html>`;
}
export function graduationReportDataUrl(
  draft: GraduationDraft,
  id: GraduationCaseId,
) {
  return `data:text/html;charset=utf-8,${encodeURIComponent(graduationReportHtml(draft, id))}`;
}
