/**
 * @license
 * Copyright 2025 Google LLC
 * SPDX-License-Identifier: Apache-2.0
 */

import type { SlashCommand, SlashCommandActionReturn, CommandContext } from './types.js';
import { CommandKind } from './types.js';
import { t } from '../../i18n/index.js';
// import { loadEnvironment } from '../../config/settings.js'; // 新版本不兼容

export const statusCommand: SlashCommand = {
  name: 'status',
  description: t('status.description'),
  kind: CommandKind.BUILT_IN,
  action: async (context: CommandContext, args: string): Promise<SlashCommandActionReturn | void> => {
    const command = args?.trim();
    
    // 中文参数映射到英文
    const commandMap: Record<string, string> = {
      '刷新': 'refresh',
      '环境变量': 'env',
      '配置': 'config'
    };
    
    // 将中文命令转换为英文，或保持原英文命令
    const normalizedCommand = commandMap[command] || command;
    
    if (normalizedCommand === 'refresh') {
      // loadEnvironment 在新版本中不兼容，暂时跳过
      await displayAllStatus(context);
      return;
    }
    
    if (normalizedCommand === 'env') {
      await displayEnvironmentDetails(context);
      return;
    }
    
    if (normalizedCommand === 'config') {
      await displayConfigDetails(context);
      return;
    }
    
    await displayAllStatus(context);
  },
  completion: async (context: CommandContext, partialArg: string): Promise<string[]> => {
    // 中英文选项映射，支持中英文输入
    const optionsMap: Record<string, string> = {
      'refresh': '刷新',
      'env': '环境变量',
      'config': '配置'
    };
    
    const englishOptions = Object.keys(optionsMap);
    const chineseOptions = Object.values(optionsMap);
    
    // 如果输入是中文，返回匹配的中文选项
    const matchingChinese = chineseOptions.filter(option => 
      option.includes(partialArg)
    );
    
    // 如果输入是英文，返回匹配的中文选项（通过英文键匹配）
    const matchingEnglish = englishOptions
      .filter(key => key.toLowerCase().includes(partialArg.toLowerCase()))
      .map(key => optionsMap[key]);
    
    // 合并去重
    const allMatches = [...new Set([...matchingChinese, ...matchingEnglish])];
    
    // 如果没有匹配项，返回所有中文选项
    return allMatches.length > 0 ? allMatches : chineseOptions;
  },
};

async function displayAllStatus(context: CommandContext): Promise<void> {
  // loadEnvironment 在新版本中不兼容，暂时跳过
  
  let statusReport = '';
  
  statusReport += `\\n🔍 超级智体专用版系统状态\\n`;
  statusReport += `${'='.repeat(50)}\\n\\n`;
  
  // 认证状态
  statusReport += getAuthStatus(context.services.settings);
  statusReport += '\\n';
  
  // 模型状态
  statusReport += getModelStatus();
  statusReport += '\\n';
  
  // 沙盒状态
  statusReport += getSandboxStatus();
  statusReport += '\\n';
  
  // 调试状态
  statusReport += getDebugStatus();
  statusReport += '\\n';
  
  // YOLO状态
  statusReport += getYoloStatus();
  
  context.ui.addItem({
    type: 'info',
    text: statusReport,
  }, Date.now());
}

async function displayEnvironmentDetails(context: CommandContext): Promise<void> {
  let envReport = '';
  
  envReport += `\\n🌍 环境变量详情\\n`;
  envReport += `${'='.repeat(30)}\\n\\n`;
  
  const envVars = [
    'GEMINI_API_KEY',
    'GOOGLE_CLOUD_PROJECT', 
    'GOOGLE_CLOUD_LOCATION',
    'GOOGLE_API_KEY',
    'GEMINI_MODEL',
    'GEMINI_SANDBOX',
    'GEMINI_DEBUG',
    'GEMINI_YOLO'
  ];
  
  envVars.forEach(varName => {
    const value = process.env[varName];
    if (value) {
      if (varName.includes('KEY')) {
        envReport += `📍 ${varName}: ${value.substring(0, 10)}***\\n`;
      } else {
        envReport += `📍 ${varName}: ${value}\\n`;
      }
    } else {
      envReport += `📍 ${varName}: 未设置\\n`;
    }
  });
  
  context.ui.addItem({
    type: 'info',
    text: envReport,
  }, Date.now());
}

