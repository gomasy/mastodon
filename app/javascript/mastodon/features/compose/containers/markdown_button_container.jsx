import { useCallback } from 'react';

import { defineMessages, useIntl } from 'react-intl';

import { useDispatch, useSelector } from 'react-redux';

import { changeComposeMarkdown } from '../../../actions/compose';
import MarkdownIndicator from '../components/markdown_indicator';

const messages = defineMessages({
  changeMode: { id: 'compose_form.markdown.change', defaultMessage: 'Change input mode' },
  marked: { id: 'compose_form.markdown.marked', defaultMessage: 'Input mode: Markdown' },
  unmarked: { id: 'compose_form.markdown.unmarked', defaultMessage: 'Input mode: Plain-text' },
});

const MarkdownButtonContainer = () => {
  const intl = useIntl();
  const dispatch = useDispatch();
  const isMarkdown = useSelector((state) => state.getIn(['compose', 'markdown']));

  const label = intl.formatMessage(isMarkdown ? messages.marked : messages.unmarked);
  const title = intl.formatMessage(messages.changeMode);

  const handleClick = useCallback(() => {
    dispatch(changeComposeMarkdown());
  }, [dispatch]);

  return (
    <MarkdownIndicator
      label={label}
      title={title}
      ariaControls='markdown-input'
      onClick={handleClick}
    />
  );
};

export default MarkdownButtonContainer;
