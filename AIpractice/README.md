# AI Practice（独立版）

这是从 Daniel's Apps 单独拆出的 AI Practice 学习应用。它包含自己的前端、后端、题库、学习进度和语音缓存；不会读取或修改 Daniel's Apps 中的任何其他应用。

## Windows 使用

只需双击 `start.bat`。它会自动检查并安装 AI Practice 所需的 Python 与前端依赖、构建界面、启动程序，并打开浏览器：`http://127.0.0.1:1234`。之后每次也只需双击这一个文件。

若电脑缺少 Python 或 Node.js，`start.bat` 会尝试通过 Windows Package Manager 自动安装；需要联网，且 Windows 未提供该工具时会显示官方下载地址。其余应用依赖会自动处理。

macOS / Linux 可在终端中运行 `python3 start.py`；macOS 也可双击 `start.command`（如果提示权限不足，先在终端运行一次 `chmod +x start.command`）。

## 数据位置

- 题库：`backend/data/AIPractice/quizzes/`
- 学习进度：`backend/data/AIPractice/progress/`
- 自建题目和笔记：同一 `AIPractice` 数据文件夹内

复制整个 `AIpractice` 文件夹到另一台电脑即可。孩子在这份副本中的任何练习、导入或删除都只影响自己的副本。

首次启动会自动忽略从别的电脑复制来的临时依赖，并在本机重新安装；题库、进度与笔记不会被清除。
