import PropTypes from 'prop-types';
import { PureComponent } from 'react';

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
          {label}
        </button>
      </div>
    );
  }

}
