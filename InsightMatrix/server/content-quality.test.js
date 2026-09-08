import test from 'node:test';
import assert from 'node:assert/strict';
import { fileURLToPath } from 'node:url';
import { loadContent } from './content.js';
import { auditCases, contentHash } from './content-quality.js';
import { loadEditorialReviews } from '../scripts/check-content.mjs';

const articles = () => loadContent(fileURLToPath(new URL('../content', import.meta.url)));
const example = () => structuredClone(articles().find((article) => article.id === 'dotcom-bubble'));
const options = { minimumPerCategory: 0, requireEditorialReview: false };
const has = (report, rule) => report.errors.some((issue) => issue.rule === rule);

test('all published cases meet coverage, source structure and current editorial review requirements', () => {
  const result = auditCases(articles(), { reviews: loadEditorialReviews() });
  assert.deepEqual(result.errors, []);
  for (const count of Object.values(result.counts)) assert.ok(count >= 10);
});

test('renaming a repeated event or copying its prose cannot evade duplicate detection', () => {
  const original = example();
  assert.deepEqual(auditCases([original], options).errors, []);
  const renamed = { ...original, id: 'another-slug', title: '新的标题并不会让同一历史事件变成新的案例' };
  assert.ok(has(auditCases([original, renamed], options), 'duplicate-event'));
  renamed.eventKey = 'renamed-event';
  const copied = auditCases([original, renamed], options);
  assert.ok(has(copied, 'near-duplicate'));
  assert.ok(has(copied, 'repeated-paragraph'));
});

test('missing counterfactuals, thin exercises and malformed evidence do not pass', () => {
  const missing = example();
  missing.body = missing.body.replace(/## 反事实与适用边界[\s\S]*?(?=\n## |$)/, '');
  assert.ok(has(auditCases([missing], options), 'missing-section'));
  const thin = example();
  thin.body = thin.body.replace(/## 判断练习[\s\S]*?(?=\n## |$)/, '## 判断练习\n你怎么看？\n');
  assert.ok(has(auditCases([thin], options), 'thin-section'));
  const malformed = example();
  malformed.sources = [null, { title: '虚构来源', url: 'javascript:alert(1)', claim: '' }];
  const report = auditCases([malformed], options);
  assert.ok(has(report, 'source-format'));
  assert.ok(has(report, 'source-url'));
  assert.ok(has(report, 'source-count'));
  const mirrored = example();
  mirrored.sources = [mirrored.sources[0], { ...mirrored.sources[0], title: mirrored.sources[0].title + '（镜像）', url: 'https://example.org/mirror' }];
  mirrored.body += '\nhttps://example.org/mirror';
  assert.ok(has(auditCases([mirrored], options), 'duplicate-source-document'));
});

test('content changes invalidate a previously approved editorial record', () => {
  const article = example();
  const review = {
    id: article.id, hash: contentHash(article), decision: 'approved', reviewer: 'test fixture only',
    checkedAt: '2026-09-08', cognitiveValue: 'fixture', limitations: 'fixture', distinctness: 'fixture', sourceVerification: 'fixture',
  };
  const reviewedOptions = { minimumPerCategory: 0, reviews: [review] };
  assert.deepEqual(auditCases([article], reviewedOptions).errors, []);
  article.body += '\n新增的事实或解释需要重新核验。';
  assert.ok(has(auditCases([article], reviewedOptions), 'stale-review'));
});
