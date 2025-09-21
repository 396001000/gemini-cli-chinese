/**
 * @license
 * Copyright 2025 Google LLC
 * SPDX-License-Identifier: Apache-2.0
 */

import { useCallback, useEffect, useState } from 'react';
import { type PartListUnion } from '@google/genai';
import { Config } from '@google/gemini-cli-core';
import { PromptTemplateManager, getGlobalTemplateManager } from './promptTemplateManager.js';
import type { MenuAction } from './promptTemplateManager.js';
import type { UseHistoryManagerReturn } from './useHistoryManager.js';
import { MessageType } from '../types.js';
import type { HistoryItemWithoutId } from '../types.js';

export interface HashCommandProcessorResult {
  type: 'handled' | 'template_content' | 'set_input_text';
  content?: string;
}

export interface UseHashCommandProcessorReturn {
  handleHashCommand: (rawQuery: PartListUnion) => Promise<HashCommandProcessorResult | false>;
  isHashCommand: (query: string) => boolean;
  pendingHistoryItems: HistoryItemWithoutId[];
  isInCreationFlow: () => boolean;
}

/**
 * 检查是否是#命令
 */
export function isHashCommand(query: string): boolean {
  const trimmed = query.trim();
  return trimmed.startsWith('#');
}

/**
 * Hook to process hash commands (e.g., #, #1, #add-category).
 */
export const useHashCommandProcessor = (
  config: Config | null,
  addItem: UseHistoryManagerReturn['addItem']
): UseHashCommandProcessorReturn => {
  const [templateManager, setTemplateManager] = useState<PromptTemplateManager | null>(null);
  const [pendingHistoryItems, _setPendingHistoryItems] = useState<HistoryItemWithoutId[]>([]);

  // 初始化模板管理器
  useEffect(() => {
    if (config) {
      try {
        const manager = getGlobalTemplateManager(config);
        setTemplateManager(manager);
      } catch (error) {
        console.error('模板管理器初始化失败:', error);
      }
    }
  }, [config]);

  const addMessage = useCallback((type: MessageType, content: string) => {
    addItem(
      { type, text: content },
      Date.now()
    );
  }, [addItem]);

  const handleHashCommand = useCallback(
    async (rawQuery: PartListUnion): Promise<HashCommandProcessorResult | false> => {
      
      if (typeof rawQuery !== 'string') {
        console.log('#命令参数类型错误');
        return false;
      }

      const trimmed = rawQuery.trim();
      
      if (!templateManager) {
        console.log('模板管理器未初始化');
        addMessage(MessageType.ERROR, '提示词模板管理器未初始化，请稍后重试');
        return { type: 'handled' };
      }

      // 对于非#开头的输入，如果处于创建流程中，直接处理
      if (!isHashCommand(trimmed) && templateManager.getCreationState().step !== 'none') {
        
        try {
          const result: MenuAction = await templateManager.handleHashCommand(trimmed);
          console.log('模板管理器返回结果:', result);
          
          switch (result.type) {
            case 'input_request':
              // 继续请求输入
              addMessage(MessageType.INFO, result.content || '');
              if (result.inputPrompt) {
                addMessage(MessageType.INFO, `💡 ${result.inputPrompt}`);
              }
              break;

            case 'set_input_text':
              // 设置输入框文本并显示提示信息
              if (result.inputPrompt) {
                addMessage(MessageType.INFO, `💡 ${result.inputPrompt}`);
              }
              return {
                type: 'set_input_text',
                content: result.content || ''
              };

            case 'message':
              // 显示结果信息（成功/失败）
              addMessage(MessageType.INFO, result.content || '');
              break;

            default:
              addMessage(MessageType.ERROR, '未知的操作类型');
              break;
          }

          return { type: 'handled' };
        } catch (error) {
          const errorMessage = error instanceof Error ? error.message : String(error);
          addMessage(MessageType.ERROR, `处理输入时出错: ${errorMessage}`);
          return { type: 'handled' };
        }
      }

      // 检查是否是有效的#命令
      if (!isHashCommand(trimmed)) {
        console.log('不是有效的#命令');
        return false;
      }
      
      // 记录用户输入
      addItem(
        { type: MessageType.USER, text: trimmed },
        Date.now()
      );

      try {
        const result: MenuAction = await templateManager.handleHashCommand(trimmed);
        
        switch (result.type) {
          case 'show_menu': {
            // 显示菜单
            let menuContent = result.content || '';
            if (result.menuItems && result.menuItems.length > 0) {
              menuContent += '\n\n' + result.menuItems.join('\n');
            }
            addMessage(MessageType.INFO, menuContent);
            break;
          }

          case 'input_request':
            // 请求用户输入
            addMessage(MessageType.INFO, result.content || '');
            if (result.inputPrompt) {
              addMessage(MessageType.INFO, `💡 ${result.inputPrompt}`);
            }
            break;

          case 'set_input_text':
            // 设置输入框文本并显示提示信息
            if (result.inputPrompt) {
              addMessage(MessageType.INFO, `💡 ${result.inputPrompt}`);
            }
            return {
              type: 'set_input_text',
              content: result.content || ''
            };

          case 'template_content':
            // 返回模板内容，将被设置到输入框中
            return {
              type: 'set_input_text',
              content: result.content || ''
            };

          case 'message':
            // 显示信息
            addMessage(MessageType.INFO, result.content || '');
            break;

          default:
            addMessage(MessageType.ERROR, '未知的操作类型');
            break;
        }

        return { type: 'handled' };
      } catch (error) {
        const errorMessage = error instanceof Error ? error.message : String(error);
        addMessage(MessageType.ERROR, `处理#命令时出错: ${errorMessage}`);
        templateManager.resetCreationState?.(); // 重置状态
        return { type: 'handled' };
      }
    },
    [templateManager, addItem, addMessage]
  );

  return {
    handleHashCommand,
    isHashCommand,
    pendingHistoryItems,
    isInCreationFlow: () => templateManager?.getCreationState().step !== 'none'
  };
}; 