/**
 * @license
 * Copyright 2025 Google LLC
 * SPDX-License-Identifier: Apache-2.0
 */

import { zhCN } from './locales/zh-CN.js';
import type { TranslationKeys } from './types.js';

// 当前语言设置
let currentLocale = 'zh-CN';

// 翻译数据存储
const translations: Record<string, TranslationKeys> = {
  'zh-CN': zhCN,
};

/**
 * 翻译函数 - 根据键值获取对应的翻译文本
 * @param key 翻译键值，支持嵌套路径如 'commands.model.description'
 * @param params 可选参数，用于字符串插值
 * @param silent 静默模式，如果为true则不打印警告
 * @returns 翻译后的文本
 */
export function t(key: string, params?: Record<string, string | number>, silent?: boolean): string {
  const locale = translations[currentLocale];
  if (!locale) {
    if (!silent) console.warn(`Translation locale '${currentLocale}' not found`);
    return key;
  }
  

  // 支持嵌套路径访问，如 'commands.model.description'
  // 特殊处理：如果是 officialCommands 路径，需要特殊处理
  if (key.startsWith('officialCommands.')) {
    const actualKey = key.substring('officialCommands.'.length);
    if (locale['officialCommands'] && actualKey in locale['officialCommands']) {
      const value = locale['officialCommands'][actualKey];
      if (typeof value === 'string') {
        // 处理参数插值
        if (params) {
          return value.replace(/\{(\w+)\}/g, (match, paramKey) => {
            return params[paramKey]?.toString() || match;
          });
        }
        return value;
      }
    }
    if (!silent) console.warn(`Translation key '${key}' not found in officialCommands`);
    return key;
  }
  
  // 常规嵌套路径处理
  const keys = key.split('.');
  let value: any = locale;
  
  for (const k of keys) {
    if (value && typeof value === 'object' && k in value) {
      value = value[k];
    } else {
      if (!silent) console.warn(`Translation key '${key}' not found`);
      return key;
    }
  }

  if (typeof value !== 'string') {
    if (!silent) console.warn(`Translation key '${key}' is not a string`);
    return key;
  }

  // 处理参数插值，支持 {param} 格式
  if (params) {
    return value.replace(/\{(\w+)\}/g, (match, paramKey) => {
      return params[paramKey]?.toString() || match;
    });
  }

  return value;
}

/**
 * 设置当前语言
 * @param locale 语言代码，如 'zh-CN'
 */
export function setLocale(locale: string): void {
  if (translations[locale]) {
    currentLocale = locale;
  } else {
    console.warn(`Locale '${locale}' is not available`);
  }
}

/**
 * 获取当前语言
 * @returns 当前语言代码
 */
export function getCurrentLocale(): string {
  return currentLocale;
}

/**
 * 检查翻译键是否存在
 * @param key 翻译键值
 * @returns 是否存在
 */
export function hasTranslation(key: string): boolean {
  const locale = translations[currentLocale];
  if (!locale) return false;

  const keys = key.split('.');
  let value: any = locale;
  
  for (const k of keys) {
    if (value && typeof value === 'object' && k in value) {
      value = value[k];
    } else {
      return false;
    }
  }

  return typeof value === 'string';
}

/**
 * 获取所有可用的语言
 * @returns 可用语言列表
 */
export function getAvailableLocales(): string[] {
  return Object.keys(translations);
}

// 默认导出翻译函数，便于使用
export default t;
