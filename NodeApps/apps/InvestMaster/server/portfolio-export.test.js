import assert from 'node:assert/strict';
import { test } from 'node:test';
import { loadContent } from './content.js';
import { buildPortfolioExport } from '../src/portfolio-export.js';

test('portfolio export preserves all saved capstone drafts and carries independent acceptance evidence', () => {
  const lessons = loadContent().filter(item => item.type === 'lessons');
  const capstones = lessons.filter(lesson => lesson.unit === '毕业研究').sort((a, b) => a.order - b.order);
  assert.equal(capstones.length, 5);
  const notes = capstones.map((lesson, index) => ({
    id: lesson.id,
    body: `底稿 ${index + 1}：现金 98,700；公式 max(ST−K,0)。\n\n| 年度 | 金额 |\n| --- | ---: |\n| 2025 | ${index + 100} |\n\n反证：需要重新核实回收日期。`,
    updatedAt: `2026-09-27T0${index}:00:00.000Z`,
  }));
  notes.push({ id: lessons.find(lesson => lesson.unit !== '毕业研究').id, body: '非毕业课程私人笔记不应进入作品导出' });
  const result = buildPortfolioExport(lessons, notes, '2026/9/27');
  for (const note of notes.slice(0, 5)) {
    assert.ok(result.includes(note.body), `导出丢失或改写了 ${note.id} 的 Markdown 底稿`);
    assert.ok(result.includes(note.updatedAt));
  }
  assert.equal((result.match(/^课题 ID：/gm) || []).length, 5);
  assert.ok(!result.includes(notes.at(-1).body), '导出不能混入其他学习笔记');
  for (const required of ['股票 A', '股票 B', '普通债券合同', '客户 IPS', '反方答辩', '0＝', '1＝', '2＝', '3＝', '4＝', '六维均至少 3 分', '22／24', '未见数量会计实作', '新披露', '返工后审读', '待审', '未保存文字不在本次导出中']) {
    assert.ok(result.includes(required), `缺少作品验收证据或状态：${required}`);
  }
  assert.equal((result.match(/\| 待审 \| 待填 \| 待填 \|/g) || []).length, 6);
});

test('empty or unrelated notes cannot produce a misleading capstone export', () => {
  const lessons = loadContent().filter(item => item.type === 'lessons');
  const capstone = lessons.find(lesson => lesson.unit === '毕业研究');
  const other = lessons.find(lesson => lesson.unit !== '毕业研究');
  assert.equal(buildPortfolioExport(lessons, [], '2026/9/27'), null);
  assert.equal(buildPortfolioExport(lessons, [{ id: capstone.id, body: ' \n\t ' }, { id: other.id, body: '仅有普通课程笔记' }], '2026/9/27'), null);
});
