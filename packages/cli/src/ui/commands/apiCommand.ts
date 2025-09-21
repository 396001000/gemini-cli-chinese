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

export const apiCommand: SlashCommand = {
  name: 'api',
  altNames: ['endpoint', 'setapi'],
  description: '修改 API 端点（CODE_ASSIST_ENDPOINT）',
  kind: CommandKind.BUILT_IN,
  action: async (_context: CommandContext, args: string) => {
    const raw = (args || '').trim();

    if (!raw) {
      return {
        type: 'message' as const,
        messageType: 'info' as const,
        content:
          '用法:\n  /api https://your-endpoint\n  /api clear  （清除端点）',
      };
    }

    if (raw.toLowerCase() === 'clear') {
      try {
        delete process.env['CODE_ASSIST_ENDPOINT'];
        await removeEndpointFromEnvFile();
        return {
          type: 'message' as const,
          messageType: 'info' as const,
          content: '✅ 已清除 API 端点设置',
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
      process.env['CODE_ASSIST_ENDPOINT'] = value;
      await setEndpointInEnvFile(value);
      return {
        type: 'message' as const,
        messageType: 'info' as const,
        content: `✅ API 端点已更新为：${value}`,
      };
    } catch (e) {
      return {
        type: 'message' as const,
        messageType: 'error' as const,
        content: `更新失败: ${e}`,
      };
    }
  },
};

async function ensureGeminiEnvPath(): Promise<string> {
  const geminiDir = path.join(os.homedir(), '.gemini');
  const envFile = path.join(geminiDir, '.env');
  if (!fs.existsSync(geminiDir)) {
    fs.mkdirSync(geminiDir, { recursive: true });
  }
  if (!fs.existsSync(envFile)) {
    fs.writeFileSync(envFile, '');
  }
  return envFile;
}

async function setEndpointInEnvFile(endpoint: string): Promise<void> {
  const envFile = await ensureGeminiEnvPath();
  let content = '';
  try {
    content = fs.readFileSync(envFile, 'utf8');
  } catch {
    content = '';
  }

  const line = `CODE_ASSIST_ENDPOINT=${endpoint}`;
  const pattern = /^CODE_ASSIST_ENDPOINT=.*$/m;
  if (pattern.test(content)) {
    content = content.replace(pattern, line);
  } else {
    content += content.endsWith('\n') ? '' : '\n';
    content += line + '\n';
  }
  fs.writeFileSync(envFile, content);
}

async function removeEndpointFromEnvFile(): Promise<void> {
  const envFile = await ensureGeminiEnvPath();
  let content = '';
  try {
    content = fs.readFileSync(envFile, 'utf8');
  } catch {
    return;
  }
  const lines = content.split(/\r?\n/);
  const filtered = lines.filter((l) => !/^CODE_ASSIST_ENDPOINT=/.test(l));
  fs.writeFileSync(envFile, filtered.join('\n') + (content.endsWith('\n') ? '\n' : ''));
}



