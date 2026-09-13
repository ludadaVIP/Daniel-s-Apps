# NodeApps

一个统一的本地工作台，包含 Investment、Industry with coms、InsightMatrix、Notebook、VisualShelf、BibleDevotion 与 Recall Verses。VisualShelf 将独立 HTML 图文资料保存在 `apps/html-library/data/library/`，并在不改写原文件的前提下提供目录、预览与阅读管理。

## 启动

Windows 双击 `start.bat`；Mac 双击 `start.command`。首次运行会安装一次共享依赖，随后自动打开 `http://127.0.0.1:5888`。

Mac 初次下载或拷贝到新电脑后，若 Finder 提示没有权限，可在终端进入本目录后执行一次：

```bash
chmod +x start.command
```

也可以在本目录运行：

```powershell
npm run dev
```

## 结构与加载方式

- `src/`：首页与共享工作台壳层。
- `apps/`：独立 APP、各自的 Markdown/JSON 数据和后端模块。VisualShelf 的 HTML 原文件位于 `apps/html-library/data/library/`，可继续作为独立网页在任何浏览器中打开；编辑的标题、简介、标签与阅读状态保存在旁边的 `catalog.json`。Recall Verses 复用 BibleDevotion 的 CUV 经文与笔记索引，并将背诵隐藏状态存放在自己的 `recall-data` 中。
- `server/`：唯一的 API 网关。

首页只包含启动页。选中卡片后才会动态下载该 APP 的 React/CSS 代码；Notebook、VisualShelf、BibleDevotion、InsightMatrix 的 API 也在第一次访问其专属路径时才会初始化。

## 生产构建

```powershell
npm run build
npm run start
```

生产模式同样使用固定端口 `http://127.0.0.1:5888`。
