@echo off
chcp 65001 >nul
title 超级智体 Gemini-CLI

echo.
echo ========================================
echo      🤖 超级智体 Gemini-CLI
echo ========================================
echo.

:: 检查是否已构建
if not exist "packages\cli\dist\index.js" (
    echo ❌ 项目未构建！
    echo.
    echo 请先运行 "安装依赖.bat" 或手动执行：
    echo   npm ci
    echo   npm run build
    echo.
    pause
    exit /b 1
)

:: 设置环境变量
set CLI_VERSION=0.7.0-nightly.20250918.2722473a
set DEBUG=false
set DEBUG_MODE=false
set DEV=false
set NODE_ENV=production
set LANG=zh_CN.UTF-8
set GEMINI_SUPERAI_MODE=true

echo 🚀 启动中...
echo 当前目录: %CD%
echo.

:: 启动 CLI
node packages\cli\dist\index.js

echo.
echo CLI 已退出
pause
