/**
 * 超级智体 Gemini-CLI 启动器 - 主进程
 * @license Apache-2.0
 */

const { app, BrowserWindow, ipcMain, dialog, shell } = require('electron');
const path = require('path');
const fs = require('fs');
const { spawn } = require('child_process');
// 简单的UUID生成函数，替代uuid依赖
function generateId() {
  return 'proj_' + Date.now() + '_' + Math.random().toString(36).substr(2, 9);
}

// 配置文件路径
const CONFIG_PATH = path.join(app.getPath('userData'), 'launcher-config.json');

let mainWindow;
let projectManagerWindow;

// 默认配置
const defaultConfig = {
  projects: [],
  settings: {
    lastSelectedProject: null,
    autoSelectLastUsed: true,
    windowSize: { width: 700, height: 580 },
    geminiCliPath: null  // Gemini-CLI 安装目录
  }
};

/**
 * 创建主窗口
 */
function createMainWindow() {
  const config = loadConfig();
  
  mainWindow = new BrowserWindow({
    width: config.settings.windowSize.width,
    height: config.settings.windowSize.height,
    minWidth: 600,
    minHeight: 500,
    maxWidth: 800,
    maxHeight: 700,
    webPreferences: {
      nodeIntegration: true,
      contextIsolation: false,
      webSecurity: false,
      enableRemoteModule: false,
      experimentalFeatures: false,
      webgl: false,
      plugins: false
    },
    icon: path.join(__dirname, 'assets', 'icon.png'),
    title: '超级智体 Gemini-CLI 启动器',
    show: false,
    frame: true,
    resizable: true,
    center: true
  });

  mainWindow.loadFile('renderer/index.html');

  // 窗口准备好后显示
  mainWindow.once('ready-to-show', () => {
    mainWindow.show();
  });

  // 窗口关闭时保存配置
  mainWindow.on('close', () => {
    const bounds = mainWindow.getBounds();
    const config = loadConfig();
    config.settings.windowSize = { width: bounds.width, height: bounds.height };
    saveConfig(config);
  });

  mainWindow.on('closed', () => {
    mainWindow = null;
  });

  // 开发模式下打开开发者工具
  if (process.argv.includes('--dev')) {
    mainWindow.webContents.openDevTools();
  }
}

/**
 * 创建项目管理窗口
 */
function createProjectManagerWindow() {
  if (projectManagerWindow) {
    projectManagerWindow.focus();
    return;
  }

  projectManagerWindow = new BrowserWindow({
    width: 750,
    height: 600,
    minWidth: 650,
    minHeight: 500,
    maxWidth: 900,
    maxHeight: 750,
    parent: mainWindow,
    modal: true,
    webPreferences: {
      nodeIntegration: true,
      contextIsolation: false
    },
    icon: path.join(__dirname, 'assets', 'icon.png'),
    title: '项目管理',
    show: false,
    frame: true,
    resizable: true,
    center: true
  });

  projectManagerWindow.loadFile('renderer/project-manager.html');

  projectManagerWindow.once('ready-to-show', () => {
    projectManagerWindow.show();
  });

  projectManagerWindow.on('closed', () => {
    projectManagerWindow = null;
  });
}

/**
 * 加载配置文件
 */
function loadConfig() {
  try {
    if (fs.existsSync(CONFIG_PATH)) {
      const data = fs.readFileSync(CONFIG_PATH, 'utf8');
      return { ...defaultConfig, ...JSON.parse(data) };
    }
  } catch (error) {
    console.error('加载配置文件失败:', error);
  }
  return { ...defaultConfig };
}

/**
 * 保存配置文件
 */
function saveConfig(config) {
  try {
    const dir = path.dirname(CONFIG_PATH);
    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir, { recursive: true });
    }
    fs.writeFileSync(CONFIG_PATH, JSON.stringify(config, null, 2));
  } catch (error) {
    console.error('保存配置文件失败:', error);
  }
}

