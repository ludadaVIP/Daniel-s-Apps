import assert from 'node:assert/strict';
import { test } from 'node:test';
import React from 'react';
import { renderToStaticMarkup } from 'react-dom/server';
import ReactMarkdown from 'react-markdown';
import { defaultRehypePlugins, defaultRemarkPlugins } from './options.js';
import { prepareMarkdown } from './prepare.js';
import { FONT_OPTIONS, normalizePreferences } from './preferences.js';

function render(source) {
  return renderToStaticMarkup(React.createElement(
    ReactMarkdown,
    { remarkPlugins: defaultRemarkPlugins, rehypePlugins: defaultRehypePlugins },
    prepareMarkdown(source),
  ));
}

test('Bible Devotion note renders strong text next to Chinese prose', () => {
  const source = '# 大卫救基伊拉的居民\n\n**撒母耳记并不是一本严格按时间流水账写成的历史书.**很多事件确实发生在大卫逃亡期间。\n\n所以，**23章的基伊拉事件揭示了几个重要主题。**';
  const html = render(source);
  assert.match(html, /<strong>撒母耳记并不是一本严格按时间流水账写成的历史书[^<]*<\/strong>/);
  assert.doesNotMatch(html, /\*\*撒母耳记/);
  assert.match(html, /<strong>23章的基伊拉事件/);
  assert.equal(prepareMarkdown(source).includes('历史书.** 很多事件'), true);
});

test('GFM table, task list, and fenced code keep their intended structure', () => {
  const html = render('| 项目 | 结果 |\n| --- | --- |\n| **重点** | ~~旧~~ 新 |\n\n- [x] 完成\n\n```md\n**原样**\n```');
  assert.match(html, /<table>/);
  assert.match(html, /<strong>重点<\/strong>/);
  assert.match(html, /<del>旧<\/del>/);
  assert.match(html, /type="checkbox"[^>]*checked/);
  assert.match(html, /<code class="language-md">\*\*原样\*\*/);
});

test('HTML tables are rendered safely and ordinary line breaks stay visible', () => {
  const html = render('甲\n乙\n\n<table><tr><td>内容</td></tr></table><script>alert(1)</script>');
  assert.match(html, /甲<br\/>\s*乙/);
  assert.match(html, /<table><tbody><tr><td>内容<\/td><\/tr><\/tbody><\/table>/);
  assert.doesNotMatch(html, /<script>/);
});

test('render repair does not rewrite inline code', () => {
  const source = '问题？**答案：**15；代码 `**答案：**15`';
  assert.equal(prepareMarkdown(source), '问题？**答案：** 15；代码 `**答案：**15`');
});

test('AI copied lists, headings, bold markers and fullwidth tables render normally', () => {
  const source = '###标题\r\n\r\n• 第一项\r\n• 第二项\r\n\r\n1、步骤一\r\n2．步骤二\r\n\r\n** 重点 **\r\n\r\n｜项目｜结果｜\r\n｜---｜---｜\r\n｜甲｜乙｜';
  const html = render(source);
  assert.match(html, /<h3>标题<\/h3>/);
  assert.match(html, /<ul>[\s\S]*第一项[\s\S]*第二项[\s\S]*<\/ul>/);
  assert.match(html, /<ol>[\s\S]*步骤一[\s\S]*步骤二[\s\S]*<\/ol>/);
  assert.match(html, /<strong>重点<\/strong>/);
  assert.match(html, /<table>[\s\S]*<td>乙<\/td>/);
});

test('valid heading levels remain intact beside AI headings without a space', () => {
  const source = '## 我们总喜欢把自己代入大卫\n\n###标题\n\n# 一级标题\n\n#### 四级标题';
  const prepared = prepareMarkdown(source);
  assert.equal(prepared, '## 我们总喜欢把自己代入大卫\n\n### 标题\n\n# 一级标题\n\n#### 四级标题');
  const html = render(source);
  assert.match(html, /<h2>我们总喜欢把自己代入大卫<\/h2>/);
  assert.match(html, /<h3>标题<\/h3>/);
  assert.doesNotMatch(html, /<h1># 我们总喜欢把自己代入大卫<\/h1>/);
});

test('a whole markdown code fence is unwrapped while code examples stay literal', () => {
  assert.match(render('```markdown\n# 标题\n\n**正文**\n```'), /<h1>标题<\/h1>[\s\S]*<strong>正文<\/strong>/);
  const source = '```text\n• 原样\n** 原样 **\n```\n\n    • 缩进代码';
  assert.equal(prepareMarkdown(source), source);
  assert.equal(prepareMarkdown('双反引号 ``**答案：**15`` 保持原样'), '双反引号 ``**答案：**15`` 保持原样');
});

test('shared Markdown renders math and validates reader preferences', () => {
  assert.match(render('$x^2$'), /class="katex"/);
  assert.deepEqual(FONT_OPTIONS.map(({ id }) => id), ['system', 'yahei', 'arial', 'calibri', 'times', 'kaiti']);
  assert.deepEqual(normalizePreferences({ font: 'kaiti', size: 147 }), { font: 'kaiti', size: 150 });
  assert.deepEqual(normalizePreferences({ font: 'invalid', size: 999 }), { font: 'system', size: 160 });
});