async function displayConfigDetails(context: CommandContext): Promise<void> {
  let configReport = '';
  
  configReport += `\\n⚙️ 配置详情\\n`;
  configReport += `${'='.repeat(30)}\\n\\n`;
  
  if (context.services.config) {
    configReport += `📁 项目根目录: ${context.services.config.getProjectRoot()}\\n`;
    configReport += `📄 配置文件: 已加载\\n`;
  } else {
    configReport += `❌ 配置文件: 未加载\\n`;
  }
  
  context.ui.addItem({
    type: 'info',
    text: configReport,
  }, Date.now());
}

function getAuthStatus(settings: any): string {
  let status = '🔐 认证状态\\n';
  
  if (settings['GEMINI_API_KEY']) {
    const keyPreview = settings['GEMINI_API_KEY'].substring(0, 10) + '***';
    status += `✅ API密钥: ${keyPreview}\\n`;
  } else {
    status += `❌ 未设置API密钥\\n`;
  }
  
  if (settings['GOOGLE_CLOUD_PROJECT']) {
    status += `✅ GCP项目: ${settings['GOOGLE_CLOUD_PROJECT']}\\n`;
  }
  
  if (settings['GOOGLE_CLOUD_LOCATION']) {
    status += `✅ GCP位置: ${settings['GOOGLE_CLOUD_LOCATION']}\\n`;
  }
  
  if (settings['GEMINI_API_KEY']) {
    status += `✅ 认证方式: API Key\\n`;
  } else if (settings['GOOGLE_CLOUD_PROJECT'] && settings['GOOGLE_CLOUD_LOCATION']) {
    status += `✅ 认证方式: Vertex AI\\n`;
  } else {
    status += `❌ 未配置认证\\n`;
  }
  
  return status;
}

function getModelStatus(): string {
  const model = process.env['GEMINI_MODEL'] || 'gemini-2.5-flash';
  let status = '';
  
  status += `🎯 当前模型: ${model}\\n`;
  
  const modelInfo = getModelInfo(model);
  status += `📊 模型特性: ${modelInfo}\\n`;
  
  if (process.env['GEMINI_MODEL']) {
    status += `📍 配置来源: 环境变量\\n`;
  } else {
    status += `📍 配置来源: 默认值\\n`;
  }
  
  return status;
}

function getSandboxStatus(): string {
  const sandboxMode = process.env['GEMINI_SANDBOX'] || 'false';
  let status = '';
  
  status += `🏗️ 沙盒模式: ${sandboxMode === 'true' ? '启用' : '禁用'}\\n`;
  
  if (sandboxMode === 'true') {
    status += `📦 沙盒环境: 已激活\\n`;
  } else {
    status += `📦 沙盒环境: 未激活\\n`;
  }
  
  return status;
}

function getDebugStatus(): string {
  const debugMode = process.env['GEMINI_DEBUG'] || 'false';
  let status = '';
  
  status += `🐛 调试模式: ${debugMode === 'true' ? '启用' : '禁用'}\\n`;
  
  if (debugMode === 'true') {
    status += `🔍 调试信息: 显示中\\n`;
  } else {
    status += `🔍 调试信息: 隐藏\\n`;
  }
  
  return status;
}

function getYoloStatus(): string {
  const yoloMode = process.env['GEMINI_YOLO'] || 'false';
  let status = '';
  
  status += `🚀 YOLO模式: ${yoloMode === 'true' ? '启用' : '禁用'}\\n`;
  
  if (yoloMode === 'true') {
    status += `⚡ 快速执行: 已激活\\n`;
  } else {
    status += `⚡ 快速执行: 需确认\\n`;
  }
  
  return status;
}

function getModelInfo(model: string): string {
  const modelMap: Record<string, string> = {
    'gemini-2.5-pro': '最强推理能力，适合复杂任务',
    'gemini-2.5-flash': '平衡性能，快速响应',
    'gemini-1.5-pro': '稳定版本，高质量输出',
    'gemini-1.5-flash': '快速版本，基础任务',
  };
  
  return modelMap[model] || '未知模型特性';
}