/**
 * 启动 Gemini-CLI
 */
function startGeminiCLI(projectPath, customCliPath = null) {
  try {
    // 验证工作目录是否存在
    if (!fs.existsSync(projectPath)) {
      return { success: false, error: '工作目录不存在' };
    }

    // 确定 Gemini-CLI 安装目录
    let geminiCliPath;
    if (customCliPath) {
      geminiCliPath = customCliPath;
    } else {
      // 从配置文件中获取
      const config = loadConfig();
      if (config.settings.geminiCliPath) {
        geminiCliPath = config.settings.geminiCliPath;
      } else {
        // 没有配置路径时返回错误，要求用户选择
        return { 
          success: false, 
          error: '请先在启动器中选择 Gemini-CLI 安装目录' 
        };
      }
    }
    
    const cliEntryPoint = path.join(geminiCliPath, 'packages', 'cli', 'dist');
    
    // 检查 Gemini-CLI 是否正确安装
    if (!fs.existsSync(cliEntryPoint)) {
      return { 
        success: false, 
        error: `Gemini-CLI 未找到，请检查安装目录：${geminiCliPath}` 
      };
    }

    // 读取 API 端点（如有）
    let apiEndpoint = null;
    try {
      const cfgForEnv = loadConfig();
      apiEndpoint = cfgForEnv && cfgForEnv.settings && cfgForEnv.settings.apiEndpoint ? cfgForEnv.settings.apiEndpoint : null;
    } catch (e) {}

    // 启动新的命令行窗口运行 CLI
    let command, args;
    
    // 使用绝对路径避免相对路径问题
    const cliIndexPath = path.join(cliEntryPoint, 'index.js');
    // 确保路径使用正斜杠或双反斜杠避免转义问题
    const absoluteCliPath = cliIndexPath.replace(/\\/g, '\\\\');
    
    if (process.platform === 'win32') {
      // 创建临时批处理文件，避免参数传递问题
      const os = require('os');
      const tempDir = os.tmpdir();
      const batchFile = path.join(tempDir, `gemini-launcher-${Date.now()}.bat`);
      
      // 控制台调试信息
      console.log('Launch Debug:');
      console.log('  Project Path:', projectPath);
      console.log('  CLI Entry:', cliEntryPoint);
      console.log('  CLI Index:', cliIndexPath);
      console.log('  Batch File:', batchFile);
      
      // 构建批处理文件内容，使用数组拼接避免格式问题
      const batchLines = [
        '@echo off',
        'chcp 65001 >nul 2>&1',
        `cd /d "${projectPath}"`,
        'if errorlevel 1 (',
        `    echo ERROR: Failed to change to project directory`,
        '    pause',
        '    exit /b 1',
        ')',
        'echo Starting Gemini-CLI in: %CD%',
        'echo.',
        'set CLI_VERSION=0.7.0-nightly.20250918.2722473a',
        'set DEBUG=false',
        'set DEBUG_MODE=false',
        'set DEV=false',
        'set NODE_ENV=production',
        'set LANG=zh_CN.UTF-8',
        'set GEMINI_SUPERAI_MODE=true',
        'set QUIET_MODE=true'
      ];
      
      if (apiEndpoint) {
        batchLines.push(`set CODE_ASSIST_ENDPOINT=${apiEndpoint}`);
      }
      
      batchLines.push(
        `node "${cliIndexPath}"`,
        'pause',
        'del "%~f0"'
      );
      
      const batchContent = batchLines.join('\r\n') + '\r\n';
      
      // 写入批处理文件，使用 ANSI 编码避免 UTF-8 BOM 问题
      fs.writeFileSync(batchFile, batchContent, 'ascii');
      console.log('Batch file content:');
      console.log('---BEGIN---');
      console.log(batchContent);
      console.log('---END---');
      
      command = 'cmd';
      args = ['/c', 'start', 'cmd', '/k', batchFile];
    } else if (process.platform === 'darwin') {
      command = 'open';
      args = ['-a', 'Terminal', '--args', 'bash', '-c', `cd "${projectPath}" && node "${startScript}"`];
    } else {
      command = 'gnome-terminal';
      args = ['--', 'bash', '-c', `cd "${projectPath}" && node "${startScript}"; exec bash`];
    }

    // 添加调试信息（使用英文避免编码问题）
    console.log('Command:', command);
    console.log('Args:', args);
    console.log('WorkDir:', projectPath);
    console.log('CLI Entry:', cliEntryPoint);
    console.log('CLI Index Path:', cliIndexPath);

    const child = spawn(command, args, {
      detached: true,
      stdio: ['ignore', 'pipe', 'pipe']
    });

    // 监听错误
    child.on('error', (error) => {
      console.error('Launch failed:', error);
    });

    child.stdout?.on('data', (data) => {
      console.log('Output:', data.toString());
    });

    child.stderr?.on('data', (data) => {
      console.error('Error:', data.toString());
    });

    child.unref();
    
    return { success: true, message: 'Gemini-CLI 启动成功' };
  } catch (error) {
    return { success: false, error: error.message };
  }
}

