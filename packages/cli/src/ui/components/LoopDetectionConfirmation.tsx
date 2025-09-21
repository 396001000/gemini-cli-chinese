/**
 * @license
 * Copyright 2025 Google LLC
 * SPDX-License-Identifier: Apache-2.0
 */

import { Box, Text } from 'ink';
import type { RadioSelectItem } from './shared/RadioButtonSelect.js';
import { RadioButtonSelect } from './shared/RadioButtonSelect.js';
import { useKeypress } from '../hooks/useKeypress.js';
import { theme } from '../semantic-colors.js';
import { t } from '../../i18n/index.js';

export type LoopDetectionConfirmationResult = {
  userSelection: 'disable' | 'keep';
};

interface LoopDetectionConfirmationProps {
  onComplete: (result: LoopDetectionConfirmationResult) => void;
}

export function LoopDetectionConfirmation({
  onComplete,
}: LoopDetectionConfirmationProps) {
  useKeypress(
    (key) => {
      if (key.name === 'escape') {
        onComplete({
          userSelection: 'keep',
        });
      }
    },
    { isActive: true },
  );

  const OPTIONS: Array<RadioSelectItem<LoopDetectionConfirmationResult>> = [
    {
      label: t('loopDetection.keepEnabled'),
      value: {
        userSelection: 'keep',
      },
    },
    {
      label: t('loopDetection.disableForSession'),
      value: {
        userSelection: 'disable',
      },
    },
  ];

  return (
    <Box
      flexDirection="column"
      borderStyle="round"
      borderColor={theme.status.warning}
      width="100%"
      marginLeft={1}
    >
      <Box paddingX={1} paddingY={0} flexDirection="column">
        <Box minHeight={1}>
          <Box minWidth={3}>
            <Text color={theme.status.warning} aria-label="Loop detected:">
              ?
            </Text>
          </Box>
          <Box>
            <Text wrap="truncate-end">
              <Text color={theme.text.primary} bold>
                {t('loopDetection.title')}
              </Text>{' '}
            </Text>
          </Box>
        </Box>
        <Box width="100%" marginTop={1}>
          <Box flexDirection="column">
            <Text color={theme.text.secondary}>
              {t('loopDetection.description')}
            </Text>
            <Box marginTop={1}>
              <RadioButtonSelect items={OPTIONS} onSelect={onComplete} />
            </Box>
          </Box>
        </Box>
      </Box>
    </Box>
  );
}
