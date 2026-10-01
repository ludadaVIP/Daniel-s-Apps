# 共享 Markdown 阅读器

所有需要展示 Markdown 的 APP 都从 `Markdown.jsx` 导入组件。GFM、换行、数学公式、安全 HTML 和 AI 粘贴兼容规则由此目录统一维护；`prepareMarkdown` 仅处理传给预览的字符串，不改写保存的文件。

```jsx
import Markdown from '../../../shared/markdown/Markdown.jsx';

<Markdown readingControls>{content}</Markdown>
```

`readingControls` 显示字号（80%–160%）和字体选项。偏好保存在工作台浏览器的本地存储中，所有阅读视图同步使用。APP 特有的链接、标题锚点和扩展插件可继续通过 `components`、`remarkPlugins`、`rehypePlugins` 传入；插件会附加在共享基础规则之后。编辑器应继续显示未经处理的原始 Markdown。

若 APP 有自己的顶部工具栏，可以在工具栏里渲染 `<MarkdownReadingControls compact />`，并在正文使用 `<Markdown readingAppearance>`。两者使用同一份偏好，控件不会占用正文空间。
