@echo off
chcp 65001 >nul
cd /d "%~dp0"

echo.
echo ================================
echo   快速虚拟环境安装工具
echo ================================
echo.

:: 检查项目结构
if not exist "package.json" (
    echo ❌ 错误：未找到 package.json 文件
    pause
    exit /b 1
)

echo 🔍 检查 Node.js...
node --version >nul 2>&1
if errorlevel 1 (
    echo ❌ 未找到 Node.js，请先安装：https://nodejs.org/
    pause
    exit /b 1
)

for /f "tokens=*" %%i in ('node --version 2^>nul') do set NODE_VERSION=%%i
echo ✅ Node.js 版本：%NODE_VERSION%

echo.
echo 🧹 清理环境...
if exist "node_modules" rmdir /s /q node_modules 2>nul
if exist "package-lock.json" del package-lock.json 2>nul

echo.
echo 📦 设置npm配置...
call npm config set fund false 2>nul
call npm config set audit false 2>nul

echo.
echo 📦 安装依赖...
call npm install
if errorlevel 1 (
    echo.
    echo ❌ 安装失败，尝试使用国内源...
    call npm config set registry https://registry.npmmirror.com/
    call npm install
    if errorlevel 1 (
        echo ❌ 依赖安装失败
        echo.
        echo 🔧 请尝试：
        echo 1. 检查网络连接
        echo 2. 以管理员身份运行
        echo 3. 清理npm缓存：npm cache clean --force
        pause
        exit /b 1
    )
)

echo.
echo 🔨 构建项目...
call npm run build >nul 2>&1
if errorlevel 1 (
    echo ⚠️  npm run build 失败，尝试手动构建...
    
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
)

echo.
echo 📝 创建虚拟环境启动脚本...
(
echo @echo off
echo chcp 65001 ^>nul
echo cd /d "%%~dp0"
echo.
echo echo 🚀 启动 Gemini CLI ^(虚拟环境^)
echo echo ================================
echo.
echo if not exist "packages\cli\dist\index.js" ^(
echo     echo ❌ 项目未构建，请先运行：快速安装虚拟环境.bat
echo     pause
echo     exit /b 1
echo ^)
echo.
echo :: 设置环境变量
echo set CLI_VERSION=0.7.0-nightly.20250918.2722473a
echo set NODE_ENV=production
echo set LANG=zh_CN.UTF-8
echo set GEMINI_SUPERAI_MODE=true
echo.
echo :: 启动 CLI
echo node packages\cli\dist\index.js
echo.
echo if errorlevel 1 ^(
echo     echo.
echo     echo ❌ CLI 启动失败
echo     echo 💡 可能的解决方案：
echo     echo 1. 重新运行：快速安装虚拟环境.bat
echo     echo 2. 检查 Node.js 版本是否兼容
echo     echo 3. 使用全局环境：启动CLI.bat
echo ^)
echo.
echo pause
) > 启动CLI-虚拟环境.bat

echo ✅ 创建启动脚本：启动CLI-虚拟环境.bat

echo.
echo 🧪 测试安装...
node packages\cli\dist\index.js --version >nul 2>&1
if errorlevel 1 (
    echo ⚠️  CLI 测试失败，但依赖已安装
    echo 请手动运行：启动CLI-虚拟环境.bat
) else (
    echo ✅ CLI 测试成功
)

echo.
echo ========================================
echo ✅ 虚拟环境安装完成！
echo ========================================
echo.
echo 🚀 启动方式：
echo   双击运行：启动CLI-虚拟环境.bat
echo.
echo 🔧 配置API：
echo   /baseurl https://api.aigsv.com
echo   /setkey sk-your-api-key
echo.
echo 💡 如果还有问题：
echo   1. 升级 Node.js 到 20+ 版本
echo   2. 使用全局环境：启动CLI.bat
echo   3. 运行环境检查：检查环境.bat
echo.
pause
