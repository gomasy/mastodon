import { injectIntl, defineMessages } from 'react-intl';

import { connect } from 'react-redux';

import { changeComposeMarkdown } from '../../../actions/compose';
import MarkdownIndicator from '../components/markdown_indicator';

const messages = defineMessages({
  changeMode: { id: 'compose_form.markdown.change', defaultMessage: 'Change input mode' },
  marked: { id: 'compose_form.markdown.marked', defaultMessage: 'Input mode: Markdown' },
  unmarked: { id: 'compose_form.markdown.unmarked', defaultMessage: 'Input mode: Plain-text' },
});

const mapStateToProps = (state, { intl }) => ({
  label: intl.formatMessage(state.getIn(['compose', 'markdown']) ? messages.marked : messages.unmarked),
  title: intl.formatMessage(messages.changeMode),
  ariaControls: 'markdown-input',
});

const mapDispatchToProps = dispatch => ({

  onClick () {
    dispatch(changeComposeMarkdown());
  },

});

export default injectIntl(connect(mapStateToProps, mapDispatchToProps)(MarkdownIndicator));
