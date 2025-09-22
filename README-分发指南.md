# 超级智体 Gemini-CLI 分发指南

## 🎯 项目概述

这是超级智体专用版的 Gemini-CLI，在官方版本基础上添加了：
- 完整的中文汉化系统
- 超级智体专用命令和功能
- 自定义启动菜单
- 增强的 API 端点管理

## 📦 分发方案

### 方案1：开源分发（推荐）
将此项目开源，用户克隆后自行安装依赖。

### 方案2：启动器 + CLI 分离
- 启动器单独打包分发
- CLI 项目开源，用户自行安装

## 🚀 用户使用指南

### 第一步：获取项目
```bash
git clone [你的仓库地址]
cd gemini-cli
```

### 第二步：安装依赖

#### 系统要求
- **操作系统**: Windows 7/8/10/11 (64位)
- **Node.js**: 20.0.0 或更高版本
- **内存**: 至少 2GB RAM
- **磁盘空间**: 至少 1GB 可用空间

#### 环境检查（推荐第一步）
**Windows 用户**：双击运行 `检查环境.bat`

检查项目：
- ✅ Node.js 版本兼容性
- ✅ 依赖安装状态
- ✅ 项目构建状态
- ✅ CLI 启动测试

#### 自动安装（推荐）
**Windows 用户**：双击运行 `安装依赖.bat`

脚本会自动执行：
- ✅ 验证项目结构完整性
- ✅ 检查 Node.js 和 npm 环境  
- ✅ 智能选择安装方式 (npm ci 或 npm install)
- ✅ 自动重试和错误恢复
- ✅ 构建项目生成可执行文件

#### 兼容性问题解决
如果遇到 Node.js 版本兼容性问题：

**Windows 用户**：双击运行 `安装虚拟环境.bat`

虚拟环境优势：
- 🔒 依赖隔离，避免版本冲突
- 📦 使用项目本地依赖
- 🛡️ 更好的兼容性保证

#### 手动安装
```bash
# 1. 确保 Node.js 版本 >= 20
node --version

# 2. 安装依赖
npm ci  # 或者 npm install

# 3. 构建项目
npm run build
```

#### 常见问题
- **Node.js 未找到**: 请先安装 [Node.js](https://nodejs.org/zh-cn/download)，安装后重启命令提示符
- **网络问题**: 使用国内镜像 `npm config set registry https://registry.npmmirror.com`
- **权限问题**: 以管理员身份运行脚本
- **依赖冲突**: 删除 `node_modules` 文件夹后重试

### 第三步：启动 CLI

#### 方式一：直接启动（推荐）
```bash
# 🌐 全局环境启动（使用系统 Node.js）
双击运行：启动CLI.bat

# 📦 虚拟环境启动（兼容性更好）
双击运行：启动CLI-虚拟环境.bat
```

#### 方式二：使用启动器
1. 下载并运行启动器
2. 在"Gemini-CLI 目录"中选择刚才克隆的项目目录
3. 设置工作项目目录
4. 点击启动

#### 环境选择建议
- **✅ 优先使用全局环境**：启动快速，资源占用少
- **🛡️ 兼容性问题时使用虚拟环境**：依赖隔离，兼容性更好
- **🔧 使用环境检查工具**：`检查环境.bat` 诊断问题

### 第四步：配置 API
在 CLI 中使用以下命令：
```
/setkey your-api-key          # 设置 API 密钥
/baseurl https://your-api     # 设置 API 端点（如使用中转）
```

## 🔧 开发者指南

### 本地开发
```bash
npm run start              # 启动开发版 CLI
npm run build             # 构建项目
npm run test              # 运行测试
```

### 启动器开发
```bash
cd launcher
npm install               # 安装启动器依赖
npm start                # 启动开发版启动器
npm run build            # 打包启动器
```

## 📋 系统要求

- **Node.js**: 20.0.0 或更高版本
- **操作系统**: Windows 10/11, macOS, Linux
- **内存**: 建议 4GB 以上
- **存储**: 约 500MB 可用空间

## 🛠️ 故障排除

### 依赖安装失败
```bash
# 清除缓存
npm cache clean --force

# 使用国内镜像
npm config set registry https://registry.npmmirror.com

# 重新安装
npm install
```

### 构建失败
```bash
# 清理并重新构建
npm run clean
npm run build
```

### 启动器连接失败
1. 确认 CLI 目录路径正确
2. 确认项目已正确构建（存在 `packages/cli/dist` 目录）
3. 重新选择 CLI 目录

## 📞 支持

如遇问题，请：
1. 查看控制台错误信息
2. 确认系统要求
3. 提交 Issue 并附上错误日志

## 📄 许可证

基于原 Gemini-CLI 许可证，添加超级智体专用功能。
