import assert from 'node:assert/strict';
import { after, before, test } from 'node:test';
import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import { createApp } from './app.js';
import { loadContent } from './content.js';
import { createStore } from './store.js';

const directory = fs.mkdtempSync(path.join(os.tmpdir(), 'invest-master-'));
let app, server, origin;
before(async () => {
  app = createApp({ databasePath: path.join(directory, 'state.sqlite') });
  server = await new Promise((resolve) => { const target = app.listen(0, '127.0.0.1', () => resolve(target)); });
  origin = `http://127.0.0.1:${server.address().port}`;
});
after(async () => {
  await new Promise((resolve) => server.close(resolve));
  app.locals.close();
  fs.rmSync(directory, { recursive: true, force: true });
});
const patch = async (body) => {
  const response = await fetch(`${origin}/api/state`, { method: 'PATCH', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(body) });
  return { status: response.status, data: await response.json() };
};

test('Markdown library has connected lessons, masters, concepts, cases and valid quizzes', () => {
  const items = loadContent();
  const ids = new Set(items.map((item) => item.id));
  assert.equal(ids.size, items.length, '内容 ID 不可重复');
  const counts = Object.fromEntries(['masters','lessons','concepts','cases'].map((type) => [type,items.filter((item) => item.type === type).length]));
  assert.ok(counts.masters >= 11, '大师视角不得少于十一位');
  assert.ok(counts.lessons >= 120, '基础教材、进阶专题、大师路线与毕业实作应同时保留');
  assert.equal(counts.concepts, 20);
  assert.ok(counts.cases >= 16, '历史、定量和独立盲题应共同覆盖增长、估值、债券信用、客户约束和流动性失效');
  const lessonsByUnit = items.filter((item) => item.type === 'lessons').reduce((count, item) => count.set(item.unit, (count.get(item.unit) || 0) + 1), new Map());
  assert.ok(lessonsByUnit.get('定量方法') >= 8, '数量方法需覆盖贝叶斯、尾部、回归和模拟');
  assert.ok(lessonsByUnit.get('企业财务') >= 7, '企业财务需覆盖融资、治理、回购与并购');
  assert.ok(lessonsByUnit.get('债券与利率') >= 7, '债券与利率需覆盖曲线、浮息、凸性及证券化');
  assert.ok(lessonsByUnit.get('信用与债务') >= 5, '信用需覆盖发行人、金融机构和再融资压力');
  assert.ok(lessonsByUnit.get('财报与会计') >= 8, '财报需覆盖雇员成本和三表预测');
  assert.ok(lessonsByUnit.get('股票估值') >= 8, '股票估值需覆盖金融机构、可比倍数与终值压力');
  assert.ok(lessonsByUnit.get('组合与风险') >= 8, '组合需覆盖客户政策、绩效归因与税费执行');
  assert.ok(lessonsByUnit.get('经济与市场') >= 6, '宏观需覆盖供需、国际收支与银行信贷');
  assert.ok(lessonsByUnit.get('衍生品与另类') >= 5, '衍生品需覆盖掉期与清算风险');
  assert.ok(lessonsByUnit.get('研究伦理') >= 5, '伦理需覆盖利益冲突、研究纠错与业绩展示');
  for (const master of items.filter((item) => item.type === 'masters')) {
    assert.ok(items.filter((item) => item.type === 'lessons' && item.master === master.id).length >= 4, `${master.id} 缺少系统课程`);
  }
  for (const concept of items.filter((item) => item.type === 'concepts')) {
    assert.ok(items.some((item) => item.type === 'lessons' && item.concepts?.includes(concept.id)), `${concept.id} 没有可深入的课程`);
  }
  const textbookUnits = new Set(items.filter((item) => item.type === 'lessons' && item.depth === 'textbook').map((item) => item.unit));
  for (const unit of ['基础地基', '定量方法', '财报与会计', '企业财务', '股票估值', '债券与利率', '信用与债务', '组合与风险', '经济与市场', '衍生品与另类', '研究伦理', '毕业研究', '格雷厄姆路线', '巴菲特路线', '芒格路线', '林奇路线', '马克斯路线', '索罗斯路线', '博格尔路线', '达摩达兰路线', '费雪路线', '达里奥路线', '斯文森路线']) assert.ok(textbookUnits.has(unit), `${unit} 缺少完整教材章节`);
  for (const item of items) {
    const minimumLength = { masters: 1400, lessons: 1800, concepts: 200, cases: 1500 }[item.type];
    assert.ok(item.body.length >= minimumLength, `${item.id} 正文过短`);
    if (item.type === 'lessons') {
      assert.equal(item.depth, 'textbook', `${item.id} 尚未达到教材结构`);
      assert.ok(item.quiz?.length >= 5 && item.quiz?.length <= 10, `${item.id} 的自测题数应在 5–10 之间`);
      assert.equal(new Set(item.quiz.map((question) => question.id)).size, item.quiz.length, `${item.id} 题目 ID 重复`);
      assert.ok(item.quiz.every((question) => question.options.every((option) => typeof option === 'string')), `${item.id} 的选项须以文字传给界面`);
    }
    if (item.depth === 'textbook') {
      assert.ok(item.body.length >= 1800, `${item.id} 的教材正文过短`);
      assert.ok(item.quiz.length >= 5, `${item.id} 缺少足够的理解检测`);
      assert.ok(item.sources?.length, `${item.id} 缺少原始来源`);
      assert.match(item.body, /练习/, `${item.id} 缺少练习`);
      assert.match(item.body, /答案|解析|参考/, `${item.id} 缺少可核查的练习答案`);
    }
    if (item.type === 'cases') assert.ok(/^https:\/\//.test(item.sourceUrl), `${item.id} 缺少来源`);
    if (item.type === 'cases') {
      assert.match(item.body, /练习|自己做决定/, `${item.id} 缺少案例练习`);
      assert.match(item.body, /答案|参考/, `${item.id} 缺少案例答案`);
      if (item.checkpoints) assert.ok(Array.isArray(item.checkpoints) && item.checkpoints.length >= 2 && item.checkpoints.every((prompt) => typeof prompt === 'string' && prompt.length >= 20), `${item.id} 的事前决策卡不完整`);
      if (item.brief) assert.ok(item.checkpoints?.length >= 2 && item.brief.length >= 500, `${item.id} 的封题资料不足`);
    }
    for (const source of item.sources || []) assert.ok(/^https:\/\//.test(source.url), `${item.id} 的来源链接无效`);
    for (const key of ['master', 'concepts', 'cases', 'lessons']) {
      const links = key === 'master' ? item[key] ? [item[key]] : [] : item[key] || [];
      for (const link of links) assert.ok(ids.has(link), `${item.id} -> ${link}`);
    }
    for (const question of item.quiz || []) {
      assert.ok(question.options.length >= 3, item.id);
      assert.ok(Number.isInteger(question.answer) && question.answer >= 0 && question.answer < question.options.length, item.id);
      assert.ok(question.explanation, item.id);
    }
  }
});

test('financial commas and formula arguments remain complete answer options', () => {
  const items = loadContent();
  const find = (lessonId, questionId) => items.find((item) => item.id === lessonId).quiz.find((question) => question.id === questionId);
  const numericCases = [
    ['bond-pricing-duration', 'q10-v2', ['98,500', '98,700', '100,200'], 100000 * 98.50 / 100 + 100000 * 2 / 1000],
    ['damodaran-story-to-numbers', 'q7-v2', ['2,475 万', '1,375 万', '3,300 万'], 3300 * (1 - 0.25) - 900 - 200],
    ['derivatives-payoffs', 'q6-v2', ['15', '1,500', '2,000'], 100 * (Math.max(120 - 100, 0) - 5)],
    ['equity-cash-flow-value', 'q2-v2', ['600', '800', '1,200'], 1000 + 100 - 300],
    ['from-store-to-stock', 'q3-v2', ['150', '800', '1,200'], 150 * 8],
    ['hedging-basis-margin', 'q6-v2', ['70,000', '90,000', '95,000'], 1000 * (90 + 100 - 120)],
    ['inflation-linked-bonds', 'q1-v2', ['950', '1,000', '1,050'], 1000 * 1.05],
    ['marks-lab', 'q2-v2', ['1,610.5', '2,415.8', '4,026.3'], Number((161.05 * 15).toFixed(1))],
    ['moat-and-cash', 'q2-v2', ['3,880', '4,365', '10,185'], (105 - 60) * 97],
    ['moat-and-cash', 'q3-v2', ['3,825', '4,000', '8,925'], (105 - 60) * 85],
  ];
  for (const [lessonId, questionId, expectedOptions, expectedValue] of numericCases) {
    const question = find(lessonId, questionId);
    assert.deepEqual(question.options, expectedOptions, `${lessonId} / ${questionId}`);
    const chosenValue = Number(question.options[question.answer].replaceAll(',', '').replace(' 万', ''));
    assert.equal(chosenValue, expectedValue, `${lessonId} / ${questionId} must grade the calculated amount`);
  }
  const market = find('market-orders-costs', 'q8-v2');
  assert.equal(market.options.length, 3);
  assert.equal(market.options[1], '能；总现金必定为 98,000');
  assert.equal(market.answer, 0);
  const option = find('option-parity-no-arbitrage', 'q3-v2');
  assert.deepEqual(option.options, ['max(ST−K,0)', 'max(K−ST,0)', 'ST+K']);
  assert.equal(option.options[option.answer], 'max(ST−K,0)');
});

test('content loading rejects an unquoted financial comma before it can be graded', () => {
  const fixtureRoot = path.join(directory, 'malformed-content');
  fs.mkdirSync(path.join(fixtureRoot, 'lessons'), { recursive: true });
  fs.writeFileSync(path.join(fixtureRoot, 'lessons', 'comma.md'), `---
id: comma
title: 金额选项检查
quiz:
  - id: q1
    question: 交割款是多少？
    options: [98,500, 98,700, 100,200]
    answer: 1
    explanation: 引号遗漏不得静默拆分金额。
---
教学内容。
`);
  assert.throws(() => loadContent(fixtureRoot), /comma.md.*q1.*3 个选项.*引号/);
});

test('a repaired question requires a new answer while preserving legacy answers and notes', async () => {
  const filename = path.join(directory, 'legacy-answers.sqlite');
  const lesson = loadContent().find((item) => item.id === 'bond-pricing-duration');
  const oldStore = createStore(filename);
  const note = '现金流、全价、应计利息、面值单位、费用和指定日期的付款能力。'.repeat(20);
  for (const question of lesson.quiz.filter((entry) => entry.id !== 'q10-v2')) {
    oldStore.update({ kind: 'answer', id: lesson.id, value: { questionId: question.id, choice: question.answer, correct: true } });
  }
  oldStore.update({ kind: 'answer', id: lesson.id, value: { questionId: 'q10', choice: 1, correct: true } });
  oldStore.update({ kind: 'note', id: lesson.id, value: note });
  oldStore.update({ kind: 'complete', id: lesson.id, value: true });
  oldStore.close();
  const revisedApp = createApp({ databasePath: filename });
  const revisedServer = await new Promise((resolve) => {
    const target = revisedApp.listen(0, '127.0.0.1', () => resolve(target));
  });
  const revisedOrigin = `http://127.0.0.1:${revisedServer.address().port}`;
  const update = (body) => fetch(`${revisedOrigin}/api/state`, {
    method: 'PATCH', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(body),
  });
  try {
    assert.equal((await update({ kind: 'complete', id: lesson.id, value: true })).status, 400);
    assert.equal((await update({ kind: 'answer', id: lesson.id, value: { questionId: 'q10', choice: 1 } })).status, 400);
    const answered = await update({ kind: 'answer', id: lesson.id, value: { questionId: 'q10-v2', choice: 1 } });
    assert.equal(answered.status, 200);
    const state = await answered.json();
    assert.equal(state.notes.find((entry) => entry.id === lesson.id).body, note);
    assert(state.answers.some((entry) => entry.questionId === 'q10' && entry.choice === 1));
    assert(state.answers.some((entry) => entry.questionId === 'q10-v2' && entry.correct));
    assert.equal((await update({ kind: 'complete', id: lesson.id, value: true })).status, 200);
  } finally {
    await new Promise((resolve) => revisedServer.close(resolve));
    revisedApp.locals.close();
  }
});

test('learning answers are checked server side, and notes and progress survive a read', async () => {
  const content = await (await fetch(`${origin}/api/content`)).json();
  const lesson = content.items.find((item) => item.id === 'what-you-own');
  const wrong = await patch({ kind: 'answer', id: lesson.id, value: { questionId: 'q1', choice: 0, correct: true } });
  assert.equal(wrong.status, 200);
  assert.equal(wrong.data.answers[0].correct, 0);
  const right = await patch({ kind: 'answer', id: lesson.id, value: { questionId: 'q1', choice: lesson.quiz[0].answer, correct: false } });
  assert.equal(right.data.answers[0].correct, 1);
  assert.equal((await patch({ kind: 'complete', id: lesson.id, value: true })).status, 400);
  for (const question of lesson.quiz.slice(1)) await patch({ kind: 'answer', id: lesson.id, value: { questionId: question.id, choice: question.answer } });
  await patch({ kind: 'note', id: lesson.id, value: '先看现金，再问反证；研究续费率、债务和维持业务所需支出。' });
  await patch({ kind: 'complete', id: lesson.id, value: true });
  const state = await (await fetch(`${origin}/api/state`)).json();
  assert.ok(state.notes.find((item) => item.id === lesson.id).body.includes('续费率'));
  assert.ok(state.completed.some((item) => item.id === lesson.id));
});

test('review scheduling and invalid payloads', async () => {
  const reviewed = await patch({ kind: 'review', id: 'intrinsic-value', value: 'good' });
  assert.equal(reviewed.status, 200);
  assert.ok(new Date(reviewed.data.reviews[0].dueAt) > new Date());
  assert.equal((await patch({ kind: 'review', id: 'intrinsic-value', value: 'unknown' })).status, 400);
  assert.equal((await patch({ kind: 'note', id: '../plan.md', value: 'x' })).status, 404);
  assert.equal((await patch({ kind: 'framework', id: 'anything', value: 'x' })).status, 400);
});

test('sealed case analysis requires an immutable first attempt', async () => {
  const id = 'haichen-exporter-fx-client-exam';
  const publicContent = await (await fetch(`${origin}/api/content`)).json();
  const sealed = publicContent.items.find((item) => item.id === id);
  assert.ok(sealed.brief.includes('2026 年'));
  assert.equal(sealed.body, '');
  const analysisUrl = `${origin}/api/case-analysis/${id}`;
  assert.equal((await fetch(analysisUrl)).status, 403);
  assert.equal((await patch({ kind: 'caseAttempt', id, value: '太短' })).status, 400);
  assert.equal((await patch({ kind: 'caseAttempt', id: 'what-you-own', value: '独立判断'.repeat(50) })).status, 400);
  const firstDraft = '经营现金流需要先从 EBIT 扣利息和税，调整折旧与营运资本，再扣资本支出。美元本金到期要按实际汇率支付，受限现金不能参与。客户先覆盖确定付款与现金底线，再决定能否买入股票；估值需要检查终值和债务桥。'.repeat(2);
  const accepted = await patch({ kind: 'caseAttempt', id, value: firstDraft });
  assert.equal(accepted.status, 200);
  assert.equal(accepted.data.caseAttempts.find((row) => row.id === id).body, firstDraft);
  const revealed = await (await fetch(analysisUrl)).json();
  assert.match(revealed.body, /CFO = 90/);
  assert.equal((await patch({ kind: 'caseAttempt', id, value: '改写'.repeat(80) })).status, 409);
  await patch({ kind: 'note', id, value: '复盘：我遗漏了受限现金。' });
  const state = await (await fetch(`${origin}/api/state`)).json();
  assert.equal(state.caseAttempts.find((row) => row.id === id).body, firstDraft);
  assert.equal(state.notes.find((row) => row.id === id).body, '复盘：我遗漏了受限现金。');
});

test('integrated research requires a substantial draft before completion can be recorded', async () => {
  const lesson = loadContent().find((item) => item.id === 'integrated-research-capstone');
  for (const question of lesson.quiz) await patch({ kind: 'answer', id: lesson.id, value: { questionId: question.id, choice: question.answer } });
  await patch({ kind: 'note', id: lesson.id, value: '这是一份过短的综合研究草稿，尚无报表与估值。' });
  assert.equal((await patch({ kind: 'complete', id: lesson.id, value: true })).status, 400);
  await patch({ kind: 'note', id: lesson.id, value: '来源、现金流、估值、债券到期、信用、反证与组合约束。'.repeat(65) });
  assert.equal((await patch({ kind: 'complete', id: lesson.id, value: true })).status, 200);
});
