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
import { spawn } from 'child_process';

export const globalPromptCommand: SlashCommand = {
  name: 'globalprompt',
  description: t('global.description'),
  kind: CommandKind.BUILT_IN,
  action: async (context: CommandContext, args: string) => {
    try {
      await openGlobalPromptFile(context);
    } catch (error) {
      return {
        type: 'message' as const,
        messageType: 'error' as const,
        content: `打开全局提示词文件时出错: ${error}`
      };
    }
    return;
  },
};

async function openGlobalPromptFile(context: CommandContext): Promise<void> {
  const geminiDir = path.join(os.homedir(), '.gemini');
  const promptFile = path.join(geminiDir, 'GEMINI.md');
  
  // 确保目录存在
  if (!fs.existsSync(geminiDir)) {
    fs.mkdirSync(geminiDir, { recursive: true });
  }
  
  // 如果文件不存在，创建默认内容
  if (!fs.existsSync(promptFile)) {
    const defaultContent = `# 全局提示词

这是您的全局提示词文件。在这里添加的内容将应用于所有对话。

## 示例用法

- 设置您的偏好
- 定义常用的指令
- 配置输出格式

## 当前设置

请用中文回复。
`;
    fs.writeFileSync(promptFile, defaultContent);
  }
  
  // 尝试打开文件
  const editor = process.env['EDITOR'] || process.env['VISUAL'] || 'notepad';
  
  const child = spawn(editor, [promptFile], {
    stdio: 'inherit',
    detached: true
  });
  
  child.on('error', (error) => {
    context.ui.addItem({
      type: 'error',
      text: `无法打开编辑器: ${error.message}`,
    }, Date.now());
  });
  
  context.ui.addItem({
    type: 'info',
    text: `正在打开全局提示词文件: ${promptFile}`,
  }, Date.now());
}