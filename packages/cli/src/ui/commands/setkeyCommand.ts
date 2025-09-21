/**
 * @license
 * Copyright 2025 Google LLC
 * SPDX-License-Identifier: Apache-2.0
 */

import type { SlashCommand, CommandContext } from './types.js';
import { CommandKind } from './types.js';
import { t } from '../../i18n/index.js';
import * as fs from 'fs';
import * as path from 'path';
import * as os from 'os';

export const setkeyCommand: SlashCommand = {
  name: 'setkey',
  description: t('setkey.description'),
  kind: CommandKind.BUILT_IN,
  action: async (context: CommandContext, args: string) => {
    const apiKey = args?.trim();
    
    if (!apiKey) {
      return {
        type: 'message' as const,
        messageType: 'info' as const,
        content: '请提供API密钥\\n\\n使用方法: /setkey <your-api-key>'
      };
    }
    
    if (apiKey.length < 20) {
      return {
        type: 'message' as const,
        messageType: 'error' as const,
        content: 'API密钥长度似乎不正确，请检查后重试'
      };
    }
    
    try {
      // 设置环境变量
      process.env['GEMINI_API_KEY'] = apiKey;
      
      // 同时保存到 .env 文件
      await setApiKeyInEnvFile(apiKey);
      
      const keyPreview = apiKey.substring(0, 10) + '***';
      return {
        type: 'message' as const,
        messageType: 'info' as const,
        content: `✅ API密钥已设置: ${keyPreview}\\n\\n密钥已保存到环境变量和配置文件中`
      };
    } catch (error) {
      return {
        type: 'message' as const,
        messageType: 'error' as const,
        content: `设置API密钥时出错: ${error}`
      };
    }
  },
};

async function setApiKeyInEnvFile(apiKey: string): Promise<void> {
  const geminiDir = path.join(os.homedir(), '.gemini');
  const envFile = path.join(geminiDir, '.env');
  
  // 确保目录存在
  if (!fs.existsSync(geminiDir)) {
    fs.mkdirSync(geminiDir, { recursive: true });
  }
  
  let envContent = '';
  
  // 读取现有内容
  if (fs.existsSync(envFile)) {
    envContent = fs.readFileSync(envFile, 'utf8');
  }
  
  // 更新或添加API密钥
  const apiKeyPattern = /^GEMINI_API_KEY=.*$/m;
  const newApiKeyLine = `GEMINI_API_KEY=${apiKey}`;
  
  if (apiKeyPattern.test(envContent)) {
    envContent = envContent.replace(apiKeyPattern, newApiKeyLine);
  } else {
    envContent += envContent.endsWith('\\n') ? '' : '\\n';
    envContent += newApiKeyLine + '\\n';
  }
  
  // 写入文件
  fs.writeFileSync(envFile, envContent);
}