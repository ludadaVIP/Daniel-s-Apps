import assert from "node:assert/strict";
import { test } from "node:test";
import React from "react";
import { renderToStaticMarkup } from "react-dom/server";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import remarkAdjacentStrong from "./remarkAdjacentStrong.js";

function render(markdown) {
  return renderToStaticMarkup(React.createElement(ReactMarkdown, {
    remarkPlugins: [remarkGfm, remarkAdjacentStrong],
    children: markdown,
  }));
}

test("renders bold before adjacent Chinese prose", () => {
  assert.equal(
    render("一个叫**厄刻克拉底（Echecrates）**的人遇见斐多"),
    "<p>一个叫<strong>厄刻克拉底（Echecrates）</strong>的人遇见斐多</p>",
  );
  assert.equal(render("这是**结论。**下一句"), "<p>这是<strong>结论。</strong>下一句</p>");
});

test("keeps normal Markdown and literal asterisks intact", () => {
  assert.equal(render("前**正常加粗**后"), "<p>前<strong>正常加粗</strong>后</p>");
  assert.equal(render("这是\\*\\*原样。\\*\\*后文"), "<p>这是**原样。**后文</p>");
  assert.equal(render("`这是**代码。**后文`"), "<p><code>这是**代码。**后文</code></p>");
  assert.equal(render("```md\n这是**代码。**后文\n```"), "<pre><code class=\"language-md\">这是**代码。**后文\n</code></pre>");
});

test("works inside link text without changing its destination", () => {
  assert.equal(
    render("[这是**标题。**正文](https://example.com/a**b)"),
    "<p><a href=\"https://example.com/a**b\">这是<strong>标题。</strong>正文</a></p>",
  );
});
