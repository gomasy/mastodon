import type React from 'react';
import { useCallback } from 'react';

import { defineMessages, useIntl } from 'react-intl';

import { TextAaIcon } from '@phosphor-icons/react';

import { changeComposeMarkdown } from '@/mastodon/actions/compose';
import { ToggleButton } from '@/mastodon/components/button/redesign';
import { useIconWeight } from '@/mastodon/components/icon';
import { useAppDispatch, useAppSelector } from '@/mastodon/store';

const messages = defineMessages({
  changeMode: {
    id: 'compose_form.markdown.change',
    defaultMessage: 'Change input mode',
  },
  marked: {
    id: 'compose_form.markdown.marked',
    defaultMessage: 'Input mode: Markdown',
  },
  unmarked: {
    id: 'compose_form.markdown.unmarked',
    defaultMessage: 'Input mode: Plain-text',
  },
});

export const ComposeMarkdownButton: React.FC = () => {
  const intl = useIntl();
  const isMarkdown = useAppSelector((state) => !!state.compose.get('markdown'));
  const markdownIcon = useIconWeight(TextAaIcon, isMarkdown && 'fill');

  const dispatch = useAppDispatch();
  const handleClick = useCallback(() => {
    dispatch(changeComposeMarkdown());
  }, [dispatch]);

  return (
    <ToggleButton
      size='sm'
      active={isMarkdown}
      onClick={handleClick}
      leadingIcon={markdownIcon}
      title={intl.formatMessage(messages.changeMode)}
    >
      {intl.formatMessage(isMarkdown ? messages.marked : messages.unmarked)}
    </ToggleButton>
  );
};
