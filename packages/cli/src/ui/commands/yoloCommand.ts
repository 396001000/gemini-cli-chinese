/**
 * @license
 * Copyright 2025 Google LLC
 * SPDX-License-Identifier: Apache-2.0
 */

import type { SlashCommand, CommandContext } from './types.js';
import { CommandKind } from './types.js';
import { t } from '../../i18n/index.js';

export const yoloCommand: SlashCommand = {
  name: 'yolo',
  description: t('yolo.description'),
  kind: CommandKind.BUILT_IN,
  action: async (context: CommandContext, args: string) => {
    const command = args?.trim().toLowerCase();
    
    // 中文参数映射到英文
    const commandMap: Record<string, string> = {
      '开启': 'on',
      '关闭': 'off', 
      '启用': 'enable',
      '禁用': 'disable'
    };
    
    // 将中文命令转换为英文，或保持原英文命令
    const normalizedCommand = commandMap[command] || command;
    const yoloEnv = process.env['GEMINI_YOLO'];
    
    if (!command) {
      const status = yoloEnv === 'true' ? '启用' : '禁用';
      return {
        type: 'message' as const,
        messageType: 'info' as const,
        content: `YOLO模式当前状态: ${status}\\n\\n使用方法:\\n- /yolo on - 启用YOLO模式\\n- /yolo off - 禁用YOLO模式`
      };
    }
    
    let newValue: string;
    let statusMessage: string;
    
    if (normalizedCommand === 'on' || normalizedCommand === 'enable' || normalizedCommand === 'true') {
      newValue = 'true';
      statusMessage = '✅ YOLO模式已启用 - 命令将快速执行，无需确认';
    } else if (normalizedCommand === 'off' || normalizedCommand === 'disable' || normalizedCommand === 'false') {
      newValue = 'false';
      statusMessage = '✅ YOLO模式已禁用 - 命令执行前将请求确认';
    } else {
      return {
        type: 'message' as const,
        messageType: 'error' as const,
        content: `无效参数: ${command}\\n\\n支持的参数: 开启(on), 关闭(off), 启用(enable), 禁用(disable)`
      };
    }
    
    process.env['GEMINI_YOLO'] = newValue;
    
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