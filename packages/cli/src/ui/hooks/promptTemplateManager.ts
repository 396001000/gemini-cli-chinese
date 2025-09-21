/**
 * @license
 * Copyright 2025 Google LLC
 * SPDX-License-Identifier: Apache-2.0
 */

import { Config } from '@google/gemini-cli-core';
import { PromptTemplateStorage } from './promptTemplateStorage.js';
// import type { PromptCategoryInfo } from './promptTemplateStorage.js'; // 未使用

// 单例模式：确保整个应用只有一个PromptTemplateManager实例
let globalTemplateManager: PromptTemplateManager | null = null;

export function getGlobalTemplateManager(config: Config): PromptTemplateManager {
  if (!globalTemplateManager) {
    globalTemplateManager = new PromptTemplateManager(config);
    globalTemplateManager.initialize().catch(console.error);
  }
  return globalTemplateManager;
}

export function resetGlobalTemplateManager(): void {
  globalTemplateManager = null;
}

export interface MenuAction {
  type: 'show_menu' | 'input_request' | 'template_content' | 'message' | 'set_input_text';
  content?: string;
  inputPrompt?: string;
  menuItems?: string[];
  categoryName?: string;
}

// 添加状态管理接口
export interface TemplateCreationState {
  step: 'none' | 'waiting_title' | 'waiting_content' | 'waiting_delete_selection';
  categoryName?: string;
  title?: string;
}

export class PromptTemplateManager {
  private storage: PromptTemplateStorage;
  private creationState: TemplateCreationState = { step: 'none' };

  constructor(config: Config) {
    const tempDir = config.getProjectRoot() + '/.temp';
    if (!tempDir) {
      throw new Error('无法获取.gemini配置目录');
    }
    this.storage = new PromptTemplateStorage(tempDir);
  }

  /**
   * 初始化管理器，创建默认分类
   */
  async initialize(): Promise<void> {
    await this.storage.initializeDefaultCategories();
  }

  /**
   * 处理#命令 - 分步式交互流程
   */
  async handleHashCommand(input: string): Promise<MenuAction> {
    const trimmed = input.trim();
    
    // 处理多步骤创建流程
    if (this.creationState.step !== 'none') {
      return await this.handleCreationStep(trimmed);
    }
    
    // 如果只输入#，显示主菜单
    if (trimmed === '#') {
      return await this.showMainMenu();
    }

    // 解析命令：#分类名 操作 [模板名称]
    const parts = trimmed.substring(1).trim().split(/\s+/);
    const categoryName = parts[0];
    const operation = parts[1];
    const templateName = parts.slice(2).join(' '); // 支持模板名称中有空格

    // 处理特殊命令
    if (categoryName === '新建分类' || categoryName === '创建分类') {
      if (operation) {
        return await this.addCategory(operation);
      } else {
        return {
          type: 'input_request',
          inputPrompt: '请输入新分类的名称：',
          content: '创建新分类'
        };
      }
    }

    if (categoryName === '帮助') {
      return await this.showHelpMenu();
    }

    // 检查是否是有效分类
    const categories = await this.storage.getAllCategories();
    const categoryInfo = categories.find(cat => cat.name === categoryName);

    if (!categoryInfo) {
      return {
        type: 'message',
        content: `分类 "${categoryName}" 不存在。\n可用分类：${categories.map(c => c.name).join(', ')}\n或使用：#新建分类 创建新分类`
      };
    }

    // 如果只输入分类名，显示分类菜单
    if (!operation) {
      return await this.showCategoryMenu(categoryName);
    }

    // 处理分类内的操作
    switch (operation) {
      case '删除分类':
        return await this.deleteCategory(categoryName);

      case '新建':
      case '添加':
        // 开始分步式创建流程
        this.creationState = {
          step: 'waiting_title',
          categoryName: categoryName
        };
        return {
          type: 'set_input_text',
          content: '提示词标题：',
          inputPrompt: `✨ 开始创建模板向导 - 分类：${categoryName}\n📝 第1步：请输入模板标题`
        };

      case '删除':
        // 如果提供了模板名称，直接删除；否则显示可删除的模板列表
        if (templateName) {
          return await this.deleteTemplateByName(categoryName, templateName);
        } else {
          return await this.showDeletableTemplates(categoryName);
        }

      default:
        // 检查是否是有效的模板名称，避免意外的模板使用
        const templateNames = await this.getTemplateNames(categoryName);
        if (templateNames.includes(operation)) {
          // 尝试作为模板名称使用
          return await this.useTemplate(categoryName, operation);
        } else {
          return {
            type: 'message',
            content: `❌ 未知操作 "${operation}"\n📝 可用操作：删除、新建\n📝 可用模板：${templateNames.join(', ')}`
          };
        }
    }
  }

