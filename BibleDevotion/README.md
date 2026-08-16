# Bible Devotion

一个完全独立的个人圣经灵修记录应用。默认只读取随应用保留的
`data/cuv_data` 中文和合本数据；仅在中栏切换为「中 / 中英」时，才按需读取当前章的
`data/esv_data` 英文 ESV 数据。西班牙文数据不会被读取。灵修笔记保存在
应用根目录下的 `devotion-data/`，因此把整个 `BibleDevotion` 文件夹移走后仍可正常使用。

## 功能

- 三栏全屏阅读：左侧经卷目录、中间经文、右侧 Markdown 灵修笔记；桌面宽屏下中栏约为左栏的两倍宽。
- 严格按需加载：启动时只取得目录与轻量笔记标记；选章时才请求该章中文经文与该章笔记；点击某一节时才请求该节笔记。中英对照也只请求当前章英文内容，不会预载整本圣经。
- 默认打开「福音 → 约翰福音 → 第 1 章」，四福音书会同时展开，方便继续阅读或切换。
- 中栏可切换「中 / 中英」；中英模式中每节中文下方显示对应的 ESV 英文，经节笔记与右栏笔记逻辑不变。
- 左侧目录可通过右上角按钮收起为 58px 窄栏；收起后仍有明显的展开按钮，`Esc` 也可快速收起。此偏好会保存在浏览器本机。
- 可分别记录「全章总览」和「某一节默想」。有全章笔记的章节方块为琥珀色；有经节笔记的经节带鲜艳橙色菱形标记；有任意笔记的经卷有圆点提示。
- 右栏支持阅读、编辑和对照三种 Markdown 模式，自动保存，也可按 `Ctrl+S`／`⌘S` 立即保存。
- 右栏在滚动较长笔记后会出现右下角的回到顶部按钮。
- 启动时会从 Markdown 文件重建笔记标记索引，自动纳入有效的孤立笔记，并移除指向不存在或空白笔记的旧标记。

## 要求

- Node.js 24.15.0 或更高版本

## 启动

```powershell
npm install
npm run dev
```

开发服务器会自动打开浏览器。若需要手动访问，请使用
`http://127.0.0.1:5181/`。该地址是 Bible Devotion 专用地址；不要使用
工作区内其他 Vite App 常用的默认端口。

在浏览器打开 Vite 显示的地址（`http://127.0.0.1:5181/`）。开发服务器会将
`/api` 请求转发到 Express 的 `http://localhost:3000`。

### 双击启动

可直接双击：

- Windows：`启动 Bible Devotion（Windows）.bat`
- macOS：`启动 Bible Devotion（macOS）.command`

两个启动文件都会先切换至其自身所在的应用目录、确认 Node.js 为 24.15.0 或更新版本，且在
`node_modules` 不存在时自动安装依赖，然后启动 `http://127.0.0.1:5181/`。请保持弹出的终端窗口开启；关闭窗口或按 `Ctrl+C`／`Control+C`
会停止应用。macOS 若首次提示权限，可在终端进入本文件夹后执行：

```bash
chmod +x '启动 Bible Devotion（macOS）.command'
```

## 生产运行

```powershell
npm run build
npm start
```

然后打开 `http://localhost:3000`。Express 会同时提供编译后的 React 页面和 API。

## API

- `GET /api/config`：66 卷书目录与已有笔记标记索引。
- `GET /api/chapters/:book/:chapter`：指定章的中文和合本文本。
- `GET /api/translations/esv/chapters/:book/:chapter`：指定章的英文 ESV 文本，仅在中英对照时调用。
- `GET /api/notes/:book/:chapter`：指定章的总览笔记。
- `GET /api/notes/:book/:chapter/:verse`：指定节的笔记。
- `PUT /api/notes/:book/:chapter`：保存或清空章节笔记，JSON body 为 `{ "content": "..." }`。
- `PUT /api/notes/:book/:chapter/:verse`：保存或清空节笔记，JSON body 相同。

所有 `book`、章、节参数均由服务端按固定的 66 卷书目录验证；客户端不能指定文件路径。
空白内容会删除对应 Markdown 文件及索引标记。

## 数据位置

```text
devotion-data/
  note-index.json
  notes/
    chapters/<Book>/<chapter>.md
    verses/<Book>/<chapter>/<verse>.md
```

笔记文件使用原始 Markdown 文本保存，写入采用临时文件后原子重命名，降低意外中断时损坏文件的风险。

## 使用方式

- 左栏按旧约／先知／福音／新约显示 66 卷书。展开一卷后可选择章节；琥珀色章节方块表示该章已有总览笔记，经卷后的圆点表示该卷已有任意笔记。
- 中栏显示所选章节。点击「中 / 中英」可为当前章逐节显示 ESV 对照；若两译本节号略有不同，会提示差异并按节号完整显示，ESV 独有节也不会被隐藏。点击某一节，会将右栏切换为该节的灵修笔记；带鲜艳橙色菱形标记的经节已有经节笔记。点击「查看全章笔记」即可切回章节总览。
- 右栏可在阅读、编辑与对照模式之间切换。笔记是标准 Markdown，预览支持表格、清单、引用等 GFM 常用格式；原始 HTML 不会执行。输入停止约 800ms 后会自动保存，也可点击保存或按 `Ctrl+S`／`⌘S`。

## 笔记索引恢复

每次启动时，应用会扫描 `devotion-data/notes/` 并原子重建 `note-index.json`：因此即使电脑恰好在笔记写入和索引写入之间中断、手动移动了 Markdown 文件，或索引中混入了无效的嵌套数据类型，目录中的笔记标记都会在下次启动恢复正确。无法识别的经卷、无效章节路径或空白 Markdown 不会进入索引，且不会被自动删除；这项扫描不会读取圣经正文。
