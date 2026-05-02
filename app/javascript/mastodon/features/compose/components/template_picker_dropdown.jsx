import PropTypes from 'prop-types';
import { PureComponent } from 'react';

import { defineMessages, useIntl } from 'react-intl';

import { supportsPassiveEvents } from 'detect-passive-events';
import Overlay from 'react-overlays/Overlay';

import ContentPasteIcon from 'mastodon/../material-icons/400-24px/content_paste.svg?react';
import { IconButton } from 'mastodon/components/icon_button';

import emojify from '../../emoji/emoji';
import escapeTextContentForBrowser from 'escape-html';

const messages = defineMessages({
  template: { id: 'template_button.label', defaultMessage: 'Insert template' },
});

const listenerOptions = supportsPassiveEvents ? { passive: true, capture: true } : true;

let customTemplates = null;

export async function loadCustomTemplateData() {
  if (customTemplates !== null) {
    return customTemplates;
  }
  const url = new URL('/api/v1/custom_templates', location.origin);
  const response = await fetch(url);
  if (!response.ok) {
    throw new Error(`Failed to fetch custom templates: ${response.statusText}`);
  }
  customTemplates = await response.json();
  return customTemplates;
}

class TemplatePickerImpl extends PureComponent {

  static propTypes = {
    intl: PropTypes.object.isRequired,
    onClick: PropTypes.func.isRequired,
    pickerButtonRef: PropTypes.func.isRequired,
  };

  handleClick = e => {
    const { onClick } = this.props;
    onClick(customTemplates[e.currentTarget.getAttribute('data-index')]);
  }

  render () {
    const { intl } = this.props;
    const { handleClick } = this;
    const title = intl.formatMessage(messages.template);

    return (
      <div className='template-picker'>
        <div className='template-picker-title'>{title}</div>
        <div className='template-picker-scroll'>
          <div className='template-picker-area'>
            {(customTemplates ?? []).map((template, i) => {
              const content = template.content;
              const emojis = template.emojis.reduce((map, emoji) => {
                map[`:${emoji.shortcode}:`] = emoji;
                return map;
              }, {});

              const html = emojify(escapeTextContentForBrowser(content).replace(/\s*\r\n/g, '<br />'), emojis);

              return (
                <div
                  className='template-picker-template'
                  key={i}
                  data-index={i}
                  dangerouslySetInnerHTML={{ __html: html }}
                  onClick={handleClick}
                />
              );
            })}
          </div>
        </div>
      </div>
    );
  }
}

class TemplatePickerMenuImpl extends PureComponent {

  static propTypes = {
    style: PropTypes.object,
    onPick: PropTypes.func.isRequired,
    onClose: PropTypes.func.isRequired,
  };

  handleDocumentClick = e => {
    if (this.node && !this.node.contains(e.target) && !this.props.pickerButtonRef.contains(e.target)) {
      this.props.onClose();
    }
  }

  componentDidMount () {
    document.addEventListener('click', this.handleDocumentClick, { capture: true });
    document.addEventListener('touchend', this.handleDocumentClick, listenerOptions);
  }

  componentWillUnmount () {
    document.removeEventListener('click', this.handleDocumentClick, { capture: true });
    document.removeEventListener('touchend', this.handleDocumentClick, listenerOptions);
  }

  setRef = c => {
    this.node = c;
  }

  handleClick = template => {
    this.props.onClose();
    this.props.onPick(template);
  }

  render () {
    const { style } = this.props;

    return (
      <div className='template-picker-dropdown__menu' style={style} ref={this.setRef}>
        <TemplatePicker
          onClick={this.handleClick}
        />
      </div>
    );
  }
}

const TemplatePicker = (props) => {
  const intl = useIntl();
  return <TemplatePickerImpl {...props} intl={intl} />;
};

const TemplatePickerMenu = (props) => {
  const intl = useIntl();
  return <TemplatePickerMenuImpl {...props} intl={intl} />;
};

class TemplatePickerDropdown extends PureComponent {

  static propTypes = {
    intl: PropTypes.object.isRequired,
    onPickTemplate: PropTypes.func.isRequired,
  };

  state = {
    active: false,
    loading: false,
  };

  setRef = (c) => {
    this.dropdown = c;
  }

  onShowDropdown = () => {
    this.setState({ active: true });

    if (customTemplates === null) {
      this.setState({ loading: true });

      loadCustomTemplateData().then(() => {
        this.setState({ loading: false });
      }).catch(() => {
        this.setState({ loading: false, active: false });
      });
    }
  }

  onHideDropdown = () => {
    this.setState({ active: false });
  }

  onToggle = (e) => {
    if (!this.state.loading && (!e.key || e.key === 'Enter')) {
      if (this.state.active) {
        this.onHideDropdown();
      } else {
        this.onShowDropdown();
      }
    }
  }

  handleKeyDown = e => {
    if (e.key === 'Escape') {
      this.onHideDropdown();
    }
  }

  setTargetRef = c => {
    this.target = c;
  }

  findTarget = () => {
    return this.target;
  }

  render () {
    const { intl, onPickTemplate } = this.props;
    const title = intl.formatMessage(messages.template);
    const { active, loading } = this.state;

    return (
      <div className='template-picker-dropdown' onKeyDown={this.handleKeyDown} ref={this.setTargetRef}>
        <IconButton
          title={title}
          aria-expanded={active}
          active={active}
          iconComponent={ContentPasteIcon}
          onClick={this.onToggle}
          inverted
        />

        <Overlay show={active && !loading} placement={'bottom'} target={this.findTarget}>
          {({ props, placement }) => (
            <div {...props} style={{ ...props.style }}>
              <div className={`dropdown-animation ${placement}`}>
                <TemplatePickerMenu
                  onPick={onPickTemplate}
                  onClose={this.onHideDropdown}
                  pickerButtonRef={this.target}
                />
              </div>
            </div>
          )}
        </Overlay>
      </div>
    );
  }
}

const TemplatePickerDropdownWrapper = (props) => {
  const intl = useIntl();
  return <TemplatePickerDropdown {...props} intl={intl} />;
};

export default TemplatePickerDropdownWrapper;
