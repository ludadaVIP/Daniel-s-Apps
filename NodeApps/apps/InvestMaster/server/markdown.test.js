import assert from 'node:assert/strict';
import { test } from 'node:test';
import React from 'react';
import { renderToStaticMarkup } from 'react-dom/server';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import { loadContent } from './content.js';
import { renderReadyMarkdown } from '../src/markdown.js';

const render = (value) => renderToStaticMarkup(React.createElement(
  ReactMarkdown,
  { remarkPlugins: [remarkGfm] },
  renderReadyMarkdown(value),
));

test('Chinese answer labels render as emphasis without changing code', () => {
  const source = '问题？**答案：**15；代码 `**答案：**15`';
  assert.equal(renderReadyMarkdown(source), '问题？**答案：** 15；代码 `**答案：**15`');
  const html = render(source);
  assert.match(html, /<strong>答案：<\/strong> 15/);
  assert.match(html, /<code>\*\*答案：\*\*15<\/code>/);
});

test('all published Markdown keeps emphasis markers out of visible prose', () => {
  for (const item of loadContent()) {
    for (const value of [item.body, item.brief].filter(Boolean)) {
      const html = render(value);
      const visibleText = html.replace(/<code>[\s\S]*?<\/code>/g, '').replace(/<pre>[\s\S]*?<\/pre>/g, '');
      assert.ok(!visibleText.includes('**'), `${item.id} still exposes Markdown markers`);
    }
  }
});