  /**
   * 处理创建流程的各个步骤
   */
  private async handleCreationStep(input: string): Promise<MenuAction> {
    let userInput = input.startsWith('#') ? input.substring(1).trim() : input.trim();

    if (userInput === '取消' || userInput === 'cancel') {
      this.creationState = { step: 'none' };
      return {
        type: 'message',
        content: '已取消创建模板'
      };
    }

    switch (this.creationState.step) {
      case 'waiting_title':
        // 解析包含"提示词标题："前缀的输入
        if (userInput.startsWith('提示词标题：')) {
          userInput = userInput.substring('提示词标题：'.length).trim();
        }
        
        if (!userInput) {
          return {
            type: 'set_input_text',
            content: '提示词标题：',
            inputPrompt: '❌ 标题不能为空，请重新输入模板标题'
          };
        }
        
        // 检查标题是否已存在
        const existingTemplate = await this.storage.getTemplate(this.creationState.categoryName!, userInput);
        if (existingTemplate) {
          return {
            type: 'set_input_text',
            content: '提示词标题：',
            inputPrompt: `❌ 标题 "${userInput}" 已存在，请输入不同的标题`
          };
        }

        this.creationState.title = userInput;
        this.creationState.step = 'waiting_content';
        return {
          type: 'set_input_text',
          content: '提示词内容：',
          inputPrompt: `✅ 标题已设置：${userInput}\n📝 第2步：请输入模板内容`
        };

      case 'waiting_content':
        // 解析包含"提示词内容："前缀的输入
        if (userInput.startsWith('提示词内容：')) {
          userInput = userInput.substring('提示词内容：'.length).trim();
        }
        
        if (!userInput) {
          return {
            type: 'set_input_text',
            content: '提示词内容：',
            inputPrompt: '❌ 内容不能为空，请重新输入模板内容'
          };
        }

        // 创建模板
        const success = await this.storage.addTemplate(
          this.creationState.categoryName!,
          this.creationState.title!,
          userInput
        );

        const categoryName = this.creationState.categoryName!;
        const title = this.creationState.title!;
        
        // 重置状态
        this.creationState = { step: 'none' };

        if (success) {
          return {
            type: 'message',
            content: `🎉 模板创建成功！\n📂 分类：${categoryName}\n📝 标题：${title}\n\n💡 使用方式：#${categoryName} ${title}\n📋 查看分类：#${categoryName}`
          };
        } else {
          return {
            type: 'message',
            content: `❌ 模板创建失败，请稍后重试`
          };
        }

      case 'waiting_delete_selection':
        // 处理删除模板选择
        const templateNames = await this.getTemplateNames(this.creationState.categoryName!);
        
        // 首先尝试精确匹配（忽略大小写）
        const exactMatch = templateNames.find(name => name.toLowerCase() === userInput.toLowerCase());
        
        const foundTemplate = exactMatch;
        
        if (foundTemplate) {
          const categoryName = this.creationState.categoryName!;
          const success = await this.storage.deleteTemplate(categoryName, foundTemplate);
          this.creationState = { step: 'none' }; // 重置状态
          
          if (success) {
            return {
              type: 'set_input_text',
              content: '', // 清空输入框
              inputPrompt: `✅ 模板 "${foundTemplate}" 已从分类 "${categoryName}" 中删除`
            };
          } else {
            return {
              type: 'message',
              content: `❌ 删除模板失败`
            };
          }
        } else {
          return {
            type: 'message',
            content: `❌ 模板 "${userInput}" 不存在\n📝 可用模板：${templateNames.join(', ')}\n💡 请输入准确的模板名称或"取消"`
          };
        }

      default:
        this.creationState = { step: 'none' };
        return {
          type: 'message',
          content: '操作流程出错，已重置'
        };
    }
  }

