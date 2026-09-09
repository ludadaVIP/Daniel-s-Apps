#!/usr/bin/env bash
set -euo pipefail

cd "$(dirname "$0")"

if ! command -v node >/dev/null 2>&1; then
  echo "[错误] 未检测到 Node.js。请先安装 Node.js 24.15.0 或更高版本。"
  read -r -p "按 Enter 退出..."
  exit 1
fi

if ! command -v npm >/dev/null 2>&1; then
  echo "[错误] 未检测到 npm。请重新安装 Node.js。"
  read -r -p "按 Enter 退出..."
  exit 1
fi

if [ ! -d "node_modules" ]; then
  echo "[首次启动] 正在安装依赖，请稍候..."
  npm install
fi

echo
echo "Industry Atlas 正在启动..."
echo "打开浏览器访问：http://127.0.0.1:5188"
echo "按 Ctrl+C 可停止服务。"
echo
npm run dev
