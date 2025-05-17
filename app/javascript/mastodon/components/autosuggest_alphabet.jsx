import PropTypes from 'prop-types';
import { PureComponent } from 'react';

export default class AutosuggestAlphabet extends PureComponent {

  static propTypes = {
    alphabet: PropTypes.shape({
      item: PropTypes.string.isRequired,
    }).isRequired,
  };

  render () {
    const { alphabet } = this.props;

    return (
      <div className='autosuggest-alphabet'>
        <div className='autosuggest-alphabet__name'>{alphabet.item}</div>
      </div>
    );
  }

}
