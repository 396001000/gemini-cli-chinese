/**
 * @license
 * Copyright 2025 Google LLC
 * SPDX-License-Identifier: Apache-2.0
 */

import type React from 'react';
import { Box, Text } from 'ink';
import { theme } from '../semantic-colors.js';
import { type Config } from '@google/gemini-cli-core';

interface TipsProps {
  config: Config;
}

export const Tips: React.FC<TipsProps> = ({ config }) => {
  const geminiMdFileCount = config.getGeminiMdFileCount();
  return (
    <Box flexDirection="column">
      <Text color={theme.text.primary}>使用入门提示：</Text>
      <Text color={theme.text.primary}>
        1. 提问、编辑文件或运行命令。
      </Text>
      <Text color={theme.text.primary}>
        2. 描述具体以获得最佳效果。
      </Text>
      {geminiMdFileCount === 0 && (
        <Text color={theme.text.primary}>
          3. 创建{' '}
          <Text bold color={theme.text.accent}>
            GEMINI.md
          </Text>{' '}
          文件来自定义与 Gemini 的交互。
        </Text>
      )}
      <Text color={theme.text.primary}>
        {geminiMdFileCount === 0 ? '4.' : '3.'}{' '}
        <Text bold color={theme.text.accent}>
          /help
        </Text>{' '}
        获取更多信息。
      </Text>
      <Text color={theme.text.primary}>
        {geminiMdFileCount === 0 ? '5.' : '4.'} 欢迎使用超级智体汉化魔改版 Gemini-cli
      </Text>
    </Box>
  );
};
