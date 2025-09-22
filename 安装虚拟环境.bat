@echo off
chcp 65001 >nul
cd /d "%~dp0"

echo.
echo ================================
echo   Gemini CLI 虚拟环境安装工具
echo ================================
echo.

:: 检查是否存在 package.json
if not exist "package.json" (
    echo ❌ 错误：未找到 package.json 文件
    echo 请确保在 Gemini CLI 项目根目录运行此脚本
    pause
    exit /b 1
)

:: 检查是否存在 packages 目录
if not exist "packages" (
    echo ❌ 错误：未找到 packages 目录
    echo 请确保这是完整的 Gemini CLI 项目
    pause
    exit /b 1
)

echo 🔍 检查 Node.js 安装...
node --version >nul 2>&1
if errorlevel 1 (
    echo ❌ 错误：未找到 Node.js
    echo.
    echo 请先安装 Node.js 20+ 版本：
    echo https://nodejs.org/
    pause
    exit /b 1
)

:: 获取 Node.js 版本
for /f "tokens=1 delims=v" %%i in ('node --version 2^>nul') do set NODE_VERSION=%%i
echo ✅ 找到 Node.js 版本：%NODE_VERSION%

:: 检查 Node.js 版本是否足够（简单检查）
for /f "tokens=1 delims=." %%a in ("%NODE_VERSION%") do set MAJOR_VERSION=%%a
if %MAJOR_VERSION% LSS 18 (
    echo ⚠️  警告：当前 Node.js 版本可能过低
    echo 推荐使用 Node.js 20+ 版本以获得最佳兼容性
    echo.
    choice /c YN /m "是否继续安装？(Y/N)"
    if errorlevel 2 exit /b 1
)

echo.
echo 🚀 开始安装虚拟环境依赖...
echo.

:: 创建 .nvmrc 文件指定 Node.js 版本
echo 20.11.0> .nvmrc
echo ✅ 创建 .nvmrc 文件

:: 清理可能存在的 node_modules
if exist "node_modules" (
    echo 🧹 清理现有 node_modules...
    rmdir /s /q node_modules 2>nul
)

:: 清理 package-lock.json
if exist "package-lock.json" (
    echo 🧹 清理 package-lock.json...
    del package-lock.json 2>nul
)

:: 设置 npm 配置优化安装
echo 📦 配置 npm 设置...
npm config set fund false
npm config set audit false

:: 智能选择安装方式
echo.
echo 📦 安装根目录依赖...

:: 检查是否存在 package-lock.json
if exist "package-lock.json" (
    echo 📋 检测到 package-lock.json，使用 npm ci...
    npm ci
    if errorlevel 1 (
        echo ⚠️  npm ci 失败，尝试 npm install...
        npm install
        if errorlevel 1 goto :install_failed
    )
) else (
    echo 📋 未找到 package-lock.json，使用 npm install...
    npm install
    if errorlevel 1 goto :install_failed
)

echo ✅ 依赖安装成功
goto :build_packages

:install_failed
echo ❌ 依赖安装失败
echo.
echo 🔧 故障排除建议：
echo 1. 检查网络连接
echo 2. 尝试切换 npm 源：npm config set registry https://registry.npmmirror.com/
echo 3. 清理 npm 缓存：npm cache clean --force
echo 4. 升级 npm：npm install -g npm@latest
echo 5. 检查磁盘空间是否充足
pause
exit /b 1

:build_packages

echo.
echo 🔨 构建项目包...

:: 构建 core 包
echo 📦 构建 core 包...
cd packages\core
call npm run build
if errorlevel 1 (
    echo ❌ core 包构建失败
    cd ..\..
    pause
    exit /b 1
)
cd ..\..

:: 构建 cli 包
echo 📦 构建 cli 包...
cd packages\cli
call npm run build
if errorlevel 1 (
    echo ❌ cli 包构建失败
    cd ..\..
    pause
    exit /b 1
)
cd ..\..

:: 创建虚拟环境启动脚本
echo.
echo 📝 创建虚拟环境启动脚本...

:: 创建虚拟环境启动脚本
(
echo @echo off
echo chcp 65001 ^>nul
echo cd /d "%%~dp0"
echo.
echo echo 🚀 启动 Gemini CLI ^(虚拟环境^)
echo echo ================================
echo.
echo :: 设置环境变量
echo set CLI_VERSION=0.7.0-nightly.20250918.2722473a
echo set DEBUG=false
echo set DEBUG_MODE=false
echo set DEV=false
echo set NODE_ENV=production
echo set LANG=zh_CN.UTF-8
echo set GEMINI_SUPERAI_MODE=true
echo set QUIET_MODE=true
echo.
echo :: 启动 CLI
echo node packages\cli\dist\index.js
echo.
echo pause
) > 启动CLI-虚拟环境.bat

echo ✅ 创建虚拟环境启动脚本：启动CLI-虚拟环境.bat

:: 测试启动
echo.
echo 🧪 测试虚拟环境安装...
timeout /t 2 >nul
node packages\cli\dist\index.js --version >nul 2>&1
if errorlevel 1 (
    echo ⚠️  CLI 测试启动失败，但依赖已安装
    echo 请手动运行：启动CLI-虚拟环境.bat 进行测试
) else (
    echo ✅ CLI 测试启动成功
)

echo.
echo ========================================
echo ✅ 虚拟环境安装完成！
echo ========================================
echo.
echo 📋 使用说明：
echo.
echo 1. 🌐 全局环境启动：
echo    双击运行：启动CLI.bat
echo    ^(使用系统全局的 Node.js^)
echo.
echo 2. 📦 虚拟环境启动：
echo    双击运行：启动CLI-虚拟环境.bat
echo    ^(使用项目本地的依赖^)
echo.
echo 💡 建议：
echo - 如果全局环境出现兼容性问题，使用虚拟环境启动
echo - 虚拟环境具有更好的依赖隔离和版本控制
echo.
echo 🔧 配置 API：
echo /baseurl https://api.aigsv.com
echo /setkey sk-your-api-key
echo.
pause
