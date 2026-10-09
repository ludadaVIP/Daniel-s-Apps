import assert from "node:assert/strict";
import { test } from "node:test";
import React from "react";
import { renderToStaticMarkup } from "react-dom/server";
import ReactMarkdown from "react-markdown";
import { bookHeadingId, bookRemarkPlugins, extractBookToc, normalizeBookMarkdown } from "./bookMarkdownModel.js";

test("TOC matches rendered headings across Markdown syntax and repeated renders", () => {
  const markdown = [
    "# **一、标题** #", "", "```md", "# 代码中的假标题", "```", "",
    "二、下划线标题", "---", "", "    # 缩进代码", "",
    "> ## 三、[链接](https://example.com)", "", "- ### 四、列表标题", "",
    "## 重复标题", "", "## 重复标题", "", "###### 六级标题",
  ].join("\r\n");
  const toc = extractBookToc(markdown);
  assert.deepEqual(toc.map(({ text }) => text), [
    "一、标题", "二、下划线标题", "三、链接", "四、列表标题", "重复标题", "重复标题", "六级标题",
  ]);
  assert.equal(new Set(toc.map(({ id }) => id)).size, toc.length);
  for (let render = 0; render < 2; render += 1) {
    const headings = [];
    const components = Object.fromEntries([1, 2, 3, 4, 5, 6].map((level) => [
      `h${level}`, ({ node, children }) => {
        const id = bookHeadingId(node.position.start);
        headings.push({ id, level });
        return React.createElement(`h${level}`, { id }, children);
      },
    ]));
    renderToStaticMarkup(React.createElement(ReactMarkdown, {
      remarkPlugins: bookRemarkPlugins, components, children: normalizeBookMarkdown(markdown),
    }));
    assert.deepEqual(headings, toc.map(({ id, level }) => ({ id, level })));
  }
});

test("empty content and fenced headings produce no TOC entries", () => {
  assert.deepEqual(extractBookToc(null), []);
  assert.deepEqual(extractBookToc("~~~md\n# 不是章节\n~~~\n\n    # 也不是章节"), []);
});
