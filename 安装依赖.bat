@echo off
chcp 65001 >nul 2>&1
title 超级智体 Gemini-CLI - 依赖安装工具

:: 切换到脚本所在目录
cd /d "%~dp0"

echo.
echo ========================================
echo   超级智体 Gemini-CLI 依赖安装工具
echo ========================================
echo.
echo 当前目录：%CD%
echo.

:: 检查是否在正确的项目目录
if not exist "package.json" (
    echo ❌ 错误：未找到 package.json 文件！
    echo 请确保此脚本位于 Gemini-CLI 项目根目录。
    echo.
    pause
    exit /b 1
)

echo [1/5] 验证项目结构...
if not exist "packages" (
    echo ❌ 错误：未找到 packages 目录！
    echo 请确保这是完整的 Gemini-CLI 项目。
    pause
    exit /b 1
)
echo ✅ 项目结构正常

echo.
echo [2/5] 检查 Node.js 环境...
node --version >nul 2>&1
if errorlevel 1 (
    echo ❌ 未检测到 Node.js！
    echo.
    echo 请先安装 Node.js 20 或更高版本：
    echo 下载地址：https://nodejs.org/zh-cn/download
    echo.
    echo 安装完成后：
    echo 1. 重启命令提示符
    echo 2. 重新运行此脚本
    echo.
    pause
    exit /b 1
)

for /f "tokens=1" %%v in ('node --version') do set NODE_VERSION=%%v
echo ✅ Node.js 版本: %NODE_VERSION%

:: 检查 Node.js 版本是否符合要求
for /f "tokens=1,2 delims=.v" %%a in ("%NODE_VERSION%") do (
    set MAJOR_VERSION=%%a
    set MINOR_VERSION=%%b
)
if %MAJOR_VERSION% lss 20 (
    echo ⚠️ 警告：Node.js 版本过低！
    echo 当前版本：%NODE_VERSION%
    echo 推荐版本：v20.0.0 或更高
    echo.
    choice /c yn /m "是否继续安装 (可能会失败)？[Y/N]"
    if errorlevel 2 (
        echo 安装已取消。请升级 Node.js 后重试。
        pause
        exit /b 1
    )
)

echo.
echo [3/5] 检查 npm 环境...
npm --version >nul 2>&1
if errorlevel 1 (
    echo ❌ npm 不可用！
    echo npm 通常随 Node.js 一起安装，请重新安装 Node.js。
    pause
    exit /b 1
)

for /f "tokens=1" %%v in ('npm --version') do set NPM_VERSION=%%v
echo ✅ npm 版本: %NPM_VERSION%

echo.
echo [4/5] 安装项目依赖...
echo 这可能需要几分钟时间，请耐心等待...
echo.

:: 首先尝试 npm ci（更快更可靠）
if exist "package-lock.json" (
    echo 使用 npm ci 安装依赖（基于 package-lock.json）...
    npm ci
) else (
    echo package-lock.json 不存在，使用 npm install...
    npm install
)

if errorlevel 1 (
    echo ❌ 依赖安装失败！
    echo.
    echo 尝试清除缓存后重新安装...
    npm cache clean --force
    if exist "node_modules" (
        echo 删除旧的 node_modules...
        rmdir /s /q node_modules
    )
    
    echo 重新安装依赖...
    npm install
    if errorlevel 1 (
        echo ❌ 依赖安装仍然失败！
        echo.
        echo 可能的解决方案：
        echo 1. 检查网络连接
        echo 2. 使用国内镜像：
        echo    npm config set registry https://registry.npmmirror.com
        echo 3. 或者使用淘宝镜像：
        echo    npm config set registry https://registry.npm.taobao.org
        echo 4. 重置为官方镜像：
        echo    npm config set registry https://registry.npmjs.org
        echo.
        pause
        exit /b 1
    )
)

echo ✅ 依赖安装完成！

echo.
echo [5/5] 构建项目...
echo 正在编译项目，请稍候...

:: 直接构建各个包
echo 构建核心包...
cd packages\core
npm run build
if errorlevel 1 (
    echo ❌ 核心包构建失败！
    cd ..\..
    pause
    exit /b 1
)
cd ..\..

echo 构建CLI包...
cd packages\cli  
npm run build
if errorlevel 1 (
    echo ❌ CLI包构建失败！
    cd ..\..
    pause
    exit /b 1
)
cd ..\..

echo ✅ 项目构建完成！

echo.
echo ========================================
echo           🎉 安装成功！
echo ========================================
echo.
echo 安装完成！现在你可以：
echo.
echo 方式一：使用启动器
echo   1. 运行启动器程序
echo   2. 选择此目录作为 Gemini-CLI 目录：
echo      %CD%
echo.
echo 方式二：直接启动 CLI
echo   1. 运行：启动CLI.bat
echo   2. 或者命令行：node packages/cli/dist/index.js
echo.
echo 配置说明：
echo   - 使用 /setkey 设置 API 密钥
echo   - 使用 /baseurl 设置 API 端点（可选）
echo.
pause
