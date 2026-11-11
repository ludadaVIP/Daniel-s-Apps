import type { EcoDraft } from './ecoProject';
import { ecoUnderstanding } from './ecoProject';
import { estimateMeadow, pathSample, meadowCensus } from './populationModel';
export function ecoReport(d: EcoDraft) {
  const current = d.sampleIds.length ? estimateMeadow(d.sampleIds) : undefined;
  const comparison = estimateMeadow(pathSample);
  const check = ecoUnderstanding(d);
  // Plain text is intentional: student writing is never interpreted as markup or executable HTML.
  return [
    'Study · S03 · 假如我是一名生态研究员 / If I were an ecological researcher',
    '原创虚拟草地 / Original virtual meadow. Not measured field data.',
    `方法 / Method: ${d.method}; seed=${d.seed}`,
    '每格1m²；全场36m²；同种植物、同一时期 / Each quadrat 1m²; field36m²; one species at one time.',
    '\n我的原始记录 / My raw records',
    ...(current?.records.map(
      (q) => `${q.id}: ${q.count} plants / 株; ${q.area}m²`,
    ) ?? []),
    `抽样面积 / Sampled area: ${current?.sampledArea ?? 0}m²`,
    `合计 / Count: ${current?.count ?? 0}`,
    `密度 / Density: ${current?.density.toFixed(3) ?? '—'} plants/m²`,
    `估计 / Estimate: ${current?.estimate.toFixed(2) ?? '—'} plants`,
    `学生计算 / Student calculation: ${d.estimate}`,
    `路边对照 / Roadside comparison: ${comparison.records.map((q) => `${q.id}=${q.count}`).join(', ')}; ${comparison.count}/${comparison.sampledArea} × 36 = ${comparison.estimate}`,
    `教学普查 / Teaching census: ${meadowCensus}; estimates are not census counts.`,
    '\n主张 / Claim',
    d.claim,
    '\n证据一 / Evidence 1',
    d.evidenceOne,
    '\n证据二 / Evidence 2',
    d.evidenceTwo,
    '\n机制与替代解释 / Mechanism and alternative explanation',
    d.reasoning,
    '\n还需的数据 / Further data needed',
    d.missingData,
    '\n中文总结 / Chinese summary',
    d.zh,
    '\nEnglish summary / 英文总结',
    d.en,
    `\n综合检查 / Understanding check: ${check.correct}/${ecoUnderstanding(d).answered} answered`,
    '\n文字填写完整不等于科学结论已经审阅。 / Complete writing does not establish scientific correctness.',
  ].join('\n');
}