// 禁用硬件加速，解决 GPU 进程错误
app.disableHardwareAcceleration();

// 添加更多命令行参数彻底解决 GPU 相关问题
app.commandLine.appendSwitch('--disable-gpu');
app.commandLine.appendSwitch('--disable-gpu-sandbox');
app.commandLine.appendSwitch('--disable-software-rasterizer');
app.commandLine.appendSwitch('--disable-gpu-compositing');
app.commandLine.appendSwitch('--disable-gpu-rasterization');
app.commandLine.appendSwitch('--disable-backgrounding-occluded-windows');
app.commandLine.appendSwitch('--disable-renderer-backgrounding');
app.commandLine.appendSwitch('--disable-features=VizDisplayCompositor');
app.commandLine.appendSwitch('--use-gl=swiftshader');
app.commandLine.appendSwitch('--ignore-gpu-blacklist');

// App 事件处理
app.whenReady().then(createMainWindow);

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit();
  }
});

app.on('activate', () => {
  if (BrowserWindow.getAllWindows().length === 0) {
    createMainWindow();
  }
});

// IPC 事件处理
ipcMain.handle('get-config', () => {
  return loadConfig();
});

ipcMain.handle('save-config', (event, config) => {
  saveConfig(config);
  return true;
});

ipcMain.handle('browse-folder', async () => {
  const result = await dialog.showOpenDialog(mainWindow, {
    properties: ['openDirectory'],
    title: '选择项目文件夹'
  });
  
  if (!result.canceled && result.filePaths.length > 0) {
    return result.filePaths[0];
  }
  return null;
});

ipcMain.handle('start-cli', (event, projectPath) => {
  const result = startGeminiCLI(projectPath);
  
  // 如果启动成功，更新最后使用时间
  if (result.success) {
    const config = loadConfig();
    const project = config.projects.find(p => p.path === projectPath);
    if (project) {
      project.lastUsed = new Date().toISOString();
      config.settings.lastSelectedProject = project.id;
      saveConfig(config);
    }
    
    // 启动成功后关闭启动器
    setTimeout(() => {
      if (mainWindow) {
        mainWindow.close();
      }
    }, 1000);
  }
  
  return result;
});

ipcMain.handle('add-project', (event, projectData) => {
  const config = loadConfig();
  const newProject = {
    id: generateId(),
    name: projectData.name,
    path: projectData.path,
    createdAt: new Date().toISOString(),
    lastUsed: null
  };
  
  config.projects.push(newProject);
  saveConfig(config);
  
  return newProject;
});

