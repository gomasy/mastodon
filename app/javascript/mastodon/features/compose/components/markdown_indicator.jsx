import PropTypes from 'prop-types';
import { PureComponent } from 'react';

import TextFieldsIcon from 'mastodon/../material-icons/400-24px/text_fields.svg?react';
import { Icon } from 'mastodon/components/icon';

export default class MarkdownIndicator extends PureComponent {

  static propTypes = {
    label: PropTypes.string.isRequired,
    title: PropTypes.string,
    active: PropTypes.bool,
    onClick: PropTypes.func.isRequired,
    ariaControls: PropTypes.string,
  };

  render () {
    const { label, title, active, ariaControls } = this.props;

    return (
      <div>
        <button
          type='button'
          title={title}
          aria-label={title}
          className={`dropdown-button ${active ? 'active' : ''}`}
          aria-expanded={active}
          onClick={this.props.onClick}
          aria-controls={ariaControls}
        >
          <Icon icon={TextFieldsIcon} />
          <span className='dropdown-button__label'>{label}</span>
        </button>
      </div>
    );
  }

}
