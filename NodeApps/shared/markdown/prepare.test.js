import assert from 'node:assert/strict';
import { test } from 'node:test';
import React from 'react';
import { renderToStaticMarkup } from 'react-dom/server';
import ReactMarkdown from 'react-markdown';
import { defaultRehypePlugins, defaultRemarkPlugins } from './options.js';
import { prepareMarkdown } from './prepare.js';

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
