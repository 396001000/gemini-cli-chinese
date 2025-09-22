@echo off
chcp 65001 >nul
cd /d "%~dp0"

echo.
echo ============================
echo   简单环境检查工具
echo ============================
echo.

:: 检查 Node.js
echo 🔍 检查 Node.js...
node --version >nul 2>&1
if errorlevel 1 (
    echo ❌ 未找到 Node.js
    echo 📥 请下载安装：https://nodejs.org/
    goto :recommendations
)

for /f "tokens=*" %%i in ('node --version') do set NODE_VERSION=%%i
echo ✅ Node.js 版本：%NODE_VERSION%

:: 简单版本检查
echo %NODE_VERSION% | findstr /r "v1[0-7]\." >nul
if not errorlevel 1 (
    echo ❌ Node.js 版本过低
    goto :recommendations
)

echo %NODE_VERSION% | findstr /r "v18\.[0-6]\." >nul
if not errorlevel 1 (
    echo ❌ Node.js 版本过低（需要 18.7+）
    goto :recommendations
)

echo ✅ Node.js 版本兼容

:: 检查项目状态
echo.
echo 🔍 检查项目状态...
if not exist "packages\cli\dist\index.js" (
    echo ❌ 项目未构建
) else (
    echo ✅ 项目已构建
)

if not exist "node_modules" (
    echo ❌ 依赖未安装
) else (
    echo ✅ 依赖已安装
)

:: 测试启动
echo.
echo 🧪 测试 CLI 启动...
if exist "packages\cli\dist\index.js" (
    node packages\cli\dist\index.js --version >nul 2>&1
    if errorlevel 1 (
        echo ❌ CLI 启动失败
        goto :recommendations
    ) else (
        echo ✅ CLI 启动正常
        echo.
        echo 🎉 环境完全正常！
        echo 📋 推荐启动方式：启动CLI.bat
        goto :end
    )
) else (
    echo ⏭️  跳过（项目未构建）
)

:recommendations
echo.
echo ============================
echo        解决建议
echo ============================
echo.
echo 🔧 根据检查结果，建议：
echo.
echo 1. 📦 如果依赖未安装或版本兼容性问题：
echo    双击运行：快速安装虚拟环境.bat
echo.
echo 2. 🌐 如果环境正常但想使用全局环境：
echo    双击运行：启动CLI.bat
echo.
echo 3. 🔄 如果Node.js版本过低：
echo    升级到 Node.js 20+：https://nodejs.org/
echo.
echo 💡 虚拟环境优势：
echo    - 依赖隔离，避免版本冲突
echo    - 更好的兼容性保证
echo    - 不影响系统全局环境

:end
echo.
pause
