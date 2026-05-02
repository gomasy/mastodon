import PropTypes from 'prop-types';
import { useCallback, useEffect, useRef, useState } from 'react';

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

const TemplatePicker = ({ onClick }) => {
  const intl = useIntl();
  const [isLoaded, setIsLoaded] = useState(customTemplates !== null);

  useEffect(() => {
    if (customTemplates === null) {
      void loadCustomTemplateData().then(() => {
        setIsLoaded(true);
      });
    }
  }, []);

  const handleClick = useCallback(e => {
    onClick(customTemplates[e.currentTarget.getAttribute('data-index')]);
  }, [onClick]);

  if (!isLoaded) {
    return null;
  }

  const title = intl.formatMessage(messages.template);

  return (
    <div className='template-picker'>
      <div className='template-picker-title'>{title}</div>
      <div className='template-picker-scroll'>
        <div className='template-picker-area'>
          {customTemplates.map((template, i) => {
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
};

TemplatePicker.propTypes = {
  onClick: PropTypes.func.isRequired,
};

const TemplatePickerMenu = ({ style, onClose, onPick, pickerButtonRef }) => {
  const nodeRef = useRef(null);

  useEffect(() => {
    const handleDocumentClick = e => {
      if (nodeRef.current && !nodeRef.current.contains(e.target) && !pickerButtonRef.contains(e.target)) {
        onClose();
      }
    };

    document.addEventListener('click', handleDocumentClick, { capture: true });
    document.addEventListener('touchend', handleDocumentClick, listenerOptions);

    return () => {
      document.removeEventListener('click', handleDocumentClick, { capture: true });
      document.removeEventListener('touchend', handleDocumentClick, listenerOptions);
    };
  }, [onClose, pickerButtonRef]);

  const handleClick = useCallback(template => {
    onClose();
    onPick(template);
  }, [onClose, onPick]);

  return (
    <div className='template-picker-dropdown__menu' style={style} ref={nodeRef}>
      <TemplatePicker onClick={handleClick} />
    </div>
  );
};

TemplatePickerMenu.propTypes = {
  style: PropTypes.object,
  onPick: PropTypes.func.isRequired,
  onClose: PropTypes.func.isRequired,
};

const TemplatePickerDropdown = ({ onPickTemplate }) => {
  const intl = useIntl();
  const [active, setActive] = useState(false);
  const targetRef = useRef(null);

  const onShowDropdown = useCallback(() => {
    setActive(true);
  }, []);

  const onHideDropdown = useCallback(() => {
    setActive(false);
  }, []);

  const onToggle = useCallback(e => {
    if (!e.key || e.key === 'Enter') {
      if (active) {
        onHideDropdown();
      } else {
        onShowDropdown();
      }
    }
  }, [active, onShowDropdown, onHideDropdown]);

  const handleKeyDown = useCallback(e => {
    if (e.key === 'Escape') {
      onHideDropdown();
    }
  }, [onHideDropdown]);

  const findTarget = useCallback(() => targetRef.current, []);

  const title = intl.formatMessage(messages.template);

  return (
    <div className='template-picker-dropdown' onKeyDown={handleKeyDown} ref={targetRef}>
      <IconButton
        title={title}
        aria-expanded={active}
        active={active}
        iconComponent={ContentPasteIcon}
        onClick={onToggle}
        inverted
      />

      <Overlay show={active} placement={'bottom'} target={findTarget}>
        {({ props, placement }) => (
          <div {...props} style={{ ...props.style }}>
            <div className={`dropdown-animation ${placement}`}>
              <TemplatePickerMenu
                onPick={onPickTemplate}
                onClose={onHideDropdown}
                pickerButtonRef={targetRef.current}
              />
            </div>
          </div>
        )}
      </Overlay>
    </div>
  );
};

TemplatePickerDropdown.propTypes = {
  onPickTemplate: PropTypes.func.isRequired,
};

export default TemplatePickerDropdown;
