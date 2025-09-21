/**
 * @license
 * Copyright 2025 Google LLC
 * SPDX-License-Identifier: Apache-2.0
 */

import type React from 'react';
import { Box, Text } from 'ink';
import { theme } from '../semantic-colors.js';
import { type SlashCommand, CommandKind } from '../commands/types.js';
import { t } from '../../i18n/index.js';

interface Help {
  commands: readonly SlashCommand[];
}

// 翻译描述的辅助函数
function translateDescription(description: string): string {
  // 首先尝试从 officialCommands 翻译映射中查找
  const officialTranslation = t(`officialCommands.${description}`, {}, true);
  if (officialTranslation !== `officialCommands.${description}`) {
    return officialTranslation;
  }
  
  // 如果没有找到，返回原描述
  return description;
}

export const Help: React.FC<Help> = ({ commands }) => (
  <Box
    flexDirection="column"
    marginBottom={1}
    borderColor={theme.border.default}
    borderStyle="round"
    padding={1}
  >
    {/* Basics */}
    <Text bold color={theme.text.primary}>
      {t('ui.Basics:', {}, true) || 'Basics:'}
    </Text>
    <Text color={theme.text.primary}>
      <Text bold color={theme.text.accent}>
        {t('ui.Add context', {}, true) || 'Add context'}
      </Text>
      : {t('ui.addContextDescription', {}, true) || 'Use @ to specify files for context (e.g., @src/myFile.ts) to target specific files or folders.'}
    </Text>
    <Text color={theme.text.primary}>
      <Text bold color={theme.text.accent}>
        {t('ui.Shell mode', {}, true) || 'Shell mode'}
      </Text>
      : {t('ui.shellModeDescription', {}, true) || 'Execute shell commands via ! (e.g., !npm run start) or use natural language (e.g. start server).'}
    </Text>

    <Box height={1} />

    {/* Commands */}
    <Text bold color={theme.text.primary}>
      {t('ui.Commands:', {}, true) || 'Commands:'}
    </Text>
    {commands
      .filter((command) => command.description && !command.hidden)
      .map((command: SlashCommand) => (
        <Box key={command.name} flexDirection="column">
          <Text color={theme.text.primary}>
            <Text bold color={theme.text.accent}>
              {' '}
              /{command.name}
            </Text>
            {command.kind === CommandKind.MCP_PROMPT && (
              <Text color={theme.text.secondary}> [MCP]</Text>
            )}
            {command.description && ' - ' + translateDescription(command.description)}
          </Text>
          {command.subCommands &&
            command.subCommands
              .filter((subCommand) => !subCommand.hidden)
              .map((subCommand) => (
                <Text key={subCommand.name} color={theme.text.primary}>
                  <Text bold color={theme.text.accent}>
                    {'   '}
                    {subCommand.name}
                  </Text>
                  {subCommand.description && ' - ' + translateDescription(subCommand.description)}
                </Text>
              ))}
        </Box>
      ))}
    <Text color={theme.text.primary}>
      <Text bold color={theme.text.accent}>
        {' '}
        !{' '}
      </Text>
      - {t('officialCommands.shell command', {}, true) || 'shell command'}
    </Text>
    <Text color={theme.text.primary}>
      <Text color={theme.text.secondary}>[MCP]</Text> - {t('officialCommands.Model Context Protocol command (from external servers)', {}, true) || 'Model Context Protocol command (from external servers)'}
    </Text>

    <Box height={1} />

    {/* Shortcuts */}
    <Text bold color={theme.text.primary}>
      {t('ui.Keyboard Shortcuts:', {}, true) || 'Keyboard Shortcuts:'}
    </Text>
    <Text color={theme.text.primary}>
      <Text bold color={theme.text.accent}>
        Alt+Left/Right
      </Text>{' '}
      - {t('ui.Jump through words in the input', {}, true) || 'Jump through words in the input'}
    </Text>
    <Text color={theme.text.primary}>
      <Text bold color={theme.text.accent}>
        Ctrl+C
      </Text>{' '}
      - {t('ui.Quit application', {}, true) || 'Quit application'}
    </Text>
    <Text color={theme.text.primary}>
      <Text bold color={theme.text.accent}>
        {process.platform === 'win32' ? 'Ctrl+Enter' : 'Ctrl+J'}
      </Text>{' '}
      {process.platform === 'linux'
        ? `- ${t('ui.New line', {}, true) || 'New line'} (Alt+Enter works for certain linux distros)`
        : `- ${t('ui.New line', {}, true) || 'New line'}`}
    </Text>
    <Text color={theme.text.primary}>
      <Text bold color={theme.text.accent}>
        Ctrl+L
      </Text>{' '}
      - {t('ui.Clear the screen', {}, true) || 'Clear the screen'}
    </Text>
    <Text color={theme.text.primary}>
      <Text bold color={theme.text.accent}>
        {process.platform === 'darwin' ? 'Ctrl+X / Meta+Enter' : 'Ctrl+X'}
      </Text>{' '}
      - {t('ui.Open input in external editor', {}, true) || 'Open input in external editor'}
    </Text>
    <Text color={theme.text.primary}>
      <Text bold color={theme.text.accent}>
        Ctrl+Y
      </Text>{' '}
      - {t('ui.Toggle YOLO mode', {}, true) || 'Toggle YOLO mode'}
    </Text>
    <Text color={theme.text.primary}>
      <Text bold color={theme.text.accent}>
        Enter
      </Text>{' '}
      - {t('ui.Send message', {}, true) || 'Send message'}
    </Text>
    <Text color={theme.text.primary}>
      <Text bold color={theme.text.accent}>
        Esc
      </Text>{' '}
      - {t('ui.Cancel operation / Clear input (double press)', {}, true) || 'Cancel operation / Clear input (double press)'}
    </Text>
    <Text color={theme.text.primary}>
      <Text bold color={theme.text.accent}>
        Shift+Tab
      </Text>{' '}
      - {t('ui.Toggle auto-accepting edits', {}, true) || 'Toggle auto-accepting edits'}
    </Text>
    <Text color={theme.text.primary}>
      <Text bold color={theme.text.accent}>
        Up/Down
      </Text>{' '}
      - {t('ui.Cycle through your prompt history', {}, true) || 'Cycle through your prompt history'}
    </Text>
    <Box height={1} />
    <Text color={theme.text.primary}>
      有关快捷键的完整列表，请参阅 docs/keyboard-shortcuts.md
    </Text>
  </Box>
);