ipcMain.handle('update-project', (event, projectId, projectData) => {
  const config = loadConfig();
  const projectIndex = config.projects.findIndex(p => p.id === projectId);
  
  if (projectIndex !== -1) {
    config.projects[projectIndex] = {
      ...config.projects[projectIndex],
      name: projectData.name,
      path: projectData.path
    };
    saveConfig(config);
    return true;
  }
  
  return false;
});

ipcMain.handle('delete-project', (event, projectId) => {
  const config = loadConfig();
  const projectIndex = config.projects.findIndex(p => p.id === projectId);
  
  if (projectIndex !== -1) {
    config.projects.splice(projectIndex, 1);
    
    // 如果删除的是当前选中的项目，清除选择
    if (config.settings.lastSelectedProject === projectId) {
      config.settings.lastSelectedProject = null;
    }
    
    saveConfig(config);
    return true;
  }
  
  return false;
});

ipcMain.handle('open-project-manager', () => {
  createProjectManagerWindow();
});

ipcMain.handle('validate-path', (event, projectPath) => {
  try {
    if (!fs.existsSync(projectPath)) {
      return { valid: false, error: '路径不存在' };
    }
    
    const stats = fs.statSync(projectPath);
    if (!stats.isDirectory()) {
      return { valid: false, error: '路径必须是一个文件夹' };
    }
    
    // 检查是否可写（可以创建文件）
    try {
      fs.accessSync(projectPath, fs.constants.W_OK);
    } catch (error) {
      return { valid: false, error: '该目录没有写入权限' };
    }
    
    return { valid: true };
  } catch (error) {
    return { valid: false, error: error.message };
  }
});

ipcMain.handle('open-external', (event, url) => {
  shell.openExternal(url);
});

// 选择 Gemini-CLI 安装目录
ipcMain.handle('select-cli-directory', async () => {
  const result = await dialog.showOpenDialog(mainWindow, {
    properties: ['openDirectory'],
    title: '选择 Gemini-CLI 安装目录'
  });
  
  if (!result.canceled && result.filePaths.length > 0) {
    return result.filePaths[0];
  }
  return null;
});

// 验证 Gemini-CLI 安装目录
ipcMain.handle('validate-cli-path', (event, cliPath) => {
  try {
    console.log('Validating CLI path:', cliPath);
    
    if (!fs.existsSync(cliPath)) {
      console.log('Path does not exist:', cliPath);
      return { valid: false, error: '路径不存在' };
    }
    
    const stats = fs.statSync(cliPath);
    if (!stats.isDirectory()) {
      console.log('Path is not a directory:', cliPath);
      return { valid: false, error: '路径必须是一个文件夹' };
    }
    
    // 检查是否包含 packages/cli 目录
    const cliEntryPoint = path.join(cliPath, 'packages', 'cli');
    console.log('Checking CLI entry point:', cliEntryPoint);
    if (!fs.existsSync(cliEntryPoint)) {
      console.log('CLI entry point does not exist:', cliEntryPoint);
      return { valid: false, error: '该目录不是有效的 Gemini-CLI 安装目录（缺少 packages/cli 文件夹）' };
    }
    
    // 检查 package.json 是否存在
    const packageJson = path.join(cliEntryPoint, 'package.json');
    console.log('Checking package.json:', packageJson);
    if (!fs.existsSync(packageJson)) {
      console.log('package.json does not exist:', packageJson);
      return { valid: false, error: '该目录不是有效的 Gemini-CLI 安装目录（缺少 package.json）' };
    }
    
    console.log('CLI path validation successful');
    return { valid: true };
  } catch (error) {
    console.error('CLI path validation error:', error);
    return { valid: false, error: `验证失败: ${error.message}` };
  }
});

// 更新 Gemini-CLI 路径设置
ipcMain.handle('update-cli-path', (event, cliPath) => {
  const config = loadConfig();
  config.settings.geminiCliPath = cliPath;
  saveConfig(config);
  return true;
});
