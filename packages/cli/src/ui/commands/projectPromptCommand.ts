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
import { spawn } from 'child_process';

export const projectPromptCommand: SlashCommand = {
  name: 'projectprompt',
  description: t('project.description'),
  kind: CommandKind.BUILT_IN,
  action: async (context: CommandContext, args: string) => {
    try {
      await openProjectPromptFile(context);
    } catch (error) {
      return {
        type: 'message' as const,
        messageType: 'error' as const,
        content: `打开项目提示词文件时出错: ${error}`
      };
    }
    return;
  },
};

async function openProjectPromptFile(context: CommandContext): Promise<void> {
  const projectRoot = context.services.config?.getProjectRoot() || process.cwd();
  const promptFile = path.join(projectRoot, 'GEMINI.md');
  
  // 如果文件不存在，创建默认内容
  if (!fs.existsSync(promptFile)) {
    const defaultContent = `# 项目提示词

这是当前项目的提示词文件。在这里添加的内容将应用于此项目的对话。

## 项目信息

- 项目名称: 
- 项目类型: 
- 技术栈: 

## 编码规范

请遵循以下编码规范:
- 使用中文注释
- 遵循项目的代码风格

## 特殊要求

在此添加项目特定的要求和说明。
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
    text: `正在打开项目提示词文件: ${promptFile}`,
  }, Date.now());
}