  /**
   * 显示可删除的模板列表
   */
  private async showDeletableTemplates(categoryName: string): Promise<MenuAction> {
    const templateNames = await this.getTemplateNames(categoryName);
    
    if (templateNames.length === 0) {
      return {
        type: 'message',
        content: `分类 "${categoryName}" 中暂无模板`
      };
    }

    // 设置删除选择状态
    this.creationState = {
      step: 'waiting_delete_selection',
      categoryName: categoryName
    };

    const menuItems = [
      `📝 选择要删除的模板：`,
      '',
      ...templateNames.map(name => `  📄 ${name}`)
    ];

    return {
      type: 'show_menu',
      content: `🗑️ 删除模板 - ${categoryName}`,
      menuItems: [
        ...menuItems,
        '',
        '💡 输入模板名称来删除，或输入"取消"退出'
      ]
    };
  }

  /**
   * 显示主菜单
   */
  private async showMainMenu(): Promise<MenuAction> {
    const categories = await this.storage.getAllCategories();
    
    const menuItems = [
      '🎯 提示词模板管理',
      '',
      '📝 快速操作：',
      '  #新建分类 <名称>     - 创建新分类',
      '  #<分类名>           - 进入分类管理',
      '  #帮助               - 查看详细帮助',
      '',
      '📁 现有分类：'
    ];

    if (categories.length === 0) {
      menuItems.push('  (暂无分类，使用 #新建分类 创建第一个分类)');
    } else {
      categories.forEach((categoryInfo) => {
        menuItems.push(`  📂 ${categoryInfo.name} (${categoryInfo.templateCount}个模板)`);
      });
    }

    return {
      type: 'show_menu',
      content: '提示词模板系统',
      menuItems
    };
  }

  /**
   * 显示分类菜单
   */
  private async showCategoryMenu(categoryName: string): Promise<MenuAction> {
    const category = await this.storage.getCategory(categoryName);
    if (!category) {
      return {
        type: 'message',
        content: `分类 "${categoryName}" 不存在`
      };
    }

    const templates = Object.keys(category.templates);
    
    const menuItems = [
      `📂 分类：${categoryName}`,
      '',
      '🛠️ 管理操作：',
      `  #${categoryName} 新建         - 创建新模板`,
      `  #${categoryName} 删除         - 删除模板`,
      `  #${categoryName} 删除分类     - 删除整个分类`,
      '',
      '📋 现有模板：'
    ];

    if (templates.length === 0) {
      menuItems.push('  (暂无模板，使用 新建 创建第一个模板)');
    } else {
      templates.forEach(title => {
        menuItems.push(`  📄 ${title}`);
      });
      menuItems.push('');
      menuItems.push('💡 使用方式：#分类名 模板名');
    }

    menuItems.push('', '🔙 返回主菜单：#');

    return {
      type: 'show_menu',
      content: `分类管理`,
      menuItems,
      categoryName
    };
  }

  /**
   * 使用模板
   */
  private async useTemplate(categoryName: string, templateName: string): Promise<MenuAction> {
    const category = await this.storage.getCategory(categoryName);
    if (!category) {
      return {
        type: 'message',
        content: `分类 "${categoryName}" 不存在`
      };
    }

    const template = category.templates[templateName];
    if (!template) {
      // 如果模板不存在，显示可用的模板列表
      const availableTemplates = Object.keys(category.templates);
      if (availableTemplates.length === 0) {
        return {
          type: 'message',
          content: `分类 "${categoryName}" 中暂无模板。使用 #${categoryName} 新建 来创建模板`
        };
      } else {
        return {
          type: 'message',
          content: `模板 "${templateName}" 不存在。\n\n可用模板：\n${availableTemplates.map(t => `  #${categoryName} ${t}`).join('\n')}`
        };
      }
    }

    return {
      type: 'template_content',
      content: template
    };
  }

  /**
   * 添加分类
   */
  private async addCategory(categoryName: string): Promise<MenuAction> {
    if (!categoryName) {
      return {
        type: 'message',
        content: '分类名称不能为空'
      };
    }

    const success = await this.storage.createCategory(categoryName);
    if (success) {
      return {
        type: 'message',
        content: `✅ 分类 "${categoryName}" 创建成功！\n\n使用 #${categoryName} 进入分类管理\n使用 #${categoryName} 新建 创建第一个模板`
      };
    } else {
      return {
        type: 'message',
        content: `❌ 创建分类失败：分类 "${categoryName}" 可能已存在`
      };
    }
  }

