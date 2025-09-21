/**
 * @license
 * Copyright 2025 Google LLC
 * SPDX-License-Identifier: Apache-2.0
 */

import type { SlashCommand, CommandContext } from './types.js';
import { CommandKind } from './types.js';
import { t } from '../../i18n/index.js';

export const debugCommand: SlashCommand = {
  name: 'debug',
  description: t('debug.description'),
  kind: CommandKind.BUILT_IN,
  action: async (context: CommandContext, args: string) => {
    const command = args?.trim();
    
    // 中文参数映射到英文
    const commandMap: Record<string, string> = {
      '开启': 'on',
      '关闭': 'off',
      'API调试': 'api',
      '详细模式': 'verbose',
      '完整模式': 'full'
    };
    
    // 将中文命令转换为英文，或保持原英文命令
    const normalizedCommand = commandMap[command] || command?.toLowerCase();
    const debug = process.env['DEBUG'];
    const debugMode = process.env['DEBUG_MODE'];
    
    if (!command) {
      let status = '调试模式状态:\\n';
      status += `- DEBUG: ${debug || '未设置'}\\n`;
      status += `- DEBUG_MODE: ${debugMode || '未设置'}\\n`;
      status += '\\n使用方法:\\n';
      status += '- /debug on - 启用调试模式\\n';
      status += '- /debug off - 禁用调试模式\\n';
      status += '- /debug api - 启用API调试\\n';
      
      return {
        type: 'message' as const,
        messageType: 'info' as const,
        content: status
      };
    }
    
    let statusMessage: string;
    
    if (normalizedCommand === 'off' || normalizedCommand === 'disable' || normalizedCommand === 'false') {
      delete process.env['DEBUG'];
      delete process.env['DEBUG_MODE'];
      statusMessage = '✅ 调试模式已禁用';
    } else if (normalizedCommand === 'on' || normalizedCommand === 'enable' || normalizedCommand === 'true') {
      process.env['DEBUG'] = 'true';
      delete process.env['DEBUG_MODE'];
      statusMessage = '✅ 调试模式已启用';
    } else if (normalizedCommand === 'verbose' || normalizedCommand === 'full') {
      process.env['DEBUG_MODE'] = 'true';
      delete process.env['DEBUG'];
      statusMessage = '✅ 详细调试模式已启用';
    } else if (normalizedCommand === 'api') {
      process.env['DEBUG'] = 'api';
      delete process.env['DEBUG_MODE'];
      statusMessage = '✅ API调试模式已启用';
    } else {
      return {
        type: 'message' as const,
        messageType: 'error' as const,
        content: `无效参数: ${command}\\n\\n支持的参数: on, off, api, verbose, full`
      };
    }
    
    return {
      type: 'message' as const,
      messageType: 'info' as const,
      content: statusMessage
    };
  },
  completion: async (context: CommandContext, partialArg: string): Promise<string[]> => {
    // 中英文选项映射，支持中英文输入
    const optionsMap: Record<string, string> = {
      'on': '开启',
      'off': '关闭',
      'api': 'API调试',
      'verbose': '详细模式',
      'full': '完整模式'
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