/**
 * @license
 * Copyright 2025 Google LLC
 * SPDX-License-Identifier: Apache-2.0
 */

import { Box, Text } from 'ink';
import { theme } from '../semantic-colors.js';
import { PrepareLabel, MAX_WIDTH } from './PrepareLabel.js';
import { CommandKind } from '../commands/types.js';
import { t } from '../../i18n/index.js';
import { Colors } from '../colors.js';
import stringWidth from 'string-width';
export interface Suggestion {
  label: string;
  value: string;
  description?: string;
  matchedIndex?: number;
  commandKind?: CommandKind;
}
interface SuggestionsDisplayProps {
  suggestions: Suggestion[];
  activeIndex: number;
  isLoading: boolean;
  width: number;
  scrollOffset: number;
  userInput: string;
  mode: 'reverse' | 'slash';
  expandedIndex?: number;
}

export const MAX_SUGGESTIONS_TO_SHOW = 8;
export { MAX_WIDTH };

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

export function SuggestionsDisplay({
  suggestions,
  activeIndex,
  isLoading,
  width,
  scrollOffset,
  userInput,
  mode,
  expandedIndex,
}: SuggestionsDisplayProps) {
  if (isLoading) {
    return (
      <Box paddingX={1} width={width}>
        <Text color="gray">Loading suggestions...</Text>
      </Box>
    );
  }

  if (suggestions.length === 0) {
    return null; // Don't render anything if there are no suggestions
  }

  // Calculate the visible slice based on scrollOffset
  const startIndex = scrollOffset;
  const endIndex = Math.min(
    scrollOffset + MAX_SUGGESTIONS_TO_SHOW,
    suggestions.length,
  );
  const visibleSuggestions = suggestions.slice(startIndex, endIndex);

  const getFullLabel = (s: Suggestion) =>
    s.label + (s.commandKind === CommandKind.MCP_PROMPT ? ' [MCP]' : '');

  const maxLabelLength = Math.max(
    ...suggestions.map((s) => stringWidth(getFullLabel(s))),
  );
  const commandColumnWidth =
    mode === 'slash' ? Math.min(maxLabelLength, Math.floor(width * 0.5)) : 0;

  return (
    <Box flexDirection="column" paddingX={1} width={width}>
      {scrollOffset > 0 && <Text color={theme.text.primary}>▲</Text>}

      {visibleSuggestions.map((suggestion, index) => {
        const originalIndex = startIndex + index;
        const isActive = originalIndex === activeIndex;
        const isExpanded = originalIndex === expandedIndex;
        const textColor = isActive ? theme.text.accent : theme.text.secondary;
        const isLong = suggestion.value.length >= MAX_WIDTH;
        const labelElement = (
          <PrepareLabel
            label={suggestion.value}
            matchedIndex={suggestion.matchedIndex}
            userInput={userInput}
            textColor={textColor}
            isExpanded={isExpanded}
          />
        );

        return (
          <Box key={`${suggestion.value}-${originalIndex}`} flexDirection="row">
            <Box
              {...(mode === 'slash'
                ? { width: commandColumnWidth, flexShrink: 0 as const }
                : { flexShrink: 1 as const })}
            >
              <Box>
                {labelElement}
                {suggestion.commandKind === CommandKind.MCP_PROMPT && (
                  <Text color={textColor}> [MCP]</Text>
                )}
              </Box>
            </Box>

            {suggestion.description && (
              <Box flexGrow={1} paddingLeft={3}>
                <Text color={textColor}>
                  {translateDescription(suggestion.description)}
                </Text>
              </Box>
            )}
            {isActive && isLong && (
              <Box>
                <Text color={Colors.Gray}>{isExpanded ? ' ← ' : ' → '}</Text>
              </Box>
            )}
          </Box>
        );
      })}
      {endIndex < suggestions.length && <Text color="gray">▼</Text>}
      {suggestions.length > MAX_SUGGESTIONS_TO_SHOW && (
        <Text color="gray">
          ({activeIndex + 1}/{suggestions.length})
        </Text>
      )}
    </Box>
  );
}
