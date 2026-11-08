import { test } from 'node:test';
import assert from 'node:assert/strict';
import { companyOverviewFor, watchBusinessSummary } from './company-overview-data.js';
import { COMPANY_PROFILES } from './company-profiles.js';

test('all curated profiles explain the actual business and have distinct investment questions', () => {
  assert.ok(Object.keys(COMPANY_PROFILES).length >= 87);
  const businesses = new Set();
  for (const [symbol, profile] of Object.entries(COMPANY_PROFILES)) {
    assert.ok(profile.short.length > 5, symbol);
    assert.ok(profile.business.length > 40, symbol);
    assert.ok(profile.thesis.length > 25, symbol);
    businesses.add(profile.business);
    assert.doesNotMatch(profile.business + profile.thesis, /核心业务：|业务延伸：|潜力来自核心产品/);
  }
  assert.equal(businesses.size, Object.keys(COMPANY_PROFILES).length);
});

test('new companies can supply a description without changes to a ticker table', () => {
  assert.equal(watchBusinessSummary({ symbol: 'NEW', businessSummary: '手动业务说明' }), '手动业务说明');
  assert.equal(watchBusinessSummary({ symbol: 'NEW', research: { businessSummary: '向医院销售试剂' } }), '向医院销售试剂');
  assert.equal(watchBusinessSummary({ symbol: 'NEW', research: { details: '业务模式：向餐厅销售软件并收支付费。\n\n最新经营：收入100万元。' } }), '向餐厅销售软件并收支付费。');
  assert.equal(watchBusinessSummary({ symbol: 'UNKNOWN' }), '业务简介待补充');
});

test('briefs keep dated financial facts, current quote and model value separate', () => {
  const watch = { symbol: 'MSFT', price: 200, priceDate: '2026-11-08', researchedAt: '2026-11-01', research: { details: '收入100亿元，净利润20亿元。', risks: ['风险'], catalysts: [] } };
  const evidence = { symbol: 'MSFT', analysisDate: '2026-11-06', financialPeriod: 'Q3', currency: 'USD', sections: [{ title: '财务与现金', body: '季度收入200亿元，净利润30亿元。' }], verdict: { stance: '等待', summary: '估值要求过高。', valueLow: 100, valueHigh: 150 }, risks: ['现金消耗'], triggers: ['下季财报'], sources: [] };
  const brief = companyOverviewFor(watch, evidence);
  assert.equal(brief.researchDate, '2026-11-06');
  assert.deepEqual(brief.financial, ['季度收入200亿元，净利润30亿元。']);
  assert.equal(brief.value.high, 150);
  assert.equal(watch.price, 200);
  assert.equal(companyOverviewFor({ ...watch, researchedAt: '2026-11-07' }, evidence).value, null);
  assert.equal(companyOverviewFor(watch, { ...evidence, symbol: 'OTHER' }).value, null);
});

test('missing research is explicit and funds do not become operating companies', () => {
  const unknown = companyOverviewFor({ symbol: 'NEW' });
  assert.deepEqual(unknown.financial, []);
  assert.equal(unknown.value, null);
  assert.match(unknown.stance, /资料不足/);
  assert.equal(companyOverviewFor({ symbol: 'VOO' }).isFund, true);
});