  /**
   * 删除分类
   */
  private async deleteCategory(categoryName: string): Promise<MenuAction> {
    const category = await this.storage.getCategory(categoryName);
    if (!category) {
      return {
        type: 'message',
        content: `分类 "${categoryName}" 不存在`
      };
    }

    const templateCount = Object.keys(category.templates).length;
    const success = await this.storage.deleteCategory(categoryName);
    
    if (success) {
      return {
        type: 'message',
        content: `✅ 分类 "${categoryName}" 及其 ${templateCount} 个模板已删除`
      };
    } else {
      return {
        type: 'message',
        content: `❌ 删除分类失败：无法删除分类 "${categoryName}"`
      };
    }
  }

  /**
   * 删除模板 - 通过编号选择
   */
  /**
   * 通过模板名称删除模板
   */
  async deleteTemplateByName(categoryName: string, templateName: string): Promise<MenuAction> {
    const templateNames = await this.getTemplateNames(categoryName);
    const foundTemplate = templateNames.find(name => name.toLowerCase() === templateName.toLowerCase());
    
    if (!foundTemplate) {
      return {
        type: 'message',
        content: `❌ 模板 "${templateName}" 不存在\n📝 可用模板：${templateNames.join(', ')}`
      };
    }

    const success = await this.storage.deleteTemplate(categoryName, foundTemplate);
    
    if (success) {
      return {
        type: 'set_input_text',
        content: '', // 清空输入框
        inputPrompt: `✅ 模板 "${foundTemplate}" 已从分类 "${categoryName}" 中删除`
      };
    } else {
      return {
        type: 'message',
        content: `❌ 删除模板失败`
      };
    }
  }

  async deleteTemplateByIndex(categoryName: string, index: number): Promise<MenuAction> {
    const templateNames = await this.getTemplateNames(categoryName);
    
    if (index < 1 || index > templateNames.length) {
      return {
        type: 'message',
        content: `无效的编号，请选择 1-${templateNames.length} 之间的数字`
      };
    }

    const templateName = templateNames[index - 1];
    const success = await this.storage.deleteTemplate(categoryName, templateName);
    
    if (success) {
      return {
        type: 'message',
        content: `✅ 模板 "${templateName}" 已从分类 "${categoryName}" 中删除`
      };
    } else {
      return {
        type: 'message',
        content: `❌ 删除模板失败`
      };
    }
  }

  /**
   * 显示帮助菜单
   */
  private async showHelpMenu(): Promise<MenuAction> {
    const menuItems = [
      '🔧 #命令使用帮助',
      '',
      '📁 分类管理：',
      '  #新建分类 <名称>     - 创建新分类',
      '  #<分类名>           - 查看分类详情',
      '  #<分类名> 删除分类    - 删除整个分类',
      '',
      '📝 模板管理（分步式）：',
      '  #<分类名> 新建       - 开始创建模板向导',
      '    → 输入标题 → 输入内容 → 完成',
      '  #<分类名> 删除       - 查看可删除的模板',
      '  #<分类名> <标题>     - 使用模板',
      '',
      '📖 使用示例：',
      '  1. #新建分类 我的提示词',
      '  2. #我的提示词',
      '  3. #我的提示词 新建',
      '  4. 输入标题：代码优化',
      '  5. 输入内容：请帮我优化这段代码',
      '  6. #我的提示词 代码优化',
      '',
      '💡 小贴士：',
      '  • 创建过程中输入"取消"可退出',
      '  • 使用 # 返回主菜单',
      '',
      '🔙 返回主菜单：#'
    ];

    return {
      type: 'show_menu',
      content: '使用帮助',
      menuItems
    };
  }

  /**
   * 获取所有分类名称
   */
  async getAllCategoryNames(): Promise<string[]> {
    const categories = await this.storage.getAllCategories();
    return categories.map(cat => cat.name);
  }

  /**
   * 获取指定分类的模板名称
   */
  async getTemplateNames(categoryName: string): Promise<string[]> {
    const category = await this.storage.getCategory(categoryName);
    return category ? Object.keys(category.templates) : [];
  }

  /**
   * 获取当前创建状态
   */
  getCreationState(): TemplateCreationState {
    return this.creationState;
  }

  /**
   * 重置创建状态
   */
  resetCreationState(): void {
    this.creationState = { step: 'none' };
  }
} 