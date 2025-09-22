@echo off
chcp 65001 >nul
cd /d "%~dp0"

echo.
echo ============================
echo   Gemini CLI 环境检查工具
echo ============================
echo.

:: 检查 Node.js
echo 🔍 检查 Node.js...
node --version >nul 2>&1
if errorlevel 1 (
    echo ❌ 未找到 Node.js
    echo.
    echo 请安装 Node.js 20+ 版本：https://nodejs.org/
    goto :end
) else (
    for /f "tokens=*" %%i in ('node --version 2^>nul') do set NODE_VERSION=%%i
    echo ✅ Node.js 版本：%NODE_VERSION%
)

:: 检查版本兼容性
for /f "tokens=1 delims=v." %%a in ("%NODE_VERSION%") do set MAJOR_VERSION=%%a
for /f "tokens=2 delims=v." %%b in ("%NODE_VERSION%") do set MINOR_VERSION=%%b

echo.
echo 📋 版本兼容性检查：
if %MAJOR_VERSION% GEQ 20 (
    echo ✅ Node.js 版本兼容（推荐）
    set COMPAT_STATUS=GOOD
) else if %MAJOR_VERSION% EQU 18 (
    if %MINOR_VERSION% GEQ 7 (
        echo ⚠️  Node.js 版本可用（最低要求）
        set COMPAT_STATUS=OK
    ) else (
        echo ❌ Node.js 版本过低（需要 18.7+）
        set COMPAT_STATUS=BAD
    )
) else (
    echo ❌ Node.js 版本过低（需要 18.7+）
    set COMPAT_STATUS=BAD
)

:: 检查项目构建状态
echo.
echo 🔍 检查项目构建状态...
if exist "packages\cli\dist\index.js" (
    echo ✅ 项目已构建
    set BUILD_STATUS=OK
) else (
    echo ❌ 项目未构建
    set BUILD_STATUS=BAD
)

:: 检查依赖安装
echo.
echo 🔍 检查依赖安装...
if exist "node_modules" (
    echo ✅ 依赖已安装
    set DEPS_STATUS=OK
) else (
    echo ❌ 依赖未安装
    set DEPS_STATUS=BAD
)

:: 测试 CLI 启动
echo.
echo 🧪 测试 CLI 启动...
if "%BUILD_STATUS%"=="OK" (
    node packages\cli\dist\index.js --version >nul 2>&1
    if errorlevel 1 (
        echo ❌ CLI 启动失败（可能存在兼容性问题）
        set CLI_STATUS=BAD
    ) else (
        echo ✅ CLI 启动正常
        set CLI_STATUS=OK
    )
) else (
    echo ⏭️  跳过（项目未构建）
    set CLI_STATUS=SKIP
)

:: 总结和建议
echo.
echo ============================
echo        环境检查结果
echo ============================
echo.

if "%COMPAT_STATUS%"=="GOOD" if "%BUILD_STATUS%"=="OK" if "%DEPS_STATUS%"=="OK" if "%CLI_STATUS%"=="OK" (
    echo 🎉 环境完全正常！
    echo.
    echo 📋 推荐启动方式：
    echo   🌐 全局环境：启动CLI.bat
    echo.
) else (
    echo ⚠️  发现问题，请参考以下建议：
    echo.
    
    if "%COMPAT_STATUS%"=="BAD" (
        echo 🔧 Node.js 版本问题：
        echo   - 升级到 Node.js 20+ 版本：https://nodejs.org/
        echo   - 或使用虚拟环境：运行 "安装虚拟环境.bat"
        echo.
    )
    
    if "%DEPS_STATUS%"=="BAD" (
        echo 🔧 依赖问题：
        echo   - 运行：安装依赖.bat
        echo.
    )
    
    if "%BUILD_STATUS%"=="BAD" (
        echo 🔧 构建问题：
        echo   - 运行：npm run build
        echo.
    )
    
    if "%CLI_STATUS%"=="BAD" (
        echo 🔧 兼容性问题：
        echo   - 推荐使用虚拟环境：运行 "安装虚拟环境.bat"
        echo   - 然后使用：启动CLI-虚拟环境.bat
        echo.
    )
)

echo 💡 环境说明：
echo   🌐 全局环境：使用系统 Node.js，启动快速
echo   📦 虚拟环境：使用项目依赖，兼容性更好
echo.

:end
pause
