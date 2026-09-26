import assert from 'node:assert/strict';
import { after, before, test } from 'node:test';
import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import { createApp } from './app.js';
import { loadContent } from './content.js';

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

test('integrated research requires a substantial draft before completion can be recorded', async () => {
  const lesson = loadContent().find((item) => item.id === 'integrated-research-capstone');
  for (const question of lesson.quiz) await patch({ kind: 'answer', id: lesson.id, value: { questionId: question.id, choice: question.answer } });
  await patch({ kind: 'note', id: lesson.id, value: '这是一份过短的综合研究草稿，尚无报表与估值。' });
  assert.equal((await patch({ kind: 'complete', id: lesson.id, value: true })).status, 400);
  await patch({ kind: 'note', id: lesson.id, value: '来源、现金流、估值、债券到期、信用、反证与组合约束。'.repeat(65) });
  assert.equal((await patch({ kind: 'complete', id: lesson.id, value: true })).status, 200);
});
