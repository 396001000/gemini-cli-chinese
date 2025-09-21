/**
 * @license
 * Copyright 2025 Google LLC
 * SPDX-License-Identifier: Apache-2.0
 */

import type { TranslationKeys } from '../types.js';

export const zhCN: TranslationKeys = {
  basics: {
    addContext: '添加上下文',
    shellMode: 'Shell 模式',
    commands: '命令',
    keyboardShortcuts: '键盘快捷键',
    enter: 'Enter',
    newLine: '换行',
    cycleHistory: '浏览提示历史记录',
    jumpWords: '在输入中跳转单词',
    toggleAutoAccept: '切换自动接受编辑',
    toggleYolo: '切换 YOLO 模式',
    cancel: '取消操作',
    quit: '退出应用程序',
  },
  
  auth: {
    getStarted: '开始使用',
    howToAuthenticate: '您希望如何为此项目进行身份验证？',
    loginWithGoogle: '使用 Google 登录',
    useCloudShell: '使用 Cloud Shell 用户凭据',
    useGeminiApiKey: '使用 Gemini API 密钥',
    vertexAi: 'Vertex AI',
    useEnterToSelect: '（按 Enter 选择）',
    termsAndPrivacy: 'Gemini CLI 服务条款和隐私声明',
    mustSelectAuth: '您必须选择一种身份验证方法才能继续。按两次 Ctrl+C 退出。',
    existingApiKeyDetected: '检测到现有 API 密钥 (GEMINI_API_KEY)。选择"使用 Gemini API 密钥"选项来使用它。',
  },

  // 确认对话框翻译
  confirmation: {
    yes: '是',
    no: '否',
    yesAllowOnce: '是，允许一次',
    yesAllowAlways: '是，始终允许',
    yesAllowAlwaysSession: '是，此会话始终允许',
    noEsc: '否 (esc)',
    cancel: '取消',
    proceed: '继续',
  },

  // Shell 命令确认对话框
  shellConfirmation: {
    title: 'Shell 命令执行',
    description: '自定义命令想要运行以下 shell 命令：',
    question: '您想要继续吗？',
  },

  // 工具确认对话框
  toolConfirmation: {
    allowExecution: '允许执行 MCP 工具',
    mcpServer: 'MCP 服务器',
    tool: '工具',
    yesAllowOnceTool: '是，允许一次',
    yesAlwaysAllowTool: '是，始终允许工具',
    yesAlwaysAllowServer: '是，始终允许来自服务器的所有工具',
    noSuggestChanges: '否，建议更改 (esc)',
  },

  // 循环检测确认
  loopDetection: {
    title: '检测到潜在循环',
    description: '这可能是由于重复的工具调用或其他模型行为造成的。您想保持循环检测启用还是在此会话中禁用它？',
    keepEnabled: '保持循环检测启用 (esc)',
    disableForSession: '在此会话中禁用循环检测',
  },
  
  loading: {
    escToCancel: '按 Esc 取消',
    contextLeft: '剩余上下文',
    noSandbox: '无沙盒',
    seeDocsForSandbox: '（查看 /docs）',
  },
  
  errors: {
    errorInFile: '文件错误：',
    pleaseFixAndTry: '请修复',
    promptInteractiveNotSupported: '错误：从标准输入管道传输输入时不支持 --prompt-interactive 标志。',
    errorAuthenticating: '身份验证错误：',
    noAuthMethodSet: '未设置身份验证方法',
    themeNotFound: '未找到主题。',
    noDiffToolAvailable: '没有可用的差异工具。请安装支持的编辑器。',
    installSupportedEditor: '请安装支持的编辑器。',
  },
  
  help: {
    shellCommand: 'shell 命令',
    sendMessage: '发送消息',
    newLineAlt: '换行（Alt+Enter 适用于某些 Linux 发行版）',
    newLineLinux: '换行',
  },
  
  system: {
    installedExtensions: '已安装的扩展：',
    macOsSeatbelt: 'MacOS 沙盒',
  },
  
  common: {
    warning: '警告：',
    error: '错误：',
    info: '信息：',
    debug: '调试：',
    version: 'v',
    model: '模型',
    contextUsage: '剩余上下文',
  },
  
  tips: {
    gettingStarted: '入门提示：',
    askQuestions: '1. 提问、编辑文件或运行命令。',
    beSpecific: '2. 具体描述以获得最佳结果。',
    createGeminiMd: '3. 欢迎使用超级智体-cli增强版，此版本免费使用。',
    welcomeMessage: '4. 微信：chaojigeti520',
    helpForMore: '获取更多信息。',
  },
  
  commands: {
    clear: {
      description: '清除屏幕和对话历史记录',
      debugMessage: '正在清除终端并重置聊天。',
    },
    help: {
      description: '获取 gemini-cli 帮助',
    },
    theme: {
      description: '更改主题',
    },
    memory: {
      description: '与内存交互的命令。',
      show: {
        description: '显示当前内存内容。',
        currentContent: '当前内存内容来自',
        emptyMemory: '内存当前为空。',
      },
      add: {
        description: '向内存添加内容。',
        usage: '用法：/memory add <要记住的文本>',
        attempting: '尝试保存到内存：',
      },
      refresh: {
        description: '从源刷新内存。',
        refreshing: '正在从源文件刷新内存...',
        success: '内存刷新成功。已从',
        successEmpty: '内存刷新成功。未找到内存内容。',
        error: '刷新内存时出错：',
      },
    },
    docs: {
      description: '在浏览器中打开完整的 Gemini CLI 文档',
    },
    auth: {
      description: '更改身份验证方法',
    },
    editor: {
      description: '设置外部编辑器首选项',
    },
    privacy: {
      description: '显示隐私声明',
    },
    stats: {
      description: '检查会话统计信息。用法：/stats [model|tools]',
    },
    mcp: {
      description: '列出已配置的 MCP 服务器和工具',
    },
    extensions: {
      description: '列出活动扩展',
    },
    tools: {
      description: '列出可用的 Gemini CLI 工具',
    },
    about: {
      description: '显示版本信息',
    },
    bug: {
      description: '提交错误报告',
    },
    chat: {
      description: '管理对话历史记录。用法：/chat <list|save|resume> <tag>',
    },
    quit: {
      description: '退出 CLI',
    },
    compress: {
      description: '通过用摘要替换上下文来压缩上下文。',
    },
    shell: {
      description: 'shell 命令',
    },
    setkey: {
      description: '设置 API 密钥',
      promptForKey: '请输入您的 Gemini API 密钥：',
      keySetSuccess: 'API 密钥已成功保存到 ~/.gemini/.env 文件。重启 Gemini CLI 后生效。',
      keySetError: '设置 API 密钥时出错：',
      invalidKey: '无效的 API 密钥格式',
      pleaseEnterKey: '请输入您的 API 密钥',
    },

    global: {
      description: '编辑全局提示词文件',
      error: '打开全局提示词文件失败：',
      opened: '全局提示词文件已打开。文件位置：~/.gemini/GEMINI.md',
    },
    project: {
      description: '编辑项目提示词文件',
      error: '打开项目提示词文件失败：',
      opened: '项目提示词文件已打开。文件位置：当前目录/GEMINI.md',
    },
    
    // 新增的命令翻译
    model: {
      description: '切换 Gemini 模型',
      title: '选择 Gemini 模型',
      current: '当前模型: {model}',
      availableModels: '可用模型:',
      usage: '使用方法: /model <模型名>',
      setSuccess: '✅ 模型已切换到: {model}\\n\\n新模型现在已生效，您可以开始使用新模型进行对话。',
      setError: '设置模型时出错：{error}',
      invalidModel: '无效的模型名称: {model}\\n\\n支持的模型: {models}',
      instructions: '请选择模型或使用 /model <模型名称> 直接切换',
    },
    
    sandbox: {
      description: '配置沙盒安全设置',
      title: '沙盒安全配置',
      setSuccess: '沙盒模式已设置为：{mode} ({description})',
      setError: '设置沙盒模式时出错：{error}',
      invalidMode: '无效的沙盒模式：{mode}。可用模式：{modes}',
      dockerNotAvailable: 'Docker 未安装或不可用。请先安装 Docker 或选择其他沙盒模式。',
      podmanNotAvailable: 'Podman 未安装或不可用。请先安装 Podman 或选择其他沙盒模式。',
    },
    
    yolo: {
      description: '配置自动执行模式',
      title: '自动执行模式',
      setSuccess: 'YOLO模式已{status}。',
      setError: '设置YOLO模式时出错：{error}',
      invalidMode: '无效的YOLO模式：{mode}。可用选项：on/off',
      enabled: '启用',
      disabled: '禁用',
      warning: '⚠️  警告：AI现在将自动执行命令。请确保在安全环境中使用！',
      safeMode: '✅ 安全模式：所有命令都将需要手动确认。',
    },
    
    debug: {
      description: '配置调试模式',
      title: '调试模式配置',
      setSuccess: '调试模式已设置为：{mode} ({description})',
      setError: '设置调试模式时出错：{error}',
      invalidMode: '无效的调试模式：{mode}。可用模式：{modes}',
      logsTitle: '调试日志',
      currentStatus: '当前状态',
      currentSession: '当前会话',
      debugEnabled: '调试已启用',
      debugDisabled: '调试未启用',
    },
    
    status: {
      description: '查看所有配置状态',
      title: '系统配置状态',
      authSection: '认证配置',
      modelSection: '模型配置',
      sandboxSection: '沙盒配置',
      debugSection: '调试配置',
      yoloSection: 'YOLO配置',
      systemSection: '系统信息',
      configSection: '配置文件',
      tips: '操作提示',
      refreshTip: '刷新配置状态',
      envTip: '显示环境变量详情',
      configTip: '显示配置文件详情',
      
      // 认证状态
      apiKeyFound: 'API密钥已配置',
      apiKeyNotFound: 'API密钥未配置',
      authMode: '认证模式',
      apiKeyMode: 'API密钥模式',
      gcpProject: 'GCP项目',
      gcpLocation: 'GCP位置',
      googleApiKey: 'Google API密钥',
      recommendedAuth: '推荐认证方式',
      geminiApiAuth: 'Gemini API密钥认证',
      vertexAiAuth: 'Vertex AI认证',
      googleLoginAuth: 'Google登录认证',
      
      // 模型状态
      currentModel: '当前模型',
      modelFeatures: '模型特性',
      configSource: '配置来源',
      envVariable: '环境变量',
      defaultValue: '默认值',
      
      modelInfo: {
        gemini25Pro: '更强推理能力，适合复杂任务',
        gemini25Flash: '快速响应，适合日常使用',
        gemini15Pro: '经典版本，稳定可靠',
        gemini15Flash: '轻量版本，快速处理',
        unknown: '未知模型',
      },
      
      // 沙盒状态
      sandboxMode: '沙盒模式',
      sandboxDescription: '安全等级',
      containerAvailable: '容器可用',
      containerNotAvailable: '容器不可用',
      
      sandboxInfo: {
        disabled: '禁用（风险较高）',
        basic: '基础沙盒（中等安全）',
        docker: 'Docker容器（高安全）',
        podman: 'Podman容器（高安全）',
        unknown: '未知模式',
      },
      
      // 调试状态
      debugMode: '调试模式',
      debugDescription: '调试级别',
      debugWarning: '调试模式会影响性能',
      
      debugInfo: {
        disabled: '关闭（最佳性能）',
        basic: '基础调试（基本信息）',
        verbose: '详细调试（详细信息）',
        api: 'API调试（API信息）',
        unknown: '未知模式',
      },
      
      // YOLO状态
      yoloMode: 'YOLO模式',
      yoloDescription: '自动执行',
      yoloWarning: 'YOLO模式存在安全风险',
      
      yoloInfo: {
        disabled: '禁用（安全模式）',
        enabled: '启用（自动执行）',
        unknown: '未知状态',
      },
      
      // 系统信息
      platform: '操作系统',
      homeDir: '用户目录',
      nodeVersion: 'Node.js版本',
      workingDir: '工作目录',
      
      // 配置文件
      geminiDir: 'Gemini配置目录',
      geminiDirNotFound: 'Gemini配置目录不存在',
      envFile: '环境变量文件',
      envFileNotFound: '环境变量文件不存在',
      settingsFile: '设置文件',
      settingsFileNotFound: '设置文件不存在',
      lastModified: '最后修改时间',
      
      // 环境变量详情
      envDetailsTitle: '环境变量详情',
      geminiEnvVars: 'Gemini环境变量',
      gcpEnvVars: 'Google Cloud环境变量',
      notSet: '未设置',
      
      // 配置详情
      configDetailsTitle: '配置文件详情',
      envFileContent: '环境变量文件内容',
      settingsFileContent: '设置文件内容',
      errorReadingFile: '读取文件时出错',
    },
  },

  // 自定义命令翻译 - 移到顶级
  status: {
    description: '查看所有配置状态',
    title: '系统配置状态',
    authSection: '认证配置',
    modelSection: '模型配置',
    sandboxSection: '沙盒配置',
    debugSection: '调试配置',
    yoloSection: 'YOLO配置',
    systemSection: '系统信息',
    configSection: '配置文件',
    tips: '操作提示',
    refreshTip: '刷新配置状态',
    envTip: '显示环境变量详情',
    configTip: '显示配置文件详情',
    
    // 认证状态
    apiKeyFound: 'API密钥已配置',
    apiKeyNotFound: 'API密钥未配置',
    authMode: '认证模式',
    apiKeyMode: 'API密钥模式',
    gcpProject: 'GCP项目',
    gcpLocation: 'GCP位置',
    googleApiKey: 'Google API密钥',
    recommendedAuth: '推荐认证方式',
    
    // 模型状态
    currentModel: '当前模型',
    modelSource: '模型来源',
    envVariable: '环境变量',
    configFile: '配置文件',
    defaultValue: '默认值',
    
    // 沙盒状态
    sandboxEnabled: '沙盒已启用',
    sandboxDisabled: '沙盒已禁用',
    sandboxMode: '沙盒模式',
    dockerMode: 'Docker模式',
    podmanMode: 'Podman模式',
    
    // YOLO状态
    yoloEnabled: 'YOLO模式已启用',
    yoloDisabled: 'YOLO模式已禁用',
    
    // 调试状态
    debugEnabled: '调试模式已启用',
    debugDisabled: '调试模式已禁用',
    
    // 系统信息
    nodeVersion: 'Node.js版本',
    platform: '操作系统',
    architecture: '系统架构',
    cliVersion: 'CLI版本',
    workingDirectory: '工作目录',
    homeDirectory: '用户目录',
    
    // 配置文件信息
    envFile: '环境文件',
    settingsFile: '设置文件',
    exists: '存在',
    notExists: '不存在',
    lastModified: '最后修改时间',
    
    // 环境变量详情
    envDetailsTitle: '环境变量详情',
    geminiEnvVars: 'Gemini环境变量',
    gcpEnvVars: 'Google Cloud环境变量',
    notSet: '未设置',
    
    // 配置详情
    configDetailsTitle: '配置文件详情',
    envFileContent: '环境变量文件内容',
    settingsFileContent: '设置文件内容',
    errorReadingFile: '读取文件时出错',
  },

  model: {
    description: '切换 Gemini 模型',
    title: '选择 Gemini 模型',
    current: '当前模型: {model}',
    availableModels: '可用模型:',
    usage: '使用方法: /model <模型名>',
    setSuccess: '✅ 模型已切换到: {model}\\n\\n新模型现在已生效，您可以开始使用新模型进行对话。',
    setError: '设置模型时出错：{error}',
    invalidModel: '无效的模型名称: {model}\\n\\n支持的模型: {models}',
    instructions: '请选择模型或使用 /model <模型名称> 直接切换',
  },

  sandbox: {
    description: '配置沙盒安全设置',
    title: '沙盒安全配置',
    setSuccess: '沙盒模式已设置为：{mode} ({description})',
    setError: '设置沙盒模式时出错：{error}',
    invalidMode: '无效的沙盒模式：{mode}。可用模式：{modes}',
    dockerNotAvailable: 'Docker 未安装或不可用。请先安装 Docker 或选择其他沙盒模式。',
    podmanNotAvailable: 'Podman 未安装或不可用。请先安装 Podman 或选择其他沙盒模式。',
  },

  yolo: {
    description: '配置自动执行模式',
    title: '自动执行模式',
    setSuccess: 'YOLO模式已{status}。',
    setError: '设置YOLO模式时出错：{error}',
    invalidMode: '无效的YOLO模式：{mode}。可用选项：on/off',
    enabled: '启用',
    disabled: '禁用',
    warning: '⚠️  警告：AI现在将自动执行命令。请确保在安全环境中使用！',
    safeMode: '✅ 安全模式：所有命令都将需要手动确认。',
  },

  debug: {
    description: '配置调试模式',
    title: '调试模式配置',
    setSuccess: '调试模式已设置为：{mode} ({description})',
    setError: '设置调试模式时出错：{error}',
    invalidMode: '无效的调试模式：{mode}。可用模式：{modes}',
    logsTitle: '调试日志',
    currentStatus: '当前状态',
    currentSession: '当前会话',
    debugEnabled: '调试已启用',
    debugDisabled: '调试未启用',
  },

  setkey: {
    description: '设置 API 密钥',
    promptForKey: '请输入您的 Gemini API 密钥：',
    keySetSuccess: 'API 密钥已成功保存到 ~/.gemini/.env 文件。重启 Gemini CLI 后生效。',
    keySetError: '设置 API 密钥时出错：',
    invalidKey: '无效的 API 密钥格式',
    pleaseEnterKey: '请输入您的 API 密钥',
  },

  global: {
    description: '编辑全局提示词文件',
    error: '打开全局提示词文件失败：',
    opened: '全局提示词文件已打开。文件位置：~/.gemini/GEMINI.md',
  },

  project: {
    description: '编辑项目提示词文件',
    error: '打开项目提示词文件失败：',
    opened: '项目提示词文件已打开。文件位置：当前目录/GEMINI.md',
  },
  
  usage: {
    usingFiles: '使用',
  },
  
  messages: {
    noMcpServers: '未配置 MCP 服务器。请在浏览器中打开以下 URL 查看文档：',
    openingDocs: '未配置 MCP 服务器。在浏览器中打开文档：',
    openDocsInBrowser: '在浏览器中打开文档：',
    noActiveExtensions: '没有活动的扩展。',
    activeExtensions: '活动扩展：',
    availableGeminiTools: '可用的 Gemini CLI 工具：',
    noToolsAvailable: '没有可用的工具',
    couldNotRetrieveTools: '无法检索工具。',
    configuredMcpServers: '已配置的 MCP 服务器：',
    mcpServersStarting: 'MCP 服务器正在启动',
    firstStartupNote: '注意：首次启动可能需要更长时间。工具可用性将自动更新。',
    ready: '就绪',
    starting: '启动中...（首次启动可能需要更长时间）',
    disconnected: '已断开连接',
    toolsWillAppear: '工具准备就绪时将显示',
    toolsCached: '工具已缓存',
    noToolsAvailableForServer: '没有可用的工具',
    toSubmitBugReport: '要提交错误报告，请在浏览器中打开以下 URL：',
    couldNotOpenUrl: '无法在浏览器中打开 URL：',
    missingCommand: '缺少命令',
    chatUsage: '用法：/chat <list|save|resume> <tag>',
    missingTag: '缺少标签。',
    chatSaveUsage: '用法：/chat save <tag>',
    conversationSaved: '对话检查点已保存，标签：',
    noConversationToSave: '没有找到要保存的对话。',
    chatResumeUsage: '用法：/chat resume <tag>',
    noCheckpointFound: '未找到带有标签的已保存检查点：',
    listOfSavedConversations: '已保存对话列表：',
    unknownChatCommand: '未知的 /chat 命令：',
    availableChatCommands: '可用命令：list, save, resume',
    alreadyCompressing: '已在压缩中，请等待上一个请求完成',
    failedToCompress: '压缩聊天历史失败。',
    noChatClientAvailable: '没有可用的聊天客户端来查看对话状态。',
    couldNotDetermineGeminiDir: '无法确定 .gemini 目录路径。',
    noRestorableToolCalls: '未找到可恢复的工具调用。',
    availableToolCallsToRestore: '可恢复的工具调用：',
    fileNotFound: '文件未找到：',
    pressCtrlCTwice: '再次按 Ctrl+C 退出',
    pressCtrlCAgain: '再次按 Ctrl+C 退出',
    pressCtrlDAgain: '再次按 Ctrl+D 退出',
    mcpServerHealthy: 'MCP 服务器运行正常',
    mcpServerUnhealthy: 'MCP 服务器运行异常',
    mcpServerDisconnected: 'MCP 服务器已断开连接',
    mcpServerConnecting: 'MCP 服务器连接中',
    mcpServerReady: 'MCP 服务器就绪',
    mcpServerError: 'MCP 服务器错误',
    extensionLoaded: '扩展已加载',
    extensionError: '扩展错误',
    extensionDisabled: '扩展已禁用',
    modelSwitched: '模型已切换',
    sandboxEnabled: '沙盒已启用',
    sandboxDisabled: '沙盒已禁用',
    yoloEnabled: 'YOLO模式已启用',
    yoloDisabled: 'YOLO模式已禁用',
    debugEnabled: '调试模式已启用',
    debugDisabled: '调试模式已禁用',
  },
  
  // 官方命令翻译映射
  officialCommands: {
    'show version info': '显示版本信息',
    'change the auth method': '更改认证方式',
    'submit a bug report': '提交错误报告',
    'Manage conversation history.': '管理对话历史记录',
    'clear the screen and conversation history': '清除屏幕和对话历史记录',
    'Compresses the context by replacing it with a summary.': '通过摘要压缩上下文内容',
    'Copy the last result or code snippet to clipboard': '将最后的结果或代码片段复制到剪贴板',
    'open full Gemini CLI documentation in your browser': '在浏览器中打开完整的 Gemini CLI 文档',
    'Manage workspace directories': '管理工作区目录',
    'set external editor preference': '设置外部编辑器偏好',
    'Manage extensions': '管理扩展',
    'for help on gemini-cli': '获取 gemini-cli 帮助',
    'manage IDE integration': '管理 IDE 集成',
    'Analyzes the project and creates a tailored GEMINI.md file.': '分析项目并创建定制的 GEMINI.md 文件',
    'list configured MCP servers and tools, or authenticate with OAuth-enabled servers': '列出配置的 MCP 服务器和工具，或使用 OAuth 服务器进行身份验证',
    'Commands for interacting with memory.': '与记忆功能交互的命令',
    'display the privacy notice': '显示隐私声明',
    'exit the cli': '退出 CLI',
    'check session stats. Usage: /stats [model|tools]': '检查会话统计信息。用法：/stats [model|tools]',
    'change the theme': '更改主题',
    'list available Gemini CLI tools. Usage: /tools [desc]': '列出可用的 Gemini CLI 工具。用法：/tools [desc]',
    'View and edit Gemini CLI settings': '查看和编辑 Gemini CLI 设置',
    'toggle vim mode on/off': '切换 vim 模式开/关',
    'Set up GitHub Actions': '设置 GitHub Actions',
    'Configure terminal keybindings for multiline input (VS Code, Cursor, Windsurf)': '配置终端多行输入键绑定（VS Code、Cursor、Windsurf）',
    'Find relevant documentation and output GitHub URLs.': '查找相关文档并输出 GitHub URL',
    'Review a specific pull request': '审查特定的拉取请求',
    'Go back to main and clean up the branch.': '返回主分支并清理分支',
    'shell command': '执行 Shell 命令',
    'Model Context Protocol command (from external servers)': '模型上下文协议命令（来自外部服务器）',
    
    // 子命令翻译
    'List saved conversation checkpoints': '列出已保存的对话检查点',
    'Save the current conversation as a checkpoint. Usage: /chat save <tag>': '将当前对话保存为检查点。用法：/chat save <tag>',
    'Resume a conversation from a checkpoint. Usage: /chat resume <tag>': '从检查点恢复对话。用法：/chat resume <tag>',
    'Delete a conversation checkpoint. Usage: /chat delete <tag>': '删除对话检查点。用法：/chat delete <tag>',
    'Share the current conversation to a markdown or json file. Usage: /chat share <file>': '将当前对话分享为 markdown 或 json 文件。用法：/chat share <file>',
    'Add directories to the workspace. Use comma to separate multiple paths': '向工作区添加目录。使用逗号分隔多个路径',
    'Show all directories in the workspace': '显示工作区中的所有目录',
    'List active extensions': '列出活跃的扩展',
    'Update extensions. Usage: update <extension-names>|--all': '更新扩展。用法：update <extension-names>|--all',
    'enable IDE integration': '启用 IDE 集成',
    'check status of IDE integration': '检查 IDE 集成状态',
    'install required IDE companion for Cursor': '为 Cursor 安装所需的 IDE 伴侣',
    'List configured MCP servers and tools': '列出配置的 MCP 服务器和工具',
    'Authenticate with an OAuth-enabled MCP server': '使用支持 OAuth 的 MCP 服务器进行身份验证',
    'Restarts MCP servers.': '重启 MCP 服务器',
    'Show the current memory contents.': '显示当前记忆内容',
    'Add content to the memory.': '向记忆中添加内容',
    'Refresh the memory from the source.': '从源刷新记忆',
    'Show model-specific usage statistics.': '显示特定模型的使用统计信息',
    'Show tool-specific usage statistics.': '显示特定工具的使用统计信息',
    
    // 更多官方命令翻译 - 只保留新增的，避免重复
    'Toggles corgi mode.': '切换 corgi 模式',
    'disable IDE integration': '禁用 IDE 集成',
    
    // 子命令翻译 - 只添加新的，避免重复
    // /mcp 子命令 (新增的)
    'list configured MCP servers and tools': '列出配置的 MCP 服务器和工具',
    'authenticate with OAuth-enabled MCP servers': '使用支持 OAuth 的 MCP 服务器进行身份验证',
    
  },

  // 终端设置命令翻译
  terminalSetup: {
    alreadyConfigured: '您的终端已经配置为多行输入的最佳体验（Shift+Enter 和 Ctrl+Enter）。',
    couldNotDetect: '无法检测终端类型。支持的终端：VS Code、Cursor 和 Windsurf。',
    notSupported: '终端 "{terminal}" 暂不支持。',
    failedToConfigure: '配置终端失败：{error}',
    restartRequired: '\n\n请重启您的终端以使更改生效。',
    existingKeybindings: '检测到现有键绑定。为避免冲突，不会修改。',
    shiftEnterExists: '- Shift+Enter 绑定已存在',
    ctrlEnterExists: '- Ctrl+Enter 绑定已存在',
    checkManually: '如需要，请手动检查和修改：',
  },

  // 设置对话框翻译
  settings: {
    title: '设置',
    vimMode: 'Vim 模式',
    disableAutoUpdate: '禁用自动更新',
    enablePromptCompletion: '启用提示完成',
    debugKeystrokeLogging: '调试按键记录',
    outputFormat: '输出格式',
    hideWindowTitle: '隐藏窗口标题',
    hideTips: '隐藏提示',
    hideBanner: '隐藏横幅',
    hideContextSummary: '隐藏上下文摘要',
    hideCWD: '隐藏当前工作目录',
    hideSandboxStatus: '隐藏沙盒状态',
    hideModelInfo: '隐藏模型信息',
    hideFooter: '隐藏页脚',
    showMemoryUsage: '显示内存使用量',
    showLineNumbers: '显示行号',
    showCitations: '显示引用',
    disableLoadingPhrases: '禁用加载短语',
    screenReaderMode: '屏幕阅读器模式',
    ideMode: 'IDE 模式',
    maxSessionTurns: '最大会话轮次',
    skipNextSpeakerCheck: '跳过下一个说话者检查',
    memoryDiscoveryMaxDirs: '记忆发现最大目录数',
    loadMemoryFromIncludeDirectories: '从包含目录加载记忆',
    respectGitignore: '遵循 .gitignore',
    respectGeminiignore: '遵循 .geminiignore',
    enableRecursiveFileSearch: '启用递归文件搜索',
    disableFuzzySearch: '禁用模糊搜索',
    useNodePtyForShellExecution: '使用 node-pty 执行 Shell',
    showColor: '显示颜色',
    autoAccept: '自动接受',
    useRipgrep: '使用 Ripgrep',
    enableToolOutputTruncation: '启用工具输出截断',
    toolOutputTruncationThreshold: '工具输出截断阈值',
    toolOutputTruncationLines: '工具输出截断行数',
    folderTrust: '文件夹信任',
    applyTo: '应用到',
    userSettings: '用户设置',
    workspaceSettings: '工作区设置',
    systemSettings: '系统设置',
    useEnterToSelect: '（按 Enter 选择，Tab 切换焦点）',
    text: '文本',
  },
  
  // UI 元素翻译
  ui: {
    'Basics:': '基础操作：',
    'Commands:': '命令：',
    'Keyboard Shortcuts:': '键盘快捷键：',
    'Add context': '添加上下文',
    'Shell mode': 'Shell 模式',
    'addContextDescription': '使用 @ 指定文件作为上下文（例如 @src/myFile.ts）来针对特定文件或文件夹。',
    'shellModeDescription': '通过 ! 执行 shell 命令（例如 !npm run start）或使用自然语言（例如启动服务器）。',
    'Jump through words in the input': '在输入中跳转单词',
    'Quit application': '退出应用程序',
    'New line': '新行',
    'Clear the screen': '清除屏幕',
    'Open input in external editor': '在外部编辑器中打开输入',
    'Toggle YOLO mode': '切换 YOLO 模式',
    'Send message': '发送消息',
    'Cancel operation / Clear input (double press)': '取消操作 / 清除输入（双击）',
    'Toggle auto-accepting edits': '切换自动接受编辑',
    'Cycle through your prompt history': '循环浏览您的提示历史记录',
    'For a full list of shortcuts, see docs/keyboard-shortcuts.md': '有关快捷键的完整列表，请参阅 docs/keyboard-shortcuts.md',
  },
}; 