/**
 * @license
 * Copyright 2025 Google LLC
 * SPDX-License-Identifier: Apache-2.0
 */

import { promises as fs } from 'fs';
import path from 'path';

export interface PromptTemplate {
  title: string;
  content: string;
}

export interface PromptCategory {
  categoryName: string;
  templates: Record<string, string>; // title -> content
  metadata: {
    created: string;
    lastModified: string;
  };
}

export interface PromptCategoryInfo {
  name: string;
  templateCount: number;
  lastModified: string;
}

export class PromptTemplateStorage {
  private promptDir: string;

  constructor(geminiConfigDir: string) {
    this.promptDir = path.join(geminiConfigDir, 'prompt-templates');
  }

  private async ensurePromptDir(): Promise<void> {
    try {
      await fs.mkdir(this.promptDir, { recursive: true });
    } catch (error) {
      // Directory might already exist, ignore error
    }
  }

  private getCategoryFilePath(categoryName: string): string {
    // 安全的文件名处理
    const safeFileName = categoryName.replace(/[<>:"/\\|?*]/g, '_');
    return path.join(this.promptDir, `${safeFileName}.json`);
  }

  /**
   * 获取所有分类的信息
   */
  async getAllCategories(): Promise<PromptCategoryInfo[]> {
    await this.ensurePromptDir();
    
    try {
      const files = await fs.readdir(this.promptDir);
      const jsonFiles = files.filter(file => file.endsWith('.json'));
      
      const categories: PromptCategoryInfo[] = [];
      
      for (const file of jsonFiles) {
        try {
          const filePath = path.join(this.promptDir, file);
          const content = await fs.readFile(filePath, 'utf-8');
          const category: PromptCategory = JSON.parse(content);
          
          categories.push({
            name: category.categoryName,
            templateCount: Object.keys(category.templates).length,
            lastModified: category.metadata.lastModified
          });
        } catch (error) {
          // 跳过损坏的文件
          console.warn(`跳过损坏的分类文件: ${file}`);
        }
      }
      
      return categories.sort((a, b) => a.name.localeCompare(b.name));
    } catch (error) {
      return [];
    }
  }

  /**
   * 获取指定分类的详细信息
   */
  async getCategory(categoryName: string): Promise<PromptCategory | null> {
    await this.ensurePromptDir();
    
    try {
      const filePath = this.getCategoryFilePath(categoryName);
      const content = await fs.readFile(filePath, 'utf-8');
      return JSON.parse(content);
    } catch (error) {
      return null;
    }
  }

  /**
   * 创建新分类
   */
  async createCategory(categoryName: string): Promise<boolean> {
    await this.ensurePromptDir();
    
    const filePath = this.getCategoryFilePath(categoryName);
    
    // 检查是否已存在
    try {
      await fs.access(filePath);
      return false; // 已存在
    } catch {
      // 文件不存在，可以创建
    }
    
    const category: PromptCategory = {
      categoryName,
      templates: {},
      metadata: {
        created: new Date().toISOString(),
        lastModified: new Date().toISOString()
      }
    };
    
    try {
      await fs.writeFile(filePath, JSON.stringify(category, null, 2), 'utf-8');
      return true;
    } catch (error) {
      return false;
    }
  }

  /**
   * 删除分类
   */
  async deleteCategory(categoryName: string): Promise<boolean> {
    try {
      const filePath = this.getCategoryFilePath(categoryName);
      await fs.unlink(filePath);
      return true;
    } catch (error) {
      return false;
    }
  }

  /**
   * 添加提示词到分类
   */
  async addTemplate(categoryName: string, title: string, content: string): Promise<boolean> {
    const category = await this.getCategory(categoryName);
    if (!category) {
      return false;
    }
    
    category.templates[title] = content;
    category.metadata.lastModified = new Date().toISOString();
    
    try {
      const filePath = this.getCategoryFilePath(categoryName);
      await fs.writeFile(filePath, JSON.stringify(category, null, 2), 'utf-8');
      return true;
    } catch (error) {
      return false;
    }
  }

  /**
   * 删除提示词
   */
  async deleteTemplate(categoryName: string, title: string): Promise<boolean> {
    const category = await this.getCategory(categoryName);
    if (!category || !category.templates[title]) {
      return false;
    }
    
    delete category.templates[title];
    category.metadata.lastModified = new Date().toISOString();
    
    try {
      const filePath = this.getCategoryFilePath(categoryName);
      await fs.writeFile(filePath, JSON.stringify(category, null, 2), 'utf-8');
      return true;
    } catch (error) {
      return false;
    }
  }

  /**
   * 获取提示词内容
   */
  async getTemplate(categoryName: string, title: string): Promise<string | null> {
    const category = await this.getCategory(categoryName);
    if (!category) {
      return null;
    }
    
    return category.templates[title] || null;
  }

  /**
   * 检查是否已经初始化过
   */
  private async isInitialized(): Promise<boolean> {
    try {
      const initFile = path.join(this.promptDir, '.initialized');
      await fs.access(initFile);
      return true;
    } catch (error) {
      return false;
    }
  }

  /**
   * 标记为已初始化
   */
  private async markAsInitialized(): Promise<void> {
    try {
      const initFile = path.join(this.promptDir, '.initialized');
      await fs.writeFile(initFile, JSON.stringify({
        initialized: true,
        timestamp: new Date().toISOString()
      }), 'utf-8');
    } catch (error) {
      console.warn('无法创建初始化标记文件:', error);
    }
  }

  /**
   * 初始化默认分类
   * 只在首次运行时创建默认分类，避免用户删除后重新创建
   */
  async initializeDefaultCategories(): Promise<void> {
    // 检查是否已经初始化过
    const initialized = await this.isInitialized();
    
    if (initialized) {
      return; // 已经初始化过，不重复创建默认分类
    }

    const defaultCategories = [
      {
        name: '默认分类1',
        templates: {
          '代码解释': '请解释这段代码的功能和工作原理',
          '代码优化': '请帮我优化这段代码，提高性能和可读性',
          '错误分析': '请分析这个错误的原因并提供解决方案'
        }
      },
      {
        name: '默认分类2',
        templates: {
          '文档生成': '请为这段代码生成详细的文档说明',
          '测试用例': '请为这个函数生成全面的测试用例',
          '代码review': '请review这段代码，指出潜在问题和改进建议'
        }
      }
    ];

    // 只在首次初始化时创建默认分类
    for (const defaultCategory of defaultCategories) {
      await this.createCategory(defaultCategory.name);
      for (const [title, content] of Object.entries(defaultCategory.templates)) {
        await this.addTemplate(defaultCategory.name, title, content);
      }
    }

    // 标记为已初始化
    await this.markAsInitialized();
  }
} 