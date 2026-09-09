# NodeApps

一个统一的本地工作台，包含 Industry with coms、InsightMatrix、Notebook 与 BibleDevotion。

## 启动

双击 `start.bat`。首次运行会安装一次共享依赖，随后访问 `http://127.0.0.1:5888`。

也可以在本目录运行：

```powershell
npm run dev
```

## 结构与加载方式

- `src/`：首页与共享工作台壳层。
- `apps/`：四个迁移后的 APP、各自的 Markdown/JSON 数据和后端模块。
- `server/`：唯一的 API 网关。

首页只包含启动页。选中卡片后才会动态下载该 APP 的 React/CSS 代码；Notebook、BibleDevotion、InsightMatrix 的 API 也在第一次访问其专属路径时才会初始化。

## 生产构建

```powershell
npm run build
npm run start
```

生产模式同样使用固定端口 `http://127.0.0.1:5888`。
