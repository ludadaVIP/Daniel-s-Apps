#!/bin/bash

set -e
cd "$(dirname "$0")"

if ! command -v node >/dev/null 2>&1; then
  echo "[InsightMatrix] 未找到 Node.js。请先安装 Node.js 24.15.0 或更高版本。"
  read -r -p "按回车键退出..."
  exit 1
fi

if [ ! -d "node_modules" ]; then
  echo "[InsightMatrix] 首次运行，正在安装依赖..."
  npm install
fi

echo "[InsightMatrix] 启动中： http://127.0.0.1:5757"
(
  sleep 3
  open "http://127.0.0.1:5757"
) &
npm run dev
