/**
 * @license
 * Copyright 2025 Google LLC
 * SPDX-License-Identifier: Apache-2.0
 */

import type { SlashCommand, CommandContext } from './types.js';
import { CommandKind } from './types.js';
import * as fs from 'node:fs';
import * as path from 'node:path';
import * as os from 'node:os';

export const baseurlCommand: SlashCommand = {
  name: 'baseurl',
  altNames: ['apibase', 'setbase'],
  description: '设置 Gemini API 基础 URL（用于 API Key 模式）',
  kind: CommandKind.BUILT_IN,
  action: async (_context: CommandContext, args: string) => {
    const raw = (args || '').trim();

    if (!raw) {
      return {
        type: 'message' as const,
        messageType: 'info' as const,
        content:
          '用法:\n  /baseurl https://your-api-endpoint.com\n  /baseurl clear  （恢复默认）\n\n⚠️ 注意：只需设置基础域名，不要包含 /v1beta 路径\n例如：/baseurl https://api.aigsv.com',
      };
    }

    if (raw.toLowerCase() === 'clear') {
      try {
        delete process.env['GEMINI_API_BASE_URL'];
        await removeBaseUrlFromEnvFiles();
        return {
          type: 'message' as const,
          messageType: 'info' as const,
          content: '✅ 已恢复默认 API 基础 URL',
        };
      } catch (e) {
        return {
          type: 'message' as const,
          messageType: 'error' as const,
          content: `清除失败: ${e}`,
        };
      }
    }

    // Validate URL
    const value = raw;
    if (!/^(https?:)\/\//i.test(value)) {
      return {
        type: 'message' as const,
        messageType: 'error' as const,
        content: '无效链接，请输入以 http(s):// 开头的地址',
      };
    }

    try {
      // 立即设置环境变量
      process.env['GEMINI_API_BASE_URL'] = value;
      
      // 同时写入两个 .env 文件
      await setBaseUrlInEnvFiles(value);
      
      return {
        type: 'message' as const,
        messageType: 'info' as const,
        content: `✅ API 基础 URL 已设置为：${value}\n\n已保存到环境变量和配置文件中`,
      };
    } catch (e) {
      return {
        type: 'message' as const,
        messageType: 'error' as const,
        content: `设置失败: ${e}`,
      };
    }
  },
};

async function ensureEnvFile(filePath: string): Promise<void> {
  const dir = path.dirname(filePath);
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true });
  }
  if (!fs.existsSync(filePath)) {
    fs.writeFileSync(filePath, '');
  }
}

async function setBaseUrlInEnvFiles(baseUrl: string): Promise<void> {
  // 1. 写入用户目录的 .gemini/.env
  const userEnvFile = path.join(os.homedir(), '.gemini', '.env');
  await ensureEnvFile(userEnvFile);
  await updateEnvFile(userEnvFile, 'GEMINI_API_BASE_URL', baseUrl);
  
  // 2. 写入项目目录的 .env（如果在项目中）
  const projectEnvFile = path.join(process.cwd(), '.env');
  await ensureEnvFile(projectEnvFile);
  await updateEnvFile(projectEnvFile, 'GEMINI_API_BASE_URL', baseUrl);
}

async function removeBaseUrlFromEnvFiles(): Promise<void> {
  // 1. 从用户目录的 .gemini/.env 中移除
  const userEnvFile = path.join(os.homedir(), '.gemini', '.env');
  if (fs.existsSync(userEnvFile)) {
    await removeFromEnvFile(userEnvFile, 'GEMINI_API_BASE_URL');
  }
  
  // 2. 从项目目录的 .env 中移除
  const projectEnvFile = path.join(process.cwd(), '.env');
  if (fs.existsSync(projectEnvFile)) {
    await removeFromEnvFile(projectEnvFile, 'GEMINI_API_BASE_URL');
  }
}

async function updateEnvFile(filePath: string, key: string, value: string): Promise<void> {
  let content = '';
  try {
    content = fs.readFileSync(filePath, 'utf8');
  } catch {
    content = '';
  }

  const line = `${key}=${value}`;
  const pattern = new RegExp(`^${key}=.*$`, 'm');
  
  if (pattern.test(content)) {
    content = content.replace(pattern, line);
  } else {
    content += content.endsWith('\n') ? '' : '\n';
    content += line + '\n';
  }
  
  fs.writeFileSync(filePath, content);
}

async function removeFromEnvFile(filePath: string, key: string): Promise<void> {
  let content = '';
  try {
    content = fs.readFileSync(filePath, 'utf8');
  } catch {
    return;
  }
  
  const lines = content.split(/\r?\n/);
  const pattern = new RegExp(`^${key}=`);
  const filtered = lines.filter((line) => !pattern.test(line));
  
  fs.writeFileSync(filePath, filtered.join('\n') + (content.endsWith('\n') ? '\n' : ''));
}
