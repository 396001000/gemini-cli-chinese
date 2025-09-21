/**
 * @license
 * Copyright 2025 Google LLC
 * SPDX-License-Identifier: Apache-2.0
 */

import { ToolConfirmationOutcome } from '@google/gemini-cli-core';
import { Box, Text } from 'ink';
import type React from 'react';
import { theme } from '../semantic-colors.js';
import { RenderInline } from '../utils/InlineMarkdownRenderer.js';
import type { RadioSelectItem } from './shared/RadioButtonSelect.js';
import { RadioButtonSelect } from './shared/RadioButtonSelect.js';
import { useKeypress } from '../hooks/useKeypress.js';
import { t } from '../../i18n/index.js';

export interface ShellConfirmationRequest {
  commands: string[];
  onConfirm: (
    outcome: ToolConfirmationOutcome,
    approvedCommands?: string[],
  ) => void;
}

export interface ShellConfirmationDialogProps {
  request: ShellConfirmationRequest;
}

export const ShellConfirmationDialog: React.FC<
  ShellConfirmationDialogProps
> = ({ request }) => {
  const { commands, onConfirm } = request;

  useKeypress(
    (key) => {
      if (key.name === 'escape') {
        onConfirm(ToolConfirmationOutcome.Cancel);
      }
    },
    { isActive: true },
  );

  const handleSelect = (item: ToolConfirmationOutcome) => {
    if (item === ToolConfirmationOutcome.Cancel) {
      onConfirm(item);
    } else {
      // For both ProceedOnce and ProceedAlways, we approve all the
      // commands that were requested.
      onConfirm(item, commands);
    }
  };

  const options: Array<RadioSelectItem<ToolConfirmationOutcome>> = [
    {
      label: t('confirmation.yesAllowOnce'),
      value: ToolConfirmationOutcome.ProceedOnce,
    },
    {
      label: t('confirmation.yesAllowAlwaysSession'),
      value: ToolConfirmationOutcome.ProceedAlways,
    },
    {
      label: t('confirmation.noEsc'),
      value: ToolConfirmationOutcome.Cancel,
    },
  ];

  return (
    <Box
      flexDirection="column"
      borderStyle="round"
      borderColor={theme.status.warning}
      padding={1}
      width="100%"
      marginLeft={1}
    >
      <Box flexDirection="column" marginBottom={1}>
        <Text bold color={theme.text.primary}>
          {t('shellConfirmation.title')}
        </Text>
        <Text color={theme.text.primary}>
          {t('shellConfirmation.description')}
        </Text>
        <Box
          flexDirection="column"
          borderStyle="round"
          borderColor={theme.border.default}
          paddingX={1}
          marginTop={1}
        >
          {commands.map((cmd) => (
            <Text key={cmd} color={theme.text.link}>
              <RenderInline text={cmd} />
            </Text>
          ))}
        </Box>
      </Box>

      <Box marginBottom={1}>
        <Text color={theme.text.primary}>{t('shellConfirmation.question')}</Text>
      </Box>

      <RadioButtonSelect items={options} onSelect={handleSelect} isFocused />
    </Box>
  );
};
