/**
 * @license
 * Copyright 2025 Google LLC
 * SPDX-License-Identifier: Apache-2.0
 */

import type { SlashCommand, CommandContext } from './types.js';
import { CommandKind } from './types.js';
import { t } from '../../i18n/index.js';

export const sandboxCommand: SlashCommand = {
  name: 'sandbox',
  description: t('sandbox.description'),
  kind: CommandKind.BUILT_IN,
  action: async (context: CommandContext, args: string) => {
    const command = args?.trim().toLowerCase();
    
    // 中文参数映射到英文
    const commandMap: Record<string, string> = {
      '状态': 'status',
      '开启': 'on',
      '关闭': 'off', 
      '启用': 'enable',
      '禁用': 'disable'
    };
    
    // 将中文命令转换为英文，或保持原英文命令
    const normalizedCommand = commandMap[command] || command;
    
    if (!normalizedCommand || normalizedCommand === 'status') {
      const sandboxMode = process.env['GEMINI_SANDBOX'] || 'false';
      const status = sandboxMode === 'true' ? '启用' : '禁用';
      
      return {
        type: 'message' as const,
        messageType: 'info' as const,
        content: `🏗️ 沙盒模式: ${status}\\n\\n使用方法:\\n- /sandbox on - 启用沙盒\\n- /sandbox off - 禁用沙盒`
      };
    }
    
    if (normalizedCommand === 'on' || normalizedCommand === 'enable') {
      process.env['GEMINI_SANDBOX'] = 'true';
      return {
        type: 'message' as const,
        messageType: 'info' as const,
        content: '✅ 沙盒模式已启用'
      };
    }
    
    if (normalizedCommand === 'off' || normalizedCommand === 'disable') {
      process.env['GEMINI_SANDBOX'] = 'false';
      return {
        type: 'message' as const,
        messageType: 'info' as const,
        content: '✅ 沙盒模式已禁用'
      };
    }
    
    return {
      type: 'message' as const,
      messageType: 'error' as const,
      content: `无效参数: ${command}\\n\\n支持的参数: 状态(status), 开启(on), 关闭(off), 启用(enable), 禁用(disable)`
    };
  },
  completion: async (context: CommandContext, partialArg: string): Promise<string[]> => {
    // 中英文选项映射，支持中英文输入
    const optionsMap: Record<string, string> = {
      'status': '状态',
      'on': '开启', 
      'off': '关闭',
      'enable': '启用',
      'disable': '禁用'
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
