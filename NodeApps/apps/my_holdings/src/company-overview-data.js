import { COMPANY_PROFILES } from "./company-profiles.js";
import { WATCH_BUSINESS_SUMMARIES } from "./watch-business-summaries.js";

const FUNDS = new Set(['VTI','VT','VGT','SOXX','SMH','VOO','QQQM','SPYL','CNDX','SCHD','VXUS','VIG','SPMO']);
export const cleanText = value => String(value || '').replace(/\[S\d+(?:[–-]\d+)?\]/g, '').replace(/^#{1,6}\s*/gm, '').replace(/\*\*/g, '').trim();
const readableFinance = value => value.replace(/\bCFO\b/g, '经营现金流').replace(/\bFCF\b/g, '自由现金流')
  .replace(/\bCapEx\b/gi, '资本开支').replace(/PP&E/g, '厂房及设备投入').replace(/\bSBC\b/g, '股权薪酬')
  .replace(/\bARR\b/g, '年度经常性收入').replace(/\bQ([1-4])\b/g, (_, n) => `第${n}季度`)
  .replace(/(?<!长)增(?=\d)/g, '增长');
const limit = (value, max) => {
  const text = cleanText(value);
  if (text.length <= max) return text;
  const sentences = text.match(/[^。！？\n]+[。！？\n]?/g) || [];
  let result = '';
  for (const sentence of sentences) { if (result.length + sentence.length > max) break; result += sentence; }
  return result.trim() || text.slice(0, max) + '…';
};
export function watchBusinessSummary(watch) {
  const symbol = String(watch?.symbol || '').trim().toUpperCase().replace('BRK-B', 'BRK.B');
  if (watch?.businessSummary?.trim()) return watch.businessSummary.trim();
  if (watch?.research?.businessSummary?.trim()) return watch.research.businessSummary.trim();
  const profile = COMPANY_PROFILES[symbol];
  if (profile) return profile.short;
  const details = cleanText(watch?.research?.details);
  const business = details.match(/(?:业务模式|商业模式|公司业务|主营业务)[：:]\s*([^\n]+)/)?.[1];
  return limit(business || WATCH_BUSINESS_SUMMARIES[symbol] || watch?.research?.identity?.sector, 70) || '业务简介待补充';
}

export function companyOverviewFor(watch, evidence = null) {
  const symbol = String(watch?.symbol || watch?.name || '').trim().toUpperCase().replace('BRK-B', 'BRK.B');
  const identity = watch?.research?.identity || {};
  const profile = COMPANY_PROFILES[symbol];
  // A more recent ordinary research result takes precedence over an older valuation archive.
  const researchDate = (watch?.researchedAt || '').slice(0, 10);
  const useDecision = evidence?.symbol === symbol && evidence.analysisDate >= researchDate;
  const details = cleanText(watch?.research?.details);
  const financialSections = useDecision ? evidence.sections.filter(s => /财务|财报|最新经营|最新业务|盈利|现金与/.test(s.title)) : [];
  const sectionText = useDecision ? (financialSections.length ? financialSections : evidence.sections).map(s => s.body).join('\n\n') : details;
  const paragraphs = sectionText.split(/\n+/).map(cleanText).filter(Boolean);
  const finance = paragraphs.filter(p => /\d/.test(p) && /收入|营收|利润|亏损|现金|毛利|资本开支|净息差|赔付|费用率|费率|资产净值/.test(p) && !/^(?:估值|方法[一二]|熊情景|基准情景|牛情景|以.*买入|公司.*(?:重述|三分部))/.test(p));
  const financial = [];
  let remaining = 600;
  // Lead with operating results, then show cash/debt rather than repeating revenue.
  const cash = finance.slice(1).find(p => /现金|借款|负债|债务|\bCFO\b/.test(p));
  const selectedFinance = [finance[0], cash || finance[1]].filter(Boolean);
  for (const p of selectedFinance) {
    if (remaining < 100) break;
    const part = readableFinance(limit(p, Math.min(remaining, 310)));
    if (part) { financial.push(part); remaining -= part.length; }
  }
  const isFund = FUNDS.has(symbol) || /ETF|指数基金/.test(identity.sector || watch?.name || '');
  const businessFromResearch = details.match(/(?:业务模式|商业模式|主营业务)[：:]\s*([^\n]+)/)?.[1];
  return {
    symbol, name: identity.name || watch?.name || symbol, exchange: identity.exchange || '',
    industry: identity.sector || (isFund ? '指数基金' : watchBusinessSummary(watch)), isFund,
    business: profile?.business || limit(businessFromResearch || watch?.research?.businessSummary, 330) || watchBusinessSummary(watch),
    thesis: profile?.thesis || '尚无逐公司投资判断；当前资料不足以支持新增投资。',
    financial, financialPeriod: useDecision ? evidence.financialPeriod : '',
    researchDate: useDecision ? evidence.analysisDate : researchDate,
    stance: useDecision ? evidence.verdict.stance : (financial.length ? '观察；尚无完整价值区间' : '资料不足，暂不作投资判断'),
    judgment: useDecision ? limit(evidence.verdict.summary || evidence.verdict.conclusion, 300) : '',
    value: useDecision && Number.isFinite(evidence.verdict.valueLow) && Number.isFinite(evidence.verdict.valueHigh)
      ? { low: evidence.verdict.valueLow, high: evidence.verdict.valueHigh, currency: evidence.currency, date: evidence.analysisDate } : null,
    risks: (useDecision ? evidence.risks : watch?.research?.risks || []).slice(0, 2).map(s => limit(s, 180)),
    triggers: (useDecision ? evidence.triggers : watch?.research?.catalysts || []).slice(0, 2).map(s => limit(s, 150)),
    sources: (useDecision ? evidence.sources : watch?.research?.sources || []).filter(s => /^https:\/\//.test(s.url)).slice(0, 5),
  };
}
