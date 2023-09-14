import { injectIntl, defineMessages } from 'react-intl';

import { connect } from 'react-redux';

import { changeComposeMarkdown } from '../../../actions/compose';
import TextIconButton from '../components/text_icon_button';

const messages = defineMessages({
  marked: { id: 'compose_form.markdown.marked', defaultMessage: 'Markdown input mode' },
  unmarked: { id: 'compose_form.markdown.unmarked', defaultMessage: 'Plain-text input mode' },
});

const mapStateToProps = (state, { intl }) => ({
  label: state.getIn(['compose', 'markdown']) ? 'MD' : 'PL',
  title: intl.formatMessage(state.getIn(['compose', 'markdown']) ? messages.marked : messages.unmarked),
  ariaControls: 'markdown-input',
});

const mapDispatchToProps = dispatch => ({

  onClick () {
    dispatch(changeComposeMarkdown());
  },

});

export default injectIntl(connect(mapStateToProps, mapDispatchToProps)(TextIconButton));
