/**
 * @license
 * Copyright 2025 Google LLC
 * SPDX-License-Identifier: Apache-2.0
 */

import type { SlashCommand, CommandContext } from './types.js';
import { CommandKind } from './types.js';
import { t } from '../../i18n/index.js';

export const modelCommand: SlashCommand = {
  name: 'model',
  description: t('model.description'),
  kind: CommandKind.BUILT_IN,
  action: async (context: CommandContext, args: string) => {
    const modelName = args?.trim();
    
    if (!modelName) {
      // 从config获取当前模型，而不是环境变量
      const currentModel = context.services.config?.getModel() || 'gemini-2.5-flash';
      return {
        type: 'message' as const,
        messageType: 'info' as const,
        content: t('model.current', { model: currentModel }) + '\\n\\n' +
                 t('model.availableModels') + '\\n- gemini-2.5-pro\\n- gemini-2.5-flash\\n- gemini-1.5-pro\\n- gemini-1.5-flash\\n\\n' +
                 t('model.usage')
      };
    }
    
    const validModels = [
      'gemini-2.5-pro',
      'gemini-2.5-flash', 
      'gemini-1.5-pro',
      'gemini-1.5-flash'
    ];
    
    if (!validModels.includes(modelName)) {
      return {
        type: 'message' as const,
        messageType: 'error' as const,
        content: t('model.invalidModel', { 
          model: modelName, 
          models: validModels.join(', ') 
        })
      };
    }
    
    // 设置环境变量
    process.env['GEMINI_MODEL'] = modelName;
    
    // 更新config中的模型配置
    if (context.services.config) {
      try {
        context.services.config.setModel(modelName);
      } catch (error) {
        console.debug('Failed to set model in config:', error);
      }
    }
    
    return {
      type: 'message' as const,
      messageType: 'info' as const,
      content: t('model.setSuccess', { model: modelName })
    };
  },
  completion: async (context: CommandContext, partialArg: string): Promise<string[]> => {
    const models = [
      'gemini-2.5-pro',
      'gemini-2.5-flash',
      'gemini-1.5-pro', 
      'gemini-1.5-flash'
    ];
    
    return models.filter(model => 
      model.toLowerCase().includes(partialArg.toLowerCase())
    );
  },